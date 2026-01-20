import React, {
  Children,
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import { debounce } from "lodash";
import { Toaster } from "react-hot-toast";
import { CheckCheck } from "lucide-react";

import YooptaEditor, {
  createYooptaEditor,
  createYooptaMark,
  generateId,
} from "@yoopta/editor";
import Paragraph from "@yoopta/paragraph";
import Blockquote from "@yoopta/blockquote";
import Image from "@yoopta/image";
import Link from "@yoopta/link";
import { HeadingOne, HeadingTwo, HeadingThree } from "@yoopta/headings";
import { NumberedList, BulletedList, TodoList } from "@yoopta/lists";

import VisualizationComponent from "./VisualizationComponent";
import ChatBox from "./Chatbox";

import LinkTool, { DefaultLinkToolRender } from "@yoopta/link-tool";
import ActionMenu, { DefaultActionMenuRender } from "@yoopta/action-menu-list";
import Toolbar, { DefaultToolbarRender } from "@yoopta/toolbar";
import {
  Bold,
  Italic,
  CodeMark,
  Underline,
  Strike,
  Highlight,
} from "@yoopta/marks";
import { html, markdown, plainText } from "@yoopta/exports";

import { EditorToolbar } from "./EditorToolbar/OfficicalExample/EditorToolbar";

// import { WITH_CUSTOM_TOOLBAR_INIT_VALUE } from './initValue';
import NewAuthService from "../services/auth-service";
import NewProjectService from "../services/project-service";
import ExportMenu from "./ExportMenu";
import {
  applyHighlightsToHtml,
  convertHtmlToJson,
  OptimizedJsonHighlightSync,
} from "../utils/HandleHighlightText";

// 上傳檔案 - 圖片
function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

const plugins = [
  Paragraph,
  Blockquote,
  Image.extend({
    options: {
      async onUpload(file) {
        const base64Url = await convertToBase64(file);
        return {
          src: base64Url,
          alt: "Uploaded Image",
          sizes: { width: "auto", height: "auto" }, // You might need to handle sizing appropriately
        };
      },
    },
  }),
  Link,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  NumberedList,
  BulletedList,
  TodoList,
];

// TOOLS & MARKS
const TOOLS = {
  Toolbar: {
    tool: Toolbar,
    render: EditorToolbar,
  },
  ActionMenu: {
    tool: ActionMenu,
    render: DefaultActionMenuRender,
  },
  LinkTool: {
    tool: LinkTool,
    render: DefaultLinkToolRender,
  },
};
const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

// 自動儲存於 IndexedDB
const DB_NAME = "EditorDB";
const STORE_NAME = "editorContent";
const DB_VERSION = 1;

// 自動儲存於 IndexedDB - 初始化 DB
const initDB = () => {
  console.log("inside initDB");
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
};

const saveToIndexedDB = async (title, content, urlId) => {
  console.log("inside saveToIndexedDB");
  console.log("urlId: ", urlId);
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.put({
      id: urlId || "current", // 如果有 URL ID 就使用它，否则fallback到'current'
      title,
      content,
      timestamp: new Date().getTime(),
    });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const loadFromIndexedDB = async (urlId) => {
  console.log("urlId: ", urlId);
  try {
    const db = await initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(urlId || "current");
      request.onsuccess = () => {
        console.log("IndexedDB request successful");
        console.log("Result:", request.result);
        if (request.result && request.result.content) {
          resolve(request.result.content);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        console.error("IndexedDB request error:", request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error("Error in loadFromIndexedDB:", error);
    throw error;
  }
};

const AIEditorComponent = React.forwardRef(
  ({ sdk, content, setContent, title }, ref) => {
    const [qid, setQid] = useState("");
    const [cid, setCid] = useState("");
    const [graphType, setGraphType] = useState("");
    const [currentSelection, setCurrentSelection] = useState(null);
    const [isComposing, setIsComposing] = useState(false);
    // const [content, setContent] = useState('');
    const { id } = useParams();
    const idRef = useRef(id);
    const saveErrorCount = useRef(0);
    const lastSavedContent = useRef("");
    const Navigate = useNavigate();
    const [exportContent, setExportContent] = useState({
      markdown: "",
      html: "",
    });
    const [autoSaveStatus, setAutoSaveStatus] = useState("idle");

    useEffect(() => {
      console.log("inside aiEditor");
    }, []);

    // 創建編輯器
    const editor = useMemo(() => createYooptaEditor(), []);

    // Expose the editor instance via ref
    React.useImperativeHandle(ref, () => ({
      getEditor: () => editor,
      html: { serialize: html.serialize },
    }));

    // 解決編輯器 IME 事件處理的問題（因為輸入中文字會優先觸發 compositionstart 等事件，而不是直接觸發 input 事件）
    const editorRef = useRef(null);
    useEffect(() => {
      const editorElement = editorRef.current;
      if (!editorElement) return;
      const handleCompositionStart = (e) => {
        setIsComposing(true);
        const placeholderElement = document.querySelector(
          ".yoopta-placeholder"
        );
        if (placeholderElement) {
          placeholderElement.classList.remove("yoopta-placeholder");
        }
      };
      const handleCompositionEnd = () => {
        setTimeout(() => setIsComposing(false), 0);
      };

      editorElement.addEventListener(
        "compositionstart",
        handleCompositionStart
      );
      editorElement.addEventListener("compositionend", handleCompositionEnd);
      return () => {
        editorElement.removeEventListener(
          "compositionstart",
          handleCompositionStart
        );
        editorElement.removeEventListener(
          "compositionend",
          handleCompositionEnd
        );
      };
    }, []);

    const handleKeyDown = (event) => {
      if (event.key === "Enter" && isComposing) {
        console.log("按下了 Enter 鍵");
        // 阻止在組字時按下 Enter 觸發換行
        event.stopPropagation();
        event.preventDefault();
        return false;
      }

      if (event.key === "Backspace" && isComposing) {
        console.log("按下了 Backspace 鍵");
        // 執行 Backspace 刪除動作的相關邏輯
      }
      if (event.key === "Delete" && isComposing) {
        console.log("按下了 Delete 鍵");
        // 執行 Delete 刪除動作的相關邏輯
      }
    };

    // 儲存於後端 DB - 創建新 project
    const createNewProject = useCallback(
      async (newContent, title) => {
        if (!id || !newContent) return;
        let serializedTexts = html.serialize(editor, newContent);
        serializedTexts = serializedTexts.replace(/"/g, "'");

        try {
          const res = await NewProjectService.create({
            title: "(No title)",
            content: serializedTexts,
          });
          lastSavedContent.current = newContent;
          Navigate(`/chatbot/document/${res.data}`);
        } catch (e) {
          console.error("Failed to update project in database:", e);
          throw e;
        }
      },
      [id]
    );

    // 儲存於後端 DB - 更新既有 project 的內容
    const updateProject = useCallback(
      async (newContent) => {
        console.log("inside updateProject 更新既有 project");
        // console.log("editor 195");
        if (!id || !/^\d+$/.test(id) || !newContent) return;

        let serializedTexts = html.serialize(editor, newContent);

        let applyHighlightsResult = applyHighlightsToHtml(
          newContent,
          serializedTexts
        );
        applyHighlightsResult = applyHighlightsResult.replace(/"/g, "'");

        try {
          const res = await NewProjectService.update(id, {
            title: title || "(No title)",
            content: applyHighlightsResult,
          });
          lastSavedContent.current = newContent;
          return res;
        } catch (e) {
          console.error("Failed to update project in database:", e);
          // throw e;
        }
      },
      [id, title]
    );

    // 編輯器內容有變動時，自動儲存到 IndexedDB
    const handleEditorChange = useCallback(
      async (content) => {
        const currentId = idRef.current; // 使用 ref 中的最新 id 值
        console.log(currentId);
        try {
          setAutoSaveStatus("saving");
          await saveToIndexedDB(title, content, currentId);
          saveErrorCount.current = 0;
          setAutoSaveStatus("saved");
          console.log(
            `成功保存到 indexedDB. ID: ${currentId}, content: `,
            content
          );
          setTimeout(() => setAutoSaveStatus("idle"), 3000);
        } catch (error) {
          saveErrorCount.current += 1;
          console.error("Error saving to IndexedDB:", error);

          // 如果 IndexedDB 失敗太多次，回退到 localStorage
          if (saveErrorCount.current > 3) {
            //   try {
            //     localStorage.setItem('editor_backup', JSON.stringify(content));
            //   } catch (localStorageError) {
            //     console.error('Both IndexedDB and localStorage failed:', localStorageError);
            //   }

            setAutoSaveStatus("failed");
          }
        }
      },
      [id]
    );

    // 編輯器內容有變動時執行 - 防抖動版本
    const debouncedHandleChange = useCallback(
      debounce((content) => {
        handleEditorChange(content);
      }, 1000), // 1000 毫秒 = 1 秒
      [] // 空依賴數組，這樣 debounce 函數只會在組件掛載時創建一次
    );

    // 每 3 分鐘保存到後端 DB
    const saveToDatabase = useCallback(() => {
      console.log("inside saveToDatabase 每 3 分鐘保存到後端 DB: ");

      if (!id || !/^\d+$/.test(id)) return;

      const currentContent = editor.getEditorValue();

      if (
        JSON.stringify(currentContent) !==
        JSON.stringify(lastSavedContent?.current)
      ) {
        // console.log("內容有變動, 執行 updateProject");
        console.log("editor 254");
        updateProject(currentContent, title).catch(console.error);
      } else {
        // console.log("內容沒有變動");
      }
    }, [editor, updateProject, createNewProject, title]);

    // 在組件卸載時清理 debounce
    useEffect(() => {
      return () => {
        debouncedHandleChange.cancel();
      };
    }, [debouncedHandleChange]);

    // 自動儲存於 IndexedDB 與後端 DB 相關、載入已儲存的資料
    useEffect(() => {
      const loadSavedContent = async () => {
        console.log("inside loadSavedContent 加載已儲存的資料");
        try {
          // const savedContent = await loadFromIndexedDB();
          const savedContent = await loadFromIndexedDB(id);
          console.log(`ID ${id} 的已保存内容: `, savedContent);
          if (savedContent) {
            // 這裡您需要實現一個方法來將保存的內容設置回編輯器
            // editor.setEditorValue(savedContent);
            // console.log(savedContent);
            // console.log('Loaded saved content');
          }
        } catch (error) {
          console.error("Error loading saved content:", error);
        }
      };

      loadSavedContent();

      const changeHandler = () => {
        const content = editor.getEditorValue();
        debouncedHandleChange(content);
      };

      editor.on("change", changeHandler);

      const intervalId = setInterval(saveToDatabase, 0.5 * 60 * 1000); // 1 分鐘 (自動儲存到後端 DB 的間隔時間)

      return () => {
        editor.off("change");
        debouncedHandleChange.cancel();
        clearInterval(intervalId);
      };
    }, [editor, debouncedHandleChange, saveToDatabase, title, id]);

    const getProjectDetails = useCallback(async () => {
      console.log("AIEditor getProjectDetails");

      if (!id || !/^\d+$/.test(id)) {
        return;
      }

      try {
        const res = await NewProjectService.getDetails(id);
        const { content } = res.data;
        setContent(content);
        const deserializedContent = html.deserialize(editor, content);
        const newContent = convertHtmlToJson(content);
        const styledContent = OptimizedJsonHighlightSync(
          newContent,
          deserializedContent
        );
        editor.setEditorValue(styledContent);
      } catch (e) {
        // console.log("Error fetching project details:", e);
        if (e.response?.status === 401) {
          try {
            const loginRes = await NewAuthService.getCurrentUser();
            const res = await NewProjectService.getDetails(id);
            const { content } = res.data;
            setContent(content);
            const deserializedContent = html.deserialize(editor, content);
            const newContent = convertHtmlToJson(content);
            const styledContent = OptimizedJsonHighlightSync(
              newContent,
              deserializedContent
            );
            editor.setEditorValue(styledContent);
          } catch (loginError) {
            console.error("Login failed:", loginError);
            Navigate("/user/login");
          }
        } else {
          try {
            console.log(id);
            const savedContent = await loadFromIndexedDB(id);
            console.log("savedContent: ", savedContent);
            if (savedContent) {
              editor.setEditorValue(savedContent);
              console.log("Loaded saved content from IndexedDB");
            } else {
              console.log("No saved content found in IndexedDB");
            }
          } catch (indexedDBError) {
            console.error(
              "Error loading content from IndexedDB:",
              indexedDBError
            );
          }
        }
      }
    }, [id, editor, setContent]);

    // 呼叫 AI Chat Bot
    useEffect(() => {
      const callAIChatBot = (callInfo) => {
        handleSendMessage(callInfo.question, callInfo.selection);
      };
      editor.on("callAIChatBot", callAIChatBot);
      return () => {
        editor.off("callAIChatBot", callAIChatBot);
      };
    }, [editor]);

    const handleSendMessage = async (inputMessage, selection) => {
      if (inputMessage.trim() !== "") {
        setQid(null); // Clear the existing visualization
        setGraphType(null); // Clear the existing graphType

        const requestData = {
          uid: "your-unique-id",
          question: inputMessage,
          createAt: new Date(),
        };

        let token = localStorage.getItem("token") || "";

        try {
          editor.readOnly = true;
          const generatingTextsBlock = {
            type: "Paragraph",
            value: [
              {
                id: generateId(),
                type: "paragraph",
                children: [
                  {
                    text: "Generating the graph...",
                    highlight: { color: "#C4554D" },
                  },
                ],
                props: {
                  nodeType: "void",
                },
              },
            ],
            meta: { depth: 0 },
          };
          console.log("editor.selection: ", editor.selection);
          editor.insertBlock(generatingTextsBlock, {
            at: [selection[0] + 1],
            focus: false,
          });

          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_SERVER}/question`,
            requestData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status === 200) {
            const responseData = response.data;
            const botResponse = responseData.query_id
              ? `ID: ${responseData.query_id} Please wait a second...`
              : "感謝您的訊息。請求錯誤。還有什麼其他問題嗎？";
            updateBlockText([selection[0] + 1], botResponse, "#C4554D");
            console.log(botResponse);

            const newQid = responseData.query_id;
            const newCid = responseData.client_id; // 用來給 Looker 查詢用的 ID
            const newGraphTypeString = responseData.graph_type;

            setQid(newQid);
            console.log("set newQid: ", newQid);
            setCid(newCid);
            setGraphType(newGraphTypeString);
            console.log("set newGraphTypeString: ", newGraphTypeString);
            setCurrentSelection(selection);
            console.log("set currentSelection: ", selection);
          } else {
            updateBlockText([selection[0] + 1], inputMessage, "#000000");
            editor.readOnly = false;
            console.log("對不起，請求失敗了。請稍後再試。");
          }
        } catch (error) {
          updateBlockText([selection[0] + 1], inputMessage, "#000000");
          editor.readOnly = false;
          console.log("對不起，發生了錯誤。請稍後再試。");
          console.log(error);
        } finally {
        }
      }
    };

    // 處理圖片上傳
    const handleImageCapture = (base64Image) => {
      let newId = generateId();
      // 刪除 block
      editor.deleteBlock({ at: [currentSelection[0] + 1] });
      const newImageBlock = {
        type: "Image",
        value: [
          {
            id: newId,
            type: "image",
            children: [{ text: "" }],
            props: {
              src: base64Image,
              alt: "Visualization",
              sizes: { width: "auto", height: "auto" },
              srcSet: null,
              bgColor: null,
              fit: "contain",
              nodeType: "void",
            },
          },
        ],
        meta: { depth: 0 },
      };
      editor.insertBlock(newImageBlock, {
        at: [currentSelection[0] + 1], // 插入到最後
        focus: false,
      });
      setQid(null);
      setGraphType(null);
      setCurrentSelection(null);
      editor.readOnly = false;
    };

    // 處理 block 的更新
    const updateBlockText = (selection, newText, newTextColor) => {
      let newId = generateId();
      // 刪除 block
      editor.deleteBlock({ at: selection });
      // 插入新 block
      const newParagraphBlock = {
        type: "Paragraph",
        value: [
          {
            children: [{ text: newText, highlight: { color: newTextColor } }],
            id: newId,
            props: { nodeType: "block" },
            type: "paragraph",
          },
        ],
        meta: { depth: 0 },
      };
      editor.insertBlock(newParagraphBlock, {
        at: selection, // 可選，指定插入位置（這裡表示在索引 1 的位置插入）
        focus: true, // 可選，插入後是否聚焦到新區塊
        slate: null, // 可選，指定 Slate 編輯器實例
      });
    };

    // 工具列
    // 匯出 (.md / .pdf)
    const handleExport = (type) => {
      if (type === "markdown") {
        return serializeMarkdown();
      } else if (type === "pdf") {
        return serializeHtml();
      }
    };

    // 匯出 markdown
    const serializeMarkdown = () => {
      const data = editor.getEditorValue();
      const markdownString = markdown.serialize(editor, data);
      // 更新狀態，這樣 ExportFunctions 才能拿到最新的內容
      setExportContent((prev) => ({
        ...prev,
        markdown: markdownString,
      }));
      return markdownString;
    };

    // 匯出 PDF
    const serializeHtml = () => {
      const data = editor.getEditorValue();
      const htmlString = html.serialize(editor, data);
      setExportContent((prev) => ({
        ...prev,
        html: htmlString,
      }));
      return htmlString;
    };

    // 刪除
    const handleDelete = () => {};

    // 獲取 project 後端 DB 資料
    useEffect(() => {
      console.log("AIEditor useEffect 688");
      if (!id) return;
      getProjectDetails();
    }, [id, getProjectDetails]);

    // 更新 idRef 當 id 變化時
    useEffect(() => {
      console.log("AIEditor useEffect 695");
      idRef.current = id;
    }, [id]);

    return (
      <>
        <div className="flex justify-center flex-col relative">
          <div className="absolute top-10 right-16 z-10 flex items-center">
            <div className="flex items-center me-10">
              {autoSaveStatus === "saving" && (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-3 border-x-gray-500 border-y-gray-300 me-3"></div>
                  <p className="text-md text-gray-500">saving...</p>
                </>
              )}
              {autoSaveStatus === "saved" && (
                <>
                  <CheckCheck className="w-5 h-5 text-gray-500 me-3" />
                  <p className="text-md text-gray-500">saved</p>
                </>
              )}
            </div>

            <ExportMenu
              onExport={handleExport}
              onDelete={handleDelete}
              title={title}
              editor={editor}
            />
          </div>
          <div className="text-sm text-gray-500">
            {/* {isSaving ? "Saving to database..." : 
             content !== lastServerSavedContent ? "Changes not saved to database" : "All changes saved"} */}
          </div>
          <div
            className={`w-full h-[72vh] mx-auto overflow-auto`}
            ref={editorRef}
            onKeyDown={handleKeyDown}
          >
            {editor && (
              <YooptaEditor
                editor={editor}
                plugins={plugins}
                tools={TOOLS}
                marks={MARKS}
                // value={WITH_CUSTOM_TOOLBAR_INIT_VALUE}
                width="85%"
              />
            )}
          </div>
          <ChatBox editor={editor} />
          <VisualizationComponent
            sdk={sdk}
            queryId={qid}
            clientId={cid}
            graphType={graphType}
            currentSelection={currentSelection}
            onImageCapture={handleImageCapture}
          />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
            }}
          />
        </div>
      </>
    );
  }
);

AIEditorComponent.displayName = "AIEditorComponent";

export default AIEditorComponent;
