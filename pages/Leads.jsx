import useCrmContext from "../context/CrmContext";
import LeadsComponent from "../components/LeadsComponent";
const Leads = () => {
  const { leadsData, leadsError, leadsLoading } = useCrmContext();

  if (leadsError)
    rreturn(
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
  if (leadsData.count === 0)
    return (
      <div className="dashboard-wrapper">
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <p className="text-dark fs-5">No Data Available.</p>
        </div>
      </div>
    );

  return (
    <div className="dashboard-wrapper">
      <h3>Dashboard</h3>
      <p className="text-muted">
        Manage and track all your leads through the sales pipeline.
      </p>
      <div>
        <LeadsComponent />
      </div>
    </div>
  );
};

export default Leads;
