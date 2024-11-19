import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany ,ManyToOne, JoinColumn,} from "typeorm";
import "reflect-metadata";
import { Token } from "./token";
import { Famille } from "./famille";

export enum UserRole {
    Enfant = "Enfant",
    Parent = "Parent",
    
}
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nom: string;

    @Column()
    prenom: string;

    @Column({
        unique: true
    })
    email: string;

    @Column()
    motDePasse: string;

    @Column()
    numTel?: string;

    @OneToMany(() => Token, token => token.user)
    tokens: Token[];

    @Column({
        type: 'enum',
        enum: ['Parent', 'Enfant'],
      })
   
      role: UserRole;


    @CreateDateColumn({ type: "datetime" })
    dateInscription: Date;


    @Column({ nullable: true })
    idFamille?: number;
    @ManyToOne(() => Famille, (famille) => famille.utilisateurs, { nullable: true })
    @JoinColumn({ name: 'idFamille' })
    famille?: Famille;
   

    constructor(
     id:number,
        nom: string,
        prenom: string,
        email: string,
        role: UserRole,
        motDePasse: string,
       tokens:  Token[],
        dateInscription: Date,
        numTel?: string,
        idFamille?: number,
      
      ) {
        this.id = id;
        this.nom = nom;
        this.tokens = tokens;
        this.prenom = prenom;
        this.email = email;
        this.role = role;
        this.motDePasse = motDePasse;
        this.numTel = numTel;
        this.idFamille = idFamille;
        this.dateInscription = dateInscription;

      }
}
