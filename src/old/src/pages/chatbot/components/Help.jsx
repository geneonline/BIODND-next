import { useState, useRef } from 'react';
import styled from 'styled-components';

import SideBar from '../layouts/SideBar_TEST2';
import HorizontalBar from '../layouts/HorizontalBar';
import WebNav from '../layouts/WebNav';

const Help = () => {
  const [projectList, setProjectList] = useState([]);

  console.log('Help');
    return (
      <div className='w-full h-full'>
        <WebNav />
        <SideBar setProjectList={setProjectList} />
        <div className='ml-[calc(100%/7)] w-[calc(6*100%/7)]'>
          <HorizontalBar />
          <div className='pt-[110px] ps-[68px] pe-[20px] w-[70%]'>
            {/* <div className=''>
                <h3 className={`${sharedStyle.title}`}>{t('help.about.label')}</h3>
                <textarea className={`${sharedStyle.textarea} w-full`} rows={10}></textarea>
            </div>
            <div>
                <h3 className={`${sharedStyle.title}`}>{t('help.tutorial.label')}</h3>
                <textarea className={`${sharedStyle.textarea} w-full`} rows={10}></textarea>
            </div> */}
          </div>
        </div>
      </div>
    )
}

// export default withTranslation(Help);

export default Help;