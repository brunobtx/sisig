import { Resend } from 'resend';

export type SendPasswordResetEmailInput = {
  to: string;
  name: string;
  resetLink: string;
  expiresInMinutes: number;
};

export interface PasswordResetMailer {
  send(input: SendPasswordResetEmailInput): Promise<void>;
}

type ResendPasswordResetMailerOptions = {
  apiKey: string;
  from: string;
  replyTo?: string;
};

export class ConsolePasswordResetMailer implements PasswordResetMailer {
  async send(input: SendPasswordResetEmailInput): Promise<void> {
    // Substitua por provider SMTP/API em produção.
    console.log('[PASSWORD_RESET_EMAIL]', {
      to: input.to,
      name: input.name,
      resetLink: input.resetLink,
      expiresInMinutes: input.expiresInMinutes,
    });
  }
}

export class ResendPasswordResetMailer implements PasswordResetMailer {
  private readonly resend: Resend;

  constructor(private readonly options: ResendPasswordResetMailerOptions) {
    this.resend = new Resend(options.apiKey);
  }

  async send(input: SendPasswordResetEmailInput): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.options.from,
      to: input.to,
      replyTo: this.options.replyTo,
      subject: 'Redefinicao de senha',
      text: [
        `Ola, ${input.name}.`,
        '',
        'Recebemos uma solicitacao para redefinir sua senha.',
        `Acesse este link: ${input.resetLink}`,
        `Este link expira em ${input.expiresInMinutes} minutos.`,
        '',
        'Se voce nao solicitou essa alteracao, ignore este e-mail.',
      ].join('\n'),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2 style="margin-bottom: 16px;">Redefinicao de senha</h2>
          <p>Ola, ${escapeHtml(input.name)}.</p>
          <p>Recebemos uma solicitacao para redefinir sua senha.</p>
          <p>
            <a
              href="${escapeHtml(input.resetLink)}"
              style="display: inline-block; background: #111827; color: #ffffff; text-decoration: none; padding: 12px 18px; border-radius: 8px;"
            >
              Redefinir senha
            </a>
          </p>
          <p>Este link expira em ${input.expiresInMinutes} minutos.</p>
          <p>Se voce nao solicitou essa alteracao, ignore este e-mail.</p>
        </div>
      `,
    });

    if (error) {
      throw new Error(`Falha ao enviar e-mail com Resend: ${error.message}`);
    }
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function createPasswordResetMailer(): PasswordResetMailer {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM ?? process.env.RESEND_FROM_EMAIL;
  const replyTo = process.env.MAIL_REPLY_TO;

  if (apiKey && from) {
    return new ResendPasswordResetMailer({
      apiKey,
      from,
      replyTo,
    });
  }

  console.warn(
    '[PASSWORD_RESET_MAILER] Resend nao configurado. Usando mailer de console. Defina RESEND_API_KEY e MAIL_FROM.',
  );

  return new ConsolePasswordResetMailer();
}
