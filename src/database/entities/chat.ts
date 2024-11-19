import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Message } from './message';

@Entity('chat')
export class Chat {
  @PrimaryGeneratedColumn()
  idChat: number;

  @Column()
  libelle: string;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  constructor(idChat:number,libelle: string,messages: Message[]) {
    this.libelle = libelle;
    this.idChat =idChat;
    this.messages = messages; // Initialiser messages comme un tableau vide
  }
}
