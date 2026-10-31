import api from "./api";

// ---------------- SUBSCRIPTIONS ----------------

// GET ALL SUBSCRIPTIONS
export const getSubscriptions = async () => {
  const response = await api.get("subscriptions/");
  return response.data;
};

// GET ONE SUBSCRIPTION
export const getSubscriptionById = async (id: number) => {
  const response = await api.get(`subscriptions/${id}/`);
  return response.data;
};

// CREATE SUBSCRIPTION
export const createSubscription = async (data: object) => {
  const response = await api.post("subscriptions/", data);
  return response.data;
};

// UPDATE SUBSCRIPTION
export const updateSubscription = async (
  id: number,
  data: object
) => {
  const response = await api.patch(
    `subscriptions/${id}/`,
    data
  );

  return response.data;
};

// DELETE SUBSCRIPTION
export const deleteSubscription = async (id: number) => {
  const response = await api.delete(`subscriptions/${id}/`);
  return response.data;
};


// ---------------- INVOICES ----------------

// GET ALL INVOICES
export const getInvoices = async () => {
  const response = await api.get("invoices/");
  return response.data;
};

// GET ONE INVOICE
export const getInvoiceById = async (id: number) => {
  const response = await api.get(`invoices/${id}/`);
  return response.data;
};

// CREATE INVOICE
export const createInvoice = async (data: object) => {
  const response = await api.post("invoices/", data);
  return response.data;
};


// ---------------- PAYMENTS ----------------

// GET ALL PAYMENTS
export const getPayments = async () => {
  const response = await api.get("payments/");
  return response.data;
};

// PROCESS PAYMENT FOR AN INVOICE
export const processPayment = async (
  invoiceId: number,
  amount: number,
  payment_method: string,
  notes: string = ""
) => {
  const response = await api.post(
    `invoices/${invoiceId}/pay/`,
    {
      amount,
      payment_method,
      notes,
    }
  );

  return response.data;
};


// ---------------- DISCOUNTS ----------------

// GET ALL DISCOUNTS
export const getDiscounts = async () => {
  const response = await api.get("discounts/");
  return response.data;
};

// CREATE DISCOUNT
export const createDiscount = async (data: object) => {
  const response = await api.post("discounts/", data);
  return response.data;
};

// UPDATE DISCOUNT
export const updateDiscount = async (
  id: number,
  data: object
) => {
  const response = await api.patch(
    `discounts/${id}/`,
    data
  );

  return response.data;
};

// DELETE DISCOUNT
export const deleteDiscount = async (id: number) => {
  const response = await api.delete(`discounts/${id}/`);
  return response.data;
};


// ---------------- BATCH BILLING ----------------

export const runBatchBilling = async () => {
  const response = await api.post("billing/run-batch/");
  return response.data;
};