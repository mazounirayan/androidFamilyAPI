import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Famille } from './famille';
import { Tache } from './tache';
import { Notification } from './notification';
import { Message } from './message';
import { UserRecompense } from './userRecompense';
import { UserBadge } from './userBadge';
import { TransactionCoins } from './transactionCoins';
import { Chat } from './chat';
import { Token } from './token';
export type UserRole = 'Parent' | 'Enfant';

@Entity('User')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    nom: string;

    @Column({ length: 100 })
    prenom: string;

    @Column({ length: 255, unique: true })
    email: string;

    @Column({ length: 255 })
    motDePasse: string;

    @Column({ length: 10, nullable: true })
    numTel: string;

    @Column({ type: 'enum', enum: ['Parent', 'Enfant'] })
    role:UserRole;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dateInscription: Date;

    @Column({ length: 255, nullable: true })
    avatar: string;

    @Column({ default: 0 })
    coins: number;

    @Column({ default: 0 })
    totalPoints: number; // Total des points accumulés

    @ManyToOne(() => Famille, famille => famille.users)
    @JoinColumn({ name: "idFamille" })
    famille: Famille;
    
    @OneToMany(() => Tache, tache => tache.user)
    taches: Tache[];

    @OneToMany(() => Notification, notification => notification.user)
    notifications: Notification[];

    @OneToMany(() => Message, message => message.user)
    messages: Message[];

    @OneToMany(() => UserRecompense, userRecompense => userRecompense.user)
    userRecompenses: UserRecompense[]; // Récompenses obtenues par l'utilisateur

    @OneToMany(() => UserBadge, userBadge => userBadge.user)
    userBadges: UserBadge[]; // Badges obtenus par l'utilisateur

    @OneToMany(() => TransactionCoins, transaction => transaction.user)
    transactions: TransactionCoins[]; // Transactions de points
    
    @OneToMany(() => Token, token => token.user)
    tokens: Token[];



    @ManyToMany(() => Chat)
    @JoinTable({
        name: "user_chats_chat",  // Correspond au nom de ta table SQL
        joinColumn: {
            name: "idUser",  // Nom de la colonne dans la table de jointure
            referencedColumnName: "id",  // Nom de la colonne référencée dans User
        },
        inverseJoinColumn: {
            name: "idChat",  // Nom de la colonne dans la table de jointure
            referencedColumnName: "idChat",  // Nom de la colonne référencée dans Chat
        },
    })
    chats: Chat[];
    
    constructor(
        id: number,
        nom: string,
        prenom: string,
        email: string,
        motDePasse: string,
        role: UserRole,
        dateInscription: Date,
        avatar: string,
        coins: number,
        totalPoints: number,
        famille: Famille,
        taches: Tache[] ,
        notifications: Notification[] ,
        messages: Message[] ,
        userRecompenses: UserRecompense[] ,
        userBadges: UserBadge[] ,
        transactions: TransactionCoins[] ,
        chats: Chat[],
        tokens: Token[],
        numTel?: string,
    ) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.role = role;
        this.dateInscription = dateInscription;
        this.avatar = avatar;
        this.coins = coins;
        this.totalPoints = totalPoints;
        this.famille = famille;
        this.taches = taches;
        this.notifications = notifications;
        this.messages = messages;
        this.userRecompenses = userRecompenses;
        this.userBadges = userBadges;
        this.transactions = transactions;
        this.chats = chats
        this.numTel = numTel || "";
        this.tokens = tokens
    }
}