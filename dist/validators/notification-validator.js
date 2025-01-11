"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsViewedValidation = exports.updateNotificationValidation = exports.notificationIdValidation = exports.listNotificationValidation = exports.createNotificationValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createNotificationValidation = joi_1.default.object({
    message: joi_1.default.string().required(),
    date_envoie: joi_1.default.date().required(),
    isVue: joi_1.default.boolean().default(false),
    idUser: joi_1.default.number().required(),
    idTache: joi_1.default.number().required(),
});
exports.listNotificationValidation = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).default(1), // Page actuelle, par défaut 1
    limit: joi_1.default.number().integer().min(1).max(100).default(20), // Limite par page, par défaut 20
    idUser: joi_1.default.number().integer().min(1).optional(), // Filtre par utilisateur (optionnel)
    isVue: joi_1.default.boolean().optional(), // Filtre par statut "vu" (optionnel)
});
exports.notificationIdValidation = joi_1.default.object({
    id: joi_1.default.number().integer().min(1).required(), // ID de la notification (obligatoire)
});
exports.updateNotificationValidation = joi_1.default.object({
    // idNotification: Joi.number().integer().min(1).required(), // ID de la notification (obligatoire)
    message: joi_1.default.string().optional(), // Message (optionnel)
    date_envoie: joi_1.default.date().optional(), // Date d'envoi (optionnel)
    isVue: joi_1.default.boolean().optional(), // Statut "vu" (optionnel)
    idUser: joi_1.default.number().integer().min(1).optional(), // ID de l'utilisateur (optionnel)
    idTache: joi_1.default.number().integer().min(1).optional(), // ID de la tâche (optionnel)
});
exports.markAsViewedValidation = joi_1.default.object({
    idNotification: joi_1.default.number().integer().min(1).required(), // ID de la notification (obligatoire)
});
