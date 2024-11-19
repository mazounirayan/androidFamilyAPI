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
exports.User = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const token_1 = require("./token");
const famille_1 = require("./famille");
const tache_1 = require("./tache");
var UserRole;
(function (UserRole) {
    UserRole["Enfant"] = "Enfant";
    UserRole["Parent"] = "Parent";
})(UserRole || (exports.UserRole = UserRole = {}));
let User = class User {
    constructor(id, nom, prenom, email, role, motDePasse, taches, tokens, dateInscription, numTel, idFamille) {
        this.id = id;
        this.nom = nom;
        this.tokens = tokens;
        this.prenom = prenom;
        this.email = email;
        this.role = role;
        this.motDePasse = motDePasse;
        this.numTel = numTel;
        this.idFamille = idFamille;
        this.dateInscription = dateInscription;
        this.taches = taches;
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "prenom", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: true
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "motDePasse", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "numTel", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => token_1.Token, token => token.user),
    __metadata("design:type", Array)
], User.prototype, "tokens", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['Parent', 'Enfant'],
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "datetime" }),
    __metadata("design:type", Date)
], User.prototype, "dateInscription", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "idFamille", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => famille_1.Famille, (famille) => famille.utilisateurs, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'idFamille' }),
    __metadata("design:type", famille_1.Famille)
], User.prototype, "famille", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tache_1.Tache, (tache) => tache.user),
    __metadata("design:type", Array)
], User.prototype, "taches", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, String, String, String, String, String, Array, Array, Date, String, Number])
], User);
