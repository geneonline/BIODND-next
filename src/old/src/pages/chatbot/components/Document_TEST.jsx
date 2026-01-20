import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { html } from "@yoopta/exports";
import useSWR, { mutate } from "swr";

// import SideBar from './sideBar_TEST';
import SideBar from "../layouts/SideBar_TEST2";
import HorizontalBar from "../layouts/HorizontalBar";
import WebNav from "../layouts/WebNav";

import FilterComponent from "./FilterComponent";
import AIEditorComponent from "./AIEditor_TEST";
import { sdk } from "./CorsSessions";

import NewProjectService from "../services/project-service";
import {
  applyHighlightsToHtml,
  convertHtmlToJson,
} from "../utils/HandleHighlightText";

const fetcher = (url) => NewProjectService.search();

export default function Document() {
  useEffect(() => {
    console.log("inside document");
  }, []);

  const { data: projectsData } = useSWR("projects", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  console.log("document 33. projectsData: ", projectsData);

  const [question, setQuestion] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const [visualizationData, setVisualizationData] = useState(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [projectList, setProjectList] = useState([]);
  const { id } = useParams();
  const editorRef = useRef(null);
  const isSavingRef = useRef(false);
  const Navigate = useNavigate();
  const Location = useLocation();
  const pendingSaveRef = useRef(false);
  const maxIdRef = useRef(null);
  const titleChangeCallbackRef = useRef(null);
  const titleRef = useRef('');  // 最後修改 title 的那個專案，其 title
  const idRef = useRef(id); // 最後修改 title 的那個專案，其 id
  const currentIdTitleRef = useRef(""); // 當前專案的 title
  const [localProjectList, setLocalProjectList] = useState([]);
  const localProjectListRef = useRef(localProjectList);


  // 獲取所有項目列表
  const getAllProjects = useCallback(async () => {
    console.log("document getAllProjects");
    try {
      await mutate(); // 使用 SWR 的 mutate 函數重新驗證數據
    } catch (e) {
      console.error("Failed to fetch projects:", e);
    }
  }, [mutate]);

  // 處理標題更改
  const handleTitleChange = useCallback(
    async (newTitle) => {
      console.log("document 55");
      console.log("newTitle: ", newTitle);

      setTitle(newTitle); // 更新本地狀態

      if (!id || !/^\d+$/.test(id)) return;

      try {
        await NewProjectService.update(id, {
          title: newTitle || "(No title)",
          content: content, // 保持現有內容
        });
        getAllProjects(); // 更新側邊欄列表

        // Call the callback to update the SideBar
        if (titleChangeCallbackRef.current) {
          titleChangeCallbackRef.current(
            newTitle || "(No title)",
            parseInt(id)
          );
        }
      } catch (error) {
        console.error("Failed to update title:", error);
      }
    },
    [id, content, getAllProjects]
  );

  // 獲取當前項目詳情
  const getProjectDetails = useCallback(async () => {
    console.log("document getProjectDetails");

    if (!id || !/^\d+$/.test(id)) return;

    try {
      const res = await NewProjectService.getDetails(id);
      const { title, content } = res.data;
      console.log("document 85. title: ", title);
      setTitle(title);
      // currentIdTitleRef.current = title;
      setContent(content);
      const styledCOntent = convertHtmlToJson(content);
      // console.log(styledCOntent);
    } catch (e) {
      console.error("Failed to fetch project details:", e);

      if (
        e.response &&
        e.response.data &&
        e.response.data.errorCode === "2000"
      ) {
        try {
          // 重新獲取專案列表
          const response = await NewProjectService.search("", false, 1, 1);
          console.log(response);
          const projects = response.data.data || [];

          if (projects.length > 0) {
            // 獲取所有 ID 並排序
            const sortedIds = projects
              .map((project) => project.id)
              .sort((a, b) => b - a); // 降序排序

            // 找到適當的導航目標
            let targetId;
            if (sortedIds[0] === parseInt(id)) {
              // 如果刪除的是最大 ID，導航到第二大 ID
              targetId = sortedIds[1];
            } else {
              // 否則導航到最大 ID
              targetId = sortedIds[0];
            }

            if (targetId) {
              maxIdRef.current = targetId;
              Navigate(`/chatbot/document/${targetId}`);
            } else {
              Navigate("/chatbot/document/new");
            }
          } else {
            Navigate("/chatbot/document/new");
          }
        } catch (searchError) {
          console.error("Failed to fetch project list:", searchError);
          Navigate("/chatbot/document/new");
        }
      }
    }
  }, [id, Navigate, getAllProjects, projectsData]);

  // 保存到數據庫
  const saveToDatabase = async () => {

    if (!id || !/^\d+$/.test(id)) return;

    const titleNode = document.querySelector("#document-title");

    if (!editorRef.current || isSavingRef.current) return;

    isSavingRef.current = true;

    const currentPageItem = localProjectListRef.current.find((item) => item.id === parseInt(id));

    // if (!currentPageItem) return;

    try {
      const editor = editorRef.current.getEditor();
      if (!editor) return;

      const currentContent = editor.getEditorValue();
      // console.log(currentContent);
      if (!currentContent) return;

      let serializedTexts = html.serialize(editor, currentContent);

      let applyHighlightsResult = applyHighlightsToHtml(
        currentContent,
        serializedTexts
      );
      applyHighlightsResult = applyHighlightsResult.replace(/"/g, "'");

      await NewProjectService.update(id, {
        title: currentPageItem.title || "(No title)",
        Content: applyHighlightsResult || "<body id='yoopta-clipboard' data-editor-id=''></body>",
      });

      getAllProjects(); // 更新側邊欄列表
    } catch (error) {
      console.error("Failed to save:", error);
      console.log("document 162");
    } finally {
      isSavingRef.current = false;
    }
  };

  // 處理頁面卸載
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      console.log("document handleBeforeUnload");
      console.log("title: ", titleRef.current);  // 使用 ref 而不是 state
      if (!isSavingRef.current) {
        e.preventDefault();
        e.returnValue = "";

        saveToDatabase().then(() => {
          window.removeEventListener("beforeunload", handleBeforeUnload);
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      if (!isSavingRef.current) {
        console.log("execute saveToDatabase");
        saveToDatabase();
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [id]);

  useEffect(() => {
    console.log("localProjectList useEffect: ", localProjectList);
    localProjectListRef.current = localProjectList;
  }, [localProjectList]);

  // useEffect(() => {
  //     const fetchData = async () => {
  //         try {
  //           if (Location.pathname.startsWith('/document')) {
  //               // 1. 執行 getAllProjects 並找出最大 ID
  //               const response = await NewProjectService.search();
  //               const projects = response.data.data || [];  // 確保即使 API 失敗也有一個空數組

  //               setProjectList(projects);  // 更新專案列表狀態

  //               // 如果有專案，找出最大 ID
  //               if (projects.length > 0) {
  //                   const maxId = Math.max(...projects.map(project => project.id));
  //                   maxIdRef.current = maxId;
  //               } else {
  //                   maxIdRef.current = null;  // 如果沒有專案，設置為 null
  //               }

  //               // 2. 檢查當前 URL ID
  //               const isValidId = id && /^\d+$/.test(id);

  //               if (!isValidId) {
  //                   // 如果 ID 無效且有最大 ID，導向到最大 ID 的頁面
  //                   if (maxIdRef.current) {
  //                       Navigate(`/chatbot/document/${maxIdRef.current}`);
  //                   } else {
  //                       // 如果沒有最大 ID（可能是空專案列表），可以導向到新建專案頁面或其他頁面
  //                       Navigate('/document/new');  // 或其他適當的處理方式
  //                   }
  //                   return;
  //               }

  //               // 3. 如果 ID 有效，執行 getProjectDetails
  //               await getProjectDetails();
  //           }
  //         } catch (error) {
  //             console.error('Error fetching data:', error);
  //             // 錯誤處理
  //             if (Location.pathname.startsWith('/document')) {
  //               if (maxIdRef.current) {
  //                   Navigate(`/chatbot/document/${maxIdRef.current}`);
  //               } else {
  //                   Navigate('/document/new');
  //               }
  //           }
  //         }
  //     };

  //     fetchData();
  // }, [Navigate, id, getProjectDetails]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("document fetchData: ", fetchData);
      try {
        if (Location.pathname.startsWith("/chatbot/document")) {
          if (projectsData && projectsData.data) {
            const projects = projectsData.data;

            // If there are projects, find the maximum ID
            if (projects.length > 0) {
              const maxId = Math.max(...projects.map((project) => project.id));
              maxIdRef.current = maxId;
            } else {
              maxIdRef.current = null;
            }

            // Check current URL ID
            const isValidId = id && /^\d+$/.test(id);

            if (!isValidId) {
              if (maxIdRef.current) {
                Navigate(`/chatbot/document/${maxIdRef.current}`);
              } else {
                Navigate("/chatbot/document/new");
              }
              return;
            }

            // If ID is valid, execute getProjectDetails
            await getProjectDetails();
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (Location.pathname.startsWith("/chatbot/document")) {
          if (maxIdRef.current) {
            Navigate(`/chatbot/document/${maxIdRef.current}`);
          } else {
            Navigate("/chatbot/document/new");
          }
        }
      }
    };

    fetchData();
  }, [Navigate, id, getProjectDetails, projectsData, Location.pathname]);

  useEffect(() => {
    console.log("document title useEffect: ", title);
    titleRef.current = title;
    console.log("modified titleRef.current: ", titleRef.current);
  }, [title]);

  return (
    <div className="w-full h-full">
      <WebNav />
      <SideBar
        projectList={projectList}
        currentId={id}
        onProjectDeleted={getAllProjects}
        setProjectList={setProjectList}
        getAllProjects={getAllProjects}
        getProjectDetails={getProjectDetails}
        onTitleChange={(callback) => {
          titleChangeCallbackRef.current = callback;
        }}
        content={content}
        setTitle={setTitle}
        idRef={idRef}
        localProjectList={localProjectList}
        setLocalProjectList={setLocalProjectList}
        localProjectListRef={localProjectListRef}
      />
      <div className="ml-[calc(100%/7)] w-[calc(6*100%/7)]">
        <HorizontalBar />
        <div className="mt-[76px]">
          <FilterComponent
            question={question}
            data={visualizationData}
            onFilteredData={setFilteredData}
          />
          {/^\d+$/.test(id) && (
            <div className="md:pt-5 md:pb-8 pt-20 pb-10 relative">
              {/*<input
                className="focus:outline-none block w-full font-bold border-0 border-b py-1 !border-gray-300"
                placeholder="Title"
                onChange={(e) => handleTitleChange(e.target.value)}
                value={title}
                style={{ fontSize: "2.25rem", lineHeight: "1.5rem" }}
                id="document-title"
              /> */}
              <AIEditorComponent
                ref={editorRef}
                sdk={sdk}
                content={content}
                setContent={setContent}
                title={title}
                onSave={saveToDatabase}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
