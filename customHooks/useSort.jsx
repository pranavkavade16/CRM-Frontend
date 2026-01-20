import { useState, useMemo } from "react";
const useSort = (leads) => {
  const [sortBy, setSortBy] = useState("null");
  const priorityOrder = {
    High: 1,
    Medium: 2,
    Low: 3,
  };

  const sortedLeads = useMemo(() => {
    const data = Array.isArray(leads) ? [...leads] : [];
    if (!sortBy || sortBy === "null") return data;

    const sortedData = data.sort((a, b) => {
      if (sortBy === "priorityHigh") {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      if (sortBy === "priorityLow") {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }

      if (sortBy === "timeHigh") {
        return Number(b.timeToClose) - Number(a.timeToClose);
      }

      if (sortBy === "timeLow") {
        return Number(a.timeToClose) - Number(b.timeToClose);
      }
    });

    return sortedData;
  }, [leads, sortBy]);

  return { sortedLeads, setSortBy };
};

export default useSort;
