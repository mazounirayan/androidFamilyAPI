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
exports.UserRecompense = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
const recompense_1 = require("./recompense");
let UserRecompense = class UserRecompense {
    constructor(idUser, idRecompense, date_obtention, user, recompense) {
        this.idUser = idUser;
        this.idRecompense = idRecompense;
        this.date_obtention = date_obtention;
        this.user = user;
        this.recompense = recompense;
    }
};
exports.UserRecompense = UserRecompense;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], UserRecompense.prototype, "idUser", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], UserRecompense.prototype, "idRecompense", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], UserRecompense.prototype, "date_obtention", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, user => user.userRecompenses),
    __metadata("design:type", user_1.User)
], UserRecompense.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => recompense_1.Recompense, recompense => recompense.userRecompenses),
    __metadata("design:type", recompense_1.Recompense)
], UserRecompense.prototype, "recompense", void 0);
exports.UserRecompense = UserRecompense = __decorate([
    (0, typeorm_1.Entity)('UserRecompense'),
    __metadata("design:paramtypes", [Number, Number, Date,
        user_1.User,
        recompense_1.Recompense])
], UserRecompense);
