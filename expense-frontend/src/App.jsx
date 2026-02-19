import { useState, useEffect } from "react";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    setIsAuthenticated(!!token);
    if(email) setUserEmail(email);
  }, []);

  function handleLogin() {
    setIsAuthenticated(true);
    setUserEmail(localStorage.getItem("userEmail"));
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    setUserEmail("");
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="h-full bg-white text-slate-100">
      <header className="mx-auto max-w-6xl px-4 py-4 flex justify-between items-center">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-red-600 bg-slate-800 px-4 py-3 shadow-lg">
  <span className="text-sm font-medium text-white">
    Welcome, {userEmail}
  </span>
  <button
    className="text-xs font-medium text-slate-100 border border-slate-300/40 px-3 py-1 rounded-lg bg-slate-900/60 hover:bg-slate-900 transition-colors"
    onClick={handleLogout}
  >
    Logout
  </button>
</div>

      </header>
      <Dashboard />
    </div>
  );
}

export default App;
