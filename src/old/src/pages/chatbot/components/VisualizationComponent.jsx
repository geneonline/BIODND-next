import React, { Children, useState, useEffect, useRef } from 'react';
import { DataProvider } from '@looker/components-data';
import { Query, Visualization } from '@looker/visualizations';
import { Button, ComponentsProvider } from '@looker/components'
import html2canvas from 'html2canvas';


const PivotLabelComponent = ({ data, fields, config, totals, pivots, children, graphType }) => {

  if (!config.series) {
    return <div>Error config series no found... </div>;
  }
  Object.keys(config.series).forEach((key, _) => {
    config.series[key].label = key.split(' - ')[0];
  })

  config.type = graphType;

  if (Children.count(children) >= 1) {
    return (
      <>
        {Children.map(children, child => {
          return React.isValidElement(child)
            ? React.cloneElement(child, {
              config: config,
              data: data,
              fields: fields,
              pivots: pivots,
              totals: totals,
            })
            : child
        })}
      </>
    )
  } else {
    console.warn(('No children passed to PivotLabelComponent component'))
    return null
  }
};


const VisualizationComponent = ({
  sdk,
  queryId,
  clientId,
  graphType,
  currentSelection,
  onImageCapture,
  onUpdateBlockText
}) => {

  const [data, setData] = useState(null);
  const visualizationRef = useRef(null);
  const captureRef = useRef();
  const [localImageData, setLocalImageData] = useState(null);

  useEffect(() => {
    if (queryId && graphType && currentSelection) {
      // 等待渲染完成後捕獲圖像
      // onUpdateBlockText(currentSelection, "等待圖片產出 ...", "#C4554D")
      const captureTimeout = setTimeout(() => {
        const element = captureRef.current;
        if (!element) {
          console.error('No element found to capture');
          return;
        }
        if (element) {
          html2canvas(element,{
            scrollX: 0, // 忽略當前滾動位置
            scrollY: 0,
            useCORS: true, // 解決跨域問題，若有外部圖片等元素
            scale: 2, // 保持圖片原始大小
          }).then(canvas => {
            const base64Image = canvas.toDataURL('image/png');
            console.log(base64Image)
            onImageCapture(base64Image);
          });
        }
      }, 5000); // 等待 1 秒以確保渲染完成

      return () => clearTimeout(captureTimeout);
    }
  }, [clientId, queryId, graphType, onImageCapture, onUpdateBlockText]);


  if (!sdk) {
    return <div>Loading... </div>;
  }


  if (!clientId || !queryId || !graphType) {
    return <div></div>
  }

  console.log('queryId: ', queryId)
  console.log('graphType: ', graphType)

  let queryRender;

  if (graphType !== 'pie') {
    queryRender = (
      <Query query={clientId}>
        <PivotLabelComponent graphType={graphType}>
          <Visualization />
        </PivotLabelComponent>
      </Query>
    );
  } else {
    queryRender = (
      <Query query={clientId} 
        config={{ type: graphType }}>
        <Visualization
        />
      </Query>
    );
  }

  const handleCapture = async () => {
    const element = captureRef.current;
    if (!element) {
      console.error('No element found to capture');
      return;
    }

    // 使用 html2canvas 捕捉內容並將其轉換為圖片數據
    const canvas = await html2canvas(element, {
      scrollX: 0, // 忽略當前滾動位置
      scrollY: 0,
      useCORS: true, // 解決跨域問題，若有外部圖片等元素
      scale: 1, // 保持圖片原始大小
    });
    const imgData = canvas.toDataURL('image/png'); // 將 Canvas 轉換為 base64 PNG

    // 將圖片數據保存到狀態中
    setLocalImageData(imgData);

  };

  return (
    <>
    <div dangerouslySetInnerHTML={{
      __html: `<style>
       .AGbjC{
          width: 100% !important;
        }
        .fQmNoh * {
          position: relative;
        }
        .visx-legend-label {
          top: -10px;
          left: 20px;
          position: absolute;
        }
      </style>`
    }} />
      {/* <h2> Get Started with Looker Visualization componentes</h2> */}
      <div ref={visualizationRef} 
      style={{
        position: 'absolute',
        left: '-9999px',
        top: '0',
        width: '100%'
      }}>
        <ComponentsProvider>
          <DataProvider sdk={sdk} >
          <div ref={captureRef} style={{ position: 'relative', zIndex: 1, width: '1080px' }}>
            {queryRender}
          </div>
          <Button onClick={handleCapture}>渲染為圖片</Button>
            {localImageData && (
              <div>
                <h3>生成的圖片：</h3>
                <img src={localImageData} alt="Generated Visualization" />
              </div>
            )}
          </DataProvider>
        </ComponentsProvider>
      </div>
    </>
  );
};

export default VisualizationComponent;