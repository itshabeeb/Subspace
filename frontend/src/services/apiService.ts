
import api from "./api";

// AUTHENTICATION
export const registerUser = (data: {
  username: string;
  email: string;
  password: string;
}) => api.post("auth/register/", data);

export const loginUser = (data: {
  email: string;
  password: string;
}) => api.post("auth/login/", data);

// PRODUCTS
export const getProducts = () => api.get("products/");

// PLANS
export const getPlans = () => api.get("plans/");

// SUBSCRIPTIONS
export const getSubscriptions = () => api.get("subscriptions/");

// INVOICES
export const getInvoices = () => api.get("invoices/");

// PAYMENTS
export const getPayments = () => api.get("payments/");

// DISCOUNTS
export const getDiscounts = () => api.get("discounts/");

// CUSTOMER MANAGEMENT
export const getCustomers = () => api.get("customers/");

// ADMIN
export const createStaff = (data: {
  username: string;
  email: string;
  password: string;
}) => api.post("admin/create-staff/", data);

// REPORTS
export const getReportStats = () => api.get("reports/stats/");

// BILLING
export const runBatchBilling = () => api.post("billing/run-batch/");

export const processPayment = (invoiceId: number, data?: object) =>
  api.post(`invoices/${invoiceId}/pay/`, data || {});
