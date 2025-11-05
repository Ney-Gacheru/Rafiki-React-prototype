import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{maxWidth:900,width:"100%",textAlign:"center"}}>
        <h1 style={{marginBottom:8}}>Rafiki — Community Market & LMS</h1>
        <p style={{color:"#555",marginBottom:18}}>Two rooms, one account. Market and LMS share social features but have different roles and moderation.</p>

        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <Link to="/login"><button style={{padding:"10px 16px",borderRadius:8}}>Login</button></Link>
          <Link to="/signup"><button style={{padding:"10px 16px",borderRadius:8,background:"#ff7a00",color:"#fff",border:"none"}}>Sign up</button></Link>
        </div>

        <div style={{marginTop:20,color:"#888",fontSize:13}}>
          <div>Sign up defaults to Market as a buyer. Sellers need admin vetting before selling privileges.</div>
        </div>
      </div>
    </div>
  );
}
