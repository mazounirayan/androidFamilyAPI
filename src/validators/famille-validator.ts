import Joi from "joi";

export const createFamilleValidation = Joi.object<CreateFamilleValidationRequest>({
    nom: Joi.string().max(255).required(),
   
}).options({ abortEarly: false });

export interface CreateFamilleValidationRequest {
    nom: string
}



export const FamilleIdValidation = Joi.object<FamilleIdRequest>({
    id: Joi.number().required(),
});

export interface FamilleIdRequest {
    id: number
}

export const updateFamilleValidation = Joi.object<UpdateFamilleRequest>({
    id: Joi.number().required(),
    nom: Joi.string().optional(),
});

export interface UpdateFamilleRequest {
    id: number
    nom?: string

}

export const listFamilleValidation = Joi.object<ListFamilleRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    nom: Joi.string().optional(),
  
});

export interface ListFamilleRequest {
    page: number
    limit: number
    nom?: string
  
}

