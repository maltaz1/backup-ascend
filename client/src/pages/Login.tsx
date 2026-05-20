import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Tab = "login" | "signup";

export default function Login() {
  const [tab, setTab] = useState<Tab>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }
    alert("Conta criada!");
    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log("LOGIN:", data, error);
    if (error) alert(error.message);
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0b0d14;
          font-family: 'Sora', sans-serif;
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          margin: 0 16px;
          background: #0f1120;
          border: 1px solid #1e2035;
          border-radius: 16px;
          padding: 36px 32px;
        }

        .logo-area {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
          justify-content: center;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #5b5fef;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-icon svg {
          width: 18px;
          height: 18px;
          fill: none;
          stroke: white;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .logo-name {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #fff;
        }

        .tab-switcher {
          display: flex;
          border-bottom: 1px solid #1e2035;
          margin-bottom: 28px;
          gap: 0;
        }

        .tab-btn {
          flex: 1;
          padding: 10px 0;
          border: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          background: transparent;
          color: #4a4f6a;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
          letter-spacing: 0.01em;
        }

        .tab-btn:hover {
          color: #9097c0;
        }

        .tab-btn.active {
          color: #fff;
          border-bottom-color: #5b5fef;
        }

        .greeting {
          margin-bottom: 24px;
        }

        .greeting h2 {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 5px;
          letter-spacing: -0.01em;
        }

        .greeting p {
          font-size: 13px;
          color: #4a4f6a;
          margin: 0;
          font-weight: 400;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 20px;
        }

        .field-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.07em;
          color: #4a4f6a;
          text-transform: uppercase;
          margin-bottom: 7px;
          display: block;
        }

        .field-wrap {
          position: relative;
        }

        .field-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #2e3250;
          pointer-events: none;
          display: flex;
          align-items: center;
        }

        .field-icon svg {
          width: 15px;
          height: 15px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .field-input {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 13px 12px 40px;
          background: #0b0d18;
          border: 1px solid #1e2035;
          border-radius: 9px;
          color: #e8eaf6;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 400;
          outline: none;
          transition: border-color 0.15s;
          -webkit-text-fill-color: #e8eaf6;
        }

        .field-input::placeholder {
          color: #2e3250;
        }

        .field-input:focus {
          border-color: #5b5fef;
        }

        .field-input:-webkit-autofill,
        .field-input:-webkit-autofill:hover,
        .field-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #0b0d18 inset;
          -webkit-text-fill-color: #e8eaf6;
          caret-color: #e8eaf6;
        }

        .password-toggle {
          position: absolute;
          right: 13px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #2e3250;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }

        .password-toggle:hover {
          color: #5b5fef;
        }

        .password-toggle svg {
          width: 15px;
          height: 15px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .password-input {
          padding-right: 42px;
        }

        .forgot-link {
          display: block;
          text-align: right;
          margin-top: 7px;
          font-size: 12px;
          color: #5b5fef;
          cursor: pointer;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.15s;
        }

        .forgot-link:hover {
          color: #818cf8;
        }

        .btn-primary {
          width: 100%;
          padding: 13px;
          border-radius: 9px;
          border: none;
          background: #5b5fef;
          color: white;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-primary:hover:not(:disabled) {
          background: #4f53d8;
        }

        .btn-primary:active:not(:disabled) {
          transform: scale(0.99);
        }

        .btn-primary:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .btn-arrow svg {
          width: 15px;
          height: 15px;
          fill: none;
          stroke: white;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .switch-link {
          margin-top: 18px;
          text-align: center;
          font-size: 13px;
          color: #4a4f6a;
          font-weight: 400;
        }

        .switch-link button {
          background: none;
          border: none;
          color: #5b5fef;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          margin-left: 4px;
          transition: color 0.15s;
        }

        .switch-link button:hover {
          color: #818cf8;
        }
      `}</style>

      <div className="login-root">
        <div className="login-card">

          {/* Logo */}
          <div className="logo-area">
            <div className="logo">
              <img src="/src/image/Logo-TaskBar.png" alt="FlowZone Logo" style={{ width: 128, height: 90, flexShrink: 0, margin: 0}} />
            </div>
            
          </div>

          {/* Tab switcher */}
          <div className="tab-switcher">
            <button
              className={`tab-btn ${tab === "login" ? "active" : ""}`}
              onClick={() => setTab("login")}
            >
              Entrar
            </button>
            <button
              className={`tab-btn ${tab === "signup" ? "active" : ""}`}
              onClick={() => setTab("signup")}
            >
              Criar conta
            </button>
          </div>

          {/* Login */}
          {tab === "login" && (
            <>
              <div className="greeting">
                <h2>Bem-vindo de volta</h2>
                <p>Continue de onde parou</p>
              </div>

              <div className="field-group">
                <div>
                  <label className="field-label">Email</label>
                  <div className="field-wrap">
                    <span className="field-icon">
                      <svg viewBox="0 0 24 24">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <polyline points="2,4 12,13 22,4" />
                      </svg>
                    </span>
                    <input
                      className="field-input"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="field-label">Senha</label>
                  <div className="field-wrap">
                    <span className="field-icon">
                      <svg viewBox="0 0 24 24">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      className={`field-input password-input`}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button
                      className="password-toggle"
                      onClick={() => setShowPassword(v => !v)}
                      type="button"
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <a className="forgot-link">Esqueci a senha</a>
                </div>
              </div>

              <button className="btn-primary" onClick={handleLogin} disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
                {!loading && (
                  <span className="btn-arrow">
                    <svg viewBox="0 0 24 24">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                )}
              </button>

              <div className="switch-link">
                Não tem uma conta?
                <button onClick={() => setTab("signup")}>Criar conta</button>
              </div>
            </>
          )}

          {/* Signup */}
          {tab === "signup" && (
            <>
              <div className="greeting">
                <h2>Comece agora</h2>
                <p>Crie sua conta e evolua todo dia</p>
              </div>

              <div className="field-group">
                <div>
                  <label className="field-label">Nome</label>
                  <div className="field-wrap">
                    <span className="field-icon">
                      <svg viewBox="0 0 24 24">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <input
                      className="field-input"
                      type="text"
                      placeholder="Seu nome"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="field-label">Email</label>
                  <div className="field-wrap">
                    <span className="field-icon">
                      <svg viewBox="0 0 24 24">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <polyline points="2,4 12,13 22,4" />
                      </svg>
                    </span>
                    <input
                      className="field-input"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="field-label">Senha</label>
                  <div className="field-wrap">
                    <span className="field-icon">
                      <svg viewBox="0 0 24 24">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      className={`field-input password-input`}
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button
                      className="password-toggle"
                      onClick={() => setShowPassword(v => !v)}
                      type="button"
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button className="btn-primary" onClick={handleSignup} disabled={loading}>
                {loading ? "Criando conta..." : "Criar conta"}
                {!loading && (
                  <span className="btn-arrow">
                    <svg viewBox="0 0 24 24">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                )}
              </button>

              <div className="switch-link">
                Já tem uma conta?
                <button onClick={() => setTab("login")}>Entrar</button>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}