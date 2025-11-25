const PageButton = ({ active, children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      ${
        active
          ? "bg-gradient-to-r from-[#1a509a] to-[#2d6bc4] text-white shadow-lg scale-110"
          : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 hover:scale-105 border border-blue-200"
      }
      rounded-xl w-10 h-10 flex items-center justify-center
      text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
      transition-all duration-200 shadow-sm
    `}
  >
    {children}
  </button>
);

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      pages.push(1, 2, 3, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage, "...", totalPages);
    }
  }

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex gap-2">
        {pages.map((page, index) => (
          <PageButton
            key={index}
            active={page === currentPage}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
          >
            {page}
          </PageButton>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 shadow-sm group"
        >
          <svg
            className="w-5 h-5 text-[#1a509a] group-hover:scale-110 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 shadow-sm group"
        >
          <svg
            className="w-5 h-5 text-[#1a509a] group-hover:scale-110 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
