// app/components/ThreatDashboard.tsx

import React, { useState, useEffect, FormEvent } from "react";
import lock from "/pixelLock.png";
import { auth } from "../utils/firebseClient";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from "firebase/auth";

export default function ThreatDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Subscribe to auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // Login handler
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setShowLogin(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Signup handler
  const handleSignup = async () => {
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      setShowLogin(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-16">
      <header className="relative w-full flex flex-col items-center gap-9 pt-10">
        {/* Only show padlock if not signed in */}
        {!user && (
          <button
            type="button"
            onClick={() => setShowLogin(true)}
            className="absolute top-40"
          >
            <img
              src={lock}
              alt="lock icon"
              className="w-[800px] h-auto object-contain overflow-hidden"
            />
          </button>
        )}
               {/* Show signed-in user and Sign Out button */}
        {user && (
          <div className="absolute top-4 right-4 text-gray-600 text-sm dark:text-gray-300">
          <p >
            Signed in as{" "}
            
            <span className="bg-black text-green-500 font-mono text-xl">
              {user.email}
            </span>
            </p>
            </div>
          
        )}
        {user && (
          <button
            onClick={() => auth.signOut()}
            className="absolute top-14 right-16 bg-black text-red-600 px-4 py-2 rounded-lg hover:text-red-200 hover:bg-red-700"
          >
            Sign Out
          </button>
        )}
        {/* Title */}
        <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100 text-center">
          Real Time.<br />
          Threat Intelligence.
        </h1>
      </header>

      {/* Login Modal */}
      {!user && showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 ">
          <div className="relative w-96 h-60 bg-blue-900 p-12 rounded-3xl border border-gray-200 dark:border-gray-700">
            {/* Close button */}
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              ×
            </button>
            {/* Login Form */}
            <form
              name="Login Form"
              onSubmit={handleLogin}
              className="flex flex-col justify-center gap-4"
            >
              {error && (
                <p className="text-center text-red-600 text-sm">{error}</p>
              )}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="text-black bg-gray-300 rounded-md px-4 py-2"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="text-black bg-gray-300 rounded-md px-4 py-2"
                required
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-600 rounded-lg px-6 py-2 text-white hover:bg-blue-700"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={handleSignup}
                  className="bg-green-600 rounded-lg px-6 py-2 text-white hover:bg-green-700"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dashboard (when signed in) */}
      {user && (
        <div className="w-[1000px] min-h-[400px] bg-blue-500 border-slate-700 border-4  rounded-lg">
          <h1 className="w-full h-20 border-slate-700 place-content-center text-5xl font-light bg-gray-300 text-gray-800 border-b-4 mb-10 text-center">
            RTTI Dashboard
          </h1>

          <div className="grid grid-cols-3 justify-between gap-4">
            {/* Threat Logs */}
            <div className="border border-black bg-white p-6 m-3 rounded-lg shadow-md">
              <h2 className="text-xl text-black font-mono mb-4">Threat Logs</h2>
              <p className="text-gray-600 text-md">
                57 unique threats logged in the past 24 hours
              </p>
            </div>

            {/* Risk Scores */}
            <div className="border border-black bg-white p-6 m-3 rounded-lg shadow-md">
              <h2 className="text-xl text-black font-mono mb-4">Risk Scores</h2>
              <p className="text-gray-600 text-md">
                Top threat score: 92.5 (SQL Injection)
              </p>
            </div>

            {/* Real-Time Alerts */}
            <div className="border border-black bg-white p-6 m-3 rounded-lg shadow-md">
              <h2 className="text-xl text-nowrap text-black font-mono mb-4">
                Real-Time Alerts
              </h2>
              <p className="text-gray-600 text-md">
                3 high-priority alerts triggered
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={() =>
                window.open("http://localhost:3000/api/reports/threat", "_blank")
              }
              className="bg-red-700 text-white mb-6 py-3 px-4 rounded-lg hover:bg-green-700"
            >
              Download Threat Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
