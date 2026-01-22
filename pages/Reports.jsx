import useLeadsData from "../customHooks/useLeadsData";
import BarChart from "../components/BarChart";
import useFetch from "../customHooks/useFetch";
import PieChartComponent from "../components/PieChartComponent";
import { useEffect } from "react";

const Reports = () => {
  const { closedLeadsPerSalesAgent, leadsDataByStatus } = useLeadsData();
  const {
    data: closedData,
    error: closedError,
    loading: closedLoading,
    fetchData,
  } = useFetch("https://crm-backend-sqw3.vercel.app/report/last-week");

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="dashboard-wrapper">
      <h3>Reports</h3>
      <p className="text-muted">
        View detailed CRM reports including lead performance and sales analytics
        to make informed decisions.
      </p>

      <div className="row g-4">
        {/* Left card */}
        <div className="col-xl-5 col-lg-5 col-md-12 col-sm-12">
          <div className="card dashboard-card h-100 shadow-sm rounded-4 mt-4">
            <div className="m-4">
              <h5 className="mb-4">Lead Pipeline Status</h5>
              {/* ORIGINAL layout preserved */}
              <div className="d-flex justify-content-center align-items-center report-chart">
                <PieChartComponent />
              </div>
            </div>
          </div>
        </div>

        {/* Right card */}
        <div className="col-xl-7 col-lg-7 col-md-12 col-sm-12">
          <div className="card dashboard-card h-100 shadow-sm rounded-4 mt-4">
            <div className="m-4">
              <h5 className="mb-5">Closed Leads per Sales Agent</h5>
              {/* ORIGINAL layout preserved */}
              <div className="d-flex justify-content-center align-items-center report-chart">
                <div className="mt-5">
                  <BarChart data={closedLeadsPerSalesAgent} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom chart */}
      <div className="mt-5">
        <div className="card dashboard-card h-75 w-100 shadow-sm rounded-4">
          <div className="m-4">
            <h5 className="mb-5">Lead Status Distribution</h5>
            {/* ORIGINAL layout preserved */}
            <div className="d-flex justify-content-center align-items-center report-chart">
              <div className="mt-5">
                <BarChart data={leadsDataByStatus} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
