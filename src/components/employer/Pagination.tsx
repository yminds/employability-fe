import type React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (rows: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
}) => {
  const getPageNumbers = () => {
    // If we have 5 or fewer pages, show all pages
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // For more pages, show a specific pattern like in the image
    const result = [];

    // Always show first page
    result.push(1);

    // If current page is not 1 and not 2, add ellipsis or page 2
    if (currentPage > 2) {
      if (currentPage > 3) {
        result.push(null); // ellipsis
      } else {
        result.push(2);
      }
    }

    // Add current page if it's not 1 and not the last page
    if (currentPage !== 1 && currentPage !== totalPages) {
      result.push(currentPage);
    }

    // If current page is not the last page and not the second-to-last page, add ellipsis or second-to-last page
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        result.push(null); // ellipsis
      } else {
        result.push(totalPages - 1);
      }
    }

    // Always show last page if we have more than 1 page
    if (totalPages > 1) {
      result.push(totalPages);
    }

    return result;
  };

  return (
    <div className="flex items-center justify-between bg-[#FAFAFA] px-6 py-4 border-t rounded-b-lg border-[#dfe3e8]">
      <div className="flex items-center gap-2">
        <button
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((page, index) =>
          page === null ? (
            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
          ) : (
            <button
              key={`page-${page}`}
              className={`min-w-[36px] h-9 flex items-center justify-center rounded ${
                currentPage === page
                  ? "border border-[#dfe3e8] bg-white"
                  : "hover:bg-[#fafafa]"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        )}

        <button
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Rows per page</span>
        <Select
          value={rowsPerPage.toString()}
          onValueChange={(value) => onRowsPerPageChange(Number.parseInt(value))}
        >
          <SelectTrigger className="w-[72px] h-9 border-[#dfe3e8]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Pagination;
