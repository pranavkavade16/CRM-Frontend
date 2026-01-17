import { useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import useFetch from "./useFetch";
const useUrl = (href) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const url = useMemo(() => {
    const queryString = searchParams.toString();
    return queryString ? `${href}?${queryString}` : `${href}`;
  }, [searchParams, href]);

  console.log("useUrl url", url);

  const { data, error, loading, fetchData } = useFetch(url);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  console.log("useUrl data", data);

  const updateFilter = useCallback(
    (key, value) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);

        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }

        return params;
      });
    },
    [setSearchParams]
  );

  return { updateFilter, data, error, loading, fetchData };
};

export default useUrl;
