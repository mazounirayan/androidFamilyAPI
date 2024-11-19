import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany ,ManyToOne, JoinColumn,} from "typeorm";
import "reflect-metadata";
import { Token } from "./token";
import { Famille } from "./famille";
import { Tache } from "./tache";
import { Recompense } from "./recomense";
import { Message } from "./message";
import { Chat } from "./chat";
import { Notification } from "./notification"; // Ajoutez cette ligne

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

    @OneToMany(() => Tache, (tache) => tache.user)
    taches: Tache[];


    @OneToMany(() => Recompense, (recompense) => recompense.user)
    recompenses: Recompense[];

    @OneToMany(() => Message, (message) => message.user)
    messages: Message[];

    @OneToMany(() => Notification, (notification) => notification.user)
    notifications: Notification[];

    @OneToMany(() => Chat, (chat) => chat.idChat)
    chats: Chat[];

    constructor(
     id:number,
        nom: string,
        prenom: string,
        email: string,
        role: UserRole,
        motDePasse: string,
        taches: Tache[],
       tokens:  Token[],
       recompenses: Recompense[],
       messages: Message[],
       notifications: Notification[],
       chats: Chat[],
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
        this.taches= taches;
        this.recompenses = recompenses;
        this.messages = messages;
        this.notifications = notifications;
        this.chats = chats;
      }
}
