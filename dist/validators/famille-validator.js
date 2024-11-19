"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listFamilleValidation = exports.updateFamilleValidation = exports.FamilleIdValidation = exports.createFamilleValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createFamilleValidation = joi_1.default.object({
    nom: joi_1.default.string().max(255).required(),
}).options({ abortEarly: false });
exports.FamilleIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateFamilleValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    nom: joi_1.default.string().optional(),
});
exports.listFamilleValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    nom: joi_1.default.string().optional(),
});
