import { generateId } from "@yoopta/editor";

// 輔助函數：安全地獲取文本內容
function safeGetTextContent(element) {
  // console.log("safeGetTextContent");
  return element ? (element.textContent || '').trim() : '';
}

// // 輔助函數：解析高亮樣式
function parseHighlightStyle(styleString) {
  // console.log("parseHighlightStyle");
  // console.log("styleString: ", styleString);

  if (!styleString) return null;
  
  const style = {};
  const colorMatch = styleString.match(/(?:^|;)\s*color:\s*(.*?)(?:;|$)/);
  const bgColorMatch = styleString.match(/(?:^|;)\s*background-color:\s*(.*?)(?:;|$)/);

  // console.log("colorMatch: ", colorMatch);
  // console.log("bgColorMatch: ", bgColorMatch);
  
  if (colorMatch) style.color = colorMatch[1].trim();
  if (bgColorMatch) style.backgroundColor = bgColorMatch[1].trim();

  // console.log("return: ", Object.keys(style).length > 0 ? style : null);
  
  return Object.keys(style).length > 0 ? style : null;
}

// // 添加數據塊 ID
// function addDataBlockIds(jsonContent, htmlString) {
//   // console.log("addDataBlockIds");

//   const parser = new DOMParser();
//   const doc = parser.parseFromString(htmlString, 'text/html');
//   const formatTags = ['b', 'i', 's', 'u', 'code'];
  
//   Object.values(jsonContent).forEach(block => {
//     block.value.forEach(valueItem => {
//       // console.log("valueItem: ", valueItem);
//       // console.log("has no children or children have no highlight");

//       if (!valueItem.children || !valueItem.children.some(child => child.highlight)) return;

//       const targetText = valueItem.children.map(child => child.text).join('');
//       // console.log("targetText: ", targetText);
//       if (!targetText) return;

//       function findAndMarkElement(element) {
//         // console.log("findAndMarkElement");
//         // console.log("element: ", element);
//         const elementText = safeGetTextContent(element);
//         // console.log("elementText: ", elementText);
        
//         if (elementText.includes(targetText)) {
//           // console.log("includes targetText");
//           let closestContainer = element;
//           // console.log("closestContainer: ", closestContainer);
          
//           // 找到最小的包含完整目標文本的容器
//           Array.from(element.children).some(child => {
//             // console.log("child: ", child);
// //             console.log("safeGetTextContent(child): ", safeGetTextContent(child));
//             if (safeGetTextContent(child).includes(targetText.trim())) {
//               closestContainer = child;
//               // console.log("closestContainer: ", closestContainer);
//               // console.log("return true");
//               return true;
//             }
//             // console.log("return false");
//             return false;
//           });
          
//           // 處理格式標籤的特殊情況
//           if (formatTags.includes(closestContainer.tagName.toLowerCase())) {
//             // console.log("268 if");
//             closestContainer = closestContainer.parentElement || closestContainer;
//             // console.log("closestContainer: ", closestContainer);
//           }
          
//           closestContainer.setAttribute('data-block-id', valueItem.id);
//           return true;
//         }
        
//         return Array.from(element.children).some(findAndMarkElement);
//       }

//       findAndMarkElement(doc.body);
//     });
//   });

//   return doc.body.innerHTML;
// }

// export function applyHighlightsToHtml(jsonContent, htmlString) {
//     // console.log("applyHighlightsToHtml");
//     const htmlWithIds = addDataBlockIds(jsonContent, htmlString);
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(htmlWithIds, 'text/html');
  
//     Object.values(jsonContent).forEach(block => {
//       block.value.forEach(valueItem => {
//         // console.log("valueItem: ", valueItem);
//         // console.log("has no children or children have no highlight");
//         // if (!valueItem.children || !valueItem.children.some(child => child.highlight)) return;
  
//         const elements = doc.querySelectorAll(`[data-block-id="${valueItem.id}"]`);
//         elements.forEach(element => {
//           // console.log("element: ", element);
//           try {
//             // 第一步：收集所有文本節點
//             const textNodes = [];
//             const walker = document.createTreeWalker(
//               element,
//               NodeFilter.SHOW_TEXT,
//               null
//             );
            
//             let node;
//             while (node = walker.nextNode()) {
//               textNodes.push(node);
//             }
  
//             // 第二步：準備高亮操作
//             const operations = [];
//             let currentPosition = 0;
            
//             valueItem.children.forEach(child => {
//               if (child.highlight) {
//                 operations.push({
//                   start: currentPosition,
//                   end: currentPosition + child.text.length,
//                   highlight: child.highlight
//                 });
//               }
//               currentPosition += child.text.length;
//             });
  
//             // 第三步：應用高亮
//             operations.sort((a, b) => b.start - a.start).forEach(op => {
//               let currentTextPosition = 0;
//               let remainingStart = op.start;
//               let remainingLength = op.end - op.start;
  
//               for (let i = 0; i < textNodes.length && remainingLength > 0; i++) {
//                 const textNode = textNodes[i];
//                 const textLength = textNode.length;
  
//                 if (currentTextPosition + textLength <= remainingStart) {
//                   currentTextPosition += textLength;
//                   continue;
//                 }
  
//                 const nodeStart = Math.max(0, remainingStart - currentTextPosition);
//                 const nodeEnd = Math.min(textLength, nodeStart + remainingLength);
                
//                 if (nodeStart < nodeEnd) {
//                   const range = doc.createRange();
//                   range.setStart(textNode, nodeStart);
//                   range.setEnd(textNode, nodeEnd);
  
//                   const span = doc.createElement('span');
//                   if (op.highlight.color) span.style.color = op.highlight.color;
//                   if (op.highlight.backgroundColor) span.style.backgroundColor = op.highlight.backgroundColor;
  
//                   try {
//                     range.surroundContents(span);
                    
//                     // 更新文本節點列表，因為我們可能創建了新的節點
//                     textNodes.splice(i + 1, 0, ...Array.from(span.childNodes));
//                   } catch (e) {
//                     console.warn('Failed to surround contents, falling back to node splitting', e);
                    
//                     // 後備方案：手動分割節點
//                     const beforeText = textNode.textContent.slice(0, nodeStart);
//                     const highlightText = textNode.textContent.slice(nodeStart, nodeEnd);
//                     const afterText = textNode.textContent.slice(nodeEnd);
                    
//                     const fragment = doc.createDocumentFragment();
//                     if (beforeText) fragment.appendChild(doc.createTextNode(beforeText));
//                     span.textContent = highlightText;
//                     fragment.appendChild(span);
//                     if (afterText) fragment.appendChild(doc.createTextNode(afterText));
                    
//                     textNode.parentNode.replaceChild(fragment, textNode);
                    
//                     // 更新文本節點列表
//                     const newNodes = [
//                       ...(beforeText ? [doc.createTextNode(beforeText)] : []),
//                       ...Array.from(span.childNodes),
//                       ...(afterText ? [doc.createTextNode(afterText)] : [])
//                     ];
//                     textNodes.splice(i, 1, ...newNodes);
//                   }
  
//                   remainingLength -= (nodeEnd - nodeStart);
//                   remainingStart = currentTextPosition + nodeEnd;
//                 }
  
//                 currentTextPosition += textLength;
//               }
//             });
//           } catch (e) {
//             console.error('Error processing element:', e);
//           }
//         });
//       });
//     });
  
//     return doc.body.innerHTML;
//   }


// HTML 轉 JSON
export function convertHtmlToJson(htmlString) {
  // console.log("convertHtmlToJson");
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const result = {};

  // 映射 HTML 標籤到對應的區塊類型
  const tagToTypeMapping = {
    'div': { blockType: 'Paragraph', valueType: 'paragraph' },
    'h1': { blockType: 'HeadingOne', valueType: 'heading-one' },
    'h2': { blockType: 'HeadingTwo', valueType: 'heading-two' },
    'h3': { blockType: 'HeadingThree', valueType: 'heading-three' },
    'ul': { blockType: 'BulletedList', valueType: 'bulleted-list' }
  };

  // 處理文本節點
  function processTextNode(node) {
    const result = [];
    
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text) result.push({ text });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node;
      
      if (element.tagName.toLowerCase() === 'span') {
        const highlight = parseHighlightStyle(element.getAttribute('style'));
        const text = element.textContent;
        result.push(highlight ? { text, highlight } : { text });
      } else {
        Array.from(element.childNodes).forEach(child => {
          result.push(...processTextNode(child));
        });
      }
    }
    
    return result;
  }

  // 處理頂層區塊元素
  doc.body.childNodes.forEach((blockNode) => {
    if (blockNode.nodeType === Node.ELEMENT_NODE) {
      const blockElement = blockNode;
      const tagName = blockElement.tagName.toLowerCase();
      const types = tagToTypeMapping[tagName] || tagToTypeMapping['div'];
      
      const uuid = generateId();
      const valueItem = {
        id: generateId(),
        type: types.valueType,
        children: processTextNode(blockElement),
        props: {
          nodeType: 'block'
        }
      };

      // 提取 meta 信息
      const meta = {};
      Array.from(blockElement.attributes).forEach(attr => {
        if (attr.name.startsWith('data-meta-')) {
          const metaKey = attr.name.replace('data-meta-', '');
          meta[metaKey] = attr.value;
        }
      });

      const contentBlock = {
        id: uuid,
        type: types.blockType,
        meta,
        value: [valueItem]
      };

      result[uuid] = contentBlock;
    }
  });

  return result;
}



export function OptimizedJsonHighlightSync(styledContent, unstyledContent) {
  const addOrderToMeta = (content) => {
    let order = 0;
    return Object.fromEntries(
      Object.entries(content).map(([key, value]) => {
        if (!value.meta) {
          value.meta = {};
        }
        value.meta.order = order++;
        return [key, value];
      })
    );
  };

  const styledWithOrder = addOrderToMeta(styledContent);
  const unstyledWithOrder = addOrderToMeta(unstyledContent);

  // console.log(styledWithOrder);
  // console.log(unstyledWithOrder);

  const syncHighlights = () => {
    const newUnstyledContent = JSON.parse(JSON.stringify(unstyledWithOrder));
    // console.log(newUnstyledContent);

    Object.values(styledWithOrder).forEach((styledValue) => {
      if (styledValue.value) {
        // console.log("styledValue has value property")
        styledValue.value.forEach((styledItem) => {
          if (styledItem.children) {
            // console.log("styledItem has children property")
            styledItem.children.forEach((styledChild) => {
              if (styledChild.highlight) {
                // console.log("styledChild has highlight property")
                // 首先尝试匹配 order
                const matchingUnstyledValue = Object.values(newUnstyledContent).find(
                  (unstyledValue) => unstyledValue.meta.order === styledValue.meta.order
                );
                // console.log("matchingUnstyledValue: ", matchingUnstyledValue);

                if (matchingUnstyledValue && matchingUnstyledValue.value) {
                  // console.log("500");
                  matchingUnstyledValue.value.forEach((unstyledItem) => {
                    if (unstyledItem.children) {
                      // console.log("503");
                      unstyledItem.children.forEach((unstyledChild) => {
                        if (unstyledChild.text === styledChild.text) {
                          // console.log("506");
                          unstyledChild.highlight = styledChild.highlight;
                        }
                      });
                    }
                  });
                } else {
                  // console.log("513");
                  // 如果无法匹配 order，回退到之前的方法
                  Object.values(newUnstyledContent).forEach((unstyledValue) => {
                    // console.log("516");
                    if (unstyledValue.value) {
                      // console.log("518");
                      unstyledValue.value.forEach((unstyledItem) => {
                        // console.log("520");
                        if (unstyledItem.children) {
                          // console.log("522");
                          unstyledItem.children.forEach((unstyledChild) => {
                            if (unstyledChild.text === styledChild.text) {
                              // console.log("525");
                              unstyledChild.highlight = styledChild.highlight;
                            }
                          });
                        }
                      });
                    }
                  });
                }
              }
            });
          }
        });
      }
    });
    return newUnstyledContent;  // 返回同步后的内容
  };
  
  return syncHighlights();  // 执行同步并返回结果
}

function addDataBlockIds(jsonContent, htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const formatTags = ['b', 'i', 's', 'u', 'code'];
  
  // 用於查找和標記元素的輔助函數
  function findAndMarkElement(element, targetText, valueItem) {
      const elementText = safeGetTextContent(element);
      
      if (elementText.includes(targetText)) {
          let closestContainer = element;
          
          Array.from(element.children).some(child => {
              if (safeGetTextContent(child).includes(targetText.trim())) {
                  closestContainer = child;
                  return true;
              }
              return false;
          });
          
          if (formatTags.includes(closestContainer.tagName.toLowerCase())) {
              closestContainer = closestContainer.parentElement || closestContainer;
          }
          
          closestContainer.setAttribute('data-block-id', valueItem.id);
          return true;
      }
      
      return Array.from(element.children).some(child => findAndMarkElement(child, targetText, valueItem));
  }
  
  // 處理所有區塊
  Object.values(jsonContent).forEach(block => {
      block.value.forEach(valueItem => {
        console.log("valueItem: ", valueItem);
          // 檢查是否為圖片區塊（根據你的 JSON 結構可能需要調整判斷條件）
          const isImageBlock = valueItem.type === 'image' || 
                             (valueItem.props && valueItem.props.type === 'image') ||
                             (valueItem.children && valueItem.children.some(child => child.type === 'image'));

          if (isImageBlock) {
              // 找到對應的圖片元素並設置 ID
              const images = doc.getElementsByTagName('img');
              for (let img of images) {
                  // 可以根據實際需求添加更多匹配條件
                  // 比如比對 src、alt 等屬性來確保找到正確的圖片
                  const parentDiv = img.parentElement;
                  if (parentDiv && !parentDiv.hasAttribute('data-block-id')) {
                      parentDiv.setAttribute('data-block-id', valueItem.id);
                  }
              }
          }
          // 處理含有文字的區塊
          else if (valueItem.children) {
              const targetText = valueItem.children.map(child => child.text).join('');
              if (targetText) {
                  findAndMarkElement(doc.body, targetText, valueItem);
              }
          }
      });
  });

  return doc.body.innerHTML;
}

export function applyHighlightsToHtml(jsonContent, htmlString) {
  console.log("jsonContent: ", jsonContent);
  console.log("htmlString: ", htmlString);
  const htmlWithIds = addDataBlockIds(jsonContent, htmlString);
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlWithIds, 'text/html');

  // 處理圖片對齊
  function processImageAlignment() {
      const images = doc.getElementsByTagName('img');
      
      for (let img of images) {
          // 獲取包含該圖片的父元素
          let container = img.parentElement;
          if (!container) continue;

          const blockId = container.getAttribute('data-block-id');
          if (!blockId) continue;
          
          // 在 jsonContent 中尋找對應的區塊
          let foundBlock = null;
          for (let block of Object.values(jsonContent)) {
              if (block.value && block.value.some(v => v.id === blockId)) {
                  foundBlock = block;
                  break;
              }
          }

          if (foundBlock && foundBlock.meta && 
              (foundBlock.meta.align === 'left' || foundBlock.meta.align === 'right' || foundBlock.meta.align === 'center')) {
              img.setAttribute('data-meta-align', foundBlock.meta.align);
          }
      }
  }

  // 首先處理圖片對齊
  processImageAlignment();

  // 原有的高亮處理邏輯
  Object.values(jsonContent).forEach(block => {
      block.value.forEach(valueItem => {
          const elements = doc.querySelectorAll(`[data-block-id="${valueItem.id}"]`);
          elements.forEach(element => {
              try {
                  // 只處理包含 highlight 的文本節點
                  if (!valueItem.children || !valueItem.children.some(child => child.highlight)) return;

                  const textNodes = [];
                  const walker = document.createTreeWalker(
                      element,
                      NodeFilter.SHOW_TEXT,
                      null
                  );
                  
                  let node;
                  while (node = walker.nextNode()) {
                      textNodes.push(node);
                  }

                  const operations = [];
                  let currentPosition = 0;
                  
                  valueItem.children.forEach(child => {
                      if (child.highlight) {
                          operations.push({
                              start: currentPosition,
                              end: currentPosition + child.text.length,
                              highlight: child.highlight
                          });
                      }
                      currentPosition += child.text.length;
                  });

                  // 應用高亮
                  operations.sort((a, b) => b.start - a.start).forEach(op => {
                      let currentTextPosition = 0;
                      let remainingStart = op.start;
                      let remainingLength = op.end - op.start;

                      for (let i = 0; i < textNodes.length && remainingLength > 0; i++) {
                          const textNode = textNodes[i];
                          const textLength = textNode.length;

                          if (currentTextPosition + textLength <= remainingStart) {
                              currentTextPosition += textLength;
                              continue;
                          }

                          const nodeStart = Math.max(0, remainingStart - currentTextPosition);
                          const nodeEnd = Math.min(textLength, nodeStart + remainingLength);
                          
                          if (nodeStart < nodeEnd) {
                              const range = doc.createRange();
                              range.setStart(textNode, nodeStart);
                              range.setEnd(textNode, nodeEnd);

                              const span = doc.createElement('span');
                              if (op.highlight.color) span.style.color = op.highlight.color;
                              if (op.highlight.backgroundColor) span.style.backgroundColor = op.highlight.backgroundColor;

                              try {
                                  range.surroundContents(span);
                                  textNodes.splice(i + 1, 0, ...Array.from(span.childNodes));
                              } catch (e) {
                                  console.warn('Failed to surround contents, falling back to node splitting', e);
                                  
                                  const beforeText = textNode.textContent.slice(0, nodeStart);
                                  const highlightText = textNode.textContent.slice(nodeStart, nodeEnd);
                                  const afterText = textNode.textContent.slice(nodeEnd);
                                  
                                  const fragment = doc.createDocumentFragment();
                                  if (beforeText) fragment.appendChild(doc.createTextNode(beforeText));
                                  span.textContent = highlightText;
                                  fragment.appendChild(span);
                                  if (afterText) fragment.appendChild(doc.createTextNode(afterText));
                                  
                                  textNode.parentNode.replaceChild(fragment, textNode);
                                  
                                  const newNodes = [
                                      ...(beforeText ? [doc.createTextNode(beforeText)] : []),
                                      ...Array.from(span.childNodes),
                                      ...(afterText ? [doc.createTextNode(afterText)] : [])
                                  ];
                                  textNodes.splice(i, 1, ...newNodes);
                              }

                              remainingLength -= (nodeEnd - nodeStart);
                              remainingStart = currentTextPosition + nodeEnd;
                          }

                          currentTextPosition += textLength;
                      }
                  });
              } catch (e) {
                  console.error('Error processing element:', e);
              }
          });
      });
  });

  return doc.body.innerHTML;
}