import useFilter from "../customHooks/useFilter";
import useLocalFilter from "../customHooks/useLocalFilter";
import useCrmContext from "../context/CrmContext";
import LeadsComponent from "../components/LeadsComponent";
import LeadsTable from "../components/LeadsTable";

const Status = () => {
  const { leadsData, leadsError, leadsLoading } = useCrmContext();
  const { updateFilter, filteredData, filteredError, filteredLoading } =
    useFilter();
  console.log(filteredData);

  // const { filteredLeads, setFilter } = useLocalFilter(filteredData);
  if (leadsError) <p>{leadsError}</p>;
  if (leadsLoading) <p>Loading....</p>;
  if (leadsData.count === 0) return <p>No leads found</p>;

  return (
    <div className="dashboard-wrapper">
      <h3>Leads by status</h3>
      <p className="text-muted">Manage your leads and track their status.</p>
      <select
        className="form-select bg-light w-25"
        onChange={(event) => updateFilter({ status: event.target.value })}
      >
        <option value="">Select Status</option>
        <option value="New">New</option>
        <option value="Qualified">Qualified</option>
        <option value="Contacted">Contacted</option>
        <option value="Closed">Closed</option>
      </select>
      <LeadsTable leads={filteredData.data} />
    </div>
  );
};

export default Status;
