import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { CategorieTache } from "./CategorieTache";
import { Famille } from "./famille";
import { User } from "./user";
import { Notification } from "./notification";

export type Priorite = 'Haute' | 'Faible' | 'Moyenne';


@Entity('Tache')
export class Tache {
    @PrimaryGeneratedColumn()
    idTache: number;

    @Column({ length: 255 })
    nom: string;

    @Column({ type: 'date', nullable: true })
    date_debut: Date ;

    @Column({ type: 'date', nullable: true })
    date_fin: Date ;

    @Column({ length: 50, nullable: true })
    status: string ;

    @Column({ length: 100, nullable: true })
    type: string ;

    @Column({ type: 'text', nullable: true })
    description: string ;

    @Column({ type: 'enum', enum: ['Haute', 'Faible','Moyenne'] })
    priorite: Priorite ;

    @ManyToOne(() => CategorieTache, categorie => categorie.taches, { nullable: true })
    @JoinColumn({ name: 'idCategorie' })
    categorie: CategorieTache ;

    @ManyToOne(() => User, user => user.taches, { nullable: false })
    @JoinColumn({ name: 'idUser' })
    user: User;

    @ManyToOne(() => Famille, famille => famille.taches, { nullable: false })
    @JoinColumn({ name: 'idFamille' })
    famille: Famille;

    @OneToMany(() => Notification, notification => notification.tache)
    notifications: Notification[];

    constructor(
            idTache: number,
            nom: string,
            user: User,
            famille: Famille,
            date_debut: Date ,
            date_fin: Date ,
            status: string  ,
            type: string ,
           
            priorite: Priorite ,
            categorie: CategorieTache ,
            notifications: Notification[], description?: string )
             {
        this.idTache = idTache;
        this.nom = nom;
        this.date_debut = date_debut 
        this.date_fin = date_fin 
        this.status = status 
        this.type = type 
        this.description = description || ""
        this.priorite = priorite 
        this.categorie = categorie 
        this.user = user;
        this.famille = famille;
        this.notifications = notifications ;
    }
}