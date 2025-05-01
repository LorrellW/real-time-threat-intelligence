// // app/components/ThreatDashboard.tsx
// import React, { useState, useEffect, FormEvent } from "react";
// import lock from "../../public/pixelLock.png"; // adjust path if needed
// import { auth } from "../utils/firebseClient";
// import {
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   onAuthStateChanged,
//   User,
// } from "firebase/auth";

// export default function ThreatDashboard() {
//   const [user, setUser] = useState<User | null>(null);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);

//   // Listen for auth state changes
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//       setUser(firebaseUser);
//     });
//     return () => unsubscribe();
//   }, []);

//   // Handle login form submission
//   const handleLogin = async (e: FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     try {
//       await signInWithEmailAndPassword(auth, email.trim(), password);
//       // user state will update via onAuthStateChanged
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   // Handle signup button
//   const handleSignup = async () => {
//     setError(null);
//     try {
//       await createUserWithEmailAndPassword(auth, email.trim(), password);
//       // user state will update via onAuthStateChanged
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   // If not authenticated, show login form
//   if (!user) {
//     return (
//       <div className="flex flex-col items-center gap-16">
//         <header className="flex flex-col items-center gap-9 pt-10">
//           <img src={lock} alt="Lock icon" className="w-16 h-16" />
//           <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100">
//             Real Time Threat Intelligence
//           </h1>
//         </header>

//         <form
//           name="Login Form"
//           onSubmit={handleLogin}
//           className="flex flex-col justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700"
//         >
//           {error && (
//             <p className="text-red-600 text-sm text-center">{error}</p>
//           )}
//           <input
//             type="email"
//             className="px-4 py-2 text-black bg-gray-300 rounded-md"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             className="px-4 py-2 text-black bg-gray-300 rounded-md"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <div className="flex justify-between">
//             <button
//               type="submit"
//               className="px-6 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
//             >
//               Login
//             </button>
//             <button
//               type="button"
//               onClick={handleSignup}
//               className="px-6 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700"
//             >
//               Sign Up
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   // If authenticated, show dashboard
//   return (
//     <div className="flex flex-col items-center gap-16">
//       <header className="flex flex-col items-center gap-9 pt-10">
//         <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100">
//           Real Time Threat Intelligence
//         </h1>
//         <p className="text-sm text-gray-600 dark:text-gray-300">
//           Signed in as: {user.email}
//         </p>
//         <button
//           onClick={() => auth.signOut()}
//           className="text-red-600 hover:underline"
//         >
//           Sign Out
//         </button>
//       </header>

//       <div className="min-h-[400px] bg-blue-500 border-4 border-slate-700 w-[80%] rounded-lg">
//         <h1 className="w-full h-20 border-b-4 border-slate-700 bg-gray-300 text-center text-5xl font-light text-gray-800 mb-10">
//           RTTI Dashboard
//         </h1>

//         <div className="grid grid-cols-3 gap-4 px-6">
//           <div className="p-6 bg-white border border-black rounded-lg shadow-md">
//             <h2 className="mb-4 text-xl font-mono text-black">Threat Logs</h2>
//             <p className="text-md text-gray-600">
//               57 unique threats logged in the past 24 hours
//             </p>
//           </div>
//           <div className="p-6 bg-white border border-black rounded-lg shadow-md">
//             <h2 className="mb-4 text-xl font-mono text-black">Risk Scores</h2>
//             <p className="text-md text-gray-600">
//               Top threat score: 92.5 (SQL Injection)
//             </p>
//           </div>
//           <div className="p-6 bg-white border border-black rounded-lg shadow-md">
//             <h2 className="mb-4 text-xl font-mono text-black">
//               Real-Time Alerts
//             </h2>
//             <p className="text-md text-gray-600">
//               3 high-priority alerts triggered
//             </p>
//           </div>
//         </div>

//         <div className="flex justify-center mt-8">
//           <button
//             onClick={() =>
//               window.open("http://localhost:3000/api/report", "_blank")
//             }
//             className="px-4 py-3 mb-6 text-white bg-red-700 rounded-lg hover:bg-red-800"
//           >
//             Download Threat Report
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
