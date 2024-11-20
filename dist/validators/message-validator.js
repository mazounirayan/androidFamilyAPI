"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessageValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createMessageValidation = joi_1.default.object({
    contenu: joi_1.default.string().min(1).required(),
    date_envoie: joi_1.default.date().required(),
    isVue: joi_1.default.boolean().default(false),
    idUser: joi_1.default.number().integer().positive().required(),
    idChat: joi_1.default.number().integer().positive().required(),
});
