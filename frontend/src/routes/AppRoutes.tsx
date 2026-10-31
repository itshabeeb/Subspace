
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Customers from "../pages/admin/Customers";
import CustomerPortal from "../pages/customer/CustomerPortal";
import ForgotPassword from "../pages/auth/ForgotPassword";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />}/>
        <Route path="/admin/customers" element={<Customers />}/>
        <Route path="/customer/dashboard" element={<CustomerPortal />}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
