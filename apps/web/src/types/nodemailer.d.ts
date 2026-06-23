declare module "nodemailer" {
  type TransportOptions = Record<string, unknown>;

  interface SendMailOptions {
    from?: string;
    to?: string;
    subject?: string;
    text?: string;
    html?: string;
  }

  interface Transporter {
    sendMail(options: SendMailOptions): Promise<unknown>;
  }

  export function createTransport(options: TransportOptions): Transporter;
}
