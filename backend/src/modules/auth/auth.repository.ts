import { prisma } from "../../shared/database/prisma.js";
import { UserRole } from "@prisma/client";

export type CreateUserData = {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
};

export type CreateSessionData = {
  userId: number;
  tokenHash: string;
  expiresAt: Date;
};

export class AuthRepository {
  async createUser(data: CreateUserData) {
    return prisma.user.create({
      data,
    });
  }

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findUserById(id: number) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async createSession(data: CreateSessionData) {
    return prisma.session.create({
      data,
    });
  }

  async findSessionByTokenHash(tokenHash: string) {
    return prisma.session.findUnique({
      where: {
        tokenHash,
      },
    });
  }

  async revokeSessionByTokenHash(tokenHash: string) {
    return prisma.session.update({
      where: {
        tokenHash,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}
