import useCrmContext from "../context/CrmContext";
import LeadsComponent from "../components/LeadsComponent";
const Leads = () => {
  const { leadsData, leadsError, leadsLoading } = useCrmContext();

  if (leadsError) <p>{leadsError}</p>;
  if (leadsLoading) <p>Loading....</p>;
  if (leadsData.count === 0) return <p>No leads found</p>;

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
