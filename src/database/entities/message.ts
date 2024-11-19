import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user';
import { Chat } from './chat';
 
@Entity('message')
export class Message {
  @PrimaryGeneratedColumn()
  idMessage: number;

  @Column('text')
  contenu: string;

  @Column({ type: 'datetime' })
  date_envoie: Date;

  @Column({ default: false })
  isVue: boolean;

  @ManyToOne(() => User, (user) => user.messages)
  user: User;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  constructor(  idMessage: number,contenu: string, date_envoie: Date, isVue: boolean, user: User, chat: Chat) {
    this.contenu = contenu;
    this.date_envoie = date_envoie;
    this.isVue = isVue;
    this.user = user; this.idMessage = idMessage;
    this.chat = chat;
  }
}
