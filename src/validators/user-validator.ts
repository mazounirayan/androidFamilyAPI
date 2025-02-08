import Joi from "joi";
import { User  } from "../database/entities/user";

// Define UserRole if not already defined
type UserRole = 'Parent' | 'Enfant'; // Or use enum if preferred

// Create User Validation
export const createUserValidation = Joi.object<CreateUserValidationRequest>({
    nom: Joi.string()
        .required()
        .messages({
            'string.empty': 'Le nom est obligatoire.',
        }),

    prenom: Joi.string()
        .required()
        .messages({
            'string.empty': 'Le prénom est obligatoire.',
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'L’email est obligatoire.',
            'string.email': 'L’email doit être valide.',
        }),

    motDePasse: Joi.string()
        .required()
        .messages({
            'string.empty': 'Le mot de passe est obligatoire.',
            'string.min': 'Le mot de passe doit contenir au moins 8 caractères.',
        }),

    numTel: Joi.string()
        .length(10) 
        .pattern(/^[0-9]+$/)
        .optional()
        .messages({
            'string.length': 'Le numéro de téléphone doit contenir exactement 10 chiffres.',
            'string.pattern.base': 'Le numéro de téléphone ne doit contenir que des chiffres.',
        }),

    role: Joi.string()
        .valid('Parent', 'Enfant')
        .required()
        .messages({
            'any.only': 'Le rôle doit être soit "Parent" soit "Enfant".',
            'string.empty': 'Le rôle est obligatoire.',
        }),

    codeFamille: Joi.string()
        .optional()
        .messages({
            'string.empty': 'Le code famille ne peut pas être vide.',
        }),

    nomFamille: Joi.string()
        .optional()
        .messages({
            'string.empty': 'Le nom de la famille ne peut pas être vide.',
        }),
})
    .options({ abortEarly: false }); 

interface CreateUserValidationRequest {
    nom: string;
    prenom: string;
    email: string;
    motDePasse: string;
    numTel?: string;
    role: 'Parent' | 'Enfant';
    codeFamille?: string; 
    nomFamille?: string;  
}

// User ID Validation
export const userIdValidation = Joi.object<UserIdRequest>({
    id: Joi.number().required(),
  
});

export interface UserIdRequest {
    id: number;

}

// Update User Validation
export const updateUserValidation = Joi.object<UpdateUserRequest>({
    id: Joi.number().required(),
  
    nom: Joi.string().optional(),
    prenom: Joi.string().optional(),
    email: Joi.string().email().optional(),
    numTel: Joi.string().min(10).max(10).optional(),
    motDePasse: Joi.string().optional(),
    role: Joi.string()
        .valid('Parent', 'Enfant') // Use ...Object.values(UserRole) if UserRole is an enum
        .optional(),
});

export interface UpdateUserRequest {
    id: number;

    nom?: string;
    prenom?: string;
    email?: string;
    numTel?: string;
    motDePasse?: string;
    role?: UserRole;
}

// List User Validation
export const listUserValidation = Joi.object<ListUserRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    nom: Joi.string().optional(),
    prenom: Joi.string().optional(),
    numTel: Joi.string().min(10).max(10).optional(),
    email: Joi.string().email().optional(),
    role: Joi.string()
        .valid('Parent', 'Enfant') // Use ...Object.values(UserRole) if UserRole is an enum
        .optional(),
});

export interface ListUserRequest {
    page: number;
    limit: number;
    nom?: string;
    prenom?: string;
    email?: string;
    numTel?: string;
    profession?: string;
    role?: UserRole;
}



// Login User Validation
export const LoginUserValidation = Joi.object<LoginUserValidationRequest>({
    email: Joi.string().email().required(),
    motDePasse: Joi.string().required(),
}).options({ abortEarly: false });

export interface LoginUserValidationRequest {
    email: string;
    motDePasse: string;
}