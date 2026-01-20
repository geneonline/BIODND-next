import React, { useState, useEffect } from 'react';

const FilterComponent = ({ question, data, onFilteredData }) => {
  const [keywords, setKeywords] = useState([]);

  useEffect(() => {
    const fetchKeywords = async () => {
      if (question) {
        try {
          const response = await fetch('/filter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: question, data: data })
          });
          const fetchedKeywords = await response.json();
          setKeywords(fetchedKeywords);
        } catch (error) {
          console.error('獲取關鍵字時出錯：', error);
        }
      }
    };

    fetchKeywords();
  }, [question, data]);

  useEffect(() => {
    if (data && keywords.length > 0) {
      const filteredData = data.filter(item => 
        keywords.some(keyword => 
          Object.values(item).some(value => 
            String(value).toLowerCase().includes(keyword.toLowerCase())
          )
        )
      );
      onFilteredData(filteredData);
    }
  }, [data, keywords, onFilteredData]);

  return null; // 這個組件不渲染任何UI元素
};

export default FilterComponent;