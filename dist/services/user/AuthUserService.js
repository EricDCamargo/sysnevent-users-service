"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUserervice = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
class AuthUserervice {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password }) {
            const user = yield prisma_1.default.user.findUnique({
                where: { email }
            });
            if (!user) {
                throw new AppError_1.AppError('Usuario não encontrado, credenciais incoretas!', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const passwordMatch = yield (0, bcryptjs_1.compare)(password, user.password);
            if (!passwordMatch) {
                throw new AppError_1.AppError('Senha incorreta!', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const token = (0, jsonwebtoken_1.sign)({
                name: user.name,
                email: user.email,
                role: user.role
            }, process.env.JWT_SECRET, {
                subject: user.id,
                expiresIn: '1d'
            });
            return {
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token,
                    needsSecretWordSetup: !user.secretWord
                },
                message: user.secretWord
                    ? 'Login realizado com sucesso!'
                    : 'Palavra secreta ainda não cadastrada, cadastre para prosseguir!'
            };
        });
    }
}
exports.AuthUserervice = AuthUserervice;
