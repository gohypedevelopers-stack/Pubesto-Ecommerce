"use client";

import "../../auth.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, Lock, Mail, UserRound } from "lucide-react";
import { useStore } from "../../../components/StoreContext";

const EMPTY_LOGIN = { email: "", password: "" };
const EMPTY_SIGNUP = { name: "", email: "", phone: "", password: "" };

export default function AccountLoginPage() {
  const router = useRouter();
  const { user, isAuthLoading, refreshAuthSession } = useStore();
  const [mode, setMode] = useState("login");
  const [redirectTo, setRedirectTo] = useState("/account");
  const [loginForm, setLoginForm] = useState(EMPTY_LOGIN);
  const [signupForm, setSignupForm] = useState(EMPTY_SIGNUP);
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextMode = params.get("mode");
    const nextRedirect = params.get("redirect");
    if (["login", "signup", "forgot"].includes(nextMode)) setMode(nextMode);
    if (nextRedirect?.startsWith("/")) setRedirectTo(nextRedirect);
  }, []);

  useEffect(() => {
    if (!isAuthLoading && user) {
      router.replace(redirectTo);
    }
  }, [isAuthLoading, redirectTo, router, user]);

  function switchMode(nextMode) {
    setMode(nextMode);
    setMessage("");
    setResetUrl("");

    const params = new URLSearchParams(window.location.search);
    if (nextMode === "login") {
      params.delete("mode");
    } else {
      params.set("mode", nextMode);
    }
    if (redirectTo !== "/account") {
      params.set("redirect", redirectTo);
    }

    const query = params.toString();
    window.history.replaceState(null, "", query ? `/account/login?${query}` : "/account/login");
  }

  function setLoginField(field, value) {
    setLoginForm((current) => ({ ...current, [field]: value }));
  }

  function setSignupField(field, value) {
    setSignupForm((current) => ({ ...current, [field]: value }));
  }

  async function submitAuth(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setResetUrl("");

    try {
      const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const payload = mode === "signup" ? signupForm : loginForm;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Could not continue.");
        return;
      }

      await refreshAuthSession?.();
      router.push(redirectTo);
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function submitForgot(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setResetUrl("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Could not start password reset.");
        return;
      }

      setMessage(data.message);
      setResetUrl(data.resetUrl || "");
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-panel auth-copy-panel">
          <span className="auth-eyebrow">Pubesto Account</span>
          <h1>Sign in without leaving Pubesto.</h1>
          <p>
            Manage saved addresses, wishlist, returns, and order preferences from a branded account area on this domain.
          </p>
          <div className="auth-benefits">
            <span><CheckCircle size={16} /> Faster checkout details</span>
            <span><CheckCircle size={16} /> Saved delivery addresses</span>
            <span><CheckCircle size={16} /> Account support history</span>
          </div>
        </div>

        <div className="auth-panel auth-form-panel">
          <div className="auth-tabs" role="tablist" aria-label="Account actions">
            <button className={mode === "login" ? "active" : ""} type="button" role="tab" aria-selected={mode === "login"} onClick={() => switchMode("login")}>
              Login
            </button>
            <button className={mode === "signup" ? "active" : ""} type="button" role="tab" aria-selected={mode === "signup"} onClick={() => switchMode("signup")}>
              Signup
            </button>
            <button className={mode === "forgot" ? "active" : ""} type="button" role="tab" aria-selected={mode === "forgot"} onClick={() => switchMode("forgot")}>
              Forgot
            </button>
          </div>

          {mode === "forgot" ? (
            <form className="auth-form" onSubmit={submitForgot}>
              <h2>Reset password</h2>
              <label>
                <span>Email address</span>
                <div className="auth-input-wrap">
                  <Mail size={18} />
                  <input
                    name="email"
                    type="email"
                    value={forgotEmail}
                    onChange={(event) => setForgotEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </label>
              {message ? <p className="auth-message">{message}</p> : null}
              {resetUrl ? (
                <Link className="auth-reset-link" href={resetUrl}>
                  Continue to reset password
                </Link>
              ) : null}
              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? "Preparing..." : "Send reset link"}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={submitAuth}>
              <h2>{mode === "signup" ? "Create your account" : "Welcome back"}</h2>
              {mode === "signup" ? (
                <>
                  <label>
                    <span>Full name</span>
                    <div className="auth-input-wrap">
                      <UserRound size={18} />
                      <input
                        name="name"
                        value={signupForm.name}
                        onChange={(event) => setSignupField("name", event.target.value)}
                        placeholder="Your name"
                        autoComplete="name"
                        required
                      />
                    </div>
                  </label>
                  <label>
                    <span>Phone</span>
                    <div className="auth-input-wrap">
                      <UserRound size={18} />
                      <input
                        name="tel"
                        value={signupForm.phone}
                        onChange={(event) => setSignupField("phone", event.target.value)}
                        placeholder="Optional"
                        autoComplete="tel"
                        inputMode="tel"
                      />
                    </div>
                  </label>
                </>
              ) : null}
              <label>
                <span>Email address</span>
                <div className="auth-input-wrap">
                  <Mail size={18} />
                  <input
                    name="email"
                    type="email"
                    value={mode === "signup" ? signupForm.email : loginForm.email}
                    onChange={(event) => mode === "signup" ? setSignupField("email", event.target.value) : setLoginField("email", event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </label>
              <label>
                <span>Password</span>
                <div className="auth-input-wrap">
                  <Lock size={18} />
                  <input
                    name={mode === "signup" ? "new-password" : "current-password"}
                    type="password"
                    value={mode === "signup" ? signupForm.password : loginForm.password}
                    onChange={(event) => mode === "signup" ? setSignupField("password", event.target.value) : setLoginField("password", event.target.value)}
                    placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    required
                    minLength={8}
                  />
                </div>
              </label>
              {message ? <p className="auth-message error">{message}</p> : null}
              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Login"}
              </button>
              {mode === "login" ? (
                <button className="auth-link-button" type="button" onClick={() => switchMode("forgot")}>
                  Forgot your password?
                </button>
              ) : null}
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
