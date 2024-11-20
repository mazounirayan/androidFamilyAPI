"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChatValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createChatValidation = joi_1.default.object({
    libelle: joi_1.default.string().required().max(255),
});
