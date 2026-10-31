import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("auth/register/", {
        username,
        email,
        password,
      });

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      const data = err.response?.data;

      if (data) {
        const messages = Object.entries(data)
          .map(([field, value]) => {
            const message = Array.isArray(value)
              ? value.join(", ")
              : String(value);
            return `${field}: ${message}`;
          })
          .join(" ");

        setError(messages || "Registration failed.");
      } else {
        setError("Unable to connect to the server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#0d0d20",
      padding: "24px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "430px",
        background: "#17172c",
        padding: "35px",
        borderRadius: "16px",
        color: "white"
      }}>
        <h1 style={{ fontSize: "30px", marginBottom: "8px" }}>
          Create your account
        </h1>

        <p style={{ color: "#aaa", marginBottom: "25px" }}>
          Join Subspace and manage your subscriptions.
        </p>

        {error && (
          <p style={{ color: "#ff7777", marginBottom: "15px" }}>
            {error}
          </p>
        )}

        {success && (
          <p style={{ color: "#5ee6a8", marginBottom: "15px" }}>
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
            placeholder="Choose a username"
          />

          <label>Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
            placeholder="you@example.com"
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
            placeholder="Create a password"
          />

          <label>Confirm password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={inputStyle}
            placeholder="Enter your password again"
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "15px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(90deg, #5145e5, #8138ed)",
              color: "white",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "25px", color: "#aaa" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#a99aff" }}>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "18px",
  borderRadius: "8px",
  border: "1px solid #383854",
  background: "#101024",
  color: "white",
  outline: "none"
};