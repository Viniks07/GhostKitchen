import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { AuthRepository } from "./auth.repository.js";
import { AppError } from "../../shared/errors/AppError.js";
import type { RegisterDTO, LoginDTO } from "./auth.dto.js";
import type { CreateUserData } from "./auth.repository.js";
import type { UserRole } from "@prisma/client";

const authRepository = new AuthRepository();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class AuthService {
  private toPublicUser(user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  }) {
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }

  async register(data: RegisterDTO) {
    if (!data.name || !data.name.trim()) {
      throw new AppError("Nome é obrigatório", 400);
    }
    const name: string = data.name.trim();

    if (!data.email || !data.email.trim()) {
      throw new AppError("Email é obrigatório", 400);
    }
    const email: string = data.email.trim().toLowerCase();

    if (!emailRegex.test(email)) {
      throw new AppError("Email inválido", 400);
    }

    if (!data.password) {
      throw new AppError("Senha é obrigatória", 400);
    }

    if (data.password.length < 8 || data.password.length > 72) {
      throw new AppError("Senha deve ter entre 8 e 72 caracteres", 400);
    }

    if (name.length > 100) {
      throw new AppError("Nome deve ter no máximo 100 caracteres", 400);
    }

    if (email.length > 255) {
      throw new AppError("Email deve ter no máximo 255 caracteres", 400);
    }

    if (data.role !== "CLIENT" && data.role !== "RESTAURANT") {
      throw new AppError(`Tipo de usuário inválido`, 400);
    }

    if (await authRepository.findUserByEmail(email)) {
      throw new AppError("Email já cadastrado", 409);
    }
    const passwordHash = await bcrypt.hash(data.password, 12);

    const userData: CreateUserData = {
      name: name,
      email: email,
      passwordHash: passwordHash,
      role: data.role,
    };

    const user = await authRepository.createUser(userData);

    const publicUser = this.toPublicUser(user);

    return publicUser;
  }

  async login(data: LoginDTO) {
    if (!data.email || !data.email.trim()) {
      throw new AppError("Email é obrigatório", 400);
    }
    const email: string = data.email.trim().toLowerCase();

    if (!emailRegex.test(email)) {
      throw new AppError("Email inválido", 400);
    }

    if (email.length > 255) {
      throw new AppError("Email deve ter no máximo 255 caracteres", 400);
    }

    if (!data.password) {
      throw new AppError("Senha é obrigatória", 400);
    }

    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new AppError("Email ou senha inválidos", 401);
    }

    const passwordMatch = await bcrypt.compare(
      data.password,
      user.passwordHash,
    );

    if (!passwordMatch) {
      throw new AppError("Email ou senha inválidos", 401);
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new AppError("JWT_SECRET não configurado", 500);
    }

    const expiresIn = Number(process.env.SESSION_EXPIRES_IN);

    if (isNaN(expiresIn) || expiresIn <= 0) {
      throw new AppError("SESSION_EXPIRES_IN inválido", 500);
    }

    const accessToken = jwt.sign({ id: user.id, role: user.role }, jwtSecret, {
      expiresIn: Math.floor(expiresIn / 1000),
    });

    const tokenHash = crypto
      .createHash("sha256")
      .update(accessToken)
      .digest("hex");

    await authRepository.createSession({
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + expiresIn),
    });

    const publicUser = this.toPublicUser(user);

    return { user: publicUser, accessToken, tokenMaxAge: expiresIn };
  }
}
