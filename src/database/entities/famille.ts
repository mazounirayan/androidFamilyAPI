import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user';
import { Tache } from './tache';

@Entity('Famille')
export class Famille {
    @PrimaryGeneratedColumn()
    idFamille: number;

    @Column({ length: 255 })
    nom: string;

    @Column({ type: 'date', nullable: true })
    date_de_creation: Date | null;

    @Column({ length: 20, unique: true })
    code_invitation: string;

    @OneToMany(() => User, user => user.famille)
    users: User[];

    @OneToMany(() => Tache, tache => tache.famille)
    taches: Tache[];

    constructor(
        idFamille: number,
        nom: string,
        code_invitation: string,
        // Optionnel
        users: User[]  ,
        taches: Tache[] , date_de_creation?: Date // Valeur par défaut
    ) {
        this.idFamille = idFamille;
        this.nom = nom;
        this.date_de_creation = date_de_creation || null;
        this.code_invitation = code_invitation;
        this.users = users;
        this.taches = taches;
    }
}