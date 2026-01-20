const FilterTags = ({ tags, onRemove }) => {
  if (!tags.length) return null;

  return (
    <div className="flex flex-col gap-3 pt-6">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-2 rounded-lg border border-primary-default/40 bg-primaryBlue-100 text-textColor-Tertiary text-base font-medium pr-1.5 pl-2.5 py-1 leading-160"
          >
            <span>{tag.displayLabel ?? tag.value}</span>
            <button
              type="button"
              aria-label={`Remove ${tag.displayLabel ?? tag.value}`}
              className="p-0.5 text-xs font-semibold text-primary-default hover:text-primary-hovered focus:outline-none"
              onClick={() => onRemove(tag.filterId, tag.value)}
            >
              <svg
                width={16}
                height={16}
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="self-stretch flex-grow relative"
                preserveAspectRatio="none"
              >
                <path
                  d="M12 4L4 12M4 4L12 12"
                  stroke="#0192A4"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default FilterTags;
