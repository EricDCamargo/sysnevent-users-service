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
exports.UpdateUserervice = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const AppError_1 = require("../../errors/AppError");
const http_status_codes_1 = require("http-status-codes");
const bcryptjs_1 = require("bcryptjs");
const utils_1 = require("../../utils");
class UpdateUserervice {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ user_id, name, email, role, password }) {
            const user = yield prisma_1.default.user.findUnique({
                where: { id: user_id }
            });
            if (!user) {
                throw new AppError_1.AppError('Usuario não encontrado!', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            if (email) {
                const userAlreadyExists = yield prisma_1.default.user.findFirst({
                    where: {
                        email,
                        NOT: {
                            id: user_id
                        }
                    }
                });
                if (userAlreadyExists) {
                    throw new AppError_1.AppError('Email já cadastrado em outro usuario!', http_status_codes_1.StatusCodes.CONFLICT);
                }
            }
            const dataToUpdate = {
                name,
                email,
                role,
                updated_at: new Date()
            };
            if (password) {
                if (!utils_1.passwordRegex.test(password)) {
                    throw new AppError_1.AppError('A nova senha deve conter no mínimo 6 caracteres, incluindo letras, números e pelo menos um caractere especial.', http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
                dataToUpdate.password = yield (0, bcryptjs_1.hash)(password, 8);
            }
            const updatedUser = yield prisma_1.default.user.update({
                where: { id: user_id },
                data: dataToUpdate,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            });
            return {
                data: updatedUser,
                message: 'Usuario editado com sucesso!'
            };
        });
    }
}
exports.UpdateUserervice = UpdateUserervice;
