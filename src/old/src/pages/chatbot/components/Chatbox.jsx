import { useState, useEffect, useRef } from "react";
import { ChevronDown, Send } from "lucide-react";
import { generateId } from "@yoopta/editor";
import { markdown } from "@yoopta/exports";

import NewGCPSearchService from "../services/gcp-search-service";

import s from "./Chatbox.module.css";

const dummy = {
  "c7efca47-5638-420b-bca5-46b5814b240a": {
    id: "c7efca47-5638-420b-bca5-46b5814b240a",
    value: [
      {
        id: "49ab54ee-ef31-4fe1-bab3-fd6ff25a7f91",
        type: "paragraph",
        children: [
          {
            text: "The US biotechnology industry is a significant contributor to the global economy, experiencing substantial growth and development across various sectors.",
          },
        ],
        props: {
          nodeType: "block",
        },
      },
    ],
    type: "Paragraph",
    meta: {
      order: 0,
      depth: 0,
    },
  },
  "09ed396a-77ab-4e84-93fb-110fb0012817": {
    id: "09ed396a-77ab-4e84-93fb-110fb0012817",
    value: [
      {
        id: "f6df740e-1c25-4791-87a4-38e6b96f4ec4",
        type: "paragraph",
        children: [
          {
            text: "Current State of the US Biotech Industry (as of February 7, 2025):",
            bold: true,
          },
        ],
        props: {
          nodeType: "block",
        },
      },
    ],
    type: "Paragraph",
    meta: {
      order: 1,
      depth: 0,
    },
  },
  "4bdb8046-f3c2-4083-94f5-4c086bd7b1c9": {
    id: "4bdb8046-f3c2-4083-94f5-4c086bd7b1c9",
    value: [
      {
        id: "083c9f49-2f42-4770-b6de-6613939761f0",
        type: "bulleted-list",
        children: [
          {
            bold: true,
            text: "Strong Growth but with Fluctuations:",
          },
          {
            text: "\n",
          },
        ],
        props: {
          nodeType: "block",
        },
      },
    ],
    type: "BulletedList",
    meta: {
      order: 2,
      depth: 0,
      align: "left",
    },
  },
  "42b55442-f905-40c7-b9df-29d131ccf282": {
    id: "42b55442-f905-40c7-b9df-29d131ccf282",
    value: [
      {
        id: "2f458f7b-dbb4-4d20-ada4-25dc77dc9135",
        type: "bulleted-list",
        children: [
          {
            bold: true,
            text: "Key Sectors:",
          },
          {
            text: "\n",
          },
        ],
        props: {
          nodeType: "block",
        },
      },
    ],
    type: "BulletedList",
    meta: {
      order: 3,
      depth: 0,
      align: "left",
    },
  },
  "388751ae-2e77-4450-8016-f06b1259065b": {
    id: "388751ae-2e77-4450-8016-f06b1259065b",
    value: [
      {
        id: "d7695dfe-ea3c-4587-8595-6141ab5421b7",
        type: "bulleted-list",
        children: [
          {
            bold: true,
            text: "Geographic Distribution:",
          },
          {
            text: "\n",
          },
        ],
        props: {
          nodeType: "block",
        },
      },
    ],
    type: "BulletedList",
    meta: {
      order: 4,
      depth: 0,
      align: "left",
    },
  },
  "beeda793-f957-4771-8849-78c453fdc5a8": {
    id: "beeda793-f957-4771-8849-78c453fdc5a8",
    value: [
      {
        id: "b64446d1-bd11-411e-8b5f-025e92a9a116",
        type: "bulleted-list",
        children: [
          {
            bold: true,
            text: "Driving Forces:",
          },
          {
            text: "\n",
          },
        ],
        props: {
          nodeType: "block",
        },
      },
    ],
    type: "BulletedList",
    meta: {
      order: 5,
      depth: 0,
      align: "left",
    },
  },
  "6c7b04d8-ce5d-43a4-942b-2dbe160f6ec8": {
    id: "6c7b04d8-ce5d-43a4-942b-2dbe160f6ec8",
    value: [
      {
        id: "a6296ea2-6010-423a-b36b-c2a42978b5c3",
        type: "bulleted-list",
        children: [
          {
            bold: true,
            text: "National Security Implications:",
          },
          {
            text: "\n",
          },
        ],
        props: {
          nodeType: "block",
        },
      },
    ],
    type: "BulletedList",
    meta: {
      order: 6,
      depth: 0,
      align: "left",
    },
  },
  "c90decee-163a-4f60-81d3-5e4475025f08": {
    id: "c90decee-163a-4f60-81d3-5e4475025f08",
    value: [
      {
        id: "8c03f687-a6a8-4a1f-862e-9debd544a52a",
        type: "bulleted-list",
        children: [
          {
            bold: true,
            text: "Challenges:",
          },
          {
            text: "\n",
          },
        ],
        props: {
          nodeType: "block",
        },
      },
    ],
    type: "BulletedList",
    meta: {
      order: 7,
      depth: 0,
      align: "left",
    },
  },
  "788b5bfc-f918-4547-b8f9-9d1394d54590": {
    id: "788b5bfc-f918-4547-b8f9-9d1394d54590",
    value: [
      {
        id: "c10ccf0e-c864-49e8-a403-7464212c7451",
        type: "paragraph",
        children: [
          {
            text: "Note:",
            bold: true,
          },
          {
            text: "  The information provided here is current as of February 7, 2025.  The biotechnology industry is dynamic, and these trends and figures may change over time.",
          },
        ],
        props: {
          nodeType: "block",
        },
      },
    ],
    type: "Paragraph",
    meta: {
      order: 8,
      depth: 0,
    },
  },
};

export default function ChatBox({ editor }) {
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("chat");
  const [showModeMenu, setShowModeMenu] = useState(false);
  const modeMenuRef = useRef(null);
  const [isSending, setIsSending] = useState(false);
  const [tempMessage, setTempMessage] = useState("");

  console.log(editor.getEditorValue());

  const modes = {
    chat: { label: "Chat BIODND" },
    report: { label: "Generate Report" },
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modeMenuRef.current && !modeMenuRef.current.contains(event.target)) {
        setShowModeMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
    console.log("mode: ", mode);
  };

  // Generate Report
  const handleGenerateReportClick = async (e) => {
    console.log("message: ", message);
    console.log("mode: ", mode);

    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    setMessage("");

    editor.readOnly = true;
    const generatingTextsBlock = {
      type: "Paragraph",
      value: [
        {
          id: generateId(),
          type: "paragraph",
          children: [
            {
              text: "Generating the report...",
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

    editor.insertBlock(generatingTextsBlock, {
      focus: false,
    });

    let originalLastPosition = Object.keys(editor.children).length;
    console.log("originalLastPosition: ", originalLastPosition);

    try {
      const res = await NewGCPSearchService.getDetails(message.trim());
      const mdString = res?.data?.output3;
      console.log("mdString: ", mdString);
      const processedMdString = mdString
        .replace(/\[(100|[1-9]\d?)((?:,\s*(?:100|[1-9]\d?))*)\]/g, "")
        .replace(/(\*\s.*?)\n\s*(\*\s)/g, "$1\n$2");
      const processedObject = markdown.deserialize(editor, processedMdString);
      console.log("processedObject: ", processedObject);

      for (const [key, value] of Object.entries(processedObject)) {
        const newLastPosition = Object.keys(editor.children).length;
        console.log("newLastPosition: ", newLastPosition);

        editor.insertBlock(value, { at: [newLastPosition], focus: false });
      }
      updateBlockText([originalLastPosition - 1], message, "#000000");
    } catch (e) {
      console.log(e);
      toast.error("Sorry! Something went wrong. Please try again later.");
      updateBlockText([editor.selection[0] + 1], "", "#000000");
      setMessage(tempMessage);
    } finally {
      editor.readOnly = false;
      setIsSending(false);
    }
  };

  // Chat BioDND
  const handleChatBiodndClick = async (e) => {
    console.log("message: ", message);
    console.log("mode: ", mode);

    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    setMessage("");

    editor.readOnly = true;
    const generatingTextsBlock = {
      type: "Paragraph",
      value: [
        {
          id: generateId(),
          type: "paragraph",
          children: [
            { text: "Generating...", highlight: { color: "#C4554D" } },
          ],
          props: {
            nodeType: "void",
          },
        },
      ],
      meta: { depth: 0 },
    };

    editor.insertBlock(generatingTextsBlock, {
      focus: false,
    });

    let originalLastPosition = Object.keys(editor.children).length;
    console.log("originalLastPosition: ", originalLastPosition);

    const res = await NewGCPSearchService.getSummary(message.trim());
    const mdString = res?.data?.output3;
    const processedMdString = mdString
      .replace(/\[(100|[1-9]\d?)((?:,\s*(?:100|[1-9]\d?))*)\]/g, "")
      .replace(/(\*\s.*?)\n\s*(\*\s)/g, "$1\n$2");
    const processedObject = markdown.deserialize(editor, processedMdString);

    try {
      for (const [key, value] of Object.entries(processedObject)) {
        const newLastPosition = Object.keys(editor.children).length;
        console.log("newLastPosition: ", newLastPosition);

        editor.insertBlock(value, { at: [newLastPosition], focus: false });
      }
      updateBlockText([originalLastPosition - 1], message, "#000000");
    } catch (e) {
      console.log(e);
      toast.error("Sorry! Something went wrong. Please try again later.");
      updateBlockText([editor.selection[0] + 1], "", "#000000");
      setMessage(tempMessage);
    } finally {
      editor.readOnly = false;
      setIsSending(false);
    }
  };

  function updateBlockText(selection, newText, newTextColor) {
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
  }

  useEffect(() => {
    if (message) {
      setTempMessage(message);
    }
  }, [message]);

  useEffect(() => console.log("tempMessage: ", tempMessage), [tempMessage]);

  useEffect(() => console.log("mode: ", mode), [mode]);

  return (
    <form
      onSubmit={
        mode === "report"
          ? (e) => handleGenerateReportClick(e)
          : (e) => handleChatBiodndClick(e)
      }
      className="flex items-center gap-2 px-3 py-5 bg-gray-100/75 rounded-lg fixed bottom-8 right-0 mx-auto w-[74%] left-[14%]"
    >
      {/* Mode Selection */}
      <div className="relative min-w-[120px]" ref={modeMenuRef}>
        <button
          type="button"
          onClick={() => setShowModeMenu(!showModeMenu)}
          className="w-full px-3 py-2 hover:bg-violet-50/75 rounded-lg 
                     flex items-center justify-between gap-2 transition-colors duration-200
                     border border-violet-300 bg-white"
        >
          <div className="flex items-center gap-2">
            {/* <CurrentModeIcon className="h-4 w-4" /> */}
            <span className={`text-sm ${s.modeButtons} font-bold`}>
              {modes[mode].label}
            </span>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-violet-500 
                       ${showModeMenu ? "transform rotate-180" : ""}`}
          />
        </button>

        {/* Mode Selection Menu */}
        {showModeMenu && (
          <div
            className="absolute top-0 left-0 w-full bg-white border border-gray-200 
                          rounded-lg shadow-lg py-1 z-10"
          >
            {/* {Object.entries(modes).map(([key, { icon: Icon, label }]) => ( */}
            {Object.entries(modes).map(([key, { label }]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setMode(key);
                  setShowModeMenu(false);
                }}
                className={`w-full px-3 py-2 flex items-center gap-2 
                           hover:bg-violet-50 transition-colors duration-200
                           ${s.modeButtons}`}
              >
                {/* <Icon className="h-4 w-4" /> */}
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input Field */}
      <div className="flex-1 relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="輸入訊息..."
          className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:!outline-transparent focus:!ring-transparent pr-10"
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 
                     hover:text-gray-600 transition-colors duration-200"
        ></button>
      </div>

      {/* Send Button */}
      <button
        type="submit"
        disabled={!message.trim() || isSending}
        className={`px-3 py-[0.45rem] rounded-lg transition-colors duration-200 flex items-center ${
          message.trim()
            ? "text-white"
            : "!bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
        style={{
          backgroundImage: message.trim()
            ? "linear-gradient(to right, #81D8D0, rgb(41, 163, 208))"
            : "",
        }}
      >
        Ask AI
        <Send className="h-5 w-5 ml-2" />
      </button>
    </form>
  );
}
