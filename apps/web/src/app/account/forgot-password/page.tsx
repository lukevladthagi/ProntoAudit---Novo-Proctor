"use client";

import { useState, type FormEvent } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const origin = window.location.origin;
    const response = await fetch("/api/auth/request-password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        redirectTo: `${origin}/account/reset-password`,
      }),
    });

    setLoading(false);

    if (!response.ok) {
      setError("Não foi possível enviar o e-mail de redefinição. Tente novamente.");
      return;
    }

    setMessage("Se este e-mail estiver cadastrado, enviaremos um link para redefinir sua senha.");
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[linear-gradient(135deg,hsl(210_24%_98%)_0%,hsl(218_62%_93%)_100%)] p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <img
            src="/prontoaudit-logo.png"
            alt="ProntoAudit"
            className="mb-4 h-auto w-80 max-w-full object-contain"
          />
          <p className="text-sm font-medium tracking-[0.22em] text-muted-foreground">
            AUDITORIA INTERNA
          </p>
        </div>

        <form onSubmit={onSubmit} className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <h1 className="mb-2 font-outfit text-xl font-semibold text-card-foreground">
            Esqueci minha senha
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Informe o e-mail cadastrado no seu usuário para receber o link de redefinição.
          </p>

          <label className="mb-1.5 block text-sm font-medium text-card-foreground">
            E-mail
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="seu@email.com.br"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />

          {message && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar link"}
          </button>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            <a href="/account/signin" className="font-medium text-primary hover:underline">
              Voltar para o login
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
