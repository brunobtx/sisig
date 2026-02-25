export type SendPasswordResetEmailInput = {
  to: string;
  name: string;
  resetLink: string;
  expiresInMinutes: number;
};

export interface PasswordResetMailer {
  send(input: SendPasswordResetEmailInput): Promise<void>;
}

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
