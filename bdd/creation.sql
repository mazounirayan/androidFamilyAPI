DROP DATABASE IF EXISTS projet_famille;
CREATE DATABASE projet_famille;

USE projet_famille;

CREATE TABLE famille (
    idFamille INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    date_de_creation DATE
);

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    motDePasse VARCHAR(255),
    profession VARCHAR(255),
    numTel VARCHAR(10),
    role ENUM('Parent', 'Enfant') NOT NULL,
    dateInscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    idFamille INT,
    FOREIGN KEY (idFamille) REFERENCES famille(idFamille)
);

CREATE TABLE taches (
    idTache INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    date_debut DATE,
    date_fin DATE,
    status VARCHAR(50),
    type VARCHAR(100),
    description TEXT,
    idUser INT,
    idFamille INT,
    FOREIGN KEY (idUser) REFERENCES user(id),
    FOREIGN KEY (idFamille) REFERENCES famille(idFamille)
);

CREATE TABLE notification (
    idNotification INT PRIMARY KEY AUTO_INCREMENT,
    message TEXT NOT NULL,
    date_envoie DATETIME,
    isVue BOOLEAN,
    idUser INT,
    idTache INT,
    FOREIGN KEY (idUser) REFERENCES user(id),
    FOREIGN KEY (idTache) REFERENCES taches(idTache)
);

CREATE TABLE chat (
    idChat INT PRIMARY KEY AUTO_INCREMENT,
    libelle VARCHAR(255)
);

CREATE TABLE message (
    idMessage INT PRIMARY KEY AUTO_INCREMENT,
    contenu TEXT NOT NULL,
    date_envoie DATETIME,
    isVue BOOLEAN,
    idUser INT,
    idChat INT,
    FOREIGN KEY (idUser) REFERENCES user(id),
    FOREIGN KEY (idChat) REFERENCES chat(idChat)
);

CREATE TABLE recompense (
    idRecompense INT PRIMARY KEY AUTO_INCREMENT,
    coin INT NOT NULL,
    idUser INT,
    FOREIGN KEY (idUser) REFERENCES user(id)
);

CREATE TABLE token (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    userId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE faire (
    idUser INT,
    idTache INT,
    PRIMARY KEY (idUser, idTache),
    FOREIGN KEY (idUser) REFERENCES user(id),
    FOREIGN KEY (idTache) REFERENCES taches(idTache)
);

CREATE TABLE recevoir (
    idUser INT,
    idNotification INT,
    PRIMARY KEY (idUser, idNotification),
    FOREIGN KEY (idUser) REFERENCES user(id),
    FOREIGN KEY (idNotification) REFERENCES notification(idNotification)
);

CREATE TABLE envoyer (
    idUser INT,
    idMessage INT,
    PRIMARY KEY (idUser, idMessage),
    FOREIGN KEY (idUser) REFERENCES user(id),
    FOREIGN KEY (idMessage) REFERENCES message(idMessage)
);

CREATE TABLE participer (
    idUser INT,
    idChat INT,
    date DATE,
    PRIMARY KEY (idUser, idChat),
    FOREIGN KEY (idUser) REFERENCES user(id),
    FOREIGN KEY (idChat) REFERENCES chat(idChat)
);

CREATE TABLE lier (
    idUser INT,
    idFamille INT,
    PRIMARY KEY (idUser, idFamille),
    FOREIGN KEY (idUser) REFERENCES user(id),
    FOREIGN KEY (idFamille) REFERENCES famille(idFamille)
);

CREATE TABLE lier_recompense (
    idUser INT,
    idRecompense INT,
    PRIMARY KEY (idUser, idRecompense),
    FOREIGN KEY (idUser) REFERENCES user(id),
    FOREIGN KEY (idRecompense) REFERENCES recompense(idRecompense)
);
