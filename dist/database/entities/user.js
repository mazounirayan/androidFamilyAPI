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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const famille_1 = require("./famille");
const tache_1 = require("./tache");
const notification_1 = require("./notification");
const message_1 = require("./message");
const userRecompense_1 = require("./userRecompense");
const userBadge_1 = require("./userBadge");
const transactionCoins_1 = require("./transactionCoins");
let User = class User {
    constructor(id, nom, prenom, email, motDePasse, role, dateInscription, avatar, coins, totalPoints, famille, taches, notifications, messages, userRecompenses, userBadges, transactions, numTel) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.role = role;
        this.dateInscription = dateInscription;
        this.avatar = avatar;
        this.coins = coins;
        this.totalPoints = totalPoints;
        this.famille = famille;
        this.taches = taches;
        this.notifications = notifications;
        this.messages = messages;
        this.userRecompenses = userRecompenses;
        this.userBadges = userBadges;
        this.transactions = transactions;
        this.numTel = numTel || "";
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], User.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], User.prototype, "prenom", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], User.prototype, "motDePasse", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "numTel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['Parent', 'Enfant'] }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], User.prototype, "dateInscription", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "coins", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "totalPoints", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => famille_1.Famille, famille => famille.users),
    (0, typeorm_1.JoinColumn)({ name: "idFamille" }),
    __metadata("design:type", famille_1.Famille)
], User.prototype, "famille", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tache_1.Tache, tache => tache.user),
    __metadata("design:type", Array)
], User.prototype, "taches", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_1.Notification, notification => notification.user),
    __metadata("design:type", Array)
], User.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_1.Message, message => message.user),
    __metadata("design:type", Array)
], User.prototype, "messages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => userRecompense_1.UserRecompense, userRecompense => userRecompense.user),
    __metadata("design:type", Array)
], User.prototype, "userRecompenses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => userBadge_1.UserBadge, userBadge => userBadge.user),
    __metadata("design:type", Array)
], User.prototype, "userBadges", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => transactionCoins_1.TransactionCoins, transaction => transaction.user),
    __metadata("design:type", Array)
], User.prototype, "transactions", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('User'),
    __metadata("design:paramtypes", [Number, String, String, String, String, String, Date, String, Number, Number, famille_1.Famille, Array, Array, Array, Array, Array, Array, String])
], User);
