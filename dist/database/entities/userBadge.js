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
exports.UserBadge = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
const Badge_1 = require("./Badge");
let UserBadge = class UserBadge {
    constructor(idUser, idBadge, date_obtention, user, badge) {
        this.idUser = idUser;
        this.idBadge = idBadge;
        this.date_obtention = date_obtention;
        this.user = user;
        this.badge = badge;
    }
};
exports.UserBadge = UserBadge;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], UserBadge.prototype, "idUser", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], UserBadge.prototype, "idBadge", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], UserBadge.prototype, "date_obtention", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, user => user.userBadges),
    (0, typeorm_1.JoinColumn)({ name: "idUser" }),
    __metadata("design:type", user_1.User)
], UserBadge.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Badge_1.Badge, badge => badge.userBadges),
    (0, typeorm_1.JoinColumn)({ name: "idBadge" }),
    __metadata("design:type", Badge_1.Badge)
], UserBadge.prototype, "badge", void 0);
exports.UserBadge = UserBadge = __decorate([
    (0, typeorm_1.Entity)('UserBadge'),
    __metadata("design:paramtypes", [Number, Number, Date,
        user_1.User,
        Badge_1.Badge])
], UserBadge);
