import { useMemo, useRef, useState } from "react";

const DEFAULT_ACTIVE_INDEX = 0;

const hasDisplayValue = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number" || typeof value === "boolean") return true;
  if (Array.isArray(value)) {
    return value.some((item) => hasDisplayValue(item));
  }
  if (typeof value === "object") {
    return Object.values(value).some((val) => hasDisplayValue(val));
  }
  return false;
};

const getNestedValue = (obj: any, path: string) => {
  if (!obj || !path) return undefined;
  const parts = path.split(".");
  return parts.reduce((acc, key) => {
    if (acc === null || acc === undefined) return undefined;
    return acc[key];
  }, obj);
};

const resolveFieldValue = (field: any, data: any) => {
  if (typeof field.getValue === "function") {
    return field.getValue(data);
  }
  if (Array.isArray(field.keys)) {
    for (const key of field.keys) {
      const value = getNestedValue(data, key);
      if (hasDisplayValue(value)) return value;
    }
    return getNestedValue(data, field.keys[field.keys.length - 1]);
  }
  return getNestedValue(data, field.key);
};

const formatObjectEntries = (obj: any, { displayKeys = true } = {}) => {
  if (!obj || typeof obj !== "object") return [];
  return Object.entries(obj)
    .map(([key, val]) => {
      if (!hasDisplayValue(val)) return null;
      let formatted;
      if (typeof val === "object" && val !== null) {
        formatted = JSON.stringify(val, null, 2);
      } else {
        const text = String(val).trim();
        formatted = text || null;
      }
      if (!formatted) return null;
      return displayKeys ? `${key}: ${formatted}` : formatted;
    })
    .filter(Boolean);
};

const renderValue = (value: any, field: any) => {
  if (!hasDisplayValue(value)) return "-";

  const displayObjectKeys = field?.showObjectKeys !== false;

  if (Array.isArray(value)) {
    const items = value
      .map((item) => {
        if (typeof item === "object" && item !== null) {
          const entries = formatObjectEntries(item, {
            displayKeys: displayObjectKeys,
          });
          return entries.length ? entries.join(", ") : null;
        }
        if (item === null || item === undefined) return null;
        const text = String(item).trim();
        return text || null;
      })
      .filter(Boolean);

    if (!items.length) return "-";

    return (
      <ul className="list-disc list-inside space-y-1">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    );
  }

  if (typeof value === "object") {
    const entries = formatObjectEntries(value, {
      displayKeys: displayObjectKeys,
    });

    if (!entries.length) return "-";

    return (
      <ul className="list-disc list-inside space-y-1">
        {entries.map((entry, idx) => (
          <li key={idx}>{entry}</li>
        ))}
      </ul>
    );
  }

  return String(value);
};

const getInitialActiveTab = (tabs: any[], defaultTitle?: string) => {
  if (!tabs.length) return null;
  if (defaultTitle) {
    const match = tabs.find((tab) => tab.title === defaultTitle);
    if (match) return match.title;
  }
  return tabs[DEFAULT_ACTIVE_INDEX]?.title ?? null;
};

const resolveOverlay = (renderLockOverlay: any, tab: any, context: any) => {
  if (typeof renderLockOverlay !== "function") return null;
  return renderLockOverlay(tab, context);
};

interface AssetDetailTabsProps {
  data: any;
  tabConfig: any[];
  userdata?: any;
  defaultActiveTitle?: string;
  renderLockOverlay?: (tab: any, context: any) => React.ReactNode;
}

export default function AssetDetailTabs({
  data,
  tabConfig,
  userdata,
  defaultActiveTitle,
  renderLockOverlay,
}: AssetDetailTabsProps) {
  const filteredTabs = useMemo(() => {
    if (!Array.isArray(tabConfig)) return [];
    return tabConfig
      .map((tab) => ({
        ...tab,
        fields: tab.fields ?? [],
      }))
      .filter((tab) =>
        (tab.fields || []).some((field: any) =>
          hasDisplayValue(resolveFieldValue(field, data))
        )
      );
  }, [data, tabConfig]);

  const [active, setActive] = useState<string | null>(() =>
    getInitialActiveTab(filteredTabs, defaultActiveTitle)
  );

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  if (!filteredTabs.length) return null;

  const activeConfig =
    filteredTabs.find((tab) => tab.title === active) ?? filteredTabs[0];

  const context = { data, userdata };

  const renderTable = (tab: any) => {
    const overlay = resolveOverlay(renderLockOverlay, tab, context);

    return (
      <div
        ref={(el) => {
          sectionRefs.current[tab.title] = el;
        }}
        key={tab.title}
        className="mt-4 rounded-lg overflow-hidden border border-Gray-500 leading-160 relative"
      >
        <div className="bg-primary-default text-white text-xl font-medium px-4 py-2">
          {tab.title}
        </div>

        {(tab.fields || []).map((field: any) => {
          const rawValue = resolveFieldValue(field, data);
          const content = field.render
            ? field.render(rawValue, data)
            : renderValue(rawValue, field);

          return (
            <div
              key={field.label ?? field.key}
              className="flex flex-col md:flex-row border-t border-Gray-500"
            >
              <div className="bg-Gray-200 md:w-[220px] w-full text-textColor-secondary font-medium p-4 border-b md:border-b-0 border-Gray-500">
                {field.label}
              </div>
              <div className="bg-white flex-1 w-full text-textColor-primary p-4 break-words">
                {content}
              </div>
            </div>
          );
        })}

        {overlay ? <div className="absolute inset-0">{overlay}</div> : null}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="hidden lg:block">
        <div className="sticky top-[96px] z-50 bg-white">
          <div className="flex border-b border-Gray-500 overflow-x-auto">
            {filteredTabs.map((tab) => {
              const isActive = active === tab.title;
              return (
                <button
                  key={tab.title}
                  onClick={() => setActive(tab.title)}
                  className={`p-4 text-lg font-medium whitespace-nowrap ${
                    isActive
                      ? "bg-primaryBlue-100 border-b-2 border-primary-default text-primary-hovered"
                      : "text-textColor-primary hover:bg-primaryBlue-100 hover:text-primary-hovered"
                  }`}
                >
                  {tab.title}
                </button>
              );
            })}
          </div>
        </div>
        {activeConfig && renderTable(activeConfig)}
      </div>

      <div className="lg:hidden">
        <div className="sticky top-24 scrollbar-hide z-50 bg-white flex border-b border-Gray-500 overflow-x-auto">
          {filteredTabs.map((tab) => (
            <button
              key={tab.title}
              onClick={() => {
                const el = sectionRefs.current[tab.title];
                if (el) {
                  const targetScrollY = el.offsetTop - window.innerHeight / 2;
                  window.scrollTo({ top: targetScrollY, behavior: "smooth" });
                }
              }}
              className="p-4 text-lg font-medium text-textColor-primary hover:bg-primaryBlue-100 hover:border-b-2 hover:border-primary-default hover:text-primary-hovered whitespace-nowrap"
            >
              {tab.title}
            </button>
          ))}
        </div>

        {filteredTabs.map((tab) => renderTable(tab))}
      </div>
    </div>
  );
}
