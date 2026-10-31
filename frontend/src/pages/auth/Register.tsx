
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle2,
  Zap,
} from "lucide-react";
import "./Register.css";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSuccess(true);
  };

  const strength =
    password.length === 0 ? 0 :
    password.length < 8 ? 1 :
    password.length < 12 ? 2 : 3;

  return (
    <div className="register-page">
      <div className="register-glow" />

      <div className="register-container">
        <div className="register-brand">
          <div className="register-logo"><Zap size={22} /></div>
          <span>subspace</span>
        </div>

        <div className="register-card">
          <div className="register-heading">
            <span className="register-eyebrow">GET STARTED</span>
            <h1>Create your account</h1>
            <p>Manage all your subscriptions in one place.</p>
          </div>

          {success ? (
            <div className="register-success">
              <CheckCircle2 size={48} />
              <h2>Form completed!</h2>
              <p>
                Your details passed frontend validation.
                Account creation is not connected to the backend yet.
              </p>
              <Link to="/login" className="register-submit">
                Go to Login <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label>Full name</label>
              <div className="register-field">
                <User size={18} />
                <input name="name" placeholder="Enter your full name" required />
              </div>

              <label>Email address</label>
              <div className="register-field">
                <Mail size={18} />
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <label>Phone number</label>
              <div className="register-field">
                <Phone size={18} />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <label>Password</label>
              <div className="register-field">
                <Lock size={18} />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="register-eye"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="password-strength">
                {[1, 2, 3].map((n) => (
                  <span key={n} className={strength >= n ? "active" : ""} />
                ))}
              </div>
              <small>
                {strength === 0 ? "Password strength" :
                 strength === 1 ? "Weak password" :
                 strength === 2 ? "Good password" : "Strong password"}
              </small>

              <label>Confirm password</label>
              <div className="register-field">
                <Lock size={18} />
                <input
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="register-eye"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <label className="register-terms">
                <input type="checkbox" required />
                <span>
                  I agree to the Terms & Conditions and Privacy Policy.
                </span>
              </label>

              {error && <div className="register-error">{error}</div>}

              <button type="submit" className="register-submit">
                Create Account <ArrowRight size={18} />
              </button>
            </form>
          )}

          <div className="register-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>

        <p className="register-copyright">
          © 2026 Subspace. All rights reserved.
        </p>
      </div>
    </div>
  );
}
