USE projet_famille;

-- Peupler la table famille
INSERT INTO famille (nom, date_de_creation, code_invitation) VALUES
('Famille Dupont', '2023-01-01', 'INV12345'),
('Famille Martin', '2023-02-15', 'INV67890');

-- Peupler la table user
INSERT INTO user (nom, prenom, email, motDePasse, profession, numTel, role, avatar, coins, idFamille) VALUES
('Dupont', 'Jean', 'jean.dupont@example.com', 'password123', 'Ingenieur', '0601020304', 'Parent', 'avatar1.png', 100, 1),
('Dupont', 'Marie', 'marie.dupont@example.com', 'password456', 'Docteur', '0604050607', 'Parent', 'avatar2.png', 50, 1),
('Dupont', 'Paul', 'paul.dupont@example.com', 'password789', 'Etudiant', '0608091011', 'Enfant', 'avatar3.png', 30, 1);

-- Peupler la table categorie_tache
INSERT INTO categorie_tache (nom) VALUES
('Travaux ménagers'),
('Devoirs scolaires'),
('Activités familiales');

-- Peupler la table taches
INSERT INTO taches (nom, date_debut, date_fin, status, type, description, priorite, idUser, idFamille, idCategorie) VALUES
('Faire la vaisselle', '2023-03-01', '2023-03-01', 'En cours', 'Tâche quotidienne', 'Nettoyer les assiettes et les couverts', 'Moyenne', 1, 1, 1),
('Faire les devoirs de maths', '2023-03-01', '2023-03-02', 'Non commencé', 'Tâche scolaire', 'Réviser les fractions', 'Haute', 3, 1, 2);

-- Peupler la table notification
INSERT INTO notification (message, date_envoie, isVue, idUser, idTache) VALUES
('Vous avez une nouvelle tâche : Faire la vaisselle', '2023-03-01 09:00:00', FALSE, 1, 1),
('Tâche assignée : Faire les devoirs de maths', '2023-03-01 10:00:00', TRUE, 3, 2);

-- Peupler la table chat
INSERT INTO chat (libelle) VALUES
('Chat familial'),
('Discussion enfants');

-- Peupler la table message
INSERT INTO message (contenu, date_envoie, isVue, type, idUser, idChat) VALUES
('Bonjour à tous !', '2023-03-01 08:30:00', TRUE, 'Texte', 1, 1),
('N\oubliez pas la réunion de famille.', '2023-03-01 09:00:00', FALSE, 'Texte', 2, 1);

-- Peupler la table recompense
INSERT INTO recompense (coin, idUser) VALUES
(50, 3),
(30, 2);

-- Peupler la table token
INSERT INTO token (token, userId) VALUES
('abcdef123456', 1),
('ghijkl789012', 2);

-- Peupler la table faire
INSERT INTO faire (idUser, idTache) VALUES
(1, 1),
(3, 2);

-- Peupler la table recevoir
INSERT INTO recevoir (idUser, idNotification) VALUES
(1, 1),
(3, 2);

-- Peupler la table envoyer
INSERT INTO envoyer (idUser, idMessage) VALUES
(1, 1),
(2, 2);

-- Peupler la table participer
INSERT INTO participer (idUser, idChat, date) VALUES
(1, 1, '2023-03-01'),
(3, 2, '2023-03-01');

-- Peupler la table lier
INSERT INTO lier (idUser, idFamille) VALUES
(1, 1),
(2, 1),
(3, 1);

-- Peupler la table lier_recompense
INSERT INTO lier_recompense (idUser, idRecompense) VALUES
(3, 1),
(2, 2);

-- Peupler la table historique_connexion
INSERT INTO historique_connexion (idUser, date_connexion, ip_adresse) VALUES
(1, '2023-03-01 08:00:00', '192.168.1.1'),
(2, '2023-03-01 08:15:00', '192.168.1.2');

-- Peupler la table transaction_coins
INSERT INTO transaction_coins (idUser, type, montant, date_transaction) VALUES
(3, 'Gain', 20, '2023-03-01 09:00:00'),
(3, 'Depense', 10, '2023-03-01 09:30:00');
