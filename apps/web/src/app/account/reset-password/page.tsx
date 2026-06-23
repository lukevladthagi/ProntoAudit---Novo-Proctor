"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const tokenError = searchParams.get("error");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    tokenError ? "O link de redefinição é inválido ou expirou." : null
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!token) {
      setError("Token de redefinição não encontrado. Solicite um novo link.");
      return;
    }

    if (password.length < 8) {
      setError("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas informadas não conferem.");
      return;
    }

    setLoading(true);
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        newPassword: password,
      }),
    });
    setLoading(false);

    if (!response.ok) {
      setError("Não foi possível alterar a senha. Solicite um novo link e tente novamente.");
      return;
    }

    setMessage("Senha alterada com sucesso. Você já pode entrar com a nova senha.");
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
            Criar nova senha
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Digite uma nova senha para acessar o ProntoAudit.
          </p>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">
                Nova senha
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">
                Confirmar senha
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

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
            disabled={loading || !token}
            className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Alterando..." : "Alterar senha"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
