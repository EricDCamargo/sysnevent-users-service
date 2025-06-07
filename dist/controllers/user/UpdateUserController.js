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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserController = void 0;
const http_status_codes_1 = require("http-status-codes");
const UpdateUserService_1 = require("../../services/user/UpdateUserService");
const AppError_1 = require("../../errors/AppError");
class UpdateUserController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = req.query.user_id;
            if (!user_id) {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ error: 'Parâmetro "user_id" é obrigatório na query.' });
            }
            const { name, email, role, password } = req.body;
            const updateUserervice = new UpdateUserService_1.UpdateUserervice();
            try {
                const updatedUser = yield updateUserervice.execute({
                    user_id,
                    name,
                    email,
                    role,
                    password
                });
                return res.status(http_status_codes_1.StatusCodes.OK).json(updatedUser);
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    return res.status(error.statusCode).json({ error: error.message });
                }
                return res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.UpdateUserController = UpdateUserController;
