import useCrmContext from "../context/CrmContext";
import LeadsComponent from "../components/LeadsComponent";
import PieChartComponent from "../components/PieChartComponent";
import BarChart from "../components/BarChart";
import useLeadsData from "../customHooks/useLeadsData";
import LeadsTable from "../components/LeadsTable";
const FrontPage = () => {
  const { leadsData, leadsError, leadsLoading } = useCrmContext();
  const { agentsData, agentsError, agentsLoading } = useCrmContext();
  const { closedLeadsPerSalesAgent, leadsDataByStatus } = useLeadsData();

  if (leadsLoading || agentsLoading)
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
  if (leadsError || agentsError)
    return (
      <div className="dashboard-wrapper">
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <p className="text-dark fs-5">Error: {leadsError || agentsError}</p>
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
        Welcome back! Here's what's happening with your leads today.
      </p>

      <div className="row g-4">
        {/* CARD 1 */}
        <div className="col-xl-3 col-lg-3 col-md-6">
          <div className="card dashboard-card h-100 shadow-sm rounded-4">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="fw-normal text-muted mb-2">Total Leads</h6>
                <h4 className="fw-bold mb-1">{leadsData?.count}</h4>
                <p className="text-success mb-0 small">
                  +15.3% from last month
                </p>
              </div>

              <svg width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="24" fill="#E6F9EF" />
                <circle
                  cx="24"
                  cy="24"
                  r="10"
                  stroke="#22C55E"
                  strokeWidth="2"
                />
                <circle cx="24" cy="24" r="4" fill="#22C55E" />
              </svg>
            </div>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="col-xl-3 col-lg-3 col-md-6">
          <div className="card dashboard-card h-100 shadow-sm rounded-4">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="fw-normal text-muted mb-2">Qualified Leads</h6>
                <h4 className="fw-bold mb-1">
                  {
                    leadsData?.data?.filter(
                      (lead) => lead.status === "Qualified"
                    ).length
                  }
                </h4>
                <p className="text-success mb-0 small">+8.7% from last month</p>
              </div>

              <svg width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="24" fill="#E6F9EF" />
                <path
                  d="M16 26l6-6 4 4 6-6"
                  stroke="#22C55E"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="col-xl-3 col-lg-3 col-md-6">
          <div className="card dashboard-card h-100 shadow-sm rounded-4">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="fw-normal text-muted mb-2">Closed Deals</h6>
                <h4 className="fw-bold mb-1">
                  {
                    leadsData?.data?.filter((lead) => lead.status === "Closed")
                      .length
                  }
                </h4>
                <p className="text-success mb-0 small">
                  +12.2% from last month
                </p>
              </div>

              <svg width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="24" fill="#E6F9EF" />
                <text
                  x="24"
                  y="30"
                  textAnchor="middle"
                  fontSize="20"
                  fill="#22C55E"
                  fontWeight="bold"
                >
                  $
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* CARD 4 */}
        <div className="col-xl-3 col-lg-3 col-md-6">
          <div className="card dashboard-card h-100 shadow-sm rounded-4">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="fw-normal text-muted mb-2">Sales Agents</h6>
                <h4 className="fw-bold mb-1">{agentsData?.data?.length}</h4>
                <p className="text-success mb-0 small">+2 new this month</p>
              </div>

              <svg width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="24" fill="#E6F9EF" />
                <circle
                  cx="24"
                  cy="18"
                  r="5"
                  stroke="#22C55E"
                  strokeWidth="2"
                />
                <path
                  d="M16 32c0-4 16-4 16 0"
                  stroke="#22C55E"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left card */}
        <div className="col-xl-5 col-lg-5 col-md-5">
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
        <div className="col-xl-7 col-lg-7 col-md-7">
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

      <div className="mt-5">
        <LeadsComponent />
      </div>
    </div>
  );
};

export default FrontPage;
