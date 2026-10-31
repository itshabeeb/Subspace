import { useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, CalendarDays,
  Check, ChevronDown, CreditCard, Download, FileText, LayoutDashboard,
  MoreHorizontal, Package, Plus, Search, Settings, ShieldCheck, Sparkles,
  Users, Wallet, Zap, CircleHelp
} from "lucide-react";
import "./AdminDashboard.css";

const subscriptions = [
  { initials: "AC", name: "Acme Corporation", email: "billing@acme.co", plan: "Business Pro", amount: "₹12,499", status: "Active", date: "Oct 31, 2026", tone: "lavender" },
  { initials: "NS", name: "Northstar Studio", email: "accounts@northstar.io", plan: "Starter", amount: "₹2,499", status: "Active", date: "Oct 30, 2026", tone: "mint" },
  { initials: "PL", name: "Pixel Labs", email: "finance@pixellabs.in", plan: "Growth", amount: "₹7,999", status: "Pending", date: "Oct 30, 2026", tone: "peach" },
  { initials: "OF", name: "Orbit Finance", email: "ops@orbitfinance.com", plan: "Business Pro", amount: "₹12,499", status: "Active", date: "Oct 29, 2026", tone: "blue" },
  { initials: "MM", name: "Mono Media", email: "hello@monomedia.in", plan: "Starter", amount: "₹2,499", status: "Cancelled", date: "Oct 28, 2026", tone: "rose" },
];
const bars = [{m:"May",v:42},{m:"Jun",v:56},{m:"Jul",v:48},{m:"Aug",v:72},{m:"Sep",v:64},{m:"Oct",v:91}];

export default function AdminDashboard() {
  const [active, setActive] = useState("Overview");
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("Last 6 months");
  const filtered = useMemo(() => subscriptions.filter(s =>
    `${s.name} ${s.email} ${s.plan}`.toLowerCase().includes(search.toLowerCase())
  ), [search]);

  const nav = (label: string, Icon: typeof LayoutDashboard, badge?: string) => (
    <button type="button" key={label} onClick={() => setActive(label)} className={`admin-nav-item ${active === label ? "active" : ""}`}>
      <Icon size={18}/><span>{label}</span>{badge && <small>{badge}</small>}
    </button>
  );

  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <a className="admin-brand" href="/admin/dashboard"><span className="admin-brand-icon"><Zap size={20} fill="currentColor"/></span><span>subspace<span className="brand-dot">.</span><small>ADMIN CONSOLE</small></span></a>
      <div className="workspace-switcher"><div className="workspace-avatar">S</div><div className="workspace-copy"><strong>Subspace Inc.</strong><span>Workspace</span></div><ChevronDown size={15}/></div>
      <div className="admin-nav-label">WORKSPACE</div>
      <nav className="admin-nav">{nav("Overview",LayoutDashboard)}{nav("Subscriptions",Activity,"128")}{nav("Customers",Users)}{nav("Products & plans",Package)}</nav>
      <div className="admin-nav-label billing-label">BILLING</div>
      <nav className="admin-nav">{nav("Invoices",FileText)}{nav("Payments",CreditCard)}{nav("Discounts",Sparkles)}</nav>
      <div className="sidebar-spacer"/>
      <div className="sidebar-help"><span className="help-icon"><CircleHelp size={17}/></span><strong>Need a hand?</strong><p>Visit our help center to get the most out of Subspace.</p><button onClick={()=>setActive("Help center")} type="button">Visit help center <ArrowRight size={13}/></button></div>
      {nav("Settings",Settings)}
      <div className="sidebar-user"><div className="user-avatar">GK</div><div className="sidebar-user-copy"><strong>Admin User</strong><span>Administrator</span></div><MoreHorizontal size={18}/></div>
    </aside>

    <main className="admin-main">
      <header className="admin-topbar">
        <div className="breadcrumb"><span>Workspace</span><i>/</i><strong>{active}</strong></div>
        <div className="topbar-actions">
          <label className="global-search"><Search size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search customers..."/><kbd>⌘ K</kbd></label>
          <button className="icon-action" aria-label="Notifications" type="button"><Bell size={18}/><i/></button>
          <div className="topbar-divider"/>
          <div className="profile-menu"><span className="user-avatar small-avatar">GK</span><span><strong>Goutham</strong><small>Admin</small></span><ChevronDown size={14}/></div>
        </div>
      </header>

      <div className="admin-content">
        <section className="welcome-row">
          <div><div className="welcome-eyebrow"><i/> YOUR BUSINESS AT A GLANCE</div><h1>Good morning, Goutham <span>✦</span></h1><p>Here’s what’s happening with your subscriptions today.</p></div>
          <div className="welcome-actions"><button className="outline-button"><CalendarDays size={15}/> October 2026 <ChevronDown size={13}/></button><button className="primary-button" onClick={()=>setActive("Create subscription")}><Plus size={16}/> New subscription</button></div>
        </section>

        <section className="metric-grid">
          <article className="metric-card"><div className="metric-top"><span>Total revenue</span><i className="metric-icon violet"><Wallet size={17}/></i></div><strong className="metric-value">₹8,42,650</strong><div className="metric-bottom"><b className="positive"><ArrowUpRight size={13}/> 12.8%</b><span>vs. last month</span><small>THIS MONTH</small></div><div className="spark violet-line"><svg viewBox="0 0 120 34"><path d="M0 28 C12 26 14 19 25 22 S40 27 50 16 S67 20 76 12 S94 17 104 7 S114 8 120 2"/></svg></div></article>
          <article className="metric-card"><div className="metric-top"><span>Active subscriptions</span><i className="metric-icon blue"><Activity size={17}/></i></div><strong className="metric-value">1,284</strong><div className="metric-bottom"><b className="positive"><ArrowUpRight size={13}/> 8.2%</b><span>vs. last month</span><small>ALL TIME</small></div><div className="spark blue-line"><svg viewBox="0 0 120 34"><path d="M0 25 C10 24 17 16 28 20 S42 11 53 17 S67 10 78 13 S93 5 104 8 S114 4 120 1"/></svg></div></article>
          <article className="metric-card"><div className="metric-top"><span>Payments received</span><i className="metric-icon green"><Check size={17}/></i></div><strong className="metric-value">₹7,96,200</strong><div className="metric-bottom"><b className="positive"><ArrowUpRight size={13}/> 10.4%</b><span>vs. last month</span><small>THIS MONTH</small></div><div className="spark green-line"><svg viewBox="0 0 120 34"><path d="M0 29 C13 23 17 26 28 18 S42 22 52 14 S66 17 77 9 S93 15 103 5 S113 6 120 2"/></svg></div></article>
          <article className="metric-card"><div className="metric-top"><span>Overdue invoices</span><i className="metric-icon amber"><FileText size={17}/></i></div><strong className="metric-value">₹46,450</strong><div className="metric-bottom"><b className="negative"><ArrowDownRight size={13}/> 2.4%</b><span>vs. last month</span><small>12 INVOICES</small></div><div className="spark amber-line"><svg viewBox="0 0 120 34"><path d="M0 6 C12 8 18 15 28 11 S42 20 52 16 S66 24 77 17 S91 23 103 26 S113 24 120 31"/></svg></div></article>
        </section>

        <section className="dashboard-middle">
          <article className="panel revenue-panel">
            <div className="panel-heading"><div><h2>Revenue overview</h2><p>Track how your business is performing</p></div><button className="select-button" onClick={()=>setPeriod(period==="Last 6 months"?"Last 12 months":"Last 6 months")}>{period}<ChevronDown size={13}/></button></div>
            <div className="revenue-summary"><strong>₹8,42,650</strong><b className="positive"><ArrowUpRight size={13}/> 12.8%</b><small>compared to previous period</small></div>
            <div className="chart-wrap"><div className="chart-y-labels"><span>₹10L</span><span>₹7.5L</span><span>₹5L</span><span>₹2.5L</span><span>₹0</span></div><div className="bar-chart"><div className="chart-gridlines"><i/><i/><i/><i/><i/></div><div className="bars">{bars.map(b=><div className="bar-column" key={b.m}><div className="bar-track"><div className={`bar-fill ${b.m==="Oct"?"highlight":""}`} style={{height:`${b.v}%`}}/></div><span>{b.m}</span></div>)}</div></div></div>
            <div className="chart-legend"><span><i className="legend-dot revenue-dot"/> Revenue collected</span><span><i className="legend-dot target-dot"/> Previous period</span></div>
          </article>
          <article className="panel collection-panel">
            <div className="panel-heading"><div><h2>Collection status</h2><p>Invoice payment breakdown</p></div><MoreHorizontal size={19}/></div>
            <div className="donut-wrap"><div className="donut-chart"><div className="donut-center"><strong>86.4%</strong><span>Collected</span></div></div></div>
            <div className="collection-legend">
              <div><span><i className="legend-dot paid-dot"/> Paid</span><strong>₹7,96,200</strong><small>86.4%</small></div>
              <div><span><i className="legend-dot pending-dot"/> Pending</span><strong>₹78,300</strong><small>8.5%</small></div>
              <div><span><i className="legend-dot overdue-dot"/> Overdue</span><strong>₹46,450</strong><small>5.1%</small></div>
            </div>
          </article>
        </section>

        <section className="panel subscriptions-panel">
          <div className="panel-heading table-heading"><div><h2>Recent subscriptions</h2><p>A quick look at your latest customer activity</p></div><div className="table-actions"><button className="outline-button compact"><Download size={14}/> Export</button><button className="text-button" onClick={()=>setActive("Subscriptions")}>View all <ArrowRight size={14}/></button></div></div>
          <div className="table-scroll"><table className="subscriptions-table"><thead><tr><th>CUSTOMER</th><th>PLAN</th><th>AMOUNT</th><th>STATUS</th><th>START DATE</th><th/></tr></thead><tbody>
            {filtered.map(s=><tr key={s.email}><td><div className="customer-cell"><i className={`customer-avatar ${s.tone}`}>{s.initials}</i><span><strong>{s.name}</strong><small>{s.email}</small></span></div></td><td>{s.plan}</td><td><strong className="amount-cell">{s.amount}</strong><small className="billing-cycle">/ month</small></td><td><span className={`status-pill ${s.status.toLowerCase()}`}><i/>{s.status}</span></td><td className="date-cell">{s.date}</td><td><MoreHorizontal size={17}/></td></tr>)}
            {filtered.length===0&&<tr><td className="empty-row" colSpan={6}>No subscriptions match your search.</td></tr>}
          </tbody></table></div>
          <div className="table-footer"><span>Showing <strong>{filtered.length}</strong> of 1,284 subscriptions</span><button onClick={()=>setActive("Subscriptions")}>See all subscriptions <ArrowRight size={13}/></button></div>
        </section>
        <footer className="admin-footer"><span>© 2026 Subspace. All rights reserved.</span><span><ShieldCheck size={14}/> All systems operational <i/></span></footer>
      </div>
    </main>
  </div>;
}
