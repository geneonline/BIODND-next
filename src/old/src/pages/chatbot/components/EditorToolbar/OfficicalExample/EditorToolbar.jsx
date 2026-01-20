import { useYooptaEditor, useYooptaTools, generateId, Blocks } from '@yoopta/editor';
import cx from 'classnames';
import { CodeIcon, ChevronDownIcon, ChevronUpIcon, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFloating, offset, flip, shift, inline, autoUpdate, FloatingPortal } from '@floating-ui/react';
import s from './EditorToolbar.module.css';
import { buildActionMenuRenderProps } from '@yoopta/action-menu-list';
import { html, markdown } from '@yoopta/exports';
import { marked } from "marked";
import { toast } from "react-hot-toast";
import { findSlateBySelectionPath } from '@yoopta/editor';

import { HighlightColor } from './HighlightColor'; // Import HighlightColor component

import report1 from "../../../dummy-data/report/1.json";
import report2 from "../../../dummy-data/report/2.json";
import report3 from "../../../dummy-data/report/3.json";
import report4 from "../../../dummy-data/report/4.json";
import graph1 from "../../../dummy-data/graph/1.png";
import graph2 from "../../../dummy-data/graph/2.png";

import NewGCPSearchService from '../../../services/gcp-search-service';
import NewProjectService from '../../../services/project-service';

// import reportMd1 from "../../../dummy-data/report/biodnd-1.md";
// const reportMd1 = require("../../../dummy-data/report/biodnd-1.md").default;

const DEFAULT_MODALS = { link: false, highlight: false, actionMenu: false };

const EditorToolbar = (props) => {
  // const [modals, setModals] = useState(DEFAULT_MODALS);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [debugOutput, setDebugOutput] = useState([]);

  const [modals, setModals] = useState({ ...DEFAULT_MODALS, aiMenu: false });
  
  // Add new floating UI hook for AI menu
  const { refs: aiMenuRefs, floatingStyles: aiMenuStyles } = useFloating({
    placement: 'bottom-start',
    open: modals.aiMenu,
    onOpenChange: (open) => onChangeModal('aiMenu', open),
    middleware: [offset(5), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  // positioning for action menu tool
  const { refs: actionMenuRefs, floatingStyles: actionMenuStyles } = useFloating({
    placement: 'bottom-start',
    open: modals.actionMenu,
    onOpenChange: (open) => onChangeModal('actionMenu', open),
    middleware: [inline(), flip(), shift(), offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const { refs: highlightPickerRefs, floatingStyles: highlightPickerStyles } = useFloating({
    placement: 'top-end',
    open: modals.highlight,
    onOpenChange: (open) => onChangeModal('highlight', open),
    middleware: [inline(), flip(), shift(), offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const onChangeModal = (modal, value) => {
    setModals((prevModals) => ({ ...prevModals, [modal]: value }));
  };

  const { activeBlock } = props;
  const editor = useYooptaEditor();
  const tools = useYooptaTools();

  const blockLabel = activeBlock?.options?.display?.title || activeBlock?.type || '';
  const ActionMenu = tools.ActionMenu;

  const onCloseActionMenu = () => onChangeModal('actionMenu', false);

  const actionMenuRenderProps = buildActionMenuRenderProps({
    editor,
    onClose: onCloseActionMenu,
    view: 'small',
    mode: 'toggle',
  });

  // 處理圖片上傳
  const handleGenerateDemoImage = (graphString) => {
    let graphSrc = "";
    if (graphString === "What to expect in US healthcare in 2023 and beyond") {
      graphSrc = graph1;
    } else if (graphString === "What are the key drivers for the growth of medical profit pools in 2023") {
      graphSrc = graph2;
    }
    console.log(graphString);

    updateBlockText(editor.selection, "Generating the graph...", "#C4554D")

    setTimeout(() => {
      let newId = generateId()
      // 刪除 block
      editor.deleteBlock({ at: editor.selection })
      const newImageBlock = {
        type: 'Image',
        value: [{ 
          id: newId,
          type: 'image',
          children: [{ text: '' }],
          props: {
            src: graphSrc,
            alt: 'Visualization',
            sizes: { width: 'auto', height: 'auto' },
            srcSet: null,
            bgColor: null,
            fit: "contain",
            nodeType: "void"
          }
        }],
        meta: { depth: 0 }
      };
      editor.insertBlock(newImageBlock, {
        at: editor.selection, // 插入到最後
        focus: false
      });  
    }, 3000);
  };  

  const handleGenerateGraph = async (editor) => {
    if (!editor.selection) {
      alert('Please select some text to generate the graph.');
      return;
    }
    console.log(editor)

    const selectedBlock = editor.getBlock({ at: editor.selection });
    // console.log(selectedBlock)
    const formattedString = formatBlockToString(selectedBlock.value[0]);
    // console.log(formattedString)

    if (!formattedString) {
      alert('Please select some text to generate the graph.');
      return;
    }


    try {
      if (formattedString.trim() === "What to expect in US healthcare in 2023 and beyond" || formattedString.trim() === "What are the key drivers for the growth of medical profit pools in 2023") {
        handleGenerateDemoImage(formattedString.trim());
        return;
      } else {
        editor.emit('callAIChatBot', { id: selectedBlock.id, selection: editor.selection, question: formattedString});
      }
    } catch (error) {
      console.error('Error asking AI:', error);
    }
  };

  // 處理 block 的更新
  const updateBlockText = (selection, newText, newTextColor) => {
    console.log(selection);
    let newId = generateId()
    // 刪除 block
    editor.deleteBlock({ at: selection })
    // 插入新 block
    const newParagraphBlock = {
      type: 'Paragraph',
      value: [{ children: [{ text: newText, highlight: {color: newTextColor} }], id: newId, props: {nodeType: "block"},type: 'paragraph'  }],
      meta: { depth: 0 }
    };
    editor.insertBlock(newParagraphBlock, {
      at: selection, // 可選，指定插入位置（這裡表示在索引 1 的位置插入）
      focus: true, // 可選，插入後是否聚焦到新區塊
      slate: null // 可選，指定 Slate 編輯器實例
    });
  }

  const updateJsonOrders = (jsonData, indexNo) => {
    console.log(indexNo);

    const result = {};

    if (!Array.isArray(indexNo)) {
      indexNo = [0];
    }
    
    for (const key in jsonData) {
      const item = jsonData[key];
      if (item.meta && typeof item.meta.order === 'number') {
        result[key] = {
          ...item,
          meta: {
            ...item.meta,
            order: item.meta.order + indexNo[0]
          }
        };
      } else {
        result[key] = item;
      }
    }
    
    return result;
  };

  // 第一步：更新對象 A 並找到最大的 order 值
  const processObjectA = (objectA, indexNo) => {
    let maxOrder = 0;
    const updatedObjectA = {};

    if (!Array.isArray(indexNo)) {
      indexNo = [0];
    }
    
    // 更新 objectA 的 order 值並找到最大值
    for (const key in objectA) {
      const item = objectA[key];
      if (item.meta && typeof item.meta.order === 'number') {
        const newOrder = item.meta.order + indexNo[0];
        maxOrder = Math.max(maxOrder, newOrder);
        
        updatedObjectA[key] = {
          ...item,
          meta: {
            ...item.meta,
            order: newOrder
          }
        };
      } else {
        updatedObjectA[key] = item;
      }
    }
    
    return { updatedObjectA, maxOrder };
  };

  // 第二步：根據 maxOrder 更新對象 B
  const processObjectB = (objectB, maxOrder, indexNo) => {
    const updatedObjectB = {};

    if (!Array.isArray(indexNo)) {
      indexNo = [0];
    }
    
    for (const key in objectB) {
      const item = objectB[key];
      if (item.meta && typeof item.meta.order === 'number') {
        if (item.meta.order >= indexNo[0]) {
          updatedObjectB[key] = {
            ...item,
            meta: {
              ...item.meta,
              order: item.meta.order + maxOrder
            }
          };
        } else {
          updatedObjectB[key] = item; // 保持原值
        }
      } else {
        updatedObjectB[key] = item;
      }
    }
    
    return updatedObjectB;
  };

  // 主函數：處理兩個對象
  const processObjects = (objectA, objectB, indexNo) => {
    // 處理對象 A
    const { updatedObjectA, maxOrder } = processObjectA(objectA, indexNo);
    
    // 處理對象 B
    const updatedObjectB = processObjectB(objectB, maxOrder, indexNo);
    
    return {
      objectA: updatedObjectA,
      objectB: updatedObjectB,
      maxOrder
    };
  };
  
  // // 處理 generated report 時返回的 HTML 字串，避免 li 標籤中 length 為 1 且值為數字的 array 被編輯器誤認為是 to-do list
  // const processHtmlLists = (htmlString) => {
  //   // 用正則表達式匹配 <li> 標籤
  //   const liRegex = /<li>(.*?)<\/li>/g;
    
  //   // 用正則表達式匹配陣列
  //   const arrayRegex = /\[(.*?)\]/g;
    
  //   // 處理 HTML 字串
  //   const processedHtml = htmlString.replace(liRegex, (match, content) => {
  //     // 檢查 <li> 內容是否包含陣列
  //     const processedContent = content.replace(arrayRegex, (arrayMatch, arrayContent) => {
  //       // 移除陣列內容的空白
  //       const trimmedArray = arrayContent.trim();
        
  //       // 檢查是否為空陣列
  //       if (trimmedArray === '') {
  //         return '';
  //       }
        
  //       // 檢查是否只包含一個數字
  //       if (/^\d+$/.test(trimmedArray)) {
  //         return '';
  //       }
        
  //       // 如果不符合條件，保留原始陣列
  //       return arrayMatch;
  //     });
      
  //     // 重新構建 <li> 標籤
  //     return `<li>${processedContent}</li>`;
  //   });
  
  //   return processedHtml;
  // };
    
  const processHtml = (htmlString) => {
    // 步驟 1: 移除所有的陣列
    const arrayRegex = /\[([^\[\]]*|\[[^\[\]]*\])*\]/g;
    let processedHtml = htmlString.replace(arrayRegex, '');
    
    // 步驟 2: 處理換行符
    // 使用正則表達式匹配一個或多個連續的換行符
    const newlineRegex = /\n+/g;
    
    processedHtml = processedHtml.replace(newlineRegex, (match) => {
      // 計算連續換行符的數量
      const count = match.length;
      // 返回相應數量的 <br /> 標籤
      return '<br />'.repeat(count);
    });

    return processedHtml;
  }

  const formatList = (text) => {
    // Match bullet list items (e.g., * or - followed by text) and the blank lines between them
    const listItemRegex = /(^\s*[\*\-]\s.+)(\n\s*\n)(?=[\*\-]\s)/gm;

    // Replace double newlines between list items with a single newline
    const adjustedText = text.replace(listItemRegex, (match, p1) => `${p1}\n`);

    return adjustedText;
}

  const processObject = (object) => {
    const isHeading = (type) => ['HeadingOne', 'HeadingTwo', 'HeadingThree'].includes(type);

    const newObject = { ...object };
    let insertions = [];
    let prevType = null;

    Object.entries(newObject)
      .sort((a, b) => a[1].meta.order - b[1].meta.order)
      .forEach(([key, value]) => {
        if (isHeading(value.type) && value.meta && value.meta.order !== 0) {
          if (!isHeading(prevType)) {
            const newId = generateId();
            const newEntry = {
              [newId]: {
                id: newId,
                value: [
                  {
                    id: generateId(),
                    type: 'paragraph',
                    children: [{ text: '' }],
                    props: { nodeType: 'block' }
                  }
                ],
                type: 'Paragraph',
                meta: {
                  order: value.meta.order - 0.5,
                  depth: 0,
                  align: 'left'
                }
              }
            };
            insertions.push(newEntry);
          }
        }
        prevType = value.type;
      });

    // 將新的對象插入到原對象中
    insertions.forEach(insertion => {
      Object.assign(newObject, insertion);
    });

    // 重新排序對象
    const sortedObject = Object.fromEntries(
      Object.entries(newObject).sort((a, b) => a[1].meta.order - b[1].meta.order)
    );

    return sortedObject;
  };


  // 生成短篇摘要
  const handleGenerateSummaryClick = async (editor) => {
    if (!editor.selection) {
      alert('Please select some text to generate summary.');
      return;
    }

    const selectedBlock = editor.getBlock({ at: editor.selection });
    const formattedString = formatBlockToString(selectedBlock.value[0]);
    
    if (!formattedString) {
      alert('Please select some text to generate summary.');
      return;
    }

    // updateBlockText(editor.selection, "Generating the summary...", "#C4554D");

    console.log(formattedString)

    try {
      editor.readOnly = true;
      const generatingTextsBlock = {
        type: 'Paragraph',
        value: [{ 
          id: generateId(),
          type: 'paragraph',
          children: [{ text: 'Generating the summary...', highlight: {color: "#C4554D"} }],
          props: {
            nodeType: "void"
          }
        }],
        meta: { depth: 0 }
      }
      editor.insertBlock(generatingTextsBlock, {
        at: [editor.selection[0] + 1],
        focus: false
      })

      const res = await NewGCPSearchService.getSummary(formattedString);
      const mdString = res?.data?.output1;
      console.log(mdString)
      // const mdString = "1. Industry Status\n\nIn 2024, the U.S. healthcare sector is poised for significant changes, driven by various economic, regulatory, and technological factors. Here’s a comprehensive analysis based on recent insights.\n\n2. Financial Performance \n- **Rising Costs and Premiums:** Employers are likely to face health insurance premium increases that exceed their comfort levels, with many anticipating annual hikes above 4%. This trend is expected to pressure both employers and employees financially.\n- **Labor Shortages and Inflation:** The healthcare sector continues to grapple with labor shortages and inflationary pressures, which have been exacerbated by the COVID-19 pandemic. These factors contribute to a projected 200-basis point gap between reimbursement rates and cost inflation, necessitating transformations in operational strategies for health systems.\n- **Convergence of Healthcare Models:** The industry is witnessing a shift towards convergence, where traditional healthcare stakeholders are being disrupted by new entrants such as tech companies and retailers. This convergence is reshaping the healthcare ecosystem, creating opportunities for innovative business models and partnerships.\n\n3. Market Position and Strategy\n- **Mergers and Acquisitions (M&A):** There has been a notable rebound in M&A activity within the healthcare sector as organizations seek to enhance their capabilities and market positions. This trend is expected to continue as entities look for ways to scale efficiently amid rising operational costs.\n- **Outsourcing Opportunities:** Many health systems are considering outsourcing non-core functions to improve efficiency and reduce costs. Approximately 40% of healthcare CFOs have expressed interest in optimizing service models through outsourcing strategies.\n- **Focus on Value-Based Care:** Payers are increasingly shifting their focus from merely administering benefits to managing care effectively. This includes enhancing partnerships with physicians under risk-based arrangements to improve patient outcomes and control cos";
      updateBlockText([editor.selection[0] + 1], "", "#000000");
      const processedMdString = formatList(mdString).replace(/\[(100|[1-9]\d?)((?:,\s*(?:100|[1-9]\d?))*)\]/g, '');
      console.log(processedMdString)
      const processedObject = markdown.deserialize(editor, processedMdString);
      console.log("processedObject: ", processedObject);
      editor.insertBlocks(Object.values(processedObject), { at: [editor.selection[0] + 1], focus: false });
    } catch (e) {
      console.log(e);
      toast.error('Sorry! Something went wrong. Please try again later.');
      updateBlockText([editor.selection[0] + 1], "", "#000000");
    } finally {
      editor.readOnly = false;
    }
  };


  // 生成長篇報告
  const handleGenerateReportClick = async (editor) => {
    if (!editor.selection) {
      alert('Please select some text to generate report.');
      return;
    }

    const selectedBlock = editor.getBlock({ at: editor.selection });
    const formattedString = formatBlockToString(selectedBlock.value[0]);
    
    if (!formattedString) {
      alert('Please select some text to generate report.');
      return;
    }

    // updateBlockText(editor.selection, "Generating the report...", "#C4554D");

    console.log(formattedString)

    if (formattedString === "business analysis US medical in 2024") {
      setTimeout(() => {
        editor.deleteBlock({ at: editor.selection });
        const prevContent = editor.getEditorValue();
        let newContentWithReport;
        let jsonFile;
        console.log(formattedString)
        jsonFile = { ...report4 };
        let reportDraft = updateJsonOrders(jsonFile, editor.selection);
        let res = processObjects(reportDraft, prevContent, editor.selection);
        newContentWithReport = { ...res.objectA, ...res.objectB };  
        editor.setEditorValue(newContentWithReport);
        setGeneratingReport(false);
      }, 5000);
    } else {

      try {
        editor.readOnly = true;
        const generatingTextsBlock = {
          type: 'Paragraph',
          value: [{ 
            id: generateId(),
            type: 'paragraph',
            children: [{ text: 'Generating the report...', highlight: {color: "#C4554D"} }],
            props: {
              nodeType: "void"
            }
          }],
          meta: { depth: 0 }
        }
        editor.insertBlock(generatingTextsBlock, {
          at: [editor.selection[0] + 1],
          focus: false
        })
  
        const res = await NewGCPSearchService.getDetails(formattedString);
        const mdString = res?.data?.output3;
        updateBlockText([editor.selection[0] + 1], "", "#000000");
        const processedMdString = formatList(mdString).replace(/\[(100|[1-9]\d?)((?:,\s*(?:100|[1-9]\d?))*)\]/g, '');
        const processedObject = markdown.deserialize(editor, processedMdString);
        console.log("processedObject: ", processedObject);
        editor.insertBlocks(Object.values(processedObject), { at: [editor.selection[0] + 1], focus: false });
      } catch (e) {
        console.log(e);
        toast.error('Sorry! Something went wrong. Please try again later.');
        updateBlockText([editor.selection[0] + 1], "", "#000000");
      } finally {
        editor.readOnly = false;
      }
    }
  };

  const highlightColors = editor.formats.highlight?.getValue();
  const getHighlightTriggerStyle = () => ({
    color: highlightColors?.color,
    backgroundColor: highlightColors?.backgroundColor,
    backgroundImage: highlightColors?.backgroundImage,
    WebkitTextFillColor: highlightColors?.webkitTextFillColor,
  });

  function formatBlockToString(block) {
    return block.children.map(child => child.text).join('');
  }

  return (
    <div className='relative'>
      <div className={s.toolbar}>
        <div className={s.group}>
          {/* <button type="button" className={`${s.group} ${s.item}`} onClick={() => handleGenerateReportClick(editor)}>
            <span className={s.askGPT}>Generate Report</span>
          </button>
          <button type="button" className={s.item} onClick={() => handleAskAiClick(editor)}>
            <span className={s.askGPT}>Generate Graph</span>
          </button> */}
          <button
            type="button"
            className={cx(s.item, { [s.active]: modals.aiMenu })}
            ref={aiMenuRefs.setReference}
            onClick={() => onChangeModal('aiMenu', !modals.aiMenu)}
          >
            <span className={s.askAI}>Ask AI</span>
            {modals.aiMenu ? <ChevronUpIcon size={12} /> : <ChevronDownIcon size={12} />}
          </button>
          {modals.aiMenu && (
            <FloatingPortal id="yoo-ai-menu-portal" root={document.getElementById('yoopta-editor')}>
              <div 
                ref={aiMenuRefs.setFloating} 
                style={aiMenuStyles}
                className={s.aiMenuContainer}
              >
                <div className='w-full'>
                  <button
                    type="button"
                    className={s.aiMenuItem}
                    onClick={() => {
                      handleGenerateSummaryClick(editor);
                      onChangeModal('aiMenu', false);
                    }}
                  >
                    Chat BIODND
                  </button>
                </div>
                <div className='w-full'>
                  <button
                    type="button"
                    className={s.aiMenuItem}
                    onClick={() => {
                      handleGenerateReportClick(editor);
                      onChangeModal('aiMenu', false);
                    }}
                  >
                    Generate Report
                  </button>
                </div>
              </div>
            </FloatingPortal>
          )}
        </div>
        <div className={s.group}>
          <button
            type="button"
            className={s.item}
            ref={actionMenuRefs.setReference}
            onClick={() => onChangeModal('actionMenu', !modals.actionMenu)}
          >
            <span className={s.block}>
              {blockLabel} <ChevronDownIcon size={12} strokeWidth={2} color="rgba(55, 53, 47, 0.35)" />
            </span>
            {modals.actionMenu && ActionMenu && (
              <FloatingPortal
                id="yoo-custom-toolbar-action-menu-list-portal"
                root={document.getElementById('yoopta-editor')}
              >
                <div style={actionMenuStyles} ref={actionMenuRefs.setFloating} onClick={(e) => e.stopPropagation()}>
                  <ActionMenu {...actionMenuRenderProps} />
                </div>
              </FloatingPortal>
            )}
          </button>
        </div>
        <div className={s.group}>
          <button
            type="button"
            onClick={() => editor.formats.bold.toggle()}
            className={cx(s.item, { [s.active]: editor.formats.bold.isActive() })}
          >
            <span className={s.bold}>B</span>
          </button>
          <button
            type="button"
            onClick={() => editor.formats.italic.toggle()}
            className={cx(s.item, { [s.active]: editor.formats.italic.isActive() })}
          >
            <span className={s.italic}>i</span>
          </button>
          <button
            type="button"
            onClick={() => editor.formats.underline.toggle()}
            className={cx(s.item, { [s.active]: editor.formats.underline.isActive() })}
          >
            <span className={s.underline}>U</span>
          </button>
          <button
            type="button"
            onClick={() => editor.formats.strike.toggle()}
            className={cx(s.item, { [s.active]: editor.formats.strike.isActive() })}
          >
            <span className={s.strikethrough}>S</span>
          </button>
          <button
            type="button"
            onClick={() => editor.formats.code.toggle()}
            className={cx(s.item, { [s.active]: editor.formats.code.isActive() })}
          >
            <span className={s.code}>
              <CodeIcon size={15} strokeWidth={1.5} />
            </span>
          </button>
          <button
            type="button"
            className={cx(s.item, { [s.active]: modals.highlight })}
            ref={highlightPickerRefs.setReference}
            onClick={() => onChangeModal('highlight', !modals.highlight)}
            style={getHighlightTriggerStyle()}
          >
            <span className={s.highlight}>A</span>
            {modals.highlight ? <ChevronUpIcon size={12} /> : <ChevronDownIcon size={12} />}
          </button>
          {modals.highlight && (
            <FloatingPortal id="yoo-highlight-color-portal" root={document.getElementById('yoopta-editor')}>
              <div style={highlightPickerStyles} ref={highlightPickerRefs.setFloating}>
                <HighlightColor
                  editor={editor}
                  highlightColors={highlightColors}
                  onClose={() => onChangeModal('highlight', false)}
                  refs={highlightPickerRefs}
                  floatingStyles={highlightPickerStyles}
                />
              </div>
            </FloatingPortal>
          )}
        </div>
      </div>
    </div>
  );
};

export { EditorToolbar };