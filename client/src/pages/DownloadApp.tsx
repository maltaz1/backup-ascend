import React, { useState, useEffect } from "react";
import {
  Download,
  CheckCircle2,
  Smartphone,
  Zap,
  Copy,
  Check,
  ArrowDown,
  Share2,
  QrCode,
} from "lucide-react";
import { showToast } from "@/components/ui/FlowToast";
import { usePWA } from "@/hooks/usePWA";

const APP_URL = "https://ascend-lac-zeta.vercel.app";

type Platform = "android" | "ios" | "desktop" | "unknown";

export default function DownloadApp() {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    detectPlatform();
  }, []);

  useEffect(() => {
    console.log("PWA STATUS", { isInstallable, isInstalled, platform });
  }, [isInstallable, isInstalled, platform]);

  const detectPlatform = () => {
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) setPlatform("android");
    else if (/iphone|ipad|ipod/i.test(ua)) setPlatform("ios");
    else setPlatform("desktop");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(APP_URL);
    setCopied(true);
    showToast("Link copiado! 📋", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Ascend",
          text: "Instale o Ascend e abra direto da tela inicial.",
          url: APP_URL,
        });
      } catch (error) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const generateQRCodeUrl = () =>
    `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(APP_URL)}&bgcolor=0d0d14&color=a78bfa&margin=16`;

  const benefits = [
    { icon: Zap, label: "Acesso rápido", desc: "Um toque da tela inicial", color: "#F59E0B" },
    { icon: Smartphone, label: "Ícone nativo", desc: "Aparência de app real", color: "#A78BFA" },
    { icon: CheckCircle2, label: "Full experience", desc: "Interface completa", color: "#34D399" },
    { icon: Download, label: "Sem loja", desc: "Zero espaço ocupado", color: "#60A5FA" },
  ];

  const steps = {
    android: [
      { n: "01", title: "Toque em Instalar Agora", sub: "O banner do navegador será exibido automaticamente" },
      { n: "02", title: "Confirme a instalação", sub: "Toque em Instalar na caixa de diálogo do Chrome" },
      { n: "03", title: "Pronto! ✦", sub: "O ícone do Ascend aparece na sua tela inicial" },
    ],
    ios: [
      { n: "01", title: "Toque no botão Compartilhar", sub: "Ícone ↑ na barra inferior do Safari" },
      { n: "02", title: "Adicionar à Tela de Início", sub: "Role a lista de ações para encontrar esta opção" },
      { n: "03", title: "Confirme e pronto! ✦", sub: "Toque em Adicionar — o app estará na sua home" },
    ],
  };

  return (
    <div
      style={{
        fontFamily: "'Sora', sans-serif",
        maxWidth: 900,
        margin: "0 auto",
        padding: "0 4px",
        animation: "fadeUp 0.4s ease both",
      }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 0.15; transform: scale(1.06); }
        }
        .dl-card {
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          backdrop-filter: blur(12px);
        }
        .dl-primary-btn {
          background: #6D28D9;
          color: #fff;
          border: none;
          border-radius: 14px;
          font-family: 'Sora', sans-serif;
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 0.01em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 24px;
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .dl-primary-btn:hover:not(:disabled) {
          background: #7C3AED;
          transform: translateY(-1px);
        }
        .dl-primary-btn:disabled {
          opacity: 0.6;
          cursor: default;
        }
        .dl-ghost-btn {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.75);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          font-family: 'Sora', sans-serif;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 20px;
          transition: all 0.18s ease;
        }
        .dl-ghost-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.18);
        }
        .benefit-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 20px;
          transition: all 0.2s ease;
          flex: 1 1 160px;
        }
        .benefit-card:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-2px);
        }
        .step-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px;
          border-radius: 14px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.05);
          transition: background 0.2s;
        }
        .step-row:hover { background: rgba(255,255,255,0.04); }
        .hero-card {
          background: linear-gradient(135deg, #5B21B6 0%, #7C3AED 55%, #A855F7 100%);
          border-radius: 28px;
          padding: 28px;
          box-shadow: 0 26px 80px rgba(92, 33, 132, 0.18);
          overflow: hidden;
          position: relative;
          margin-bottom: 24px;
          color: white;
        }
        .hero-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top right, rgba(255,255,255,0.15), transparent 45%);
          pointer-events: none;
        }
        .hero-card-inner {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .hero-card__icon {
          width: 88px;
          height: 88px;
          border-radius: 28px;
          background: rgba(255,255,255,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12);
          flex-shrink: 0;
        }
        .hero-card__title {
          font-size: 28px;
          font-weight: 800;
          margin: 0 0 8px;
          line-height: 1.05;
        }
        .hero-card__subtitle {
          margin: 0;
          color: rgba(255,255,255,0.82);
          font-size: 15px;
          max-width: 520px;
        }
        .hero-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 18px;
        }
        .hero-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 22px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.18);
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
          min-width: 160px;
        }
        .hero-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 40px rgba(0,0,0,0.12);
        }
        .hero-btn--primary {
          background: white;
          color: #5B21B6;
          border-color: transparent;
        }
        .hero-btn--secondary {
          background: rgba(255,255,255,0.12);
          color: white;
        }
        .hero-btn--success {
          background: rgba(34,197,94,0.18);
          color: #D9F99D;
          border-color: rgba(34,197,94,0.3);
        }
        .hero-status {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 12px;
          padding: 12px 16px;
          border-radius: 16px;
          background: rgba(34,197,94,0.12);
          border: 1px solid rgba(34,197,94,0.22);
          color: #D9F99D;
          font-size: 14px;
        }
        .hero-card__note {
          margin-top: 10px;
          color: rgba(255,255,255,0.7);
          font-size: 13px;
        }
        .desktop-qr-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 18px;
        }
        .desktop-qr-actions button {
          min-width: 160px;
        }
        .copy-field {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 12px 14px;
        }
        @media (max-width: 600px) {
          .desktop-grid { grid-template-columns: 1fr !important; }
          .header-row { flex-direction: column !important; align-items: stretch !important; }
          .header-actions { width: 100%; }
          .header-actions button { flex: 1; }
          .benefits-row { flex-wrap: wrap; }
          .hero-card { padding: 22px; }
          .hero-card__title { font-size: 24px; }
          .hero-card__icon { width: 72px; height: 72px; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <div
        className="header-row"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 28,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#6D28D9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Download size={16} color="#fff" />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>
              Baixar App
            </h1>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>
            Instale em qualquer dispositivo em segundos
          </p>
        </div>

        <div className="header-actions" style={{ display: "flex", gap: 10 }}>
          {!isInstalled && (
            <button className="dl-ghost-btn" onClick={shareLink}>
              <Share2 size={15} />
              Compartilhar
            </button>
          )}
        </div>
      </div>

      <div className="hero-card">
        <div className="hero-card-inner">
          <div>
            <div className="hero-card__icon">
              <Download size={34} />
            </div>
            <div style={{ marginTop: 18 }}>
              <p className="hero-card__note">Instale o Ascend</p>
              <h2 className="hero-card__title">Tenha acesso instantâneo diretamente da tela inicial.</h2>
              <p className="hero-card__subtitle">Use o Ascend como um aplicativo nativo no seu dispositivo.</p>
              {!isInstallable && !isInstalled && (
                <p className="hero-card__note" style={{ marginTop: 14, opacity: 0.9 }}>
                  Seu navegador ainda não disponibilizou a instalação automática.
                </p>
              )}
            </div>
          </div>

          <div className="hero-actions">
            {isInstalled ? (
              <>
                <button
                  className="hero-btn hero-btn--success"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                >
                  🚀 Abrir Aplicativo
                </button>
                <div className="hero-status">
                  ✓ Ascend instalado
                </div>
              </>
            ) : isInstallable ? (
              <button
                className="hero-btn hero-btn--primary"
                onClick={async () => {
                  const ok = await installApp();
                  if (ok) showToast("Ascend instalado com sucesso! 🎉", "success");
                }}
              >
                📲 Instalar Agora
              </button>
            ) : (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "flex-start" }}>
                <button className="hero-btn hero-btn--secondary" onClick={copyToClipboard}>
                  📋 Copiar Link
                </button>
                <button className="hero-btn hero-btn--secondary" onClick={shareLink}>
                  📱 Compartilhar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── INSTALLED BADGE ── */}
      {isInstalled && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "16px 20px",
            borderRadius: 20,
            background: "rgba(34,197,94,0.12)",
            border: "1px solid rgba(34,197,94,0.22)",
            marginBottom: 20,
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "rgba(34,197,94,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Check size={20} color="#34D399" />
            </div>
            <div>
              <p style={{ fontWeight: 700, color: "#ECFDF5", margin: 0, fontSize: 15 }}>
                ✓ Ascend instalado com sucesso
              </p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: "4px 0 0" }}>
                Você já possui o aplicativo instalado e pode acessá-lo pela tela inicial.
              </p>
            </div>
          </div>
          <button
            className="hero-btn hero-btn--success"
            onClick={() => {
              window.location.href = "/";
            }}
            style={{ marginLeft: "auto" }}
          >
            Abrir Aplicativo
          </button>
        </div>
      )}

      {/* ── PLATFORM SECTIONS ── */}

      {/* ANDROID */}
      {platform === "android" && !isInstalled && (
        <div className="dl-card" style={{ padding: 24, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 22 }}>🤖</span>
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Android</h2>
          </div>
          {isInstallable ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {steps.android.map((s, i) => (
                <div className="step-row" key={i}>
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "rgba(167,139,250,0.7)",
                      flexShrink: 0,
                      marginTop: 2,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {s.n}
                  </span>
                  <div>
                    <p style={{ fontWeight: 600, margin: 0, fontSize: 14 }}>{s.title}</p>
                    <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { n: "01", title: "Abra no Chrome", sub: "Use o navegador Chrome no Android." },
                { n: "02", title: "Toque em ⋮", sub: "Abra o menu do navegador no canto superior direito." },
                { n: "03", title: "Adicionar à tela inicial", sub: "Escolha esta opção para instalar o Ascend." },
              ].map((s, i) => (
                <div className="step-row" key={i}>
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "rgba(250,159,74,0.85)",
                      flexShrink: 0,
                      marginTop: 2,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {s.n}
                  </span>
                  <div>
                    <p style={{ fontWeight: 600, margin: 0, fontSize: 14 }}>{s.title}</p>
                    <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{s.sub}</p>
                  </div>
                </div>
              ))}
              <div
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: "rgba(245,158,11,0.08)",
                  border: "1px solid rgba(245,158,11,0.2)",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.65)",
                }}
              >
                Se ainda não aparecer, tente abrir este link diretamente no Chrome e atualizar.
              </div>
            </div>
          )}
        </div>
      )}

      {/* iOS */}
      {platform === "ios" && !isInstalled && (
        <div className="dl-card" style={{ padding: 24, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 22 }}>🍎</span>
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>iPhone / iPad</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {steps.ios.map((s, i) => (
              <div className="step-row" key={i}>
                <span
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "rgba(167,139,250,0.7)",
                    flexShrink: 0,
                    marginTop: 2,
                    letterSpacing: "0.05em",
                  }}
                >
                  {s.n}
                </span>
                <div>
                  <p style={{ fontWeight: 600, margin: 0, fontSize: 14 }}>{s.title}</p>
                  <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DESKTOP */}
      {platform === "desktop" && (
        <div className="dl-card" style={{ padding: 28, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <QrCode size={18} style={{ color: "rgba(167,139,250,0.8)" }} />
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Escaneie para instalar no celular</h2>
          </div>

          <div
            className="desktop-grid"
            style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "center" }}
          >
            {/* QR */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  position: "relative",
                  padding: 14,
                  borderRadius: 20,
                  background: "#0d0d14",
                  border: "1px solid rgba(167,139,250,0.18)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: -8,
                    borderRadius: 24,
                    border: "1px solid rgba(167,139,250,0.12)",
                    animation: "pulse-ring 3s ease-in-out infinite",
                  }}
                />
                <img
                  src={generateQRCodeUrl()}
                  alt="QR Code"
                  style={{ width: 160, height: 160, borderRadius: 8, display: "block" }}
                />
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", textAlign: "center", margin: 0 }}>
                Aponte a câmera do celular
              </p>
            </div>

            {/* Link + info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
                  Ou copie o link direto:
                </p>
                <div className="copy-field">
                  <code
                    style={{
                      flex: 1,
                      fontSize: 12,
                      color: "rgba(167,139,250,0.9)",
                      fontFamily: "JetBrains Mono, monospace",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {APP_URL}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "rgba(255,255,255,0.4)",
                      cursor: "pointer",
                      padding: "2px 4px",
                      display: "flex",
                      alignItems: "center",
                      transition: "color 0.15s",
                      flexShrink: 0,
                    }}
                    title="Copiar"
                  >
                    {copied ? (
                      <Check size={14} style={{ color: "#34D399" }} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>

                <div className="desktop-qr-actions">
                  <button className="hero-btn hero-btn--secondary" onClick={() => window.open(APP_URL, "_blank") }>
                    📱 Abrir no Celular
                  </button>
                  <button className="hero-btn hero-btn--primary" onClick={copyToClipboard}>
                    📋 Copiar Link
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  "Compartilhe com amigos e família",
                  "Funciona em qualquer navegador mobile",
                  "Instala direto da tela inicial, sem loja",
                ].map((tip, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "rgba(167,139,250,0.6)",
                        flexShrink: 0,
                      }}
                    />
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── BENEFITS ── */}
      <div style={{ marginBottom: 20 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            marginBottom: 12,
          }}
        >
          Por que instalar?
        </p>
        <div
          className="benefits-row"
          style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
        >
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div className="benefit-card" key={i}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: `${b.color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                  }}
                >
                  <Icon size={16} style={{ color: b.color }} />
                </div>
                <p style={{ fontWeight: 600, fontSize: 13, margin: "0 0 4px" }}>{b.label}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SHARE FOOTER ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "16px 20px",
          borderRadius: 16,
          background: "rgba(124,58,237,0.07)",
          border: "1px solid rgba(124,58,237,0.2)",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>Compartilhe o Ascend</p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "2px 0 0", fontFamily: "JetBrains Mono, monospace" }}>
            {APP_URL}
          </p>
        </div>
        <button
          className="dl-primary-btn"
          onClick={copyToClipboard}
          style={{ padding: "11px 20px", fontSize: 13 }}
        >
          {copied ? <><Check size={14} /> Copiado!</> : <><Copy size={14} /> Copiar Link</>}
        </button>
      </div>
    </div>
  );
}