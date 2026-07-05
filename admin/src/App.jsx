import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./page/MainPage";
import Dashboard from "./page/Dashboard";
import Products from "./page/Products";
import Debtors from "./page/Debtors";
import ActiveDebts from "./page/ActiveDebts";
import LoginPage from "./page/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Orders from "./page/Orders";
import AddOrderPage from "./page/AddOrderPage";
import AllProduct from "./components/AllProduct";
import Setting from "./page/Setting";
import Clients from "./page/Clients";
import NotFound from "./page/NotFound";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="allproduct" element={<AllProduct />} />
          <Route path="settings" element={<Setting />} />
          <Route path="debtors" element={<Debtors />} />
          <Route path="debts/active" element={<ActiveDebts />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/add" element={<AddOrderPage />} />
          <Route path="client" element={<Clients />} />
        </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;