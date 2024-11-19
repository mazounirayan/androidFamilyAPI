import Joi, { number } from "joi";
import { User, UserRole } from "../database/entities/user";

export const createUserValidation = Joi.object<CreateUserValidationRequest>({
    nom: Joi.string().required(),
    prenom: Joi.string().required(),
    email: Joi.string().email().required()  .messages({
        'string.empty': 'L’email est obligatoire.',
        'string.email': 'L’email doit être valide.',
      }),
    motDePasse: Joi.string().required(),
    numTel: Joi.string().min(10).max(10),
    role: Joi.string().valid('Parent', 'Enfant')
    .required()
    .messages({
      'any.only': 'Le rôle doit être soit "Parent" soit "Enfant".',
    }),
    dateInscription: Joi.date().required(),
}).options({ abortEarly: false });

export interface CreateUserValidationRequest {
    nom: string
    prenom: string
    email: string
    motDePasse: string
    numTel: string
    role: UserRole
    dateInscription: Date
}

export const userIdValidation = Joi.object<UserIdRequest>({
    id: Joi.number().required(),
    token: Joi.string().required()
});

export interface UserIdRequest {
    id: number
    token: string
}

export const updateUserValidation = Joi.object<UpdateUserRequest>({
    id: Joi.number().required(),
    token: Joi.string().required(),
    nom: Joi.string().optional(),
    prenom: Joi.string().optional(),
    email: Joi.string().email().optional(),
    numTel: Joi.string().min(10).max(10).optional(),
    motDePasse: Joi.string().optional(),
    role: Joi.string().valid(...Object.values(UserRole)).optional(),

});

export interface UpdateUserRequest {
    id: number
    token: string
    nom?: string
    prenom?: string
    email?: string
    numTel?: string
    motDePasse?: string
    role?: UserRole
}

export const listUserValidation = Joi.object<ListUserRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    nom: Joi.string().optional(),
    prenom: Joi.string().optional(),
    numTel: Joi.string().min(10).max(10).optional(),
    email: Joi.string().email().optional(),
    role: Joi.string().valid(...Object.values(UserRole)).optional(),
});

export interface ListUserRequest {
    page: number
    limit: number
    nom?: string
    prenom?: string
    email?: string
    numTel?: string
    profession?: string
    role?: UserRole
}

export const LoginUserValidation = Joi.object<LoginUserValidationRequest>({
    email: Joi.string().email().required(),
    motDePasse: Joi.string().required(),
}).options({ abortEarly: false });

export interface LoginUserValidationRequest {
    email: string
    motDePasse: string
}