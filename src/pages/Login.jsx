import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, getDefaultArea } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login({ email, password });
      // If a redirect target exists, use it; otherwise send to default area
      if (from) {
        navigate(from, { replace: true });
      } else {
        const area = getDefaultArea(user);
        navigate(`/${area}`, { replace: true });
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div style={{padding:20,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
      <form onSubmit={submit} style={{width:360,background:"#fff",padding:20,borderRadius:10,boxShadow:"0 6px 20px rgba(0,0,0,0.06)"}}>
        <h2>Login</h2>
        {error && <div style={{color:"crimson",marginBottom:8}}>{error}</div>}
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" style={{width:"100%",padding:10,marginBottom:8,borderRadius:6}}/>
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" style={{width:"100%",padding:10,marginBottom:12,borderRadius:6}}/>
        <button type="submit" style={{width:"100%",padding:10,background:"#ff7a00",color:"#fff",border:"none",borderRadius:6}}>Login</button>
        <div style={{marginTop:12,fontSize:13,color:"#666"}}>
          No account? <Link to="/signup">Sign up</Link>
        </div>
      </form>
    </div>
  );
}
