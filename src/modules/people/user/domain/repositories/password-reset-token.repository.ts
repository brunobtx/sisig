export type PasswordResetTokenRecord = {
  id: number;
  userId: number;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
};

export interface PasswordResetTokenRepository {
  create(params: {
    userId: number;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void>;
  findValidByTokenHash(tokenHash: string, now: Date): Promise<PasswordResetTokenRecord | null>;
  invalidateAllByUserId(userId: number): Promise<void>;
  markAsUsed(id: number): Promise<void>;
  deleteExpired(now: Date): Promise<void>;
}
