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
exports.CategorieTacheUsecase = void 0;
const CategorieTache_1 = require("../database/entities/CategorieTache");
class CategorieTacheUsecase {
    constructor(db) {
        this.db = db;
    }
    deleteCategorieTache(idCategorie) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(CategorieTache_1.CategorieTache);
            const result = yield repo.delete({ idCategorie });
            if (result.affected === 0) {
                throw new Error("Category not found");
            }
        });
    }
    updateCategorieTache(idCategorie, categorieData) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(CategorieTache_1.CategorieTache);
            const categorie = yield repo.findOneBy({ idCategorie });
            if (!categorie) {
                throw new Error("Category not found");
            }
            Object.assign(categorie, categorieData);
            return yield repo.save(categorie);
        });
    }
    getCategorieTacheById(idCategorie) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(CategorieTache_1.CategorieTache);
            const categorie = yield repo.findOneBy({ idCategorie });
            if (!categorie) {
                throw new Error("Category not found");
            }
            return categorie;
        });
    }
    createCategorieTache(categorieData) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(CategorieTache_1.CategorieTache);
            const categorie = repo.create(categorieData);
            return yield repo.save(categorie);
        });
    }
    listCategoriesTache() {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(CategorieTache_1.CategorieTache);
            const categories = yield repo.find();
            if (!categories || categories.length === 0) {
                throw new Error("No categories found");
            }
            return categories;
        });
    }
}
exports.CategorieTacheUsecase = CategorieTacheUsecase;
