import { useEffect, useRef, useState } from "react";

const DEFAULT_SELECTOR = '[data-scroll-container="true"]';

export function useGlobalHorizontalScrollbar({
  dependencies = [],
  containerSelector = DEFAULT_SELECTOR,
} = {}) {
  const bottomScrollRef = useRef(null);
  const [scrollContainers, setScrollContainers] = useState([]);
  const [scrollMetrics, setScrollMetrics] = useState({
    contentWidth: 0,
    viewportWidth: 0,
  });

  useEffect(() => {
    const containers = Array.from(
      document.querySelectorAll(containerSelector)
    );
    setScrollContainers(containers);

    const updateMetrics = () => {
      if (!containers.length) {
        setScrollMetrics((prev) => {
          if (prev.contentWidth === 0 && prev.viewportWidth === 0) {
            return prev;
          }
          return { contentWidth: 0, viewportWidth: 0 };
        });
        return;
      }

      const contentWidth = containers.reduce(
        (max, el) => Math.max(max, el.scrollWidth),
        0
      );
      const viewportWidth = containers.reduce(
        (max, el) => Math.max(max, el.clientWidth),
        0
      );

      setScrollMetrics((prev) => {
        if (
          prev.contentWidth === contentWidth &&
          prev.viewportWidth === viewportWidth
        ) {
          return prev;
        }
        return { contentWidth, viewportWidth };
      });
    };

    updateMetrics();

    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateMetrics);
      containers.forEach((container) => resizeObserver.observe(container));
    }

    window.addEventListener("resize", updateMetrics);

    return () => {
      window.removeEventListener("resize", updateMetrics);
      if (resizeObserver) {
        containers.forEach((container) => resizeObserver.unobserve(container));
        resizeObserver.disconnect();
      }
    };
  }, dependencies);

  useEffect(() => {
    if (!scrollContainers.length) return;

    const bottom = bottomScrollRef.current;
    const targets = bottom
      ? [...scrollContainers, bottom]
      : [...scrollContainers];

    if (!targets.length) return;

    const initialScrollLeft = scrollContainers[0]?.scrollLeft ?? 0;
    // Sync all targets to the initial scroll position immediately
    targets.forEach((target) => {
      if (target.scrollLeft !== initialScrollLeft) {
        target.scrollLeft = initialScrollLeft;
      }
    });

    let isSyncing = false;
    const handleScroll = (event) => {
      if (isSyncing) return;
      isSyncing = true;
      const { scrollLeft } = event.target;
      targets.forEach((target) => {
        if (target !== event.target && target.scrollLeft !== scrollLeft) {
          target.scrollLeft = scrollLeft;
        }
      });
      isSyncing = false;
    };

    targets.forEach((target) =>
      target.addEventListener("scroll", handleScroll)
    );

    return () => {
      targets.forEach((target) =>
        target.removeEventListener("scroll", handleScroll)
      );
    };
  }, [scrollContainers, scrollMetrics]);

  const showScrollbar = scrollMetrics.contentWidth > scrollMetrics.viewportWidth;
  const scrollbarInnerWidth = Math.max(
    scrollMetrics.contentWidth,
    scrollMetrics.viewportWidth
  );

  return { bottomScrollRef, showScrollbar, scrollbarInnerWidth };
}

export default useGlobalHorizontalScrollbar;
