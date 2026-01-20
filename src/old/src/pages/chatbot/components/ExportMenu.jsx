import React, { useState, useEffect } from "react";
import { MoreHorizontal, Download, FileDown, Trash2 } from "lucide-react";
import { html as beautifyHtml } from "js-beautify";

import { applyHighlightsToHtml } from "../utils/HandleHighlightText";

import style from "./ExportMenu.module.scss";

const ExportMenu = ({ onExport, onDelete, title, editor }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleMoreClick = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({ x: rect.left, y: rect.bottom + 5 });
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowMenu(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const exportPDF = async () => {
    const rawContent = onExport("pdf");
    if (editor) {
      console.log("jsonContent: ", editor.getEditorValue());
    }

    const applyHighlightsResult = applyHighlightsToHtml(
      editor.getEditorValue(),
      rawContent
    );

    const beautifyOptions = {
      indent_size: 2,
      max_preserve_newlines: 1,
      preserve_newlines: true,
      wrap_line_length: 0,
    };

    const styleSheet = `
    <style>
        h1 { font-size: 2.25rem; font-weight: bold; margin-bottom: 0.5rem; page-break-inside: avoid; break-inside: avoid; }
        h2 { font-size: 1.875rem; font-weight: bold; margin-bottom: 0.5rem; page-break-inside: avoid; break-inside: avoid; }
        h3 { font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem; page-break-inside: avoid; break-inside: avoid; }
        p { margin-bottom: 1rem; page-break-inside: avoid; break-inside: avoid; }
        ul, ol { margin-left: 2rem; margin-bottom: 1rem; page-break-inside: avoid; break-inside: avoid; }
        blockquote { 
            border-left: 3px solid #ccc;
            margin-left: 0;
            padding-left: 1rem;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        div, li, td, th { 
            page-break-inside: avoid; 
            break-inside: avoid;
        }
        h1, h2, h3 { 
            page-break-after: avoid;
            break-after: avoid;
        }
        img, figure { 
            page-break-inside: avoid;
            break-inside: avoid;
            max-width: 100%;
            margin: 1rem auto;
        }
        .image-container, figure {
            page-break-inside: avoid;
            break-inside: avoid;
            margin: 1rem 0;
        }
    </style>
`;

    // const beautifiedContent = beautifyHtml(rawContent, beautifyOptions);

    const beautifiedContent = applyHighlightsResult;
    const contentWithStyles = `
            <!DOCTYPE html>
            <html>
                <head>${styleSheet}</head>
                <body>
                    <div class="${style.title}">
                        ${title}
                    </div>
                    <div class="${style.dividedLine}"></div>
                    ${beautifiedContent}
                </body>
            </html>
        `;

    const element = document.createElement("div");
    element.innerHTML = contentWithStyles;

    const opt = {
      margin: 1,
      filename: "document.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    try {
      const html2pdf = (await import("html2pdf.js")).default;
      await html2pdf().set(opt).from(element).save();
      setShowMenu(false);
    } catch (error) {
      console.error("PDF 匯出失敗:", error);
    }
  };

  const exportMarkdown = () => {
    const content = onExport("markdown");
    const titleMd = `# ${title}\n\n`;
    const fullContent = titleMd + content;
    const blob = new Blob([fullContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  return (
    <div className="fixed end-5">
      <button
        variant="ghost"
        className="hover:bg-gray-200 p-2"
        onClick={handleMoreClick}
      >
        <MoreHorizontal size={30} />
      </button>

      {showMenu && (
        <div
          className="absolute bg-white shadow-lg rounded-md py-1 z-50 right-0 text-nowrap"
          // style={{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }}
        >
          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
            onClick={exportPDF}
          >
            <FileDown size={16} />
            匯出 PDF
          </button>
          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
            onClick={exportMarkdown}
          >
            <Download size={16} />
            匯出 Markdown
          </button>
          {/* <button 
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => {
                            onDelete();
                            setShowMenu(false);
                        }}
                    >
                        <Trash2 size={16} />
                        刪除
                    </button> */}
        </div>
      )}
    </div>
  );
};

export default ExportMenu;
