import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user';
import { Chat } from './chat';

@Entity('Message')
export class Message {
    @PrimaryGeneratedColumn()
    idMessage: number;

    @Column({ type: 'text' })
    contenu: string;

    @Column({ type: 'datetime' })
    date_envoie: Date;

    @Column({ type: 'boolean' })
    isVue: boolean;

    @ManyToOne(() => User, user => user.messages)
    @JoinColumn({ name: 'idUser' })
    user: User;

    @ManyToOne(() => Chat, chat => chat.messages)
    @JoinColumn({ name: 'idChat' })
    chat: Chat;

    constructor(
        idMessage: number,
        contenu: string,
        date_envoie: Date,
        isVue: boolean,
        user: User,
        chat: Chat
    ) {
        this.idMessage = idMessage;
        this.contenu = contenu;
        this.date_envoie = date_envoie;
        this.isVue = isVue;
        this.user = user;
        this.chat = chat;
    }
}