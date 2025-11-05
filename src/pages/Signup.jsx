import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup, getDefaultArea } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [wantToSell, setWantToSell] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await signup({ name, email, password, wantToSell });
      // default route is market for signups (buyer). If they signed as vendor they'll be created but approval=false.
      const area = getDefaultArea(user);
      navigate(`/${area}`, { replace: true });
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div style={{padding:20,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
      <form onSubmit={submit} style={{width:420,background:"#fff",padding:20,borderRadius:10,boxShadow:"0 6px 20px rgba(0,0,0,0.06)"}}>
        <h2>Create account</h2>
        {error && <div style={{color:"crimson",marginBottom:8}}>{error}</div>}
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" style={{width:"100%",padding:10,marginBottom:8,borderRadius:6}}/>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" style={{width:"100%",padding:10,marginBottom:8,borderRadius:6}}/>
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" style={{width:"100%",padding:10,marginBottom:12,borderRadius:6}}/>
        <label style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <input type="checkbox" checked={wantToSell} onChange={e=>setWantToSell(e.target.checked)} />
          I want to sell on Rafiki (seller accounts must be vetted by admin)
        </label>
        <button style={{width:"100%",padding:10,background:"#ff7a00",color:"#fff",border:"none",borderRadius:6}} type="submit">Sign up</button>
        <div style={{marginTop:12,fontSize:13,color:"#666"}}>
          By default new accounts are market buyers. If you requested seller status, an admin will review your request.
        </div>
      </form>
    </div>
  );
}
