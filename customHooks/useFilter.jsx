import { useMemo, useState } from "react";
const useFilter = (leads) => {
  const [filter, setFilter] = useState("");
  console.log(filter);

  const filteredLeads = useMemo(() => {
    if (filter === "") return leads;

    if (filter === "High" || filter === "Medium" || filter === "Low") {
      return leads.filter((lead) => lead.priority === filter);
    }

    if (
      filter === "New" ||
      filter === "Qualified" ||
      filter === "Contacted" ||
      filter === "Proposal Sent" ||
      filter === "Closed"
    ) {
      return leads.filter((lead) => lead.status === filter);
    }
  }, [leads, filter]);
  console.log(filteredLeads);

  return { filteredLeads, setFilter };
};

export default useFilter;
