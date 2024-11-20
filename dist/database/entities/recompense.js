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
exports.Recompense = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
let Recompense = class Recompense {
    constructor(idRecompense, coin, user) {
        this.coin = coin;
        this.idRecompense = idRecompense;
        this.user = user;
    }
};
exports.Recompense = Recompense;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Recompense.prototype, "idRecompense", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Recompense.prototype, "coin", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, (user) => user.recompenses),
    __metadata("design:type", user_1.User)
], Recompense.prototype, "user", void 0);
exports.Recompense = Recompense = __decorate([
    (0, typeorm_1.Entity)('recompense'),
    __metadata("design:paramtypes", [Number, Number, user_1.User])
], Recompense);