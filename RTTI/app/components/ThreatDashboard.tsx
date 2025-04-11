import React from "react";

function ThreatDashboard() {
  return (
    <div className="flex flex-col items-center gap-16">
      <header className="flex flex-col items-center gap-9 pt-10">
        <h1 className="leading text-6xl font-bold space-y-3 text-gray-800 dark:text-gray-100">
          <div/> Real Time.
          <div/>Threat Intelligence.
        </h1>
      </header>

      <form name="Login Form" className="flex flex-col justify-center gap-4 rounded-3xl border border-gray-200 p-4 dark:border-gray-700">
        <input className="text-black bg-gray-300 rounded-md" placeholder=" Email" />
        <input className="text-black bg-gray-300 rounded-md" placeholder=" Password" />
        <div className="flex justify-between">
          <button className="bg-blue-600 min-w-24 rounded-lg leading-6 text-gray-700 dark:text-gray-200">
            Login
          </button>
          <button className="bg-blue-600 min-w-24 rounded-lg leading-6 text-gray-700 dark:text-gray-200" onClick={Number}>
            Signup
          </button>
        </div>
      </form>

      <div className="min-h-[400px] bg-blue-500 border-slate-700 border-4 w-[80%] rounded-lg">
        <h1 className="w-full h-20 border-slate-700 place-content-center text-5xl font-light bg-gray-300 text-gray-800  border-b-4 mb-10 text-center">
          RTTI Dashboard
        </h1>

        <div className="grid grid-cols-3 justify-between gap-4">
          <div className="border border-black bg-white p-6 m-3 rounded-lg shadow-md">
            <h2 className="text-xl text-black font-mono mb-4">Threat Logs</h2>
            <p className="text-gray-600 text-md">57 unique threats logged in the past 24 hours</p>
          </div>

          <div className="border border-black bg-white p-6 m-3 rounded-lg shadow-md">
            <h2 className="text-xl text-black font-mono mb-4">Risk Scores</h2>
            <p className="text-gray-600 text-md">Top threat score: 92.5 (SQL Injection)</p>
          </div>

          <div className="border border-black bg-white p-6 m-3 rounded-lg shadow-md">
            <h2 className="text-xl text-nowrap text-black font-mono mb-4">Real-Time Alerts</h2>
            <p className="text-gray-600 text-md">3 high-priority alerts triggered</p>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
          
            onClick={() => window.open("http://localhost:3000/api/reports/threat", "_blank")}
            className="bg-red-700 text-white mb-6  py-3 px-4 rounded-lg hover:bg-green-700"
          >
            Download Threat Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThreatDashboard;
