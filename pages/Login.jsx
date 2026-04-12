import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://crm-backend-delta-dun.vercel.app/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Invalid email or password.");
      }

      const data = await res.json();
      if (data?.token) localStorage.setItem("token", data.token);
      if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      console.log(err.message);
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

            <h1 className="nexus-auth-box__heading">Welcome back</h1>
            <p className="nexus-auth-box__sub">
              Sign in to continue to your dashboard.
            </p>

            {error && <div className="nexus-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="nexus-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="nexus-input"
                  placeholder="name@company.com"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="nexus-submit-btn"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="nexus-divider">
              <div className="nexus-divider__line" />
              <span className="nexus-divider__text">or</span>
              <div className="nexus-divider__line" />
            </div>

            <p className="nexus-footer-text">
              Don't have an account? <Link to="/signup">Create one</Link>
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

export default Login;
