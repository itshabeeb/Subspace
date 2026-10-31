import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowDownToLine, Building2, Check, ChevronDown, ChevronLeft, ChevronRight,
  CirclePlus, Download, Mail, MoreHorizontal, Pencil, Phone, Plus, Search,
  SlidersHorizontal, UserRound, Users, X
} from "lucide-react";
import "./Customers.css";

type CustomerStatus = "Active" | "Inactive" | "Lead";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  subscriptions: number;
  totalSpend: number;
  joined: string;
  status: CustomerStatus;
  initials: string;
  color: string;
};

const initialCustomers: Customer[] = [
  { id: "CUS-1024", name: "Arjun Menon", email: "arjun@northstar.io", phone: "+91 98765 43210", company: "Northstar Studio", subscriptions: 3, totalSpend: 74970, joined: "Oct 28, 2026", status: "Active", initials: "AM", color: "violet" },
  { id: "CUS-1023", name: "Meera Nair", email: "meera@pixelworks.in", phone: "+91 98470 12345", company: "Pixelworks", subscriptions: 2, totalSpend: 45998, joined: "Oct 26, 2026", status: "Active", initials: "MN", color: "mint" },
  { id: "CUS-1022", name: "Rahul Varma", email: "rahul@orbitfinance.com", phone: "+91 98950 67890", company: "Orbit Finance", subscriptions: 1, totalSpend: 12499, joined: "Oct 24, 2026", status: "Active", initials: "RV", color: "blue" },
  { id: "CUS-1021", name: "Ananya Krishnan", email: "ananya@monomedia.in", phone: "+91 94470 11223", company: "Mono Media", subscriptions: 0, totalSpend: 0, joined: "Oct 21, 2026", status: "Lead", initials: "AK", color: "peach" },
  { id: "CUS-1020", name: "Devika Thomas", email: "devika@acme.co", phone: "+91 98951 22334", company: "Acme Corporation", subscriptions: 4, totalSpend: 112490, joined: "Oct 18, 2026", status: "Active", initials: "DT", color: "rose" },
  { id: "CUS-1019", name: "Nikhil Das", email: "nikhil@brightlabs.in", phone: "+91 97460 44556", company: "Bright Labs", subscriptions: 0, totalSpend: 8999, joined: "Oct 15, 2026", status: "Inactive", initials: "ND", color: "amber" },
  { id: "CUS-1018", name: "Sara Joseph", email: "sara@cloudnine.app", phone: "+91 95678 33445", company: "Cloudnine", subscriptions: 2, totalSpend: 32998, joined: "Oct 12, 2026", status: "Active", initials: "SJ", color: "cyan" },
  { id: "CUS-1017", name: "Aditya Rao", email: "aditya@vertex.in", phone: "+91 99950 88776", company: "Vertex Technologies", subscriptions: 1, totalSpend: 24999, joined: "Oct 08, 2026", status: "Active", initials: "AR", color: "indigo" },
];

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

const emptyForm = { name: "", email: "", phone: "", company: "" };

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All customers");
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState("");

  const filtered = useMemo(() => customers.filter((customer) => {
    const matchesQuery = `${customer.name} ${customer.email} ${customer.company} ${customer.id}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "All customers" || customer.status === statusFilter;
    return matchesQuery && matchesStatus;
  }), [customers, query, statusFilter]);

  const activeCount = customers.filter((customer) => customer.status === "Active").length;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpend, 0);

  const addCustomer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name || !email) return;
    const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
    const newCustomer: Customer = {
      ...form,
      id: `CUS-${1025 + customers.length - initialCustomers.length}`,
      name,
      email,
      phone: form.phone.trim() || "—",
      company: form.company.trim() || "Individual",
      subscriptions: 0,
      totalSpend: 0,
      joined: "Oct 31, 2026",
      status: "Lead",
      initials,
      color: "violet",
    };
    setCustomers((current) => [newCustomer, ...current]);
    setForm(emptyForm);
    setShowAdd(false);
    setNotice("Customer added successfully");
    window.setTimeout(() => setNotice(""), 2600);
  };

  const updateField = (field: keyof typeof emptyForm, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  return (
    <div className="customers-page">
      <div className="customers-heading">
        <div>
          <div className="customers-eyebrow"><span /> CUSTOMER DIRECTORY</div>
          <h1>Customers</h1>
          <p>Manage your customer relationships and keep their details in one place.</p>
        </div>
        <div className="customers-heading-actions">
          <button className="customer-secondary-btn" type="button" onClick={() => setNotice("Export is a demo action. Connect your export API to enable downloads.")}>
            <ArrowDownToLine size={15} /> Export
          </button>
          <button className="customer-primary-btn" type="button" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> Add customer
          </button>
        </div>
      </div>

      <div className="customer-stat-grid">
        <article className="customer-stat-card">
          <div className="customer-stat-top"><span>Total customers</span><i className="stat-purple"><Users size={17} /></i></div>
          <strong>{customers.length.toLocaleString("en-IN")}</strong>
          <small><span className="stat-trend">+12.5%</span> from last month</small>
        </article>
        <article className="customer-stat-card">
          <div className="customer-stat-top"><span>Active customers</span><i className="stat-green"><Check size={17} /></i></div>
          <strong>{activeCount.toLocaleString("en-IN")}</strong>
          <small><span className="stat-trend">+8.2%</span> from last month</small>
        </article>
        <article className="customer-stat-card">
          <div className="customer-stat-top"><span>New this month</span><i className="stat-blue"><UserRound size={17} /></i></div>
          <strong>86</strong>
          <small><span className="stat-trend">+16.4%</span> from last month</small>
        </article>
        <article className="customer-stat-card">
          <div className="customer-stat-top"><span>Customer lifetime value</span><i className="stat-amber"><Building2 size={17} /></i></div>
          <strong>{formatINR(totalRevenue)}</strong>
          <small>Across all customer accounts</small>
        </article>
      </div>

      <section className="customer-table-panel">
        <div className="customer-table-toolbar">
          <div><h2>All customers <span>{filtered.length}</span></h2><p>A list of everyone in your customer directory.</p></div>
          <div className="customer-toolbar-actions">
            <label className="customer-search"><Search size={15} /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search customers..." /><kbd>⌘ K</kbd></label>
            <label className="customer-filter"><SlidersHorizontal size={14} /><select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}><option>All customers</option><option>Active</option><option>Inactive</option><option>Lead</option></select><ChevronDown size={13} /></label>
          </div>
        </div>

        <div className="customer-table-scroll">
          <table className="customer-table">
            <thead><tr><th><input aria-label="Select all customers" type="checkbox" /></th><th>CUSTOMER</th><th>CUSTOMER ID</th><th>SUBSCRIPTIONS</th><th>TOTAL SPEND</th><th>JOINED DATE</th><th>STATUS</th><th /></tr></thead>
            <tbody>
              {filtered.slice((page - 1) * 8, page * 8).map((customer) => (
                <tr key={customer.id}>
                  <td><input aria-label={`Select ${customer.name}`} type="checkbox" /></td>
                  <td><div className="customer-person-cell"><span className={`customer-person-avatar ${customer.color}`}>{customer.initials}</span><span><strong>{customer.name}</strong><small>{customer.email}</small></span></div></td>
                  <td className="customer-id">{customer.id}</td>
                  <td><span className="subscription-count">{customer.subscriptions}</span></td>
                  <td className="customer-spend">{formatINR(customer.totalSpend)}</td>
                  <td className="customer-joined">{customer.joined}</td>
                  <td><span className={`customer-status ${customer.status.toLowerCase()}`}><i />{customer.status}</span></td>
                  <td><button className="customer-row-menu" aria-label={`View ${customer.name}`} type="button" onClick={() => setSelected(customer)}><MoreHorizontal size={18} /></button></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="customer-empty">No customers found. Try another search or add a new customer.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="customer-table-footer">
          <span>Showing <strong>{filtered.length ? (page - 1) * 8 + 1 : 0}–{Math.min(page * 8, filtered.length)}</strong> of <strong>{filtered.length}</strong> customers</span>
          <div className="customer-pagination">
            <button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}><ChevronLeft size={15} /></button>
            <span>Page {page} of {Math.max(1, Math.ceil(filtered.length / 8))}</span>
            <button type="button" aria-label="Next page" disabled={page >= Math.ceil(filtered.length / 8)} onClick={() => setPage((p) => p + 1)}><ChevronRight size={15} /></button>
          </div>
        </div>
      </section>

      <div className="customers-bottom-note"><span><i /> Customer data is up to date</span><span>Last synced just now</span></div>

      {notice && <div className="customer-toast"><Check size={15} />{notice}<button type="button" onClick={() => setNotice("")}><X size={14} /></button></div>}

      {showAdd && (
        <div className="customer-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowAdd(false); }}>
          <section className="customer-modal" role="dialog" aria-modal="true" aria-labelledby="add-customer-title">
            <div className="customer-modal-heading"><div><span className="modal-icon"><CirclePlus size={18} /></span><div><h2 id="add-customer-title">Add customer</h2><p>Create a new customer profile in your directory.</p></div></div><button type="button" aria-label="Close" onClick={() => setShowAdd(false)}><X size={18} /></button></div>
            <form onSubmit={addCustomer}>
              <label>Full name <b>*</b><input required autoFocus value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="e.g. Alex Johnson" /></label>
              <label>Email address <b>*</b><input required type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="alex@company.com" /></label>
              <label>Phone number<input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="+91 98765 43210" /></label>
              <label>Company name<input value={form.company} onChange={(event) => updateField("company", event.target.value)} placeholder="Company or organization" /></label>
              <div className="customer-modal-actions"><button className="customer-secondary-btn" type="button" onClick={() => setShowAdd(false)}>Cancel</button><button className="customer-primary-btn" type="submit"><Plus size={15} /> Create customer</button></div>
            </form>
          </section>
        </div>
      )}

      {selected && (
        <div className="customer-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <section className="customer-detail-drawer" role="dialog" aria-modal="true" aria-labelledby="customer-detail-title">
            <div className="drawer-top"><span> CUSTOMER PROFILE</span><button type="button" aria-label="Close" onClick={() => setSelected(null)}><X size={18} /></button></div>
            <div className="drawer-profile"><span className={`customer-person-avatar large ${selected.color}`}>{selected.initials}</span><h2 id="customer-detail-title">{selected.name}</h2><p>{selected.company}</p><span className={`customer-status ${selected.status.toLowerCase()}`}><i />{selected.status}</span></div>
            <div className="drawer-actions"><button type="button" onClick={() => setNotice("Edit customer form is the next step to implement.")}><Pencil size={14} /> Edit</button><button type="button" onClick={() => setNotice("Email action will be enabled when connected to your service.")}><Mail size={14} /> Email</button></div>
            <div className="drawer-section"><h3>Contact information</h3><div><Mail size={15} /><span><small>Email address</small>{selected.email}</span></div><div><Phone size={15} /><span><small>Phone number</small>{selected.phone}</span></div><div><Building2 size={15} /><span><small>Company</small>{selected.company}</span></div></div>
            <div className="drawer-section"><h3>Customer overview</h3><div><Users size={15} /><span><small>Subscriptions</small>{selected.subscriptions} active / total subscriptions</span></div><div><Download size={15} /><span><small>Total spend</small>{formatINR(selected.totalSpend)}</span></div><div><UserRound size={15} /><span><small>Customer since</small>{selected.joined}</span></div></div>
            <button className="drawer-close-btn" type="button" onClick={() => setSelected(null)}>Close profile</button>
          </section>
        </div>
      )}
    </div>
  );
}
