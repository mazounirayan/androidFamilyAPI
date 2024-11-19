"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Famille = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
const tache_1 = require("./tache");
let Famille = class Famille {
    constructor(nom, taches, utilisateurs, idFamille, date_de_creation) {
        this.nom = nom;
        this.utilisateurs = utilisateurs;
        this.idFamille = idFamille;
        this.date_de_creation = date_de_creation;
        this.taches = taches;
    }
};
exports.Famille = Famille;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Famille.prototype, "idFamille", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Famille.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Famille.prototype, "date_de_creation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_1.User, (user) => user.famille),
    __metadata("design:type", Array)
], Famille.prototype, "utilisateurs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tache_1.Tache, (tache) => tache.famille),
    __metadata("design:type", Array)
], Famille.prototype, "taches", void 0);
exports.Famille = Famille = __decorate([
    (0, typeorm_1.Entity)('famille'),
    __metadata("design:paramtypes", [String, Array, Array, Number, Date])
], Famille);
