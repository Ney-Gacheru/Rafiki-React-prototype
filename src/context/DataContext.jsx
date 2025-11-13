// src/context/DataContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx"; // Correct path

const RAFIKI_KEY = "rafikiData_v1";

const DataContext = createContext(null);

export function useData() {
  return useContext(DataContext);
}

const DEMO_POSTS = [
  {
    id: "p1",
    userId: "u_jane_vendor", 
    user: "Jane Vendor",
    userAvatar: "https://placehold.co/100x100/e91e63/ffffff?text=JV", 
    role: "vendor",
    type: "sell",
    itemName: "New Crocs", 
    text: "New Crocs in stock! 🐊 Light, durable and comfy.",
    price: "KSh 500",
    images: ["https://cpshoes.com/wp-content/uploads/2024/02/Childrens-Crocs-3-scaled.jpg.webp"],
    likes: 12,
    comments: 4,
    shares: 3,
    visibility: "everyone", 
    createdAt: "2025-10-20T09:00:00Z"
  },
  {
    id: "p2",
    userId: "u_peter_buyer", 
    user: "Peter Buyer",
    userAvatar: "https://placehold.co/100x100/1e88e5/ffffff?text=PB", 
    role: "customer",
    type: "request",
    itemName: "Size 41 Slides", 
    text: "Looking for size 41 slides, budget KSh 600.",
    budget: "KSh 600", 
    likes: 3,
    comments: 1,
    shares: 0,
    visibility: "everyone", 
    createdAt: "2025-10-19T09:00:00Z"
  },
  {
    id: "p3",
    userId: "u_lyn_student", 
    user: "Lyn Student",
    userAvatar: "https://placehold.co/100x100/43a047/ffffff?text=LS", 
    role: "student",
    type: "general",
    itemName: "", // General posts don't have an item name
    text: "Just coded my first responsive portfolio site 🎉 #NextGenDev",
    images: ["https://webandcrafts.com/_next/image?url=https%3A%2F%2Fadmin.wac.co%2Fuploads%2FResponsive_websites_a4b1bafc09.png&w=1200&q=90"],
    likes: 10,
    comments: 1,
    shares: 0,
    visibility: "followers", 
    createdAt: "2025-10-17T09:00:00Z"
  },
  {
    id: "p4",
    userId: "u_brian_vendor", 
    user: "Brian Vendor",
    userAvatar: "https://placehold.co/100x100/5e35b1/ffffff?text=BV", 
    role: "vendor",
    type: "sell",
    itemName: "2015 Mazda Demio", 
    text: "Selling a clean 2015 Mazda Demio 🚗 — automatic, 1300cc, well maintained. Ready to drive!",
    price: "KSh 890,000",
    images: ["data:image/jpeg;base64,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"],
    likes: 19,
    comments: 6,
    shares: 3,
    visibility: "everyone", 
    createdAt: "2025-10-16T09:00:00Z"
  }
];


function nowISO() {
  return new Date().toISOString();
}

export function DataProvider({ children }) {
  const { currentUser, users, setUsers, loading: authLoading } = useAuth();

  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(RAFIKI_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    
    return {
      posts: DEMO_POSTS.slice(),
      messages: [],
      notifications: [],
      follows: {}, 
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(RAFIKI_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Failed persisting rafiki data", e);
    }
  }, [data]);

  const makeId = (prefix = "p") => `${prefix}${Date.now()}`;

  const createPost = ({ 
    type = "general", 
    text = "", 
    images = [], 
    price = "",
    itemName = "",
    budget = "",
    visibility = "everyone" 
  }) => {
    if (!currentUser) throw new Error("Not authenticated");
    const p = {
      id: makeId("p"),
      userId: currentUser.id,
      user: currentUser.name,
      userAvatar: currentUser.avatar || `https://placehold.co/100x100/cccccc/ffffff?text=${currentUser.name.charAt(0)}`,
      role: currentUser.role,
      type,
      itemName,
      text: text || "",
      images: images || [],
      price: price || "",
      budget: budget || "",
      visibility: visibility || "everyone",
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: nowISO()
    };
    setData(prev => ({ ...prev, posts: [p, ...(prev.posts || [])] }));
    return p;
  };

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

  const toggleFollowInternal = (userIdToFollow) => {
    if (!currentUser) return { ok: false, message: "Login required" };
    setData(prev => {
      const follows = { ...(prev.follows || {}) };
      const followers = new Set(follows[userIdToFollow] || []);
      const me = currentUser.id;
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
    const me = currentUser?.id;
    Object.keys(f).forEach(userId => {
      if (!me) out[userId] = false;
      else out[userId] = Array.isArray(f[userId]) && f[userId].includes(me);
    });
    return out;
  }, [data.follows, currentUser]);

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

  const sendMessage = ({ toUser, text }) => {
    const m = { id: makeId("m"), from: currentUser?.name || "anon", to: toUser, text, createdAt: nowISO() };
    setData(prev => ({ ...prev, messages: [m, ...(prev.messages || [])] }));
    return { ok: true, message: m };
  };

  const addNotification = (note) => {
    const n = { id: makeId("n"), ...note, createdAt: nowISO() };
    setData(prev => ({ ...prev, notifications: [n, ...(prev.notifications || [])] }));
  };

  const approveVendor = (userId) => {
    setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, approved: true } : u));
  };

  const getPosts = () => data.posts || [];
  const getUsers = () => users || [];
  const getUserByEmail = (email) => (users || []).find(u => u.email === email);
  const getUserByName = (name) => (users || []).find(u => u.name === name);

  const value = useMemo(() => ({
    data,
    loading: authLoading, 
    posts: data.posts || [],
    updatePost,       
    follows: followsBoolean,
    toggleFollow: toggleFollowInternal,
    createPost,
    editPost,
    deletePost,
    getPosts,
    likeToggle,
    addComment,
    sharePost,
    makeOffer,
    respondToRequest,
    sendMessage,
    addNotification,
    approveVendor,
    getUsers,
    getUserByEmail,
    getUserByName
  }), [data, authLoading, currentUser, followsBoolean, users]); 

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}