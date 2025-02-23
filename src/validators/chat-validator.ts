import Joi from "joi";

export const createChatValidation = Joi.object({
    libelle: Joi.string().required().max(255),
    participants: Joi.array().items(Joi.number().integer()).min(1).required()  
});


export const addUserToChat = Joi.object<AddUserToChat>({
    idUser: Joi.number().required(),
    idChat: Joi.number().required()
});

export interface AddUserToChat {
    idUser:number;
    idChat:number;
}