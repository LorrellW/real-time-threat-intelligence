// /src/components/ThreatDashboard.jsx
import React from "react";

function ThreatDashboard() {
  return (

    <div className="flex flex-col items-center gap-16">
      <header className="flex flex-col items-center gap-9">
        <h1 className="leading text-5xl font-bold text-gray-800 dark:text-gray-100">
          Real Time Threat Intelligence
        </h1>
      </header>

      <form name="Login Form" className="flex flex-col justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">

        <input className="text-black bg-gray-300 rounded-md" placeholder=" Email"></input>
        <input className="text-black bg-gray-300 rounded-md" placeholder=" Password"></input>
        <div className="flex justify-between">
          <button className=" bg-blue-600 min-w-24 rounded-lg leading-6 text-gray-700 dark:text-gray-200">
            Login
          </button>
          <button className=" bg-blue-600 min-w-24 rounded-lg leading-6 text-gray-700 dark:text-gray-200" onClick={Number}>
            Signup
          </button>
        </div>
      </form>


      <div className="min-h-[400px] bg-blue-500 p-10">
        <h1 className="w-2/3 mx-auto place-items-center text-3xl bg-white text-black border border-black font-bold mb-8 text-center">RTTI Dashboard</h1>

        <div className="grid grid-cols-3 justify-between gap-4">

          <div className="flex-row border border-black bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl text-black font-semibold mb-4">Threat logs</h2>
            <p className="text-gray-600 text-2xl">...</p>
          </div>

          <div className="flex-row border border-black bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl text-black font-semibold mb-4">Risk scores</h2>
            <p className="text-gray-600 text-2xl">...</p>
          </div>

          <div className="flex-row border border-black bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl text-black font-semibold mb-4">Real-time alerts</h2>
            <p className="text-gray-600 text-2xl">...</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ThreatDashboard;
