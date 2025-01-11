DROP DATABASE IF EXISTS projet_famille;
CREATE DATABASE projet_famille;

USE projet_famille;
-- Table Badge
CREATE TABLE Badge (
    idBadge INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(255)
);

-- Table CategorieTache
CREATE TABLE CategorieTache (
    idCategorie INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL
);

-- Table Chat
CREATE TABLE Chat (
    idChat INT PRIMARY KEY AUTO_INCREMENT,
    libelle VARCHAR(255) NOT NULL
);

-- Table Famille
CREATE TABLE Famille (
    idFamille INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    date_de_creation DATE,
    code_invitation VARCHAR(20) UNIQUE NOT NULL
);

-- Table Message
CREATE TABLE Message (
    idMessage INT PRIMARY KEY AUTO_INCREMENT,
    contenu TEXT NOT NULL,
    date_envoie DATETIME NOT NULL,
    isVue BOOLEAN NOT NULL,
    idUser INT,
    idChat INT,
    FOREIGN KEY (idUser) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (idChat) REFERENCES Chat(idChat) ON DELETE CASCADE
);

-- Table Notification
CREATE TABLE Notification (
    idNotification INT PRIMARY KEY AUTO_INCREMENT,
    message TEXT NOT NULL,
    date_envoie DATETIME NOT NULL,
    isVue BOOLEAN NOT NULL,
    idUser INT,
    idTache INT,
    FOREIGN KEY (idUser) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (idTache) REFERENCES Tache(idTache) ON DELETE CASCADE
);

-- Table Recompense
CREATE TABLE Recompense (
    idRecompense INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    cout INT NOT NULL,
    stock INT DEFAULT 0,
    estDisponible BOOLEAN DEFAULT TRUE
);

-- Table Tache
CREATE TABLE Tache (
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
    FOREIGN KEY (idCategorie) REFERENCES CategorieTache(idCategorie) ON DELETE SET NULL,
    FOREIGN KEY (idUser) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (idFamille) REFERENCES Famille(idFamille) ON DELETE CASCADE
);

-- Table TransactionCoins
CREATE TABLE TransactionCoins (
    idTransaction INT PRIMARY KEY AUTO_INCREMENT,
    idUser INT,
    type ENUM('Gain', 'Depense') NOT NULL,
    montant INT NOT NULL,
    date_transaction DATETIME DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    FOREIGN KEY (idUser) REFERENCES User(id) ON DELETE CASCADE
);

-- Table User
CREATE TABLE User (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    motDePasse VARCHAR(255) NOT NULL,
    numTel VARCHAR(10),
    role ENUM('Parent', 'Enfant') NOT NULL,
    dateInscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    avatar VARCHAR(255),
    coins INT DEFAULT 0,
    totalPoints INT DEFAULT 0,
    idFamille INT,
    FOREIGN KEY (idFamille) REFERENCES Famille(idFamille) ON DELETE SET NULL
);

-- Table UserBadge
CREATE TABLE UserBadge (
    idUser INT,
    idBadge INT,
    date_obtention DATE NOT NULL,
    PRIMARY KEY (idUser, idBadge),
    FOREIGN KEY (idUser) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (idBadge) REFERENCES Badge(idBadge) ON DELETE CASCADE
);

-- Table UserRecompense
CREATE TABLE UserRecompense (
    idUser INT,
    idRecompense INT,
    date_obtention DATE NOT NULL,
    PRIMARY KEY (idUser, idRecompense),
    FOREIGN KEY (idUser) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (idRecompense) REFERENCES Recompense(idRecompense) ON DELETE CASCADE
);