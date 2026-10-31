
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity, ArrowDownToLine, ArrowRight, Bell, CalendarDays, Check,
  ChevronDown, ChevronLeft, ChevronRight, CircleHelp, CreditCard,
  Download, FileText, LayoutDashboard, LogOut, Menu, MoreHorizontal,
  Package, Search, Settings, ShieldCheck, Sparkles, UserRound, Wallet, X,
  Zap
} from "lucide-react";
import "./CustomerPortal.css";

type Subscription = {
  id: string;
  product: string;
  plan: string;
  price: string;
  cycle: string;
  nextDate: string;
  status: "Active" | "Paused";
  icon: string;
  tone: string;
};

type LoggedInUser = {
  id: number;
  username: string;
  email: string;
  role: string;
};

const getLoggedInUser = (): LoggedInUser | null => {
  try {
    const storedUser =
      sessionStorage.getItem("user") ||
      localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const formatName = (username: string) => {
  return username
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
};

const initialSubscriptions: Subscription[] = [
  { id: "SUB-2048", product: "Workspace Suite", plan: "Business Pro", price: "₹2,499", cycle: "month", nextDate: "Nov 12, 2026", status: "Active", icon: "W", tone: "purple" },
  { id: "SUB-2031", product: "Cloud Storage", plan: "2 TB Plan", price: "₹799", cycle: "month", nextDate: "Nov 18, 2026", status: "Active", icon: "C", tone: "blue" },
  { id: "SUB-1986", product: "Design Toolkit", plan: "Professional", price: "₹1,499", cycle: "month", nextDate: "Nov 22, 2026", status: "Paused", icon: "D", tone: "orange" },
];

const invoices = [
  { id: "INV-2026-1048", date: "Oct 12, 2026", amount: "₹2,499.00", status: "Paid" },
  { id: "INV-2026-1031", date: "Oct 18, 2026", amount: "₹799.00", status: "Paid" },
  { id: "INV-2026-0986", date: "Oct 22, 2026", amount: "₹1,499.00", status: "Pending" },
];

export default function CustomerPortal() {
  const navigateTo = useNavigate();

  const [user] = useState<LoggedInUser | null>(getLoggedInUser);

  const displayName = user?.username
    ? formatName(user.username)
    : "Customer";

  const initials = getInitials(displayName);

  const [activePage, setActivePage] = useState("Overview");
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");

  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "Active"
  ).length;

  const filteredSubscriptions = useMemo(
    () =>
      subscriptions.filter((s) =>
        `${s.product} ${s.plan} ${s.id}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [subscriptions, query]
  );

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  };

  const navigate = (page: string) => {
    setActivePage(page);
    setMobileMenu(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    navigateTo("/login");
  };

  const togglePause = (id: string) => {
    setSubscriptions((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "Active" ? "Paused" : "Active",
            }
          : item
      )
    );

    notify("Subscription status updated in this demo");
  };

  return (
    <div className="customer-portal">
      <aside className={`portal-sidebar ${mobileMenu ? "mobile-open" : ""}`}>
        <a className="portal-brand" href="/customer/dashboard">
          <span className="portal-brand-mark">
            <Zap size={19} fill="currentColor" />
          </span>
          <span>
            subspace<span className="portal-brand-dot">.</span>
            <small>CUSTOMER PORTAL</small>
          </span>
        </a>

        <div className="portal-workspace">
          <div className="portal-user-avatar">{initials}</div>
          <div>
            <strong>{displayName}</strong>
            <small>Personal account</small>
          </div>
          <ChevronDown size={14} />
        </div>

        <span className="portal-nav-label">MY ACCOUNT</span>

        <nav className="portal-nav">
          <button
            className={activePage === "Overview" ? "selected" : ""}
            onClick={() => navigate("Overview")}
          >
            <LayoutDashboard size={17} />Overview
          </button>

          <button
            className={activePage === "Subscriptions" ? "selected" : ""}
            onClick={() => navigate("Subscriptions")}
          >
            <Package size={17} />My subscriptions
            <span className="portal-nav-count">{subscriptions.length}</span>
          </button>

          <button
            className={activePage === "Invoices" ? "selected" : ""}
            onClick={() => navigate("Invoices")}
          >
            <FileText size={17} />Invoices & billing
          </button>

          <button
            className={activePage === "Payment methods" ? "selected" : ""}
            onClick={() => navigate("Payment methods")}
          >
            <CreditCard size={17} />Payment methods
          </button>
        </nav>

        <span className="portal-nav-label portal-support-label">SUPPORT</span>

        <nav className="portal-nav">
          <button
            className={activePage === "Help center" ? "selected" : ""}
            onClick={() => navigate("Help center")}
          >
            <CircleHelp size={17} />Help center
          </button>

          <button
            className={activePage === "Settings" ? "selected" : ""}
            onClick={() => navigate("Settings")}
          >
            <Settings size={17} />Account settings
          </button>
        </nav>

        <div className="portal-sidebar-bottom">
          <div className="portal-support-card">
            <span><Sparkles size={15} /> Need assistance?</span>
            <p>
              Our support team is here to help with your subscriptions.
            </p>
            <button onClick={() => navigate("Help center")}>
              Contact support <ArrowRight size={13} />
            </button>
          </div>

          <button className="portal-logout" onClick={handleLogout}>
            <LogOut size={16} />Sign out
          </button>

          <div className="portal-sidebar-footer">© 2026 Subspace</div>
        </div>
      </aside>

      {mobileMenu && (
        <button
          className="portal-mobile-scrim"
          aria-label="Close menu"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <main className="portal-main">
        <header className="portal-topbar">
          <div className="portal-breadcrumb">
            <button
              className="portal-mobile-menu"
              aria-label="Open menu"
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={19} />
            </button>

            <span>My account</span>
            <i>/</i>
            <strong>{activePage}</strong>
          </div>

          <div className="portal-top-actions">
            <button
              className="portal-icon-btn notification-trigger"
              aria-label="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={18} /><i />
            </button>

            <div className="portal-top-divider" />

            <button
              className="portal-profile-trigger"
              onClick={() => setShowProfile(!showProfile)}
            >
              <span className="portal-user-avatar small">{initials}</span>
              <span>
                <strong>{displayName}</strong>
                <small>Customer</small>
              </span>
              <ChevronDown size={14} />
            </button>

            {showNotifications && (
              <div className="portal-popover notification-popover">
                <div className="portal-popover-head">
                  <strong>Notifications</strong>
                  <span>2 new</span>
                </div>

                <div className="portal-notification">
                  <i />
                  <span>
                    <b>Payment received</b>
                    <small>
                      Your Workspace Suite payment was successful.
                    </small>
                    <time>2 hours ago</time>
                  </span>
                </div>

                <div className="portal-notification">
                  <i />
                  <span>
                    <b>Upcoming renewal</b>
                    <small>Cloud Storage renews on Nov 18.</small>
                    <time>Yesterday</time>
                  </span>
                </div>

                <button onClick={() => setShowNotifications(false)}>
                  Close notifications
                </button>
              </div>
            )}

            {showProfile && (
              <div className="portal-popover profile-popover">
                <button
                  onClick={() => {
                    navigate("Settings");
                    setShowProfile(false);
                  }}
                >
                  <UserRound size={14} />My profile
                </button>

                <button
                  onClick={() => {
                    navigate("Settings");
                    setShowProfile(false);
                  }}
                >
                  <Settings size={14} />Account settings
                </button>

                <button onClick={handleLogout}>
                  <LogOut size={14} />Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="portal-content">
          {activePage === "Overview" && (
            <>
              <section className="portal-welcome">
                <div>
                  <div className="portal-eyebrow">
                    <span /> YOUR SUBSPACE ACCOUNT
                  </div>

                  <h1>
                    Good afternoon, {displayName} <span>✦</span>
                  </h1>

                  <p>
                    Here's an overview of your subscriptions and recent activity.
                  </p>
                </div>

                <button
                  className="portal-date-button"
                  onClick={() =>
                    notify("Showing account activity for October 2026")
                  }
                >
                  <CalendarDays size={15} />
                  October 2026
                  <ChevronDown size={13} />
                </button>
              </section>

              <section className="portal-stats">
                <article>
                  <div className="portal-stat-head">
                    Active subscriptions
                    <span className="portal-stat-icon violet">
                      <Package size={17} />
                    </span>
                  </div>
                  <strong>{activeSubscriptions}</strong>
                  <small>Services currently active</small>
                </article>

                <article>
                  <div className="portal-stat-head">
                    Monthly spending
                    <span className="portal-stat-icon blue">
                      <Wallet size={17} />
                    </span>
                  </div>
                  <strong>₹3,298<span className="portal-per-month">/mo</span></strong>
                  <small>Across active subscriptions</small>
                </article>

                <article>
                  <div className="portal-stat-head">
                    Next payment
                    <span className="portal-stat-icon green">
                      <CalendarDays size={17} />
                    </span>
                  </div>
                  <strong>Nov 12</strong>
                  <small>Workspace Suite renewal</small>
                </article>
              </section>

              <section className="portal-content-grid">
                <article className="portal-panel portal-subscriptions-panel">
                  <div className="portal-panel-heading">
                    <div>
                      <h2>Your subscriptions</h2>
                      <p>Manage the services you're subscribed to.</p>
                    </div>
                    <button
                      className="portal-text-link"
                      onClick={() => navigate("Subscriptions")}
                    >
                      View all <ArrowRight size={14} />
                    </button>
                  </div>

                  <div className="portal-subscription-list">
                    {subscriptions.map((item) => (
                      <div className="portal-subscription-row" key={item.id}>
                        <span className={`portal-product-icon ${item.tone}`}>
                          {item.icon}
                        </span>

                        <div className="portal-product-info">
                          <strong>{item.product}</strong>
                          <small>{item.plan} · {item.id}</small>
                        </div>

                        <div className="portal-product-price">
                          <strong>{item.price}</strong>
                          <small>/ {item.cycle}</small>
                        </div>

                        <span className={`portal-status ${item.status.toLowerCase()}`}>
                          <i />{item.status}
                        </span>

                        <button
                          className="portal-more-btn"
                          aria-label={`Manage ${item.product}`}
                          onClick={() => navigate("Subscriptions")}
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    className="portal-view-all"
                    onClick={() => navigate("Subscriptions")}
                  >
                    Manage all subscriptions <ArrowRight size={14} />
                  </button>
                </article>

                <article className="portal-panel next-payment-panel">
                  <div className="portal-panel-heading">
                    <div>
                      <h2>Next payment</h2>
                      <p>Your upcoming renewal</p>
                    </div>
                    <span className="portal-calendar-icon">
                      <CalendarDays size={17} />
                    </span>
                  </div>

                  <div className="next-payment-date">
                    <span>NOV</span>
                    <strong>12</strong>
                    <small>THURSDAY</small>
                  </div>

                  <div className="next-payment-details">
                    <span>Workspace Suite</span>
                    <strong>₹2,499.00</strong>
                  </div>

                  <div className="next-payment-details">
                    <span>Billing period</span>
                    <strong>Nov 12 – Dec 11</strong>
                  </div>

                  <div className="next-payment-divider" />

                  <div className="next-payment-total">
                    <span>Amount due</span>
                    <strong>₹2,499.00</strong>
                  </div>

                  <button
                    className="portal-primary-wide"
                    onClick={() => navigate("Payment methods")}
                  >
                    Manage payment method <ArrowRight size={14} />
                  </button>
                </article>
              </section>

              <section className="portal-panel portal-invoices-panel">
                <div className="portal-panel-heading">
                  <div>
                    <h2>Recent invoices</h2>
                    <p>Your latest billing documents.</p>
                  </div>
                  <button
                    className="portal-text-link"
                    onClick={() => navigate("Invoices")}
                  >
                    All invoices <ArrowRight size={14} />
                  </button>
                </div>

                <div className="portal-invoice-table-wrap">
                  <table className="portal-invoice-table">
                    <thead>
                      <tr>
                        <th>INVOICE</th>
                        <th>DATE</th>
                        <th>AMOUNT</th>
                        <th>STATUS</th>
                        <th />
                      </tr>
                    </thead>

                    <tbody>
                      {invoices.slice(0, 2).map((invoice) => (
                        <tr key={invoice.id}>
                          <td><strong>{invoice.id}</strong></td>
                          <td>{invoice.date}</td>
                          <td className="portal-invoice-amount">
                            {invoice.amount}
                          </td>
                          <td>
                            <span className={`portal-invoice-status ${invoice.status.toLowerCase()}`}>
                              <i />{invoice.status}
                            </span>
                          </td>
                          <td>
                            <button
                              aria-label="Download invoice"
                              onClick={() =>
                                notify("Invoice download will be connected to the billing API")
                              }
                            >
                              <Download size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <footer className="portal-footer">
                <span>
                  Need help?{" "}
                  <button onClick={() => navigate("Help center")}>
                    Contact our support team
                  </button>
                </span>
                <span><ShieldCheck size={13} /> Your account is secure</span>
              </footer>
            </>
          )}

          {activePage === "Subscriptions" && (
            <section className="portal-inner-page">
              <div className="portal-page-title">
                <div>
                  <div className="portal-eyebrow">
                    <span /> SERVICES & PLANS
                  </div>
                  <h1>My subscriptions</h1>
                  <p>View and manage all the services linked to your account.</p>
                </div>
                <button
                  className="portal-secondary-btn"
                  onClick={() => notify("Browse plans will be connected to the product catalogue")}
                >
                  <Sparkles size={15} /> Explore plans
                </button>
              </div>

              <div className="portal-mini-stats">
                <div><small>Total subscriptions</small><strong>{subscriptions.length}</strong></div>
                <div><small>Active</small><strong>{activeSubscriptions}</strong></div>
                <div><small>Paused</small><strong>{subscriptions.length - activeSubscriptions}</strong></div>
              </div>

              <div className="portal-panel">
                <div className="portal-panel-heading">
                  <div>
                    <h2>All subscriptions</h2>
                    <p>Review plan details and renewal dates.</p>
                  </div>
                  <label className="portal-search">
                    <Search size={14} />
                    <input
                      placeholder="Search subscriptions"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </label>
                </div>

                <div className="portal-full-sub-list">
                  {filteredSubscriptions.map((item) => (
                    <div className="portal-full-sub-row" key={item.id}>
                      <span className={`portal-product-icon ${item.tone}`}>
                        {item.icon}
                      </span>
                      <div className="portal-product-info">
                        <strong>{item.product}</strong>
                        <small>{item.plan} · {item.id}</small>
                      </div>
                      <div className="portal-full-sub-meta">
                        <small>RENEWAL DATE</small>
                        <strong>{item.nextDate}</strong>
                      </div>
                      <div className="portal-full-sub-meta">
                        <small>PRICE</small>
                        <strong>{item.price} / {item.cycle}</strong>
                      </div>
                      <span className={`portal-status ${item.status.toLowerCase()}`}>
                        <i />{item.status}
                      </span>
                      <button
                        className="portal-secondary-btn small"
                        onClick={() => togglePause(item.id)}
                      >
                        {item.status === "Active" ? "Pause" : "Resume"}
                      </button>
                    </div>
                  ))}

                  {filteredSubscriptions.length === 0 && (
                    <div className="portal-empty">
                      No subscriptions match your search.
                    </div>
                  )}
                </div>
              </div>

              <div className="portal-info-banner">
                <CircleHelp size={17} />
                <span>
                  <strong>Need to make a change?</strong>
                  <small>
                    Contact our support team if you need help changing or cancelling a subscription.
                  </small>
                </span>
                <button onClick={() => navigate("Help center")}>
                  Get help <ArrowRight size={13} />
                </button>
              </div>
            </section>
          )}

          {activePage === "Invoices" && (
            <section className="portal-inner-page">
              <div className="portal-page-title">
                <div>
                  <div className="portal-eyebrow">
                    <span /> BILLING HISTORY
                  </div>
                  <h1>Invoices & billing</h1>
                  <p>Access your invoices and review your payment history.</p>
                </div>
                <button
                  className="portal-secondary-btn"
                  onClick={() => notify("Invoice export will be connected to the billing API")}
                >
                  <Download size={15} /> Export history
                </button>
              </div>

              <div className="portal-mini-stats">
                <div><small>Total invoices</small><strong>12</strong></div>
                <div><small>Paid this year</small><strong>₹38,964</strong></div>
                <div><small>Pending</small><strong>₹1,499</strong></div>
              </div>

              <div className="portal-panel">
                <div className="portal-panel-heading">
                  <div>
                    <h2>Invoice history</h2>
                    <p>All invoices generated for your account.</p>
                  </div>
                  <label className="portal-search">
                    <Search size={14} />
                    <input placeholder="Search invoice ID" />
                  </label>
                </div>

                <div className="portal-invoice-table-wrap">
                  <table className="portal-invoice-table full">
                    <thead>
                      <tr>
                        <th>INVOICE</th>
                        <th>DATE</th>
                        <th>DESCRIPTION</th>
                        <th>AMOUNT</th>
                        <th>STATUS</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice, index) => (
                        <tr key={invoice.id}>
                          <td><strong>{invoice.id}</strong></td>
                          <td>{invoice.date}</td>
                          <td>
                            {[
                              "Workspace Suite · Monthly plan",
                              "Cloud Storage · Monthly plan",
                              "Design Toolkit · Monthly plan",
                            ][index]}
                          </td>
                          <td className="portal-invoice-amount">
                            {invoice.amount}
                          </td>
                          <td>
                            <span className={`portal-invoice-status ${invoice.status.toLowerCase()}`}>
                              <i />{invoice.status}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() =>
                                notify("Invoice download will be connected to the billing API")
                              }
                            >
                              <Download size={15} /> Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {activePage === "Payment methods" && (
            <section className="portal-inner-page">
              <div className="portal-page-title">
                <div>
                  <div className="portal-eyebrow">
                    <span /> PAYMENT PREFERENCES
                  </div>
                  <h1>Payment methods</h1>
                  <p>Manage the payment methods used for your subscriptions.</p>
                </div>
                <button
                  className="portal-primary-btn"
                  onClick={() => notify("Add payment method form will be connected to the payment provider")}
                >
                  <span>+</span> Add payment method
                </button>
              </div>

              <div className="portal-panel payment-method-card">
                <div className="payment-card-top">
                  <span className="payment-card-chip">
                    <CreditCard size={20} />
                  </span>
                  <span className="payment-default">DEFAULT</span>
                </div>

                <div className="payment-card-number">
                  •••• •••• •••• 4242
                </div>

                <div className="payment-card-bottom">
                  <span>
                    <small>CARDHOLDER</small>
                    <strong>{displayName.toUpperCase()}</strong>
                  </span>
                  <span>
                    <small>EXPIRES</small>
                    <strong>08/28</strong>
                  </span>
                  <b>VISA</b>
                </div>
              </div>

              <div className="portal-info-banner">
                <ShieldCheck size={17} />
                <span>
                  <strong>Your payment information is protected</strong>
                  <small>
                    Payment details are securely handled by your payment provider.
                  </small>
                </span>
              </div>
            </section>
          )}

          {(activePage === "Settings" || activePage === "Help center") && (
            <section className="portal-inner-page">
              <div className="portal-page-title">
                <div>
                  <div className="portal-eyebrow">
                    <span /> ACCOUNT
                  </div>
                  <h1>{activePage}</h1>
                  <p>
                    {activePage === "Settings"
                      ? "Manage your personal information and account preferences."
                      : "Find help with your Subspace account and subscriptions."}
                  </p>
                </div>
              </div>

              {activePage === "Settings" ? (
                <div className="portal-panel settings-card">
                  <div className="settings-avatar">{initials}</div>
                  <div>
                    <h2>{displayName}</h2>
                    <p>{user?.email || "Email not available"}</p>
                    <span className="portal-status active">
                      <i />Account active
                    </span>
                  </div>
                  <button
                    className="portal-secondary-btn"
                    onClick={() => notify("Profile editing will be connected to your account API")}
                  >
                    Edit profile
                  </button>
                </div>
              ) : (
                <div className="portal-panel help-card">
                  <span className="help-card-icon">
                    <CircleHelp size={25} />
                  </span>
                  <h2>How can we help?</h2>
                  <p>
                    Our customer support team can help with subscriptions, invoices and payments.
                  </p>
                  <button
                    className="portal-primary-btn"
                    onClick={() => notify("Support contact will be connected to your support workflow")}
                  >
                    Contact support <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      {notice && (
        <div className="portal-toast">
          <Check size={15} />
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
