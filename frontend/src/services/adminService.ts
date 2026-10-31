import api from "./api";

// ---------------- CUSTOMERS ----------------

// GET ALL CUSTOMERS
export const getCustomers = async () => {
  const response = await api.get("customers/");
  return response.data;
};


// ---------------- STAFF ----------------

// CREATE STAFF MEMBER
export const createStaff = async (data: {
  username: string;
  email: string;
  password: string;
  role: "STAFF" | "ADMIN";
}) => {
  const response = await api.post(
    "admin/create-staff/",
    data
  );

  return response.data;
};


// ---------------- DASHBOARD REPORTS ----------------

// GET DASHBOARD STATISTICS
export const getReportStats = async () => {
  const response = await api.get("reports/stats/");
  return response.data;
};