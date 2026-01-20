import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MoreHorizontal, Trash2, PencilLine, CirclePlus } from "lucide-react";
import toast from "react-hot-toast";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import useSWRInfinite from "swr/infinite";

import NewProjectService from "../services/project-service";
import logo from "../../../assets/img/chatbot/sideBar/logo.png";
import addBtn from "../../../assets/img/chatbot/sideBar/addBtn.png";

import "./SideBar_TEST2.scss";

const PAGE_SIZE = 10;
const fetcher = async (url, page) => {
  const response = await NewProjectService.search("", false, page, PAGE_SIZE);
  console.log("response: ", response);
  return response.data; // 假設這返回 { data: [...], pagination: { totalCount } }
};

export default function SideBar({
  setProjectList,
  getAllProjects,
  currentId,
  getProjectDetails,
  onTitleChange,
  content,
  setTitle,
  idRef,
  localProjectList,
  setLocalProjectList,
  localProjectListRef,
}) {
  const [activeItem, setActiveItem] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const sidebarRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const scrollUpRef = useRef(null);
  const scrollDownRef = useRef(null);
  const [renamingId, setRenamingId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [contentOfModifiedProject, setContentOfModifiedProject] = useState("");

  const getKey = (pageIndex, previousPageData) => {
    console.log("inside getKey");
    if (previousPageData && !previousPageData.data.length) return null;
    return ["projects", pageIndex + 1];
  };

  const { data, error, size, setSize, mutate } = useSWRInfinite(
    getKey,
    ([_, page]) => fetcher("projects", page),
    {
      revalidateAll: false,
      revalidateFirstPage: false,
      persistSize: true,
    }
  );

  console.log("sidebar 60. data: ", data);

  useEffect(() => {
    console.log("sidebar 63. useEffect");
    if (data) {
      const newProjectList = [].concat(...data.map((page) => page.data));
      console.log("newProjectList: ", newProjectList);
      setLocalProjectList(newProjectList);
      setProjectList(newProjectList);
    }
  }, [data, setProjectList]);

  const projectList = data ? [].concat(...data.map((page) => page.data)) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.data.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.data.length < PAGE_SIZE);
  const totalCount = data?.[0]?.pagination?.totalCount || 0;

  const shouldLoadMore = useCallback(() => {
    console.log("inside shouldLoadMore");
    if (isReachingEnd || isLoadingMore || projectList.length >= totalCount) {
      return false;
    }

    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      return scrollHeight - scrollTop <= clientHeight * 1.5;
    }

    return false;
  }, [isReachingEnd, isLoadingMore, projectList.length, totalCount]);

  const loadMore = useCallback(() => {
    console.log("inside loadMore");
    if (shouldLoadMore()) {
      setSize(size + 1);
    }
  }, [shouldLoadMore, setSize, size]);

  const handleScroll = useCallback(() => {
    console.log("inside handleScroll");
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;

      // Check if we need to load more
      if (scrollHeight - scrollTop <= clientHeight * 1.5) {
        loadMore();
      }
    }
  }, [loadMore]);

  useEffect(() => {
    console.log("inside useEffect handleScroll");
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      handleScroll(); // Initialize button display state
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    console.log("sidebar 134. useEffect");
    // Check if we need to load more after initial load
    if (data && !isLoadingInitialData) {
      loadMore();
    }
  }, [data, isLoadingInitialData, loadMore]);

  useEffect(() => {
    console.log("sidebar 142. useEffect");
    const handleResize = () => {
      loadMore();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [loadMore]);

  const handleScrollUp = () => {
    console.log("inside handleScrollUp");
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop -= 50;
    }
  };

  const handleScrollDown = () => {
    console.log("inside handleScrollDown");
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop += 50;
    }
  };

  const createNewProject = async () => {
    try {
      const res = await NewProjectService.create({
        title: "Title",
        content:
          "<body id='yoopta-clipboard' data-editor-id=''></body>",
      });
      const newProject = { id: res.data, title: "Title" };
      setLocalProjectList((prevList) => [newProject, ...prevList]);
      navigate(`/chatbot/document/${res.data}`);
    } catch (e) {
      toast.error("Failed to create new project");
      console.error("Failed to create new project:", e);
    }
  };

  const handleDelete = async (item) => {
    console.log("inside handleDelete");
    console.log("item: ", item);

    try {
      await NewProjectService.delete(item);
      setLocalProjectList((prevList) =>
        prevList.filter((i) => i.id !== item)
      );
      mutate(); // Revalidate the data after deletion
      getAllProjects();
      setShowMenu(false);
      toast.success("Project deleted.");
      console.log("localProjectList: ", localProjectList);
      if (localProjectList.length > 1) {
        navigate(`/chatbot/document/${localProjectList[1].id}`); // 第二項是因為 state 不會立即更新，此時的第一項是剛剛被刪除的
      } else {
        navigate("/chatbot/document/new");
      }
    } catch (e) {
      toast.error("Failed to delete project.");
      console.error("Failed to delete project:", e);
    }

    // // 處理新增完後馬上刪除的情形
    // if (!item && activeItem) {
    //   console.log("inside if");
    //   console.log("activeItem: ", activeItem);

    //   try {
    //     await NewProjectService.delete(activeItem);
    //     setLocalProjectList((prevList) =>
    //       prevList.filter((i) => i.id !== activeItem)
    //     );
    //     mutate(); // Revalidate the data after deletion
    //     getAllProjects();
    //     setShowMenu(false);
    //     toast.success("Project deleted successfully!");
    //     navigate(`/chatbot/document/${localProjectList[1].id}`); // 第二項是因為 state 不會立即更新，此時的第一項是剛剛被刪除的
    //   } catch (e) {
    //     toast.error("Failed to delete project. Please try again later.");
    //     console.error("Failed to delete project:", e);
    //   }
    //   // 處理一般情況的刪除
    // } else {
    //   console.log("inside else");
    //   try {
    //     await NewProjectService.delete(item.id);
    //     setLocalProjectList((prevList) =>
    //       prevList.filter((i) => i.id !== item.id)
    //     );
    //     mutate(); // Revalidate the data after deletion
    //     getAllProjects();
    //     setShowMenu(false);
    //     toast.success("Project deleted successfully!");

    //     if (item.id === parseInt(id)) {
    //       getProjectDetails();
    //     }
    //   } catch (e) {
    //     toast.error("Failed to delete project. Please try again later.");
    //     console.error("Failed to delete project:", e);
    //   }
    // }
  };

  const startRename = async (e, item) => {
    e.stopPropagation();
    setRenamingId(item.id);
    idRef.current = item.id;
    setNewTitle(item.title);
    console.log("item: ", item);
    try {
      const res = await NewProjectService.getDetails(item.id);
      console.log("res: ", res);
      setContentOfModifiedProject(res?.data?.content);
    } catch (e) {
      console.error("Failed to get project details:", e);
    }
  };

  const handleRename = async (e, itemId) => {
    console.log("itemId: ", itemId, " type: ", typeof itemId);
    console.log("content: ", contentOfModifiedProject);
    console.log("newTitle: ", newTitle);
    e.stopPropagation();
    if (e.key === 'Enter' || e.type === 'blur') {
      if (!newTitle.trim()) return;
      try {
        await NewProjectService.update(itemId, {
          title: newTitle || "(No title)",
          content: contentOfModifiedProject || "<body id='yoopta-clipboard' data-editor-id=''", // 保持現有內容
        });
        // getAllProjects(); // 更新側邊欄列表

        // Call the callback to update the SideBar
        // if (titleChangeCallbackRef.current) {
        //   titleChangeCallbackRef.current(
        //     newTitle || "(No title)",
        //     parseInt(id)
        //   );
        // }
        setLocalProjectList((prevList) =>
          prevList.map((project) =>
            project.id === itemId ? { ...project, title: newTitle } : project
          )
        );
        setRenamingId(null);
        setTitle(newTitle);
        toast.success("Project renamed.");
      } catch (error) {
        toast.error("Failed to rename project. Please try again later.");
        console.error("Failed to rename project:", error);
      }
    }
  };

  const handleMoreClick = (e, item) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({ x: rect.right, y: rect.top });
    setActiveItem(item.id);
    setShowMenu(true);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowMenu(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // useEffect(() => {
  //   const createNewProject = async () => {
  //     try {
  //       const res = await NewProjectService.create({
  //         title: "Title",
  //         content: "<body id='yoopta-clipboard' data-editor-id=''></body>"
  //       });
  //       setProjectList(prev => {
  //         console.log("setProjectList");
  //         console.log("prev: ", prev);
  //         // 確保不會重複添加
  //         if (prev.length === 0) {
  //           return [{
  //             title: "Title",
  //             content: "<body id='yoopta-clipboard' data-editor-id=''></body>"
  //           }];
  //         }
  //         return prev;
  //       });
  //       navigate(`/chatbot/document/${res.data}`);
  //     } catch (error) {
  //       console.error('Failed to create project:', error);
  //     }
  //   };
  //   if (projectList.length === 0) {
  //     createNewProject();
  //   }
  // }, []);

  useEffect(() => {
    console.log("projectList: ", projectList);
  }, [projectList]);

  useEffect(() => {
    console.log("localProjectList: ", localProjectList);
  }, [localProjectList]);

  useEffect(() => {
    console.log("activeItem: ", activeItem);
  }, [activeItem]);

  // useEffect(() => {
  //   if (onTitleChange) {
  //     onTitleChange((newTitle, projectId) => {
  //       setLocalProjectList((prevList) =>
  //         prevList.map((project) =>
  //           project.id === projectId ? { ...project, title: newTitle } : project
  //         )
  //       );
  //     });
  //   }
  // }, [onTitleChange]);


  return (
    <div
      ref={sidebarRef}
      className="fixed left-0 top-0 h-screen bg-[#F9FAFB] flex flex-col overflow-hidden px-[10px] w-[calc(100%/7)]"
    >
      <div className="">
        <img src={logo} alt="Logo" className="mt-[26px] mb-4" />
        <div className="mt-[48px] mb-[20px] flex items-center justify-between">
          <h2 className="text-nowrap">Project List</h2>
          <button
            type="button"
            className="flex items-center mr-4"
            onClick={createNewProject}
          >
            {/* <img src={addBtn} alt="create new project" /> */}
            <CirclePlus size={30} className="text-emerald-400 hover:text-emerald-500" />
          </button>
        </div>
      </div>
      <div className="relative flex-grow overflow-hidden">
        <div
          ref={scrollUpRef}
          className="scroll-button scroll-up"
          onClick={handleScrollUp}
        ></div>
        <PerfectScrollbar
          containerRef={(el) => {
            scrollContainerRef.current = el;
          }}
          className="flex-grow"
          options={{
            suppressScrollX: true,
            wheelPropagation: false,
          }}
        >
          <ul className="">
            {localProjectList.map((item) => (
              <li
                key={item.id}
                className={`cursor-pointer group flex items-center justify-between px-[6px] py-2 me-[18px] mb-1 hover:bg-gray-200 rounded ${
                  item.id.toString() === currentId ? "bg-[#DDF3F4]" : ""
                }`}
                onClick={() => navigate(`/chatbot/document/${item.id}`)}
              >
                {renamingId === item.id ? (
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => handleRename(e, item.id)}
                    onBlur={(e) => handleRename(e, item.id)}
                    className="flex-grow bg-white px-2 py-0 rounded w-full"
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                ) : (
                  <span className="truncate">{item?.title}</span>
                )}
                {renamingId !== item.id && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      className="p-1 hover:bg-gray-300 rounded"
                      onClick={(e) => startRename(e, item)}
                    >
                      <PencilLine size={16} className="text-gray-600" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-300 rounded"
                      onClick={(e) => handleDelete(item.id)}
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </PerfectScrollbar>
        <div
          ref={scrollDownRef}
          className="scroll-button scroll-down"
          onClick={handleScrollDown}
        ></div>
      </div>
    </div>
  );
}
