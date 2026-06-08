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
  async createUser(userData: CreateUserData) {
    return prisma.user.create({
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }

  async findUserByEmailWithPasswordHash(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        passwordHash: true,
      },
    });
  }

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
  }

  async findPublicUserById(id: number) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
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
