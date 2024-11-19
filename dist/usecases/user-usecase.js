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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUsecase = void 0;
const user_1 = require("../database/entities/user");
const token_1 = require("../database/entities/token");
class UserUsecase {
    constructor(db) {
        this.db = db;
    }
    deleteToken(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const TokenDelete = yield this.db.createQueryBuilder().delete().from(token_1.Token).where("userId = :id", { id: id }).execute();
            return TokenDelete;
        });
    }
    verifUser(id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getOneUser(id);
            if (!user) {
                return false;
            }
            for (const element of user.tokens) {
                if (element.token === token) {
                    return true;
                }
            }
            return false;
        });
    }
    verifAcces(userId, funcId) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = this.db;
            const sqlQuery = `
        select count(*) from droit where userId = ? and fonctionnaliteId = ?;`;
            const query = yield entityManager.query(sqlQuery, [userId, funcId]);
            return query;
        });
    }
    listUsers(listUserRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(user_1.User, 'user');
            if (listUserRequest.nom) {
                query.andWhere("user.nom = :nom", { nom: listUserRequest.nom });
            }
            if (listUserRequest.prenom) {
                query.andWhere("user.prenom = :prenom", { prenom: listUserRequest.prenom });
            }
            if (listUserRequest.email) {
                query.andWhere("user.email = :email", { email: listUserRequest.email });
            }
            if (listUserRequest.numTel) {
                query.andWhere("user.numTel = :numTel", { numTel: listUserRequest.numTel });
            }
            if (listUserRequest.role) {
                query.andWhere("user.role = :role", { role: listUserRequest.role });
            }
            if (listUserRequest.dateInscription) {
                query.andWhere("user.dateInscription = :dateInscription", { dateInscription: listUserRequest.dateInscription });
            }
            //.leftJoinAndSelect('user.taches', 'taches')
            query.leftJoinAndSelect('user.tokens', 'tokens')
                .skip((listUserRequest.page - 1) * listUserRequest.limit)
                .take(listUserRequest.limit);
            const [Users, totalCount] = yield query.getManyAndCount();
            return {
                Users,
                totalCount
            };
        });
    }
    getOneUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(user_1.User, 'user')
                //   .leftJoinAndSelect('user.taches', 'taches')
                .leftJoinAndSelect('user.tokens', 'tokens')
                .where("user.id = :id", { id: id });
            const user = yield query.getOne();
            if (!user) {
                console.log({ error: `User ${id} not found` });
                return null;
            }
            return user;
        });
    }
    updateUser(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { nom, prenom, email, motDePasse, numTel, profession, role, dateInscription }) {
            const repo = this.db.getRepository(user_1.User);
            const userFound = yield repo.findOneBy({ id });
            if (userFound === null)
                return null;
            if (nom === undefined && prenom === undefined && email === undefined && motDePasse === undefined && numTel === undefined && profession === undefined && role === undefined && dateInscription === undefined) {
                return "No changes";
            }
            if (nom) {
                userFound.nom = nom;
            }
            if (prenom) {
                userFound.prenom = prenom;
            }
            if (email) {
                userFound.email = email;
            }
            if (motDePasse) {
                userFound.motDePasse = motDePasse;
            }
            if (numTel) {
                userFound.numTel = numTel;
            }
            if (role) {
                userFound.role = role;
            }
            if (dateInscription) {
                userFound.dateInscription = dateInscription;
            }
            const userUpdate = yield repo.save(userFound);
            return userUpdate;
        });
    }
}
exports.UserUsecase = UserUsecase;
