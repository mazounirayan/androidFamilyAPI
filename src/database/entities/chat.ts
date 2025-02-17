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
  @ManyToMany(() => User)
    @JoinTable({
        name: "user_chats_chat", // Le nom de la table de jointure
        joinColumn: {
            name: "idChat",
            referencedColumnName: "idChat"
        },
        inverseJoinColumn: {
            name: "idUser",
            referencedColumnName: "id"
        }
    })
    participants: User[];

  constructor(idChat:number,libelle: string,messages: Message[] ,participants: User[]) {
    this.idChat =idChat;
    this.libelle = libelle;
    this.messages = messages; // Initialiser messages comme un tableau vide
    this.participants = participants; // Initialiser participants comme un tableau vide
  }
}
