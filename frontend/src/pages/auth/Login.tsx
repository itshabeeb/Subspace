import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Zap,
} from "lucide-react";
import { useAuth, type User } from "../../context/AuthContext";

interface LoginApiResponse {
  user: User;
  access?: string;
  access_token?: string;
  token?: string;
  detail?: string;
  message?: string;
}
const API_BASE_URL = "http://127.0.0.1:8000";
const LOGIN_ENDPOINT = "/api/auth/login/";

export default function Login() {
  const rootRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Only the background spotlight follows the pointer. Content stays still.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const motionQuery = window.matchMedia(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!motionQuery.matches) return;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const update = () => {
      frame = 0;
      const bounds = root.getBoundingClientRect();
      root.style.setProperty("--spot-x", `${pointerX - bounds.left}px`);
      root.style.setProperty("--spot-y", `${pointerY - bounds.top}px`);
    };

    const handlePointerMove = (event: globalThis.PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };

    const handlePointerLeave = () => {
      root.style.setProperty("--spot-x", "50%");
      root.style.setProperty("--spot-y", "45%");
    };

    root.addEventListener("pointermove", handlePointerMove, { passive: true });
    root.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  
const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setError("");

  if (!email.trim() || !password) {
    setError("Please enter your email and password.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}${LOGIN_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
    });

    // Safely read the response
    const responseText = await response.text();

    let data: LoginApiResponse;

    try {
      data = responseText
        ? JSON.parse(responseText)
        : ({} as LoginApiResponse);
    } catch {
      throw new Error(
        "The server returned an invalid response. Please contact the backend team."
      );
    }

    if (!response.ok) {
      throw new Error(
        data.detail ||
        data.message ||
        "Invalid email or password."
      );
    }

    if (!data.user) {
      throw new Error("User details are missing from the server response.");
    }

    if (
      data.user.role !== "admin" &&
      data.user.role !== "customer"
    ) {
      throw new Error("Invalid user role received from server.");
    }

    const token = data.access ?? data.access_token ?? data.token;

    if (!token) {
      throw new Error("Authentication token was not received.");
    }

    login(data.user, token);

    navigate(
      data.user.role === "admin"
        ? "/admin/dashboard"
        : "/customer/dashboard",
      { replace: true }
    );

  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Unable to sign in. Please try again."
    );
  } finally {
    setLoading(false);
  }
};


  const handleButtonPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--button-x",
      `${event.clientX - bounds.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--button-y",
      `${event.clientY - bounds.top}px`,
    );
  };

  return (
    <main ref={rootRef} className="subspace-login min-h-screen">
      <div className="login-ambient login-ambient-one" aria-hidden="true" />
      <div className="login-ambient login-ambient-two" aria-hidden="true" />
      <div className="login-grain" aria-hidden="true" />

      <div className="login-layout min-h-screen">
        <section className="login-side flex w-full items-center justify-center px-6 py-12 lg:w-1/2 lg:px-12">
          <div className="login-card w-full max-w-md">
            <Link to="/" className="brand-mark mb-12 inline-flex items-center gap-3">
              <span className="brand-icon">
                <Zap size={21} fill="currentColor" strokeWidth={2.2} />
              </span>
              <span className="text-[25px] font-bold tracking-[-0.055em] text-slate-950">
                Subspace
              </span>
            </Link>

            <div className="mb-8">
              <p className="eyebrow mb-3">YOUR WORKSPACE, IN SYNC</p>
              <h1 className="text-[2.15rem] font-semibold leading-tight tracking-[-0.045em] text-slate-950">
                Welcome back<span className="text-indigo-600">.</span>
              </h1>
              <p className="mt-3 text-[15px] leading-6 text-slate-500">
                Sign in to manage your subscriptions and billing.
              </p>
            </div>

            {error && (
              <div
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="field-label">
                  Email address
                </label>
                <div className="field-wrap">
                  <Mail className="field-icon" size={18} aria-hidden="true" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="login-input"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="field-label mb-0">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[13px] font-semibold text-indigo-600 transition-colors hover:text-indigo-800"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="field-wrap">
                  <Lock className="field-icon" size={18} aria-hidden="true" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="login-input pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="password-toggle"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-0.5">
                <input
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-indigo-600"
                />
                <label
                  htmlFor="remember"
                  className="cursor-pointer text-[13px] text-slate-600"
                >
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                onPointerMove={handleButtonPointerMove}
                className="signin-button group flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>{loading ? "Signing in..." : "Sign in"}</span>
                {!loading && (
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-[13px] text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Create an account
              </Link>
            </p>

            <div className="mt-12 flex items-center justify-center gap-2 text-[11px] tracking-wide text-slate-400">
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              © 2026 Subspace Software. All rights reserved.
            </div>
          </div>
        </section>

        <aside className="branding-side relative hidden items-center justify-center overflow-hidden lg:flex lg:w-1/2">
          <div className="branding-grid" aria-hidden="true" />
          <div className="branding-orb branding-orb-a" aria-hidden="true" />
          <div className="branding-orb branding-orb-b" aria-hidden="true" />
          <div className="branding-orb branding-orb-c" aria-hidden="true" />

          <div className="branding-content relative z-10 max-w-xl px-12 py-16 text-white xl:px-16">
            <div className="brand-pill mb-9 inline-flex items-center gap-2.5 rounded-full px-4 py-2.5 text-[12px] font-medium tracking-wide">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]" />
              Subscription management, reimagined
            </div>

            <h2 className="max-w-lg text-[3.25rem] font-semibold leading-[1.08] tracking-[-0.055em] xl:text-[3.75rem]">
              Clarity for every
              <span className="block bg-gradient-to-r from-indigo-200 via-violet-200 to-white bg-clip-text text-transparent">
                recurring moment.
              </span>
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-7 text-indigo-100/80">
              Bring subscriptions, billing and revenue into one calm,
              connected workspace. Spend less time chasing numbers and more
              time moving your business forward.
            </p>

            <div className="feature-stack mt-10 space-y-3">
              {[
                "Automated recurring billing",
                "Real-time revenue insights",
                "Complete subscription control",
              ].map((feature, index) => (
                <div
                  key={feature}
                  className="feature-row flex items-center gap-3.5 rounded-xl px-4 py-3"
                  data-parallax={index === 1 ? "0.9" : "0.35"}
                >
                  <span className="feature-check">
                    <CheckCircle2 size={17} />
                  </span>
                  <span className="text-[13px] font-medium text-white/90">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-14 border-t border-white/15 pt-6">
              <p className="text-[12px] tracking-wide text-indigo-100/65">
                SIMPLIFY YOUR BILLING. FOCUS ON GROWTH.
              </p>
            </div>
          </div>

          <div className="floating-note floating-note-top" aria-hidden="true">
            <span className="floating-note-icon"><Zap size={15} /></span>
            <span>
              <strong>Billing on autopilot</strong>
              <small>Everything in sync</small>
            </span>
            <span className="note-status" />
          </div>
          <div className="floating-note floating-note-bottom" aria-hidden="true">
            <span className="note-chart">
              <span /><span /><span /><span /><span />
            </span>
            <span>
              <strong>Revenue insights</strong>
              <small>See the bigger picture</small>
            </span>
          </div>
        </aside>
      </div>
    </main>
  );
}
