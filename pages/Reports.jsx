import useLeadsData from "../customHooks/useLeadsData";
import BarChart from "../components/BarChart";
import PieChartComponent from "../components/PieChartComponent";
const Reports = () => {
  const { closedLeadsPerSalesAgent, leadsDataByStatus } = useLeadsData();
  return (
    <div className="dashboard-wrapper">
      <h3>Reports</h3>
      <p className="text-muted">
        View detailed CRM reports including lead performance and sales analytics
        to make informed decisions.
      </p>
      <div className="row g-4">
        {/* Left card */}
        <div className="col-xl-5 col-lg-5 col-md-5 mb-4">
          <div className="card dashboard-card h-100 shadow-sm rounded-4 mt-4">
            <div className="m-4">
              <h5 className="mb-4">Lead Pipeline Status</h5>
              <div className="d-flex justify-content-center align-items-center">
                <PieChartComponent />
              </div>
            </div>
          </div>
        </div>

        {/* Right card */}
        <div className="col-xl-7 col-lg-7 col-md-7 mb-4">
          <div className="card dashboard-card h-100 shadow-sm rounded-4 mt-4">
            <div className="m-4">
              <h5 className="mb-4">Closed Leads per Sales Agent</h5>
              <div className="d-flex justify-content-center align-items-center">
                <BarChart data={closedLeadsPerSalesAgent} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="card dashboard-card h-75 w-100 shadow-sm rounded-4">
          <div className="m-4">
            <h5 className="mb-4"> Lead Status Distribution</h5>
            <div className="d-flex justify-content-center align-items-center">
              <BarChart data={leadsDataByStatus} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
