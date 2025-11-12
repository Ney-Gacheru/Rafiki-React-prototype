import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * AuthContext
 * - loads initial users from /data/users.json (public folder)
 * - uses localStorage for persistence (users + currentUser)
 * - login / signup / logout
 * - getDefaultArea(user) -> "market" | "lms"
 *
 * NOTES:
 * - Place a users.json file in public/data/users.json (sample below)
 * - Vendor signups are created with approved: false (admin must set approved: true)
 */

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const USERS_LS_KEY = "rafiki_users_v1";
const CURRENT_USER_KEY = "rafiki_current_user";

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    try {
      const raw = localStorage.getItem(USERS_LS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(!users);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CURRENT_USER_KEY)) || null;
    } catch {
      return null;
    }
  });

  // load seed users from public/data/users.json if not in localStorage
  useEffect(() => {
    if (users) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const resp = await fetch("/data/users.json", { cache: "no-store" });
        if (!resp.ok) throw new Error("no seed users");
        const seed = await resp.json();
        setUsers(seed);
        localStorage.setItem(USERS_LS_KEY, JSON.stringify(seed));
      } catch (err) {
        // fallback: create a minimal admin user if fetch fails
        const fallback = [
          { id: "u_admin", name: "Admin", email: "admin@rafiki.local", password: "admin", role: "admin", approved: true }
        ];
        setUsers(fallback);
        localStorage.setItem(USERS_LS_KEY, JSON.stringify(fallback));
      } finally {
        setLoading(false);
      }
    })();
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    } catch {}
  }, [currentUser]);

  // persist users when they change
  useEffect(() => {
    if (users) {
      try { localStorage.setItem(USERS_LS_KEY, JSON.stringify(users)); } catch {}
    }
  }, [users]);

  function findUserByEmail(email) {
    return (users || []).find(u => u.email?.toLowerCase() === (email || "").toLowerCase());
  }

  async function login({ email, password }) {
    if (loading) throw new Error("Auth not initialized yet");
    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
      throw new Error("Invalid credentials");
    }
    // If vendor is not approved, we still allow login but mark as notApproved flag (app can restrict actions)
    setCurrentUser(user);
    return user;
  }

  async function signup({ name, email, password, wantToSell = false }) {
    if (loading) throw new Error("Auth not initialized yet");
    if (!email || !password || !name) throw new Error("Missing fields");
    const exists = findUserByEmail(email);
    if (exists) throw new Error("Email already in use");

    const newUser = {
      id: "u_" + Date.now(),
      name,
      email,
      password,
      role: wantToSell ? "vendor" : "customer", // default signups go to market as customer/buyer
      // vendors must be vetted
      approved: wantToSell ? false : true,
      createdAt: new Date().toISOString()
    };

    const updated = [newUser, ...(users || [])];
    setUsers(updated);
    setCurrentUser(newUser);
    return newUser;
  }

  function logout() {
    setCurrentUser(null);
    try { localStorage.removeItem(CURRENT_USER_KEY); } catch {}
  }

  function updateUser(updatedUser) {
    const list = (users || []).map(u => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(list);
    if (currentUser && currentUser.id === updatedUser.id) setCurrentUser(updatedUser);
  }

  function getDefaultArea(user) {
    if (!user) return "market";
    const marketRoles = ["vendor", "customer", "buyer"];
    const lmsRoles = ["student", "educator", "school"];
    if (marketRoles.includes(user.role)) return "market";
    if (lmsRoles.includes(user.role)) return "lms";
    return "market";
  }

  return (
    <AuthContext.Provider value={{
      users,
      loading,
      currentUser,
      login,
      signup,
      logout,
      updateUser,
      getDefaultArea,
      setUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
}