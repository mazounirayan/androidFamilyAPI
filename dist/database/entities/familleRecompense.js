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
exports.FamilleRecompense = void 0;
const typeorm_1 = require("typeorm");
const recompense_1 = require("./recompense");
const famille_1 = require("./famille");
let FamilleRecompense = class FamilleRecompense {
    constructor(idFamille, idRecompense, famille, recompense) {
        this.idRecompense = idRecompense;
        this.idFamille = idFamille;
        this.famille = famille;
        this.recompense = recompense;
    }
};
exports.FamilleRecompense = FamilleRecompense;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], FamilleRecompense.prototype, "idFamille", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], FamilleRecompense.prototype, "idRecompense", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => famille_1.Famille, famille => famille.familleRecompenses),
    (0, typeorm_1.JoinColumn)({ name: 'idFamille' }),
    __metadata("design:type", famille_1.Famille)
], FamilleRecompense.prototype, "famille", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => recompense_1.Recompense, recompense => recompense.familleRecompenses),
    (0, typeorm_1.JoinColumn)({ name: 'idRecompense' }),
    __metadata("design:type", recompense_1.Recompense)
], FamilleRecompense.prototype, "recompense", void 0);
exports.FamilleRecompense = FamilleRecompense = __decorate([
    (0, typeorm_1.Entity)("FamilleRecompense"),
    __metadata("design:paramtypes", [Number, Number, famille_1.Famille,
        recompense_1.Recompense])
], FamilleRecompense);
