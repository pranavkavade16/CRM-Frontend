import { Link } from "react-router-dom";

const NavBar = ({ onMenuClick, isSidebarOpen }) => {
  return (
    <header className="dashboard-wrapper bg-white border-bottom">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn p-0 border-0 bg-transparent d-md-none"
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <i
              className={`bi ${isSidebarOpen ? "bi-x-lg" : "bi-list"} fs-3`}
            ></i>
          </button>

          <h4 className="text-danger fw-semibold mb-0">NexusCRM</h4>

          <div
            className="vr d-none d-md-block mx-2"
            style={{ height: 38 }}
          ></div>

          <div className="d-none d-md-flex align-items-center gap-2 text-muted">
            <i className="bi bi-calendar"></i>
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <Link
          to="/addLead"
          className="btn btn-dark rounded-3 px-3 text-nowrap ms-4"
        >
          + Add Lead
        </Link>
      </div>
    </header>
  );
};

export default NavBar;
