"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { useTranslation } from "react-i18next"; // Используем тот же i18next, что и на HomePage
import { Skeleton } from "./ui/skeleton";

interface PaginationControlProps {
  basePath: string;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  className?: string;
  isFetching?: boolean;
}

type PageItem = number | "...";

export function PaginationControl({
  basePath,
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  className,
  isFetching = false,
}: PaginationControlProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handlePageChange = (page: number): void => {
    navigate(`${basePath}?page=${page}`);
  };

  const generatePageRange = (): PageItem[] => {
    const range: PageItem[] = [];
    const maxVisiblePages = 1;

    if (currentPage > 2) range.push(1);
    if (currentPage > 3) range.push("...");

    const start = Math.max(1, currentPage - maxVisiblePages);
    const end = Math.min(totalPages, currentPage + maxVisiblePages);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (currentPage < totalPages - 2) range.push("...");
    if (currentPage < totalPages - 1) range.push(totalPages);

    return range;
  };

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(startItem + pageSize - 1, totalItems);

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row justify-center items-center gap-4",
        isFetching && "opacity-70 pointer-events-none",
        className,
      )}
    >
      {/* Перевод строки состояния с интерполяцией переменных */}
      <div className="text-xs text-muted-foreground w-full text-center md:text-start">
        {t("pagination_status", {
          start: startItem,
          end: endItem,
          total: totalItems,
        })}
      </div>

      <Pagination className="md:justify-end">
        <PaginationContent className="flex flex-wrap justify-center">
          <PaginationItem>
            <PaginationPrevious
              href={`${basePath}?page=${Math.max(1, currentPage - 1)}`}
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                if (currentPage > 1) handlePageChange(currentPage - 1);
              }}
              aria-disabled={currentPage === 1}
            />
          </PaginationItem>

          {generatePageRange().map((page, index) => (
            <PaginationItem key={`${page}-${index}`}>
              {page === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={`${basePath}?page=${page}`}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    handlePageChange(page);
                  }}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href={`${basePath}?page=${Math.min(totalPages, currentPage + 1)}`}
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                if (currentPage < totalPages) handlePageChange(currentPage + 1);
              }}
              aria-disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
}

export function PaginationControlSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row justify-center items-center gap-4",
        className,
      )}
    >
      <div className="w-full md:w-48">
        <Skeleton className="h-4 w-32 bg-white/10 rounded-md mx-auto md:mx-0" />
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <Skeleton className="h-8 w-20 rounded-md bg-white/10" />
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-8 rounded-md bg-white/10" />
        ))}
        <Skeleton className="h-8 w-20 rounded-md bg-white/10" />
      </div>
    </div>
  );
}
