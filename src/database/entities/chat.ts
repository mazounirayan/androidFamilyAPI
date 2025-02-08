import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Message } from './message';
import { User } from './user';

@Entity('Chat')
export class Chat {
  @PrimaryGeneratedColumn()
  idChat: number;

  @Column()
  libelle: string;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
  
  constructor(idChat:number,libelle: string,messages: Message[]) {
    this.idChat =idChat;
    this.libelle = libelle;
    this.messages = messages; // Initialiser messages comme un tableau vide
  }
}
