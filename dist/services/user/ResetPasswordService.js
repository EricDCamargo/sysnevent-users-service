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
exports.ResetPasswordService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const bcryptjs_1 = require("bcryptjs");
const AppError_1 = require("../../errors/AppError");
const http_status_codes_1 = require("http-status-codes");
const utils_1 = require("../../utils");
class ResetPasswordService {
    registerSecretWord(user_id, secretWord) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!secretWord) {
                throw new AppError_1.AppError('Palavra-chave é obrigatória!', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const user = yield prisma_1.default.user.findUnique({ where: { id: user_id } });
            if (!user) {
                throw new AppError_1.AppError('Usuário não encontrado!', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            if (user.secretWord) {
                throw new AppError_1.AppError('Palavra-chave já foi cadastrada!', http_status_codes_1.StatusCodes.CONFLICT);
            }
            if (!secretWord || secretWord.length < 6) {
                throw new AppError_1.AppError('A palavra chave deve ter pelo menos 6 caracteres.', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const hashedSecret = yield (0, bcryptjs_1.hash)(secretWord, 8);
            yield prisma_1.default.user.update({
                where: { id: user_id },
                data: { secretWord: hashedSecret }
            });
            return { message: 'Palavra-chave cadastrada com sucesso!' };
        });
    }
    resetPassword(email, secretWord, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_1.default.user.findUnique({ where: { email } });
            if (!user || !user.secretWord) {
                throw new AppError_1.AppError('Usuário não encontrado ou sem palavra-chave cadastrada.', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const isMatch = yield (0, bcryptjs_1.compare)(secretWord, user.secretWord);
            if (!isMatch) {
                throw new AppError_1.AppError('Palavra-chave inválida!', http_status_codes_1.StatusCodes.UNAUTHORIZED);
            }
            if (!utils_1.passwordRegex.test(newPassword)) {
                throw new AppError_1.AppError('A nova senha deve conter no mínimo 6 caracteres, incluindo letras, números e pelo menos um caractere especial.', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const newPasswordHash = yield (0, bcryptjs_1.hash)(newPassword, 8);
            yield prisma_1.default.user.update({
                where: { email },
                data: { password: newPasswordHash }
            });
            return { message: 'Senha redefinida com sucesso!' };
        });
    }
}
exports.ResetPasswordService = ResetPasswordService;
