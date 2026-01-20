// NewsSection.jsx
import { useMemo } from "react";
import news_img_default from "@/assets/svg/database/finance/news_default.svg";

// Helper function to parse relative date strings to Date objects
const parseRelativeDate = (relativeDate) => {
  const now = new Date();
  const [value, unit] = relativeDate.split(" ");
  const numericValue = parseInt(value, 10);

  if (unit.startsWith("hour")) {
    return new Date(now.getTime() - numericValue * 60 * 60 * 1000);
  } else if (unit.startsWith("day")) {
    return new Date(now.getTime() - numericValue * 24 * 60 * 60 * 1000);
  } else {
    // Default to now if the unit is unrecognized
    return now;
  }
};

const NewsSection = ({ newsResults }) => {
  // Extract and sort the latest five news items
  const latestNews = useMemo(() => {
    if (!newsResults || newsResults.length === 0) return [];

    let allNewsItems = [];

    // Check if the first item has 'items' to determine the data structure
    if (newsResults[0].items && Array.isArray(newsResults[0].items)) {
      // Data A: Multiple sections with 'title' and 'items'
      allNewsItems = newsResults.flatMap((section) =>
        // 提供默認值為空陣列，避免 section 或 section.items 為 undefined
        (section?.items || [])
          .filter((item) => item.snippet && item.link) // Ensure the item has necessary fields
          .map((item) => ({
            ...item,
            parsedDate: parseRelativeDate(item.date),
          }))
      );
    } else {
      // Data B: Flat array of news items
      allNewsItems = newsResults
        .filter((item) => item.snippet && item.link) // Ensure the item has necessary fields
        .map((item) => ({
          ...item,
          parsedDate: parseRelativeDate(item.date),
        }));
    }

    // Sort the news items by parsedDate in descending order (latest first)
    allNewsItems.sort((a, b) => b.parsedDate - a.parsedDate);

    // Return the top five latest news items
    return allNewsItems.slice(0, 5);
  }, [newsResults]);

  return (
    <div className="mb-6">
      <h2 className="text-24px font-semibold mb-4">In the News</h2>
      <div className="bg-white py-6 px-10 drop-shadow-gray-solid">
        {latestNews.length === 0 ? (
          <p>No recent news available.</p>
        ) : (
          latestNews.map((news, index) => (
            <a
              key={index}
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center py-2 hover:bg-gray-100 transition border-b last:border-b-0 border-[rgba(0,0,0,0.08)]"
            >
              <img
                src={news.thumbnail || news_img_default}
                alt={news.source}
                className="w-26 h-18 flex-shrink-0 object-cover rounded-5px border border-black mr-5"
              />

              <div>
                <h3 className="text-xl font-semibold text-main-text-gray underline">
                  {news.snippet || "No Title"}
                </h3>
                <div className="flex items-center mt-2">
                  <span className="text-main-color-gb text-base font-semibold pr-3">
                    {news.source}
                  </span>

                  <span className="text-main-text-gray text-sm1 font-medium">
                    {news.date}
                  </span>
                </div>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsSection;
