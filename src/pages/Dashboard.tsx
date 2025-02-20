// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { getAuth, sendEmailVerification, updateProfile, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        navigate("/login");
      }
    };
    fetchUserData();
  }, [auth.currentUser, navigate]);

  const handleResendVerification = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      setMessage("Verification email sent. Please check your inbox.");
    }
  };

  const handleUpdateName = async () => {
    const user = auth.currentUser;
    if (user) {
      await updateProfile(user, { displayName: newName });
      await updateDoc(doc(db, "users", user.uid), { name: newName });
      setUserData({ ...userData, name: newName });
      setEditing(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        {!auth.currentUser?.emailVerified ? (
          <>
            <p className="warning-message">You need to verify your email.</p>
            <button className="button" onClick={handleResendVerification}>
              Resend Verification Email
            </button>
            <button className="button logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <h2>Hello {userData.name}!</h2>
            {editing ? (
              <>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter new name"
                />
                <button className="button" onClick={handleUpdateName}>
                  Submit
                </button>
              </>
            ) : (
              <button className="button" onClick={() => { setEditing(true); setNewName(userData.name); }}>
                Update Name
              </button>
            )}
            <button className="button logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
        {message && <p className="info-message">{message}</p>}
      </div>
    </div>
  );
};

export default Dashboard;
