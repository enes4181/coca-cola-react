import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import SignIn from "./components/sign-in/sign-in";
import SignUp from "./components/sign-up/sign-up";
import Admin from "./pages/admin-page";
import Home from "./pages/home-page";
import ProductDetail from "./pages/product-detail";
import useAuthStore from "./store/user";
import ProtectedRoute from "./router/protected-route";
import Unauthorized from "./pages/unauthorized";

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loadUserFromSessionStorage = useAuthStore(
    (state) => state.loadUserFromSessionStorage
  );
  const isLoading = useAuthStore((state) => state.isLoading);

  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    loadUserFromSessionStorage();
  }, [loadUserFromSessionStorage]);

  if (isLoading) {
    return;
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              roles={["admin"]}
              userRole={user?.role}
            >
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:productId"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProductDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
};

export default App;
