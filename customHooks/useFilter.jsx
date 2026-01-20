import { useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useFetch from "./useFetch";

const useFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filter = useMemo(() => {
    return {
      status: searchParams.get("status") || "",
      priority: searchParams.get("priority") || "",
      sort: searchParams.get("sort") || "",
      order: searchParams.get("order") || "",
    };
  }, [searchParams]);

  console.log(searchParams);
  console.log(filter);

  const baseURL = "https://crm-backend-sqw3.vercel.app/leads";

  const apiUrl = useMemo(() => {
    const queryString = searchParams.toString();

    return queryString ? `${baseURL}?${queryString}` : baseURL;
  }, [searchParams]);

  console.log(apiUrl);

  const {
    data: filteredData,
    error: filteredError,
    loading: filteredLoading,
    fetchData: fetchFilteredData,
  } = useFetch(apiUrl);

  useEffect(() => {
    fetchFilteredData();
  }, [apiUrl, fetchFilteredData]);

  console.log("Filtered data", filteredData);

  const updateFilter = useCallback(
    (updates) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);

        Object.entries(updates).forEach(([key, value]) => {
          if (value) params.set(key, value);
          else params.delete(key);
        });

        return params;
      });
    },
    [setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return {
    filter,
    filteredData,
    filteredError,
    filteredLoading,
    updateFilter,
    clearFilters,
  };
};

export default useFilter;
