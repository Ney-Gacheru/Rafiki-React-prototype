// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const USERS_LS_KEY = "rafiki_users_v1";
const CURRENT_USER_KEY = "rafiki_current_user";

// Helper to generate avatar placeholder
const getAvatarUrl = (name) => {
  const firstLetter = name ? name.charAt(0).toUpperCase() : "R";
  const colors = ["8e44ad", "3498db", "2ecc71", "e67e22", "e74c3c"];
  const color = colors[firstLetter.charCodeAt(0) % colors.length];
  return `https://placehold.co/100x100/${color}/fff?text=${firstLetter}`;
};

// Helper to "enrich" user data on load
const enrichUser = (user) => {
  let verification = "none";
  if (user.role === "vendor" || user.role === "educator") {
    verification = user.approved ? "vetted" : "pending";
  } else if (user.role === "school") {
    verification = user.approved ? "verified_org" : "pending";
  } else if (user.role === "student") {
    verification = "student";
  }

  return {
    ...user,
    userId: user.id, // Standardize on userId
    userAvatar: getAvatarUrl(user.name), // Auto-generate avatar
    verification: verification,
  };
};


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
        
        // Enrich the seed data
        const enrichedSeed = seed.map(enrichUser);

        setUsers(enrichedSeed);
        localStorage.setItem(USERS_LS_KEY, JSON.stringify(enrichedSeed));
      } catch (err) {
        // fallback: create a minimal admin user if fetch fails
        const fallback = [
          enrichUser({ id: "u_admin", name: "Admin", email: "admin@rafiki.local", password: "admin", role: "admin", approved: true })
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
    setCurrentUser(user);
    return user;
  }

  async function signup({ name, email, password, wantToSell = false }) {
    if (loading) throw new Error("Auth not initialized yet");
    if (!email || !password || !name) throw new Error("Missing fields");
    const exists = findUserByEmail(email);
    if (exists) throw new Error("Email already in use");

    const newUser = enrichUser({
      id: "u_" + Date.now(),
      name,
      email,
      password,
      role: wantToSell ? "vendor" : "customer",
      approved: wantToSell ? false : true,
      createdAt: new Date().toISOString()
    });

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

  // All users now land on /market for a unified experience
  function getDefaultArea(user) {
    if (!user) return "market";
    if (user.role === "admin") return "admin";
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
      setUsers // Used by DataContext to approve vendors
    }}>
      {children}
    </AuthContext.Provider>
  );
}