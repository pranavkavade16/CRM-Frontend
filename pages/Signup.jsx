import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [user, setUser] = useState({ name: "", email: "", password: "" });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordMismatch(false);

    if (user.password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://crm-backend-delta-dun.vercel.app/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        },
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create account.");
      }

      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nexus-auth-root">
      {/* Main form area */}
      <main className="nexus-auth-main">
        <div>
          <div className="nexus-auth-box">
            {/* Logo */}
            <div className="nexus-auth-box__logo">
              <div className="nexus-logo-mark">
                <svg viewBox="0 0 16 16">
                  <path d="M2 8 L7 13 L14 4" />
                </svg>
              </div>
              <span className="nexus-logo-name">
                Nexus<span>CRM</span>
              </span>
            </div>

            <h1 className="nexus-auth-box__heading">Create your account</h1>
            <p className="nexus-auth-box__sub">
              Join NexusCRM and start managing your leads.
            </p>

            {error && <div className="nexus-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="nexus-field">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  className="nexus-input"
                  placeholder="Rahul Sharma"
                  required
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="nexus-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="nexus-input"
                  placeholder="name@company.com"
                  required
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="nexus-field">
                <div className="nexus-field__top">
                  <label htmlFor="password">Password</label>
                  <button
                    type="button"
                    className="nexus-show-btn"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={loading}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="nexus-input"
                  placeholder="Create a strong password"
                  minLength={6}
                  required
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <div className="nexus-field">
                <div className="nexus-field__top">
                  <label htmlFor="confirm">Confirm Password</label>
                  <button
                    type="button"
                    className="nexus-show-btn"
                    onClick={() => setShowConfirm((v) => !v)}
                    disabled={loading}
                  >
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  className={`nexus-input${passwordMismatch ? " is-error" : ""}`}
                  placeholder="Re-enter your password"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordMismatch) setPasswordMismatch(false);
                  }}
                  disabled={loading}
                />
                {passwordMismatch && (
                  <p className="nexus-mismatch">
                    Passwords do not match. Please try again.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="nexus-submit-btn"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="nexus-divider">
              <div className="nexus-divider__line" />
              <span className="nexus-divider__text">or</span>
              <div className="nexus-divider__line" />
            </div>

            <p className="nexus-footer-text">
              Already have an account? <Link to="/">Sign in</Link>
            </p>
          </div>

          <p className="nexus-copyright">
            © {new Date().getFullYear()} NexusCRM
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
