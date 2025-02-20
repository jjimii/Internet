// src/pages/Register.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/Register.css";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [error, setError] = useState("");
  const [passwordFocus, setPasswordFocus] = useState(false);
  const navigate = useNavigate();

  // Validate email using regex
  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Validate password: at least 8 characters, 1 uppercase letter, and 1 number
  const isPasswordValid = (pwd: string) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(isEmailValid(value) ? "" : "Please enter a valid email address.");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordValid(isPasswordValid(value));
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (!passwordValid) {
      setError("Password must be at least 8 characters long, include one uppercase letter and one number.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Set displayName to "user"
      await updateProfile(userCredential.user, { displayName: "user" });
      await sendEmailVerification(userCredential.user);

      // Create a Firestore document in "users" collection
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: "user",
        isLoggedIn: true,
        lastLogin: new Date(),
      });

      navigate("/login");
    } catch (err: any) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email is already registered. Forgot your password?");
          break;
        case "auth/invalid-email":
          setError("The email address is invalid.");
          break;
        case "auth/weak-password":
          setError("Password is too weak. Please choose a stronger password.");
          break;
        default:
          setError("An unexpected error occurred. Please try again.");
          break;
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              required
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
              required
            />
            {passwordFocus && password && !passwordValid && (
              <p className="password-validation-message">
                Password must be at least 8 characters long and include at least one uppercase letter and one number.
              </p>
            )}
            <div className={`password-strength ${passwordValid ? "valid" : ""}`} />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          
          <button type="submit" className="button">Register</button>
        </form>
        <div className="password-requirements">
          <p>Password must be at least 8 characters long, include at least 1 uppercase letter and 1 number.</p>
        </div>
        <div className="login-link">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
