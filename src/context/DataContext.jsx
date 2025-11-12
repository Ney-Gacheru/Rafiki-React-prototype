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
    price: "KSh 1200",
    images: ["https://placehold.co/600x400/ff7a00/fff?text=Croc+Image"],
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
    images: ["https://placehold.co/600x400/1d4ed8/fff?text=Portfolio+Site"],
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
    images: ["https://placehold.co/600x400/111/fff?text=Mazda+Demio"],
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