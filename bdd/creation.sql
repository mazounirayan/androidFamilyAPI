DROP DATABASE IF EXISTS projet_famille;
CREATE DATABASE projet_famille;

USE projet_famille;

-- Table famille
CREATE TABLE famille (
    idFamille INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    
    date_de_creation DATE,
    code_invitation VARCHAR(20) UNIQUE
);

-- Table user
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    motDePasse VARCHAR(255) NOT NULL,

    numTel VARCHAR(10),
    role ENUM('Parent', 'Enfant') NOT NULL,
    dateInscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    avatar VARCHAR(255),
    coins INT DEFAULT 0,
    idFamille INT,
    FOREIGN KEY (idFamille) REFERENCES famille(idFamille) ON DELETE CASCADE
);

-- Table taches
CREATE TABLE taches (
    idTache INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    date_debut DATE,
    date_fin DATE,
    status VARCHAR(50),
    type VARCHAR(100),
    description TEXT,
    priorite ENUM('Haute', 'Moyenne', 'Basse'),
    idCategorie INT,
    idUser INT,
    idFamille INT,
    FOREIGN KEY (idCategorie) REFERENCES categorie_tache(idCategorie) ON DELETE SET NULL,
    FOREIGN KEY (idUser) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (idFamille) REFERENCES famille(idFamille) ON DELETE CASCADE
);


-- Table notification
CREATE TABLE notification (
    idNotification INT PRIMARY KEY AUTO_INCREMENT,
    message TEXT NOT NULL,
    date_envoie DATETIME,
    isVue BOOLEAN,
    idUser INT,
    idTache INT,
    FOREIGN KEY (idUser) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (idTache) REFERENCES taches(idTache) ON DELETE CASCADE
);

-- Table chat
CREATE TABLE chat (
    idChat INT PRIMARY KEY AUTO_INCREMENT,
    libelle VARCHAR(255)
);

-- Table message
CREATE TABLE message (
    idMessage INT PRIMARY KEY AUTO_INCREMENT,
    contenu TEXT NOT NULL,
    date_envoie DATETIME,
    isVue BOOLEAN,
    idUser INT,
    idChat INT,
    FOREIGN KEY (idUser) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (idChat) REFERENCES chat(idChat) ON DELETE CASCADE
);


CREATE TABLE recompense (
    idRecompense INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    cout INT NOT NULL, -- Coût en points pour obtenir la récompense
    stock INT DEFAULT 0 -- Quantité disponible
);

-- Table token
CREATE TABLE token (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    userId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
);

-- Table faire
CREATE TABLE faire (
    idUser INT,
    idTache INT,
    PRIMARY KEY (idUser, idTache),
    FOREIGN KEY (idUser) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (idTache) REFERENCES taches(idTache) ON DELETE CASCADE
);
CREATE TABLE badge (
    idBadge INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(255) -- Chemin de l'image du badge
);
CREATE TABLE user_badge (
    idUser INT,
    idBadge INT,
    date_obtention DATE,
    PRIMARY KEY (idUser, idBadge),
    FOREIGN KEY (idUser) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (idBadge) REFERENCES badge(idBadge) ON DELETE CASCADE
);
-- Table recevoir
CREATE TABLE recevoir (
    idUser INT,
    idNotification INT,
    PRIMARY KEY (idUser, idNotification),
    FOREIGN KEY (idUser) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (idNotification) REFERENCES notification(idNotification) ON DELETE CASCADE
);

-- Table envoyer
CREATE TABLE envoyer (
    idUser INT,
    idMessage INT,
    PRIMARY KEY (idUser, idMessage),
    FOREIGN KEY (idUser) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (idMessage) REFERENCES message(idMessage) ON DELETE CASCADE
);

-- Table participer
CREATE TABLE participer (
    idUser INT,
    idChat INT,
    date DATE,
    PRIMARY KEY (idUser, idChat),
    FOREIGN KEY (idUser) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (idChat) REFERENCES chat(idChat) ON DELETE CASCADE
);

-- Table lier
CREATE TABLE lier (
    idUser INT,
    idFamille INT,
    PRIMARY KEY (idUser, idFamille),
    FOREIGN KEY (idUser) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (idFamille) REFERENCES famille(idFamille) ON DELETE CASCADE
);



CREATE TABLE user_recompense (
    idUser INT,
    idRecompense INT,
    date_obtention DATE,
    PRIMARY KEY (idUser, idRecompense),
    FOREIGN KEY (idUser) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (idRecompense) REFERENCES recompense(idRecompense) ON DELETE CASCADE
);

-- Table transaction_coins
CREATE TABLE transaction_coins (
    idTransaction INT PRIMARY KEY AUTO_INCREMENT,
    idUser INT,
    type ENUM('Gain', 'Depense') NOT NULL,
    montant INT NOT NULL,
    date_transaction DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUser) REFERENCES user(id) ON DELETE CASCADE
);

-- Table categorie_tache
CREATE TABLE categorie_tache (
    idCategorie INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL
);

