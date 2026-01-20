import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <header>
      <div className="nav-bar" style={{ backgroundColor: "white" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="input-group flex-grow-0 w-50">
            <h4 className="brand text-danger mt-1">NexusCRM</h4>
            <div className="vr mx-3" style={{ height: 38 }}></div>
            <span className="mt-2 me-2">
              <i class="bi bi-calendar"></i>
            </span>
            <p className="text-muted mt-2">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <div>
            <Link className="btn btn-dark rounded-3" to="/addLead">
              + Add Lead
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
