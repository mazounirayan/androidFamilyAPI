import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Tache } from './tache';

@Entity('CategorieTache')
export class CategorieTache {
    @PrimaryGeneratedColumn()
    idCategorie: number;

    @Column({ length: 255 })
    nom: string;

    @OneToMany(() => Tache, tache => tache.categorie)
    taches: Tache[];

    constructor(
        idCategorie: number,
        nom: string,
        taches: Tache[] 
    ) {
        this.idCategorie = idCategorie;
        this.nom = nom;
        this.taches = taches;
    }
}