import prismaClient from '../../../../../prisma';
import { v4 as uuidv4 } from 'uuid';
import {
  PasswordResetTokenRecord,
  PasswordResetTokenRepository,
} from '../../domain/repositories/password-reset-token.repository';

export class PrismaPasswordResetTokenRepository implements PasswordResetTokenRepository {
  async create(params: { userId: number; tokenHash: string; expiresAt: Date }): Promise<void> {
    await prismaClient.$executeRaw`
      INSERT INTO "password_reset_token" ("uuid", "id_user", "token_hash", "expires_at", "updated_at")
      VALUES (${uuidv4()}, ${params.userId}, ${params.tokenHash}, ${params.expiresAt}, NOW())
    `;
  }

  async findValidByTokenHash(tokenHash: string, now: Date): Promise<PasswordResetTokenRecord | null> {
    const rows = await prismaClient.$queryRaw<
      Array<{
        id: number;
        id_user: number;
        token_hash: string;
        expires_at: Date;
        used_at: Date | null;
      }>
    >`
      SELECT "id", "id_user", "token_hash", "expires_at", "used_at"
      FROM "password_reset_token"
      WHERE "token_hash" = ${tokenHash}
        AND "used_at" IS NULL
        AND "expires_at" > ${now}
      ORDER BY "id" DESC
      LIMIT 1
    `;

    const token = rows[0];

    if (!token) return null;

    return {
      id: token.id,
      userId: token.id_user,
      tokenHash: token.token_hash,
      expiresAt: token.expires_at,
      usedAt: token.used_at,
    };
  }

  async invalidateAllByUserId(userId: number): Promise<void> {
    await prismaClient.$executeRaw`
      UPDATE "password_reset_token"
      SET "used_at" = NOW(), "updated_at" = NOW()
      WHERE "id_user" = ${userId}
        AND "used_at" IS NULL
    `;
  }

  async markAsUsed(id: number): Promise<void> {
    await prismaClient.$executeRaw`
      UPDATE "password_reset_token"
      SET "used_at" = NOW(), "updated_at" = NOW()
      WHERE "id" = ${id}
    `;
  }

  async deleteExpired(now: Date): Promise<void> {
    await prismaClient.$executeRaw`
      DELETE FROM "password_reset_token"
      WHERE "expires_at" <= ${now}
    `;
  }
}
