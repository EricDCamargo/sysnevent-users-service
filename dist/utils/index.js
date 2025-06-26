"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordRegex = void 0;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
exports.passwordRegex = passwordRegex;
