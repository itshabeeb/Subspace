
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Mail, Zap, CheckCircle2 } from "lucide-react";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <main
      className="forgot-page"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setSpotlight({
          x: ((event.clientX - rect.left) / rect.width) * 100,
          y: ((event.clientY - rect.top) / rect.height) * 100,
        });
      }}
      style={{
        "--mouse-x": `${spotlight.x}%`,
        "--mouse-y": `${spotlight.y}%`,
      } as React.CSSProperties}
    >
      <div className="forgot-glow" />

      <div className="forgot-container">
        <Link to="/login" className="forgot-brand">
          <span className="forgot-logo"><Zap size={22} /></span>
          <span>Subspace</span>
        </Link>

        <section className="forgot-card">
          {submitted ? (
            <div className="forgot-success">
              <div className="forgot-success-icon">
                <CheckCircle2 size={35} />
              </div>
              <h1>Check your inbox</h1>
              <p>
                Your email address has been validated by this demo form.
                Password-reset email delivery will be available once the
                backend API is connected.
              </p>
              <button
                className="forgot-button"
                onClick={() => setSubmitted(false)}
              >
                Try another email <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <>
              <div className="forgot-icon">
                <Mail size={25} />
              </div>

              <span className="forgot-eyebrow">ACCOUNT RECOVERY</span>
              <h1>Forgot your password?</h1>
              <p className="forgot-description">
                Don't worry. It happens. Enter your registered email address
                and we'll help you get back into your account.
              </p>

              <form onSubmit={handleSubmit}>
                <label htmlFor="forgot-email">Email address</label>
                <div className="forgot-input">
                  <Mail size={18} />
                  <input
                    id="forgot-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error && <p className="forgot-error">{error}</p>}

                <button type="submit" className="forgot-button">
                  Reset password <ArrowRight size={18} />
                </button>
              </form>
            </>
          )}

          <Link to="/login" className="forgot-back">
            <ArrowLeft size={16} /> Back to sign in
          </Link>
        </section>

        <p className="forgot-copyright">
          © 2026 Subspace. All rights reserved.
        </p>
      </div>
    </main>
  );
}
