// src/context/DataContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
// 1. IMPORT THE AUTH CONTEXT (Removed .jsx extension for broad compatibility)
import { useAuth } from "./AuthContext";

const RAFIKI_KEY = "rafikiData_v1"; // For posts, messages, etc.

const DataContext = createContext(null);

export function useData() {
  return useContext(DataContext);
}

// UPDATED DEMO_POSTS with user IDs and Avatars
const DEMO_POSTS = [
  {
    id: "p1",
    userId: "u_jane", // Added
    user: "Jane Vendor",
    userAvatar: "https://placehold.co/100x100/ff7a00/fff?text=J", // Added
    role: "vendor",
    type: "sell",
    text: "New Crocs in stock! 🐊 Light, durable and comfy.",
    price: "KSh 1200",
    images: ["https://placehold.co/600x400/ff7a00/fff?text=Croc+Image"],
    likes: 12,
    comments: 4,
    shares: 3,
    createdAt: "2025-10-20T09:00:00Z"
  },
  {
    id: "p2",
    userId: "u_peter", // Added
    user: "Peter Buyer",
    userAvatar: "https://placehold.co/100x100/1d4ed8/fff?text=P", // Added
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
    userId: "u_lyn", // Added
    user: "Lyn Student",
    userAvatar: "https://placehold.co/100x100/111/fff?text=L", // Added
    role: "student",
    type: "general",
    text: "Just coded my first responsive portfolio site 🎉 #NextGenDev",
    images: ["https://placehold.co/600x400/1d4ed8/fff?text=Portfolio+Site"],
    likes: 10,
    comments: 1,
    shares: 0,
    createdAt: "2025-10-17T09:00:00Z"
  },
  {
    id: "p4",
    userId: "u_brian", // Added
    user: "Brian Vendor",
    userAvatar: "https://placehold.co/100x100/111/fff?text=B", // Added
    role: "vendor",
    type: "sell",
    text: "Selling a clean 2015 Mazda Demio 🚗 — automatic, 1300cc, well maintained. Ready to drive!",
    price: "KSh 890,000",
    images: ["https://placehold.co/600x400/111/fff?text=Mazda+Demio"],
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
  // GET ALL AUTH DATA FROM AuthContext
  const { currentUser, users, setUsers, loading: authLoading } = useAuth();

  // DataContext state is NOW ONLY for non-auth data
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(RAFIKI_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    
    return {
      posts: DEMO_POSTS.slice(),
      messages: [],
      notifications: [],
      follows: {}, // { userIdToFollow: ["followerId1","followerId2", ...] }
    };
  });

  // persist data
  useEffect(() => {
    try {
      localStorage.setItem(RAFIKI_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Failed persisting rafiki data", e);
    }
  }, [data]);

  // id generator
  const makeId = (prefix = "p") => `${prefix}${Date.now()}`;

  /* ----------------- POSTS & INTERACTIONS ----------------- */
  const createPost = ({ type = "general", text = "", images = [], price = "" }) => {
    if (!currentUser) throw new Error("Not authenticated");
    const p = {
      id: makeId("p"),
      userId: currentUser.id, // Use ID
      user: currentUser.name,
      userAvatar: currentUser.avatar || `https://placehold.co/100x100/111/fff?text=${currentUser.name?.charAt(0) || "U"}`, // Use avatar or placeholder
      role: currentUser.role,
      type,
      text: text || (type === "sell" ? "Selling item" : type ==="request" ? "Requesting item" : ""),
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
        // This is a simple like toggle, _liked is a local-only flag
        // A full "likedBy" system would be more complex
        const liked = p._liked || false;
        const count = p.likes || 0;
        return { ...p, likes: liked ? Math.max(0, count - 1) : count + 1, _liked: !liked };
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
  // NOTE: Switched to track by UserID for robustness
  // data.follows shape: { userIdToFollow: ["followerId1","followerId2"] }
  const toggleFollowInternal = (userIdToFollow) => {
    if (!currentUser) return { ok: false, message: "Login required" };
    setData(prev => {
      const follows = { ...(prev.follows || {}) };
      const followers = new Set(follows[userIdToFollow] || []);
      const me = currentUser.id; // Use ID
      
      if (followers.has(me)) followers.delete(me);
      else followers.add(me);
      
      follows[userIdToFollow] = Array.from(followers);
      return { ...prev, follows };
    });
    return { ok: true };
  };

  const followsBoolean = useMemo(() => {
    const out = {};
    const f = data.follows || {};
    const me = currentUser?.id; // Use ID
    if (!me) return {}; // No user, can't be following anyone
    
    // We only need to know who the *current user* follows
    for (const userIdToFollow in f) {
      const followers = f[userIdToFollow] || [];
      out[userIdToFollow] = followers.includes(me);
    }
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
    setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, approved: true } : u));
  };

  /* ----------------- GETTERS ----------------- */
  const getPosts = () => data.posts || [];
  const getUsers = () => users || [];
  const getUserByEmail = (email) => (users || []).find(u => u.email === email);
  const getUserByName = (name) => (users || []).find(u => u.name === name);

  // THE VALUE
  const value = useMemo(() => ({
    // raw state
    data,
    loading: authLoading, // Use the auth loading state

    // directly expected by FeedTabs and other components
    posts: data.posts || [],
    updatePost,       // (id, patch) shallow merge
    follows: followsBoolean,
    toggleFollow: toggleFollowInternal,

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

  }), [data, authLoading, currentUser, followsBoolean, users]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}