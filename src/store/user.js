import { create } from "zustand";

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  userToken: "",
  isLoading: true,
  user: {
    _id: "",
    name: "",
    lastname: "",
    email: "",
    role: "",
  },
  setIsAuthenticated: (authStatus) => set({ isAuthenticated: authStatus }),
  setUser: (userData) => {
    set({ user: userData });
    sessionStorage.setItem("user", JSON.stringify(userData));
  },
  setUserToken: (token) => {
    set({ userToken: token });
    sessionStorage.setItem("userToken", token);
  },
  clearUser: () => {
    set({
      isAuthenticated: false,
      userToken: "",
      user: {
        _id: "",
        name: "",
        lastname: "",
        email: "",
        role: "",
      },
    });
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userToken");
  },
  loadUserFromSessionStorage: () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const userToken = sessionStorage.getItem("userToken");

      console.log("store user", user);
      console.log("store userToken", userToken);

      if (user && userToken) {
        set({ isAuthenticated: true, user, userToken, isLoading: false });
      } else {
        // Kullanıcı yoksa bile isLoading false olmalı
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Error loading user from sessionStorage:", error);
      // Hata durumunda isLoading'i false yapın
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
