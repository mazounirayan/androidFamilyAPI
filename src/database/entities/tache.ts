import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user"; 
import { Famille } from "./famille"; 

@Entity("taches")
export class Tache {
    @PrimaryGeneratedColumn()
    idTache: number;

    @Column({ length: 255 })
    nom: string;

    @Column({ type: "date", nullable: true })
    date_debut: Date;

    @Column({ type: "date", nullable: true })
    date_fin: Date;

    @Column({ length: 50, nullable: true })
    status: string;

    @Column({ length: 100, nullable: true })
    type: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({ name: "idUser", nullable: true }) // Ajoutez name: "idUser"
    userId?: number;

    @ManyToOne(() => User, (user) => user.taches)
    @JoinColumn({ name: "idUser" }) // Vérifiez que c'est bien "idUser"
    user: User;

    @ManyToOne(() => Famille, (famille) => famille.taches)
    @JoinColumn({ name: "idFamille" })
    famille: Famille;
    constructor(
        idTache: number,
        nom: string,
        date_debut: Date,
        date_fin: Date,
        status: string,
        type: string,
        description: string,
        user: User,
        famille: Famille
    ) {
        this.idTache = idTache;
        this.nom = nom;
        this.date_debut = date_debut;
        this.date_fin = date_fin;
        this.status = status;
        this.type = type;
        this.description = description;
        this.user = user;
        this.famille = famille;
    }
}