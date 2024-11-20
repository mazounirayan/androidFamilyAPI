"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotificationValidation = exports.createNotificationValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createNotificationValidation = joi_1.default.object({
    message: joi_1.default.string().required(),
    date_envoie: joi_1.default.date().required(),
    isVue: joi_1.default.boolean().default(false),
    idUser: joi_1.default.number().required(),
    idTache: joi_1.default.number().required(),
});
exports.updateNotificationValidation = joi_1.default.object({
    idNotification: joi_1.default.number().required(),
    isVue: joi_1.default.boolean().optional(),
});
