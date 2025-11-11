// src/context/DataContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const RAFIKI_KEY = "rafikiData_v1";
const USER_KEY = "currentUser";

const DataContext = createContext(null);

export function useData() {
  return useContext(DataContext);
}

const DEMO_POSTS = [
  {
    id: "p1",
    user: "Jane Vendor",
    role: "vendor",
    type: "sell",
    text: "New Crocs in stock! 🐊 Light, durable and comfy.",
    price: "KSh 1200",
    images: ["/images/small-crock.jpg"],
    likes: 12,
    comments: 4,
    shares: 3,
    createdAt: "2025-10-20T09:00:00Z"
  },
  {
    id: "p2",
    user: "Peter Buyer",
    role: "customer",
    type: "request",
    text: "Looking for size 41 slides, budget KSh 600.",
    likes: 3,
    comments: 1,
    shares: 0,
    createdAt: "2025-10-19T09:00:00Z"
  },
  {
    id: "p3",
    user: "Lyn Student",
    role: "student",
    type: "general",
    text: "Just coded my first responsive portfolio site 🎉 #NextGenDev",
    images: ["/images/portfolio.jpeg"],
    likes: 10,
    comments: 1,
    shares: 0,
    createdAt: "2025-10-17T09:00:00Z"
  },
  {
    id: "p4",
    user: "Brian Vendor",
    role: "vendor",
    type: "sell",
    text: "Selling a clean 2015 Mazda Demio 🚗 — automatic, 1300cc, well maintained. Ready to drive!",
    price: "KSh 890,000",
    images: ["/images/car.jpg"],
    likes: 19,
    comments: 6,
    shares: 3,
    createdAt: "2025-10-16T09:00:00Z"
  }
];

function nowISO() {
  return new Date().toISOString();
}

export function DataProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(RAFIKI_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore
    }
    return {
      users: [],
      posts: DEMO_POSTS.slice(),
      messages: [],
      notifications: [],
      follows: {}, // { username: ["follower1","follower2", ...] }
    };
  });

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || "null");
    } catch {
      return null;
    }
  });

  // persist data
  useEffect(() => {
    try {
      localStorage.setItem(RAFIKI_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Failed persisting rafiki data", e);
    }
  }, [data]);

  // persist currentUser
  useEffect(() => {
    if (currentUser) localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    else localStorage.removeItem(USER_KEY);
  }, [currentUser]);

  // load users.json if present
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/data/users.json", { cache: "no-store" });
        if (!res.ok) throw new Error("users not found");
        const fileUsers = await res.json();
        if (!mounted) return;
        setData((prev) => {
          const emails = new Set(prev.users.map(u => u.email));
          const merged = [...prev.users];
          fileUsers.forEach((u) => {
            if (!emails.has(u.email)) merged.push(u);
          });
          return { ...prev, users: merged.length ? merged : fileUsers };
        });
      } catch (err) {
        console.info("users.json not loaded (ok if not present):", err.message);
      } finally {
        if (mounted) setLoadingUsers(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // id generator
  const makeId = (prefix = "p") => `${prefix}${Date.now()}`;

  /* ----------------- AUTH-LIKE HELPERS ----------------- */
  const login = async ({ email, password }) => {
    if (loadingUsers) {
      await new Promise(r => setTimeout(r, 80));
    }
    const user = (data.users || []).find(u => u.email === (email || "").trim() && u.password === (password || ""));
    if (!user) {
      const err = new Error("Invalid credentials");
      err.code = "INVALID_CREDENTIALS";
      throw err;
    }
    setCurrentUser(user);
    return user;
  };

  const signup = async ({ name, email, password, wantToSell = false }) => {
    if (!name || !email || !password) {
      const err = new Error("Fill all fields");
      throw err;
    }
    const exists = (data.users || []).find(u => u.email === email.trim());
    if (exists) {
      const err = new Error("Email already used");
      throw err;
    }
    const id = `u${(data.users.length || 0) + 1}_${Date.now()}`;
    const role = wantToSell ? "vendor" : "customer";
    const user = {
      id,
      name: name.trim(),
      email: email.trim(),
      password,
      role,
      approved: wantToSell ? false : true,
      createdAt: nowISO()
    };
    setData(prev => ({ ...prev, users: [user, ...prev.users] }));
    setCurrentUser(user);
    return user;
  };

  const getDefaultArea = (user = currentUser) => {
    if (!user) return "market";
    const marketRoles = ["vendor", "customer", "user"];
    const lmsRoles = ["student", "educator", "school"];
    if (marketRoles.includes(user.role)) return "market";
    if (lmsRoles.includes(user.role)) return "lms";
    if (user.role === "admin") return "admin";
    return "market";
  };

  const logout = () => {
    setCurrentUser(null);
  };

  /* ----------------- POSTS & INTERACTIONS ----------------- */
  const createPost = ({ type = "general", text = "", images = [], price = "" }) => {
    if (!currentUser) throw new Error("Not authenticated");
    const p = {
      id: makeId("p"),
      user: currentUser.name,
      role: currentUser.role,
      type,
      text: text || (type === "sell" ? "Selling item" : type === "request" ? "Requesting item" : ""),
      images: images || [],
      price: price || "",
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: nowISO()
    };
    setData(prev => ({ ...prev, posts: [p, ...(prev.posts || [])] }));
    return p;
  };

  // updatePost (shallow merge) — used by FeedTabs
  const updatePost = (postId, patch = {}) => {
    setData(prev => ({
      ...prev,
      posts: (prev.posts || []).map(p => p.id === postId ? { ...p, ...patch } : p)
    }));
  };

  const editPost = (postId, patch = {}) => updatePost(postId, patch);

  const deletePost = (postId) => {
    setData(prev => ({ ...prev, posts: (prev.posts || []).filter(p => p.id !== postId) }));
  };

  const likeToggle = (postId, byUserName = currentUser?.name) => {
    setData(prev => {
      const posts = (prev.posts || []).map(p => {
        if (p.id !== postId) return p;
        const likedBy = new Set(p.likedBy || []);
        if (!byUserName) {
          p.likes = (p.likes || 0) + 1;
          return p;
        }
        if (likedBy.has(byUserName)) likedBy.delete(byUserName);
        else likedBy.add(byUserName);
        return { ...p, likedBy: Array.from(likedBy), likes: likedBy.size };
      });
      return { ...prev, posts };
    });
  };

  const addComment = (postId, comment = { text: "", from: currentUser?.name }) => {
    setData(prev => ({
      ...prev,
      posts: (prev.posts || []).map(p => p.id === postId ? { ...p, comments: (p.comments || 0) + 1 } : p)
    }));
  };

  const sharePost = (postId, byUserName = currentUser?.name) => {
    setData(prev => ({ ...prev, posts: (prev.posts || []).map(p => p.id === postId ? { ...p, shares: (p.shares || 0) + 1 } : p) }));
  };

  /* ----------------- FOLLOWERS ----------------- */
  // data.follows shape: { username: ["follower1","follower2"] }
  const toggleFollowInternal = (username) => {
    if (!currentUser) return { ok: false, message: "Login required" };
    setData(prev => {
      const follows = { ...(prev.follows || {}) };
      const followers = new Set(follows[username] || []);
      const me = currentUser.name;
      if (followers.has(me)) followers.delete(me);
      else followers.add(me);
      follows[username] = Array.from(followers);
      return { ...prev, follows };
    });
    return { ok: true };
  };

  // convert follows into simple boolean map for the *current user*
  const followsBoolean = useMemo(() => {
    const out = {};
    const f = data.follows || {};
    const me = currentUser?.name;
    Object.keys(f).forEach(username => {
      if (!me) out[username] = false;
      else out[username] = Array.isArray(f[username]) && f[username].includes(me);
    });
    return out;
  }, [data.follows, currentUser]);

  /* ----------------- DEALS / RESPONSES ----------------- */
  const makeOffer = (postId, { amount, message }) => {
    const note = { id: makeId("n"), type: "offer", postId, from: currentUser?.name || "anon", amount, message, createdAt: nowISO() };
    setData(prev => ({ ...prev, notifications: [note, ...(prev.notifications || [])] }));
    return { ok: true };
  };

  const respondToRequest = (postId, { message }) => {
    const note = { id: makeId("n"), type: "response", postId, from: currentUser?.name || "anon", message, createdAt: nowISO() };
    setData(prev => ({ ...prev, notifications: [note, ...(prev.notifications || [])] }));
    return { ok: true };
  };

  /* ----------------- MESSAGES & NOTIFICATIONS ----------------- */
  const sendMessage = ({ toUser, text }) => {
    const m = { id: makeId("m"), from: currentUser?.name || "anon", to: toUser, text, createdAt: nowISO() };
    setData(prev => ({ ...prev, messages: [m, ...(prev.messages || [])] }));
    return { ok: true, message: m };
  };

  const addNotification = (note) => {
    const n = { id: makeId("n"), ...note, createdAt: nowISO() };
    setData(prev => ({ ...prev, notifications: [n, ...(prev.notifications || [])] }));
  };

  /* ----------------- ADMIN helpers ----------------- */
  const approveVendor = (userId) => {
    setData(prev => ({ ...prev, users: prev.users.map(u => u.id === userId ? { ...u, approved: true } : u) }));
  };

  /* ----------------- GETTERS ----------------- */
  const getPosts = () => data.posts || [];
  const getUsers = () => data.users || [];
  const getUserByEmail = (email) => (data.users || []).find(u => u.email === email);
  const getUserByName = (name) => (data.users || []).find(u => u.name === name);

  // expose a stable API that matches FeedTabs expectations
  const value = useMemo(() => ({
    // raw state
    data,
    loadingUsers,
    currentUser,

    // directly expected by FeedTabs and other components
    posts: data.posts || [],
    updatePost,            // (id, patch) shallow merge
    follows: followsBoolean,
    toggleFollow: toggleFollowInternal,

    // auth-like (used by Login/Signup)
    login,
    signup,
    logout,
    getDefaultArea,

    // posts and helpers
    createPost,
    editPost,
    deletePost,
    getPosts,

    // interactions
    likeToggle,
    addComment,
    sharePost,

    // offers
    makeOffer,
    respondToRequest,

    // messages / notifications
    sendMessage,
    addNotification,

    // admin
    approveVendor,

    // helpers
    getUsers,
    getUserByEmail,
    getUserByName

  }), [data, loadingUsers, currentUser, followsBoolean]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
