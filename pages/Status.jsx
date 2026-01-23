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

  if (leadsError)
    return (
      <div className="dashboard-wrapper">
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <p className="text-dark fs-5">Error: {leadsError}</p>
        </div>
      </div>
    );
  if (leadsLoading)
    return (
      <div className="dashboard-wrapper">
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <div className="spinner-border text-dark mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-dark fs-5">Loading...</p>
        </div>
      </div>
    );
  if (!leadsData)
    return (
      <div className="dashboard-wrapper">
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <p className="text-dark fs-5">No Data Available.</p>
        </div>
      </div>
    );

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
