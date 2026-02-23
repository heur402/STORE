import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./page/MainPage";
import Dashboard from "./page/Dashboard";
import Products from "./page/Products";
import Debtors from "./page/Debtors";
import ActiveDebts from "./page/ActiveDebts";
import LoginPage from "./page/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Orders from "./page/Orders";
import AllProduct from "./components/AllProduct";

function App() {
  return (
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
          <Route path="allproducts" element={<AllProduct />} />
          <Route path="debtors" element={<Debtors />} />
          <Route path="debts/active" element={<ActiveDebts />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;