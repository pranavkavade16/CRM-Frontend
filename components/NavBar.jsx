import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <header>
      <div className="nav-bar" style={{ backgroundColor: "white" }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center flex-wrap gap-2">
            <h4 className="brand text-danger mb-0">NexusCRM</h4>
            <div
              className="vr d-none d-md-block mx-2"
              style={{ height: 38 }}
            ></div>
            <span className="">
              <i class="bi bi-calendar"></i>
            </span>
            <p className="text-muted mb-0">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <div>
            <Link
              className="btn btn-dark rounded-3 btn-sm btn-md-normal"
              to="/addLead"
            >
              + Add Lead
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
