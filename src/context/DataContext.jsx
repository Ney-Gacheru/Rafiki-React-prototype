// src/context/DataContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx"; // FIX: Added .jsx extension

const RAFIKI_KEY = "rafikiData_v1"; // For posts, messages, etc.

const DataContext = createContext(null);

export function useData() {
  return useContext(DataContext);
}

// MATCH YOUR users.json IDs
const DEMO_POSTS = [
  {
    id: "p1",
    userId: "u_vendor", 
    user: "Jane Vendor",
    role: "vendor",
    verification: "vetted", // <-- 1. VERIFICATION DATA
    userAvatar: "https://placehold.co/100x100/e67e22/fff?text=J",
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
    userId: "u_customer", 
    user: "Peter Buyer", // <-- ADDED USER
    role: "customer", // <-- ADDED ROLE
    verification: "none", // <-- 1. VERIFICATION DATA
    userAvatar: "https://placehold.co/100x100/3498db/fff?text=P",
    type: "request",
    itemName: "Size 41 slides",
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
    userId: "u_student", 
    user: "Lyn Student", // <-- ADDED USER
    role: "student", // <-- ADDED ROLE
    verification: "student", // <-- 1. VERIFICATION DATA
    userAvatar: "https://placehold.co/100x100/8e44ad/fff?text=L",
    type: "general",
    text: "Just coded my first responsive portfolio site 🎉 #NextGenDev",
    images: ["https://placehold.co/600x400/1d4ed8/fff?text=Portfolio+Site"],
    likes: 10,
    comments: 1,
    shares: 0,
    visibility: "everyone",
    createdAt: "2025-10-17T09:00:00Z"
  },
  {
    id: "p4",
    userId: "u_vendor",
    user: "Jane Vendor", // <-- ADDED USER
    role: "vendor", // <-- ADDED ROLE
    verification: "vetted", // <-- 1. VERIFICATION DATA
    userAvatar: "https://placehold.co/100x100/e67e22/fff?text=J",
    type: "general",
    text: "Market is busy today! Great day for business.",
    images: [],
    likes: 5,
    comments: 1,
    shares: 0,
    visibility: "everyone",
    createdAt: "2025-10-15T11:00:00Z"
  },
  {
    id: "p5",
    userId: "u_student",
    user: "Lyn Student", // <-- ADDED USER
    role: "student", // <-- ADDED ROLE
    verification: "student", // <-- 1. VERIFICATION DATA
    userAvatar: "https://placehold.co/100x100/8e44ad/fff?text=L",
    type: "general",
    text: "Just finished my 'Fundamentals' module. It was tough but I learned a lot about process.",
    images: [],
    likes: 8,
    comments: 2,
    shares: 0,
    visibility: "followers",
    createdAt: "2025-10-14T15:30:00Z"
  },
  {
    id: "p6",
    userId: "u_educator",
    user: "Mr. Kazi", // <-- ADDED USER
    role: "educator", // <-- ADDED ROLE
    verification: "vetted", // <-- 1. VERIFICATION DATA
    userAvatar: "https://placehold.co/100x100/2ecc71/fff?text=K",
    type: "general",
    text: "A quick reflection on 'Process vs. Product' for all my students.",
    images: [],
    likes: 15,
    comments: 3,
    shares: 2,
    visibility: "everyone",
    createdAt: "2025-10-18T10:00:00Z"
  }
];

const DEMO_TASKS = [
  {
    id: "t1",
    educator: "Mr. Kazi",
    course: "CodeCraft Fundamentals",
    title: "Project: Promote the Local Library",
    description: "You've been tasked to promote a local library. How would you do it? Post your ideas: a slogan, a poster, a video, a website mockup... Let's see your creativity!",
    submissions: 3,
    dueDate: "2025-10-30T23:59:00Z"
  },
  {
    id: "t2",
    educator: "Mr. Kazi",
    course: "CodeCraft Fundamentals",
    title: "Discussion: What is 'Good Design'?",
    description: "Find an example of a website or app you think has 'good design.' Post a screenshot and explain *why* you think it works well.",
    submissions: 5,
    dueDate: "2025-10-25T23:59:00Z"
  }
];

const DEMO_COURSES = [
  {
    id: "c1",
    title: "CodeCraft Fundamentals",
    description: "Learn the core principles of design thinking, problem-solving, and digital literacy. This is the foundation for all other paths.",
    modules: [
      { id: "m1", title: "Introduction: Process vs. Product" },
      { id: "m2", title: "Module 1: Defining the Problem" },
      { id: "m3", title: "Module 2: Ideation & Brainstorming" },
      { id: "m4", title: "Module 3: Prototyping Your Idea" },
      { id: "m5", title: "Module 4: Feedback & Iteration" },
      { id: "m6", title: "Capstone: The Library Project" }
    ]
  }
];

const DEMO_STUDENT_PROGRESS = {
  "c1": { "m1": true, "m2": true, "m3": true, "m4": false, "m5": false, "m6": false }
};

const DEMO_UNITS = [
  { id: "u1", title: "Unit 1: Fundamentals", description: "Core principles of design thinking." },
  { id: "u2", title: "Unit 2: Web Path", description: "Introduction to HTML, CSS, and React." },
];

// Renamed 'articles' to 'reflections'
const DEMO_REFLECTIONS = [
  { id: "r1", title: "Why 'Process' Matters More" },
  { id: "r2", title: "Unlocking Creativity with Constraints" }
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
      tasks: DEMO_TASKS.slice(),
      courses: DEMO_COURSES.slice(),
      studentProgress: DEMO_STUDENT_PROGRESS,
      units: DEMO_UNITS.slice(),
      reflections: DEMO_REFLECTIONS.slice(),
      messages: [],
      notifications: [],
      follows: {}, 
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

  const makeId = (prefix = "p") => `${prefix}${Date.now()}`;

  /* ----------------- POSTS & INTERACTIONS ----------------- */
  const createPost = (postData) => {
    if (!currentUser) throw new Error("Not authenticated");
    const p = {
      id: makeId("p"),
      userId: currentUser.userId,
      user: currentUser.name,
      role: currentUser.role,
      userAvatar: currentUser.userAvatar,
      verification: currentUser.verification, // <-- 2. ADD VERIFICATION ON CREATE
      
      type: "general", // Default
      text: "",
      images: [],
      price: "",
      budget: "",
      itemName: "",
      visibility: "everyone", // Default
      
      ...postData, // Overwrite with provided data
      
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

  /* ----------------- FOLLOWERS ----------------- */
  const toggleFollowInternal = (userIdToFollow) => {
    if (!currentUser) return { ok: false, message: "Login required" };
    setData(prev => {
      const follows = { ...(prev.follows || {}) };
      const followers = new Set(follows[userIdToFollow] || []);
      const me = currentUser.userId; // Use userId for follows
      
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
    const me = currentUser?.userId;
    Object.keys(f).forEach(userId => {
      if (!me) out[userId] = false;
      else out[userId] = Array.isArray(f[userId]) && f[userId].includes(me);
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
    setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, approved: true, verification: "vetted" } : u));
  };

  /* ----------------- GETTERS ----------------- */
  const getPosts = () => data.posts || [];
  const getPostsByUserId = (userId) => (data.posts || []).filter(p => p.userId === userId);
  const getTasks = () => data.tasks || [];
  const getCourses = () => data.courses || [];
  const getStudentProgress = () => data.studentProgress || {};
  const getUnits = () => data.units || []; 
  const getReflections = () => data.reflections || [];

  const getUsers = () => users || [];
  const getUserById = (userId) => (users || []).find(u => u.userId === userId);
  const getUserByName = (name) => (users || []).find(u => u.name === name);

  const value = useMemo(() => ({
    // raw state
    data,
    loading: authLoading, 

    // data slices
    posts: data.posts || [],
    tasks: data.tasks || [],
    courses: data.courses || [],
    studentProgress: data.studentProgress || {},
    units: data.units || [],
    reflections: data.reflections || [],
    
    // Auth context passthroughs
    users: users || [],
    currentUser,

    // directly expected by FeedTabs and other components
    updatePost,       
    follows: followsBoolean,
    toggleFollow: toggleFollowInternal,

    // posts and helpers
    createPost,
    editPost,
    deletePost,
    getPosts,
    getPostsByUserId, // New getter

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
    getUserById, // Changed from getByEmail
    getUserByName,
    
    // LMS getters
    getTasks,
    getCourses,
    getStudentProgress,
    getUnits,
    getReflections,

  }), [data, authLoading, currentUser, followsBoolean, users]); 

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}