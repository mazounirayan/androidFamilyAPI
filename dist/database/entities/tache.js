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
exports.Tache = void 0;
const typeorm_1 = require("typeorm");
const CategorieTache_1 = require("./CategorieTache");
const famille_1 = require("./famille");
const user_1 = require("./user");
const notification_1 = require("./notification");
let Tache = class Tache {
    constructor(idTache, nom, user, famille, date_debut, date_fin, status, type, priorite, categorie, notifications, description) {
        this.idTache = idTache;
        this.nom = nom;
        this.date_debut = date_debut;
        this.date_fin = date_fin;
        this.status = status;
        this.type = type;
        this.description = description || "";
        this.priorite = priorite;
        this.categorie = categorie;
        this.user = user;
        this.famille = famille;
        this.notifications = notifications;
    }
};
exports.Tache = Tache;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Tache.prototype, "idTache", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Tache.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Tache.prototype, "date_debut", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Tache.prototype, "date_fin", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Tache.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Tache.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Tache.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['Haute', 'Faible', 'Moyenne'] }),
    __metadata("design:type", String)
], Tache.prototype, "priorite", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => CategorieTache_1.CategorieTache, categorie => categorie.taches, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'idCategorie' }),
    __metadata("design:type", CategorieTache_1.CategorieTache)
], Tache.prototype, "categorie", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, user => user.taches, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'idUser' }),
    __metadata("design:type", user_1.User)
], Tache.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => famille_1.Famille, famille => famille.taches, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'idFamille' }),
    __metadata("design:type", famille_1.Famille)
], Tache.prototype, "famille", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_1.Notification, notification => notification.tache),
    __metadata("design:type", Array)
], Tache.prototype, "notifications", void 0);
exports.Tache = Tache = __decorate([
    (0, typeorm_1.Entity)('Tache'),
    __metadata("design:paramtypes", [Number, String, user_1.User,
        famille_1.Famille,
        Date,
        Date, String, String, String, CategorieTache_1.CategorieTache, Array, String])
], Tache);
