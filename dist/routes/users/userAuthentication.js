"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserHandlerAuthentication = void 0;
const database_1 = require("../../database/database");
const bcrypt_1 = require("bcrypt");
const user_validator_1 = require("../../validators/user-validator");
const generate_validation_message_1 = require("../../validators/generate-validation-message");
const user_1 = require("../../database/entities/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Importez jwt pour générer le token
const user_usecase_1 = require("../../usecases/user-usecase");
const famille_1 = require("../../database/entities/famille");
const token_1 = require("../../database/entities/token");
function generateUniqueCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}
const UserHandlerAuthentication = (app) => {
    app.post('/auth/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Valider le corps de la requête
            const validationResult = user_validator_1.createUserValidation.validate(req.body);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const createUserRequest = validationResult.value;
            const userRepository = database_1.AppDataSource.getRepository(user_1.User);
            const familleRepository = database_1.AppDataSource.getRepository(famille_1.Famille);
            let famille = null;
            // Hasher le mot de passe
            const hashedPassword = createUserRequest.motDePasse
                ? yield (0, bcrypt_1.hash)(createUserRequest.motDePasse, 10)
                : undefined;
            // Logique selon le rôle de l'utilisateur
            if (createUserRequest.role === 'Parent') {
                // Si le parent crée une nouvelle famille
                if (!createUserRequest.nomFamille) {
                    res.status(400).send({ error: "Le nom de la famille est obligatoire pour un parent." });
                    return;
                }
                // Vérifier si une famille avec le même nom existe
                famille = yield familleRepository.findOne({ where: { nom: createUserRequest.nomFamille } });
                if (!famille) {
                    // Créer une nouvelle famille si elle n'existe pas
                    famille = familleRepository.create({
                        nom: createUserRequest.nomFamille,
                        date_de_creation: new Date(),
                        code_invitation: generateUniqueCode(), // Implémentez cette fonction
                    });
                    famille = yield familleRepository.save(famille);
                }
            }
            else if (createUserRequest.role === 'Enfant') {
                // Si l'enfant rejoint une famille existante
                if (!createUserRequest.codeFamille) {
                    res.status(400).send({ error: "Le code famille est obligatoire pour un enfant." });
                    return;
                }
                // Vérifier si le code famille est valide
                famille = yield familleRepository.findOne({ where: { code_invitation: createUserRequest.codeFamille } });
                if (!famille) {
                    res.status(404).send({ error: "Le code famille est invalide." });
                    return;
                }
            }
            else {
                res.status(400).send({ error: "Rôle utilisateur invalide." });
                return;
            }
            // Créer l'utilisateur
            const user = userRepository.create({
                nom: createUserRequest.nom,
                prenom: createUserRequest.prenom,
                email: createUserRequest.email,
                motDePasse: hashedPassword,
                role: createUserRequest.role,
                dateInscription: new Date(),
                famille,
            });
            const savedUser = yield userRepository.save(user);
            // Réponse avec l'utilisateur créé
            res.status(201).send({
                id: savedUser.id,
                nom: savedUser.nom,
                prenom: savedUser.prenom,
                email: savedUser.email,
                role: savedUser.role,
                famille: famille ? { idFamille: famille.idFamille, nom: famille.nom, code_invitation: famille.code_invitation } : null,
            });
        }
        catch (error) {
            const mysqlError = error;
            if (mysqlError.code === 'ER_DUP_ENTRY') {
                res.status(400).send({ error: "L'adresse email est déjà utilisée." });
            }
            else {
                console.error('Erreur interne du serveur:', error);
                res.status(500).send({ error: "Erreur interne du serveur. Réessayez plus tard." });
            }
        }
    }));
    app.post('/auth/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = user_validator_1.LoginUserValidation.validate(req.body);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const loginUserRequest = validationResult.value;
            let user = yield database_1.AppDataSource.getRepository(user_1.User).findOneBy({ email: loginUserRequest.email });
            if (!user) {
                res.status(400).send({ error: "username or password not valid" });
                return;
            }
            //  a remetrre apres les test   const isValid = await compare(loginUserRequest.motDePasse, user.motDePasse);
            const isValid = loginUserRequest.motDePasse === user.motDePasse;
            if (!isValid) {
                res.status(400).send({ error: "username or password not valid" });
                return;
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, // Payload (données à inclure dans le token)
            process.env.JWT_SECRET || 'your_secret_key', // Clé secrète pour signer le token
            { expiresIn: '1d' } // Durée de validité du token
            );
            yield database_1.AppDataSource.getRepository(token_1.Token).save({ token: token, user: user });
            const userUsecase = new user_usecase_1.UserUsecase(database_1.AppDataSource);
            user = yield userUsecase.getOneUser(user.id);
            console.error("User récupéré par UserUsecase :", user);
            if (user === null) {
                res.status(404).send({ "error": `user not found` });
                return;
            }
            yield userUsecase.updateUser(user.id, Object.assign({}, user));
            res.status(200).json({
                token,
                user,
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ "error": "internal error retry later" });
            return;
        }
    }));
    app.delete('/auth/logout/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = user_validator_1.userIdValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const userUsecase = new user_usecase_1.UserUsecase(database_1.AppDataSource);
            if ((yield userUsecase.verifUser(+req.params.id)) === false) {
                res.status(400).send({ "error": `Bad user` });
                return;
            }
            const userId = validationResult.value;
            const userRepository = database_1.AppDataSource.getRepository(user_1.User);
            const user = yield userRepository.findOneBy({ id: userId.id });
            if (user === null) {
                res.status(404).send({ "error": `user ${userId.id} not found` });
                return;
            }
            userUsecase.deleteToken(user.id);
            yield userUsecase.updateUser(user.id, Object.assign({}, user));
            res.status(201).send({ "message": "logout success" });
            return;
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ "error": "internal error retry later" });
            return;
        }
    }));
};
exports.UserHandlerAuthentication = UserHandlerAuthentication;
