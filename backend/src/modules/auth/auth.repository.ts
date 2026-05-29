import {prisma} from "../../shared/database/prisma.js"
import {UserRole} from "@prisma/client";

export type CreateUserData = {
    name:string;
    email:string;
    passwordHash:string;
    role:UserRole;
}

export type CreateSessionData = {
    userId:number;
    tokenHash:string;
    expiresAt:Date;
}

export class AuthRepository {

    async findUserByEmail(email:string){
        return prisma.user.findUnique({
            where:{
                email
            }
        })

    }

    async createUser(data:CreateUserData){
        return prisma.user.create({
            data
        })
    }

    async createSession(data:CreateSessionData){
        return prisma.session.create({
            data
        })
    }

    async findSessionByTokenHash(tokenHash:string){
        return prisma.session.findUnique({
            where:{
                tokenHash
            }
        })
    }

}