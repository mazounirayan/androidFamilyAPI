"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRecompenseValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createRecompenseValidation = joi_1.default.object({
    coin: joi_1.default.number().integer().positive().required(),
    idUser: joi_1.default.number().integer().positive().required(),
});
