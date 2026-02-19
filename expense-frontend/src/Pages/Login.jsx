import { useState } from "react";
import { login, register } from "../services/api";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [error, setError] = useState("");

 async function handleSubmit(e) {
  e.preventDefault();
  setError("");

  try {
    if (mode === "register") {
      const regRes = await register(email, password);
      // Stop if registration failed
      if (regRes.message && regRes.message !== "User registered") {
        setError(regRes.message);
        return;
      }
    }

    const data = await login(email, password);

    // Guard against missing token
    if (!data.access_token) {
      setError("Login failed. Please check your credentials.");
      return;
    }

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("userEmail", email);
    onLogin();
  } catch (err) {
    setError("Invalid email or password");
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-white">
       
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-4xl font-bold mb-3 text-center">SmartSpend</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm">
            <span className="mb-1 block text-slate-300">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-slate-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100"
            />
          </label>
          {error && (
            <p className="text-sm text-rose-400">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-xl bg-brand/20 hover:bg-brand/30 text-brand px-4 py-2 border border-brand/30"
          >
            {mode === "login" ? "Log In" : "Register & Log In"}
          </button>
        </form>
        <button
          className="mt-4 text-xs text-slate-400 hover:text-brand underline"
          onClick={() =>
            setMode(mode === "login" ? "register" : "login")
          }
        >
          {mode === "login"
            ? "Need an account? Register"
            : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
}

export default Login;
