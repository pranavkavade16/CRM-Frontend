import useCrmContext from "../context/CrmContext";
import useFilter from "../customHooks/useFilter";
import useSort from "../customHooks/useSort";
import useSearch from "../customHooks/useSearch";
import BadgePill from "../components/BadgePill";
import {
  STATUS_COLORS,
  PRIORITY_COLORS,
  SOURCE_COLORS,
} from "../utils/badgeMap";
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import useLocalFilter from "../customHooks/useLocalFilter";

const Settings = () => {
  const [page, setPage] = useState(1);
  const { leadsData, leadsError, leadsLoading, fetchLeads } = useCrmContext();
  const { agentsData, agentsError, agentsLoading, fetchAgents, showToast } =
    useCrmContext();

  const { searchedLeads, setSearch, searchedAgents } = useSearch(
    leadsData?.data,
    agentsData?.data
  );
  const { filteredData, updateFilter } = useLocalFilter(searchedLeads);
  const { sortedLeads, setSortBy } = useSort(filteredData);

  const pageSize = 10;
  const totalPages = Math.ceil(leadsData?.data?.length / pageSize);

  const slicedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedLeads.slice(start, start + pageSize);
  }, [sortedLeads, page]);

  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  useEffect(() => {
    setPage(1);
  }, [searchedLeads, filteredData, sortedLeads]);

  const agentStats = useMemo(() => {
    if (!leadsData?.data) return {};
    return leadsData.data.reduce((acc, lead) => {
      const name = lead.salesAgent?.name;
      if (!acc[name]) acc[name] = { total: 0, active: 0, closed: 0 };
      acc[name].total += 1;
      lead.status === "Closed" ? acc[name].closed++ : acc[name].active++;
      return acc;
    }, {});
  }, [leadsData?.data]);

  const handleDeleteAgent = async (agentId) => {
    try {
      await fetch(
        `https://crm-backend-sqw3.vercel.app/salesAgent/delete/${agentId}`,
        { method: "DELETE" }
      );
      showToast("Sales agent deleted successfully");
    } catch (err) {
      console.log(err);
    } finally {
      fetchAgents();
    }
  };

  const handleDeleteLead = async (leadId) => {
    try {
      await fetch(`https://crm-backend-sqw3.vercel.app/leads/${leadId}`, {
        method: "DELETE",
      });
      showToast("Lead deleted successfully");
    } catch (err) {
      console.log(err);
    } finally {
      fetchLeads();
    }
  };

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
      <h3>Settings</h3>
      <p className="text-muted">
        Manage and delete leads or sales agents directly from this CRM settings
        page.
      </p>

      {/* SALES AGENTS */}
      <div className="card w-100 mb-3 mt-3">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
            <h5 className="mb-0">Sales Agent</h5>
            <Link className="btn btn-dark rounded-3 px-3" to="/addSalesAgent">
              + Add Sales Agent
            </Link>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text bg-light">🔍</span>
            <input
              type="text"
              className="form-control bg-light"
              placeholder="Search sales agents"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Total Leads</th>
                  <th>Active Leads</th>
                  <th>Closed Leads</th>
                  <th>Conversion Rate</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {searchedAgents?.map((agent) => {
                  const stats = agentStats[agent.name] || {
                    total: 0,
                    active: 0,
                    closed: 0,
                  };
                  const conversionRate =
                    stats.total === 0
                      ? "0%"
                      : `${Math.round((stats.closed / stats.total) * 100)}%`;

                  return (
                    <tr key={agent._id}>
                      <td>{agent.name}</td>
                      <td>{stats.total}</td>
                      <td>{stats.active}</td>
                      <td>{stats.closed}</td>
                      <td>{conversionRate}</td>
                      <td>
                        <Link
                          className="btn btn-outline-dark btn-sm"
                          to={`/salesAgentDetails/${agent._id}`}
                        >
                          View
                        </Link>
                        <button
                          className="btn btn-outline-dark btn-sm ms-2"
                          onClick={() => handleDeleteAgent(agent._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* LEADS */}
      <div className="card w-100 mb-3 mt-3">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
            <h5 className="mb-0">Leads</h5>
            <Link className="btn btn-dark rounded-3 px-3" to="/addLead">
              + Add Lead
            </Link>
          </div>

          {/* Filters */}
          <div className="row g-2 mb-4">
            <div className="col-12 col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-light">🔍</span>
                <input
                  type="text"
                  className="form-control bg-light"
                  placeholder="Search leads..."
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-12 col-md-2">
              <select
                className="form-select bg-light"
                onChange={(e) => updateFilter({ status: e.target.value })}
              >
                <option value="">Status</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="col-12 col-md-2">
              <select
                className="form-select bg-light"
                onChange={(e) => updateFilter({ priority: e.target.value })}
              >
                <option value="">Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <select
                className="form-select bg-light"
                onChange={(e) => {
                  const [sort, order] = e.target.value.split(":");
                  updateFilter({ sort, order });
                }}
              >
                <option value="">Sort by</option>
                <option value="priority:desc">Priority (High → Low)</option>
                <option value="priority:asc">Priority (Low → High)</option>
                <option value="timeToClose:desc">
                  Time to close (High → Low)
                </option>
                <option value="timeToClose:asc">
                  Time to close (Low → High)
                </option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Lead Name</th>
                  <th>Source</th>
                  <th>Agent</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Time to close</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {slicedData.map((lead) => (
                  <tr key={lead._id}>
                    <td className="truncate">{lead.name.slice(0, 25)}</td>
                    <td>
                      <BadgePill
                        text={lead.source}
                        color={SOURCE_COLORS[lead.source]}
                        className="badge-soft"
                      />
                    </td>
                    <td>{lead.salesAgent.name}</td>
                    <td>
                      <BadgePill
                        text={lead.status}
                        color={STATUS_COLORS[lead.status]}
                        className="badge-soft-lg"
                      />
                    </td>
                    <td>
                      <BadgePill
                        text={lead.priority}
                        color={PRIORITY_COLORS[lead.priority]}
                        className="badge-soft"
                      />
                    </td>
                    <td>{lead.timeToClose} Days</td>
                    <td>
                      <Link
                        className="btn btn-outline-dark btn-sm"
                        to={`/leadManagement/${lead._id}`}
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-outline-dark btn-sm ms-2"
                        onClick={() => handleDeleteLead(lead._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <nav aria-label="Pagination">
            <ul className="pagination pagination-sm">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => goTo(page - 1)}>
                  Previous
                </button>
              </li>

              {[page - 1, page, page + 1]
                .filter((p) => p >= 1 && p <= totalPages)
                .map((p) => (
                  <li
                    key={p}
                    className={`page-item ${p === page ? "active" : ""}`}
                  >
                    <button className="page-link" onClick={() => goTo(p)}>
                      {p}
                    </button>
                  </li>
                ))}

              <li
                className={`page-item ${page === totalPages ? "disabled" : ""}`}
              >
                <button className="page-link" onClick={() => goTo(page + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>

          <div className="text-muted small">
            Showing {(page - 1) * pageSize + 1}–
            {Math.min(page * pageSize, sortedLeads.length)} of{" "}
            {sortedLeads.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
