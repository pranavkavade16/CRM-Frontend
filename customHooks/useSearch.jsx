import { useMemo, useState } from "react";

const normalize = (value) => (value ?? "").toString().toLowerCase();

const useSearch = (leads = []) => {
  const [search, setSearch] = useState("");

  const searchedLeads = useMemo(() => {
    const q = normalize(search);
    if (!q) return leads;

    return leads.filter((lead) => {
      const name = normalize(lead?.name);
      const source = normalize(lead?.source);
      const salesAgent = normalize(lead?.salesAgent);
      const status = normalize(lead?.status);
      const timeToClose = normalize(lead?.timeToClose);
      const priority = normalize(lead?.priority);

      return (
        name.includes(q) ||
        source.includes(q) ||
        salesAgent.includes(q) ||
        status.includes(q) ||
        timeToClose.includes(q) ||
        priority.includes(q)
      );
    });
  }, [leads, search]);

  return { search, setSearch, searchedLeads };
};

export default useSearch;
