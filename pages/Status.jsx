import useFilter from "../customHooks/useFilter";
import useCrmContext from "../context/CrmContext";
import LeadsComponent from "../components/LeadsComponent";

const Status = () => {
  const { leadsData, leadsError, leadsLoading } = useCrmContext();
  const { filteredLeads, setFilter } = useFilter(leadsData.data);
  if (leadsError) <p>{leadsError}</p>;
  if (leadsLoading) <p>Loading....</p>;
  if (leadsData.count === 0) return <p>No leads found</p>;
  console.log("Status page filtered leads", filteredLeads);
  return (
    <div className="dashboard-wrapper">
      <h3>Leads by status</h3>
      <p className="text-muted">Manage your leads and track their status.</p>
      <select
        className="form-select bg-light w-25"
        onChange={(event) => setFilter(event.target.value)}
      >
        <option value="">Select Status</option>
        <option value="New">New</option>
        <option value="Qualified">Qualified</option>
        <option value="Contacted">Contacted</option>
        <option value="Closed">Closed</option>
      </select>
      <LeadsComponent leads={filteredLeads} />
    </div>
  );
};

export default Status;
