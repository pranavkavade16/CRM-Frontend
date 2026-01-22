import useSearch from "../customHooks/useSearch";
import BadgePill from "./BadgePill";
import { Link } from "react-router-dom";
import {
  STATUS_COLORS,
  PRIORITY_COLORS,
  SOURCE_COLORS,
} from "../utils/badgeMap";
import { useState, useMemo, useEffect } from "react";
import useLocalFilter from "../customHooks/useLocalFilter";

const LeadsTable = ({ leads = [], pageSize = 10 }) => {
  const [page, setPage] = useState(1);

  const data = Array.isArray(leads) ? leads : [];

  const { searchedLeads, setSearch } = useSearch(data);
  const { filteredData, updateFilter } = useLocalFilter(searchedLeads);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const slicedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  useEffect(() => {
    setPage(1);
  }, [searchedLeads, filteredData]);

  if (!data.length) return <p>No leads found</p>;

  return (
    <div className="card w-100 my-3">
      <div className="card-body">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h5 className="mb-0">Leads</h5>
          <Link className="btn btn-dark rounded-3 w-sm-auto" to="/addLead">
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

        {/* Table */}
        <div className="table-responsive leads-table-wrapper">
          <table className="table table-hover align-middle">
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
                  <td className="text-truncate" style={{ maxWidth: 180 }}>
                    {lead.name}
                  </td>
                  <td>
                    <BadgePill
                      text={lead.source}
                      color={SOURCE_COLORS[lead.source]}
                      className="badge-soft"
                    />
                  </td>
                  <td>{lead.salesAgent?.name || "Unassigned"}</td>
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
                      className="btn btn-dark btn-sm"
                      to={`/leadManagement/${lead._id}`}
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
          <ul className="pagination pagination-sm mb-0">
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

          <div className="text-muted small">
            Showing {(page - 1) * pageSize + 1}–
            {Math.min(page * pageSize, filteredData.length)} of{" "}
            {filteredData.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsTable;
