import { useEffect, useState } from "react";
import axios from "axios";

const GRAPHQL_URL =
  "https://wordpress-476820-5428187.cloudwaysapps.com/graphql";

const GET_POST_EDGES = `
  query GetPostEdges {
    posts(where: {categoryName: "rd"}, first: 10) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          databaseId
          title
          date
          modified
          slug
          uri
          excerpt
          content
          author {
            node {
              name
              avatar {
                url
              }
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
          tags {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  }
`;

const WordPressPosts = () => {
  const [posts, setPosts] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 發送 GraphQL 請求
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        GRAPHQL_URL,
        { query: GET_POST_EDGES },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // GraphQL 的資料通常包在 res.data.data 裡
      const data = res.data.data.posts;
      setPosts(data.edges);
      setPageInfo(data.pageInfo);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <p>讀取中…</p>;
  if (error) return <p>錯誤：{error.message}</p>;

  return (
    <section>
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        {/* Title */}
        <div className="max-w-2xl text-center mx-auto mb-10 lg:mb-14">
          <h2 className="text-2xl font-bold md:text-4xl md:leading-tight">
            Read our latest news
          </h2>
          <p className="mt-1 text-gray-600 dark:text-neutral-400">
            We've helped some great companies brand, design and get to market.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 lg:mb-14">
          {posts.map(({ node }) => (
            <a
              target="blank"
              key={node.databaseId}
              href={`https://wordpress-476820-5428187.cloudwaysapps.com/${node.uri}`}
              className="group flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl hover:shadow-md focus:outline-hidden focus:shadow-md transition dark:bg-neutral-900 dark:border-neutral-800"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  className="w-full object-cover rounded-t-xl"
                  src={node.featuredImage.node.sourceUrl}
                  alt="Blog Image"
                />
              </div>
              <div className="p-4 md:p-5">
                <h3 className="mt-2 text-lg font-medium text-gray-800 group-hover:text-blue-600 dark:text-neutral-300 dark:group-hover:text-white">
                  {node.title}
                </h3>
              </div>
            </a>
          ))}
        </div>

        {pageInfo?.hasNextPage && (
          <button
            onClick={() => {
              /* 實作分頁，例如更新 query 的 endCursor */
            }}
          >
            載入更多
          </button>
        )}
      </div>
    </section>
  );
};
export default WordPressPosts;
