import { useState, useCallback } from 'react';
import { PaginatedResponse } from '../types';

export const usePagination = (initialPage = 0, initialSize = 10) => {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  const updatePagination = useCallback((response: PaginatedResponse<any>) => {
    setTotalPages(response.totalPages);
    setTotalElements(response.totalElements);
  }, []);
  
  const nextPage = useCallback(() => {
    setPage((prev) => Math.min(prev + 1, totalPages - 1));
  }, [totalPages]);
  
  const previousPage = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 0));
  }, []);
  
  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(0, Math.min(newPage, totalPages - 1)));
  }, [totalPages]);
  
  const changeSize = useCallback((newSize: number) => {
    setSize(newSize);
    setPage(0); // Reset to first page when changing size
  }, []);
  
  const reset = useCallback(() => {
    setPage(initialPage);
    setSize(initialSize);
    setTotalPages(0);
    setTotalElements(0);
  }, [initialPage, initialSize]);
  
  return {
    page,
    size,
    totalPages,
    totalElements,
    setPage,
    setSize,
    updatePagination,
    nextPage,
    previousPage,
    goToPage,
    changeSize,
    reset,
    hasNextPage: page < totalPages - 1,
    hasPreviousPage: page > 0,
  };
};
