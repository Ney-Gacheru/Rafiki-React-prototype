// src/context/DataContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

/**
 * DataContext
 * - Loads users from /data/users.json (public folder)
 * - Seeds a posts array (demo content similar to your original JS)
 * - Persists to localStorage under RAFIKI_KEY
 * - Exposes auth-like helpers used by your current Login/Signup (login, signup, getDefaultArea)
 * - Exposes posts/interactions API
 */

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
    // try hydrate from localStorage
    try {
      const raw = localStorage.getItem(RAFIKI_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore
    }
    // fallback skeleton; users loaded asynchronously from public/data/users.json
    return {
      users: [], // will be populated
      posts: DEMO_POSTS.slice(), // demo posts
      messages: [],
      notifications: [],
      follows: {}, // { username: [followers...] }
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

  // persist data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(RAFIKI_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Failed persisting rafiki data", e);
    }
  }, [data]);

  // persist currentUser to localStorage
  useEffect(() => {
    if (currentUser) localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    else localStorage.removeItem(USER_KEY);
  }, [currentUser]);

  // load users from public/data/users.json on first mount (if file exists)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/data/users.json", { cache: "no-store" });
        if (!res.ok) throw new Error("users not found");
        const fileUsers = await res.json();
        if (!mounted) return;
        // merge file users into existing data.users, avoid duplicates by id or email
        setData((prev) => {
          const emails = new Set(prev.users.map(u => u.email));
          const merged = [...prev.users];
          fileUsers.forEach((u) => {
            if (!emails.has(u.email)) merged.push(u);
          });
          return { ...prev, users: merged.length ? merged : fileUsers };
        });
      } catch (err) {
        // if file not found, keep existing users (maybe already in localStorage)
        console.info("users.json not loaded (ok if not present):", err.message);
      } finally {
        if (mounted) setLoadingUsers(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // small id generator
  const makeId = (prefix = "p") => `${prefix}${Date.now()}`;

  /* ----------------- AUTH-LIKE HELPERS ----------------- */
  // login used by your Login.jsx — returns user or throws an error
  const login = async ({ email, password }) => {
    // ensure users loaded
    if (loadingUsers) {
      // wait briefly (most often file loads quickly)
      await new Promise(r => setTimeout(r, 80));
    }
    const user = data.users.find(u => u.email === (email || "").trim() && u.password === (password || ""));
    if (!user) {
      const err = new Error("Invalid credentials");
      err.code = "INVALID_CREDENTIALS";
      throw err;
    }
    setCurrentUser(user);
    return user;
  };

  // signup used by your Signup.jsx — returns user or throws
  // wantToSell toggles vendor + approved:false
  const signup = async ({ name, email, password, wantToSell = false }) => {
    // validate
    if (!name || !email || !password) {
      const err = new Error("Fill all fields");
      throw err;
    }
    const exists = data.users.find(u => u.email === email.trim());
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
      approved: wantToSell ? false : true, // vendors must be vetted
      createdAt: nowISO()
    };
    setData(prev => ({ ...prev, users: [user, ...prev.users] }));
    setCurrentUser(user);
    return user;
  };

  // helper used by your Login flow to decide where to navigate after login
  const getDefaultArea = (user = currentUser) => {
    if (!user) return "market";
    // map roles to area
    const marketRoles = ["vendor", "customer", "customer", "user"];
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

  const editPost = (postId, patch = {}) => {
    setData(prev => ({ ...prev, posts: prev.posts.map(p => p.id === postId ? { ...p, ...patch } : p) }));
  };

  const deletePost = (postId) => {
    setData(prev => ({ ...prev, posts: prev.posts.filter(p => p.id !== postId) }));
  };

  // like toggle for simplicity
  const likeToggle = (postId, byUserName = currentUser?.name) => {
    setData(prev => {
      const posts = prev.posts.map(p => {
        if (p.id !== postId) return p;
        // maintain a lightweight likedBy set in the post (not persisted to seed) — we will store likedBy as usernames
        const likedBy = new Set(p.likedBy || []);
        if (!byUserName) {
          p.likes = (p.likes || 0) + 1;
          return p;
        }
        if (likedBy.has(byUserName)) {
          likedBy.delete(byUserName);
        } else {
          likedBy.add(byUserName);
        }
        return { ...p, likedBy: Array.from(likedBy), likes: likedBy.size };
      });
      return { ...prev, posts };
    });
  };

  const addComment = (postId, comment = { text: "", from: currentUser?.name }) => {
    // for demo just bump count and push to notifications/messages optionally
    setData(prev => ({
      ...prev,
      posts: prev.posts.map(p => p.id === postId ? { ...p, comments: (p.comments || 0) + 1 } : p)
    }));
  };

  const sharePost = (postId, byUserName = currentUser?.name) => {
    setData(prev => ({ ...prev, posts: prev.posts.map(p => p.id === postId ? { ...p, shares: (p.shares || 0) + 1 } : p) }));
  };

  /* ----------------- FOLLOWERS ----------------- */
  const toggleFollow = (username) => {
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

  // convenience getters
  const getPosts = () => data.posts || [];
  const getUsers = () => data.users || [];
  const getUserByEmail = (email) => (data.users || []).find(u => u.email === email);
  const getUserByName = (name) => (data.users || []).find(u => u.name === name);

  const value = useMemo(() => ({
    // state
    data,
    loadingUsers,
    currentUser,

    // auth-like
    login,
    signup,
    logout,
    getDefaultArea,

    // posts
    createPost,
    editPost,
    deletePost,
    getPosts,

    // interactions
    likeToggle,
    addComment,
    sharePost,

    // follow
    toggleFollow,

    // offers / responses
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

  }), [data, currentUser, loadingUsers]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
