import { createTransport } from "nodemailer";

interface PasswordResetEmail {
  to: string;
  name?: string | null;
  resetUrl: string;
}

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

function getTransporter() {
  const port = Number(process.env.SMTP_PORT ?? 587);

  return createTransport({
    host: requiredEnv("SMTP_HOST"),
    port,
    secure: port === 465,
    auth: {
      user: requiredEnv("SMTP_USER"),
      pass: requiredEnv("SMTP_PASSWORD"),
    },
  });
}

export async function sendPasswordResetEmail({ to, name, resetUrl }: PasswordResetEmail) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const displayName = name?.trim() || "usuário";

  await getTransporter().sendMail({
    from,
    to,
    subject: "Redefinição de senha - ProntoAudit",
    text: [
      `Olá, ${displayName}.`,
      "",
      "Recebemos uma solicitação para redefinir sua senha no ProntoAudit.",
      "Acesse o link abaixo para cadastrar uma nova senha:",
      "",
      resetUrl,
      "",
      "Se você não solicitou essa alteração, ignore este e-mail.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #172033;">
        <h2 style="color: #06275c;">Redefinição de senha</h2>
        <p>Olá, ${displayName}.</p>
        <p>Recebemos uma solicitação para redefinir sua senha no ProntoAudit.</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; background: #06275c; color: #ffffff; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-weight: 700;">
            Alterar minha senha
          </a>
        </p>
        <p>Se o botão não abrir, copie e cole este link no navegador:</p>
        <p style="word-break: break-all; color: #44516a;">${resetUrl}</p>
        <p style="font-size: 12px; color: #667085;">Se você não solicitou essa alteração, ignore este e-mail.</p>
      </div>
    `,
  });
}
