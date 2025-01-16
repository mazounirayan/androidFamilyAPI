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
const UserHandlerAuthentication = (app) => {
    app.post('/auth/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = user_validator_1.createUserValidation.validate(req.body);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const createUserRequest = validationResult.value;
            let hashedPassword;
            if (createUserRequest.motDePasse !== undefined) {
                hashedPassword = yield (0, bcrypt_1.hash)(createUserRequest.motDePasse, 10);
            }
            const userRepository = database_1.AppDataSource.getRepository(user_1.User);
            const user = yield userRepository.save({
                nom: req.body.nom,
                prenom: req.body.prenom,
                email: req.body.email,
                motDePasse: req.body.motDePasse,
                numTel: req.body.numTel,
                role: req.body.role,
                dateInscription: new Date(),
            });
            res.status(201).send({ id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role });
            return;
        }
        catch (error) {
            // Vérification de l'erreur de la base de données
            const mysqlError = error;
            if (error instanceof Error) {
                if (mysqlError.code === 'ER_DUP_ENTRY') {
                    res.status(400).send({ error: "L'adresse email est déjà utilisée." });
                }
                else {
                    // Log de l'erreur pour le débogage
                    console.error('Erreur interne du serveur:', error);
                    // Envoi de la réponse d'erreur générique
                    res.status(500).send({ error: "Erreur interne du serveur. Réessayez plus tard." });
                }
            }
            else {
                // En cas d'erreur inconnue non instance de Error
                console.error('Erreur inconnue:', error);
                res.status(500).send({ error: "Erreur inconnue. Réessayez plus tard." });
            }
            return;
        }
    }));
    app.post('/auth/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.error("Body reçu :", req.body);
            const validationResult = user_validator_1.LoginUserValidation.validate(req.body);
            console.error("Validation result :", validationResult);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const loginUserRequest = validationResult.value;
            let user = yield database_1.AppDataSource.getRepository(user_1.User).findOneBy({ email: loginUserRequest.email });
            console.error("Utilisateur trouvé :", user);
            console.error("Utilisateur trouvé (ou null) :", user);
            console.error("Mot de passe reçu :", loginUserRequest.motDePasse);
            console.error("Mot de passe stocké :", user === null || user === void 0 ? void 0 : user.motDePasse);
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
            { expiresIn: '365d' } // Durée de validité du token
            );
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
