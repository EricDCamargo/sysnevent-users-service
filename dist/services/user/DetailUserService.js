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
exports.DetailUserervice = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
const prisma_1 = __importDefault(require("../../prisma"));
class DetailUserervice {
    execute(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user_id) {
                throw new AppError_1.AppError('Necessario informar ID do usuario!', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const user = yield prisma_1.default.user.findFirst({
                where: {
                    id: user_id
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            });
            if (!user) {
                throw new AppError_1.AppError('Usuario não encontrado!', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            return {
                data: user,
                message: 'Usuario ativo!'
            };
        });
    }
}
exports.DetailUserervice = DetailUserervice;
