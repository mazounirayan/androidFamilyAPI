-- Insertion des familles
INSERT INTO famille (nom, date_de_creation) VALUES
('Famille Dupont', '2024-01-01'),
('Famille Martin', '2023-12-15');

-- Insertion des utilisateurs (user)
INSERT INTO user (nom, prenom, email, motDePasse, profession, numTel, role, idFamille) VALUES
('Dupont', 'Pierre', 'pierre.dupont@mail.com', 'motdepasse123', 'Développeur', '0123456789', 'Parent', 1),
('Dupont', 'Marie', 'marie.dupont@mail.com', 'motdepasse123', 'Médecin', '0123456789', 'Parent', 1),
('Martin', 'Paul', 'paul.martin@mail.com', 'motdepasse123', 'Professeur', '0987654321', 'Enfant', 2);

-- Insertion des tâches (taches)
INSERT INTO taches (nom, date_debut, date_fin, status, type, description, idUser, idFamille) VALUES
('Faire les courses', '2024-11-01', '2024-11-05', 'En cours', 'Ménage', 'Acheter les provisions', 1, 1),
('Préparer le dîner', '2024-11-01', '2024-11-01', 'Terminé', 'Cuisine', 'Préparer le repas du soir', 2, 1);

-- Insertion des notifications
INSERT INTO notification (message, date_envoie, isVue, idUser, idTache) VALUES
('Vous avez une nouvelle tâche à faire', '2024-11-01 10:00:00', false, 1, 1),
('La tâche "Préparer le dîner" est terminée', '2024-11-01 20:00:00', true, 2, 2);

-- Insertion des chats
INSERT INTO chat (libelle) VALUES
('Chat Famille Dupont'),
('Chat Famille Martin');

-- Insertion des messages
INSERT INTO message (contenu, date_envoie, isVue, idUser, idChat) VALUES
('Salut tout le monde !', '2024-11-01 08:00:00', true, 1, 1),
('Bonjour, comment ça va ?', '2024-11-01 08:30:00', false, 2, 1);

-- Insertion des récompenses
INSERT INTO recompense (coin, idUser) VALUES
(100, 1),
(50, 2);

-- Insertion des tokens
INSERT INTO token (token, userId) VALUES
('token_1_abcdef', 1),
('token_2_ghijk', 2);

-- Insertion des relations dans la table faire (association entre user et tâche)
INSERT INTO faire (idUser, idTache) VALUES
(1, 1),
(2, 2);

-- Insertion des relations dans la table recevoir (association entre user et notification)
INSERT INTO recevoir (idUser, idNotification) VALUES
(1, 1),
(2, 2);

-- Insertion des relations dans la table envoyer (association entre user et message)
INSERT INTO envoyer (idUser, idMessage) VALUES
(1, 1),
(2, 2);

-- Insertion des relations dans la table participer (association entre user et chat)
INSERT INTO participer (idUser, idChat, date) VALUES
(1, 1, '2024-11-01'),
(2, 1, '2024-11-01');

-- Insertion des relations dans la table lier (association entre user et famille)
INSERT INTO lier (idUser, idFamille) VALUES
(1, 1),
(2, 1),
(3, 2);

-- Insertion des relations dans la table lier_recompense (association entre user et recompense)
INSERT INTO lier_recompense (idUser, idRecompense) VALUES
(1, 1),
(2, 2);
