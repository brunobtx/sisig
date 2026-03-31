import { Resend } from 'resend';
import { AppError } from '../../../../../shared/errors/AppError';

export type SendPasswordResetEmailInput = {
  to: string;
  name: string;
  resetLink: string;
  expiresInMinutes: number;
};

export interface PasswordResetMailer {
  assertConfigured(): void;
  send(input: SendPasswordResetEmailInput): Promise<void>;
}

type ResendPasswordResetMailerOptions = {
  apiKey: string;
  from: string;
  replyTo?: string;
};

export class ConsolePasswordResetMailer implements PasswordResetMailer {
  assertConfigured(): void {}

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

export class MisconfiguredPasswordResetMailer implements PasswordResetMailer {
  constructor(private readonly message: string) {}

  assertConfigured(): void {
    throw new AppError(this.message, 500);
  }

  async send(): Promise<void> {
    this.assertConfigured();
  }
}

export class ResendPasswordResetMailer implements PasswordResetMailer {
  private readonly resend: Resend;

  constructor(private readonly options: ResendPasswordResetMailerOptions) {
    this.resend = new Resend(options.apiKey);
  }

  assertConfigured(): void {}

  async send(input: SendPasswordResetEmailInput): Promise<void> {
    try {
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
        console.error('[PASSWORD_RESET_MAILER] Resend rejeitou o envio.', {
          to: maskEmail(input.to),
          from: this.options.from,
          message: error.message,
          name: error.name,
        });
        throw new Error(`Falha ao enviar e-mail com Resend: ${error.message}`);
      }
    } catch (error) {
      if (!(error instanceof Error && error.message.startsWith('Falha ao enviar e-mail com Resend:'))) {
        console.error('[PASSWORD_RESET_MAILER] Erro inesperado ao enviar e-mail.', {
          to: maskEmail(input.to),
          from: this.options.from,
          message: error instanceof Error ? error.message : String(error),
        });
      }

      throw error;
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
  const apiKey = readEnv('RESEND_API_KEY');
  const from = readEnv('MAIL_FROM') ?? readEnv('RESEND_FROM_EMAIL');
  const replyTo = readEnv('MAIL_REPLY_TO');
  const isProduction = readEnv('NODE_ENV') === 'production';

  if (apiKey && from) {
    if (isResendTestSender(from)) {
      if (isProduction) {
        return new MisconfiguredPasswordResetMailer(
          'MAIL_FROM nao pode usar o remetente de teste da Resend em producao. Configure um dominio verificado.',
        );
      }

      console.warn(
        '[PASSWORD_RESET_MAILER] Remetente de teste da Resend detectado em ambiente local. Usando mailer de console para permitir testes com e-mails locais.',
      );

      return new ConsolePasswordResetMailer();
    }

    return new ResendPasswordResetMailer({
      apiKey,
      from,
      replyTo,
    });
  }

  const misconfigurationMessage =
    'Envio de redefinicao de senha nao configurado. Defina RESEND_API_KEY e MAIL_FROM.';

  if (isProduction) {
    return new MisconfiguredPasswordResetMailer(misconfigurationMessage);
  }

  console.warn('[PASSWORD_RESET_MAILER]', `${misconfigurationMessage} Usando mailer de console.`);

  return new ConsolePasswordResetMailer();
}

function readEnv(name: string): string | undefined {
  const rawValue = process.env[name]?.trim();

  if (!rawValue) {
    return undefined;
  }

  const normalizedValue = stripWrappingQuotes(rawValue).trim();

  return normalizedValue ? normalizedValue : undefined;
}

function stripWrappingQuotes(value: string): string {
  if (value.length < 2) {
    return value;
  }

  const firstChar = value[0];
  const lastChar = value[value.length - 1];
  const hasMatchingQuotes =
    (firstChar === '"' && lastChar === '"') ||
    (firstChar === '\'' && lastChar === '\'');

  return hasMatchingQuotes ? value.slice(1, -1) : value;
}

function isResendTestSender(from: string): boolean {
  const senderAddressMatch = from.match(/<([^>]+)>/);
  const senderAddress = (senderAddressMatch?.[1] ?? from).trim().toLowerCase();

  return senderAddress.endsWith('@resend.dev');
}

function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');

  if (!localPart || !domain) {
    return '[invalid-email]';
  }

  const visibleLocalPart = localPart.slice(0, 2);

  return `${visibleLocalPart}${'*'.repeat(Math.max(localPart.length - visibleLocalPart.length, 1))}@${domain}`;
}
