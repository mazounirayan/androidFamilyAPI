USE projet_famille;
-- Insertion dans Famille
INSERT INTO Famille (nom, date_de_creation, code_invitation) VALUES
('Famille Dupont', '2023-01-01', 'INV12345'),
('Famille Martin', '2023-02-15', 'INV67890');

-- Insertion dans User
INSERT INTO User (nom, prenom, email, motDePasse, numTel, role, avatar, coins, totalPoints, idFamille) VALUES
('Dupont', 'Jean', 'jean.dupont@example.com', 'password123', '0601020304', 'Parent', 'avatar1.png', 100, 500, 1),
('Dupont', 'Marie', 'marie.dupont@example.com', 'password456', '0604050607', 'Parent', 'avatar2.png', 50, 300, 1),
('Dupont', 'Paul', 'paul.dupont@example.com', 'password789', '0608091011', 'Enfant', 'avatar3.png', 30, 200, 1);

-- Insertion dans CategorieTache
INSERT INTO CategorieTache (nom) VALUES
('Travaux ménagers'),
('Devoirs scolaires'),
('Activités familiales');

INSERT INTO Tache (nom, date_debut, date_fin, status, type, description, priorite, idCategorie, idUser, idFamille) VALUES
('Faire la vaisselle', '2023-03-01', '2023-03-01', 'En cours', 'Tâche quotidienne', 'Nettoyer les assiettes et les couverts', 'Moyenne', 1, 1, 1),
('Faire les devoirs de maths', '2023-03-01', '2023-03-02', 'Non commencé', 'Tâche scolaire', 'Réviser les fractions', 'Haute', 2, 3, 1);
-- Insertion dans Notification
INSERT INTO Notification (message, date_envoie, isVue, idUser, idTache) VALUES
('Vous avez une nouvelle tâche : Faire la vaisselle', '2023-03-01 09:00:00', FALSE, 1, 1),
('Tâche assignée : Faire les devoirs de maths', '2023-03-01 10:00:00', TRUE, 3, 2);
-- Insertion dans Chat
INSERT INTO Chat (libelle) VALUES
('Chat familial'),
('Discussion enfants');

-- Insertion dans Message
INSERT INTO Message (contenu, date_envoie, isVue, idUser, idChat) VALUES
('Bonjour à tous !', '2023-03-01 08:30:00', TRUE, 1, 1),
('N\oubliez pas la réunion de famille.', '2023-03-01 09:00:00', FALSE, 2, 1);

-- Insertion dans Recompense

INSERT INTO Recompense (nom, description, cout, stock, estDisponible) VALUES
('Récompense 1', 'Description de la récompense 1', 50, 10, TRUE),
('Récompense 2', 'Description de la récompense 2', 30, 5, TRUE);
-- Insertion dans UserRecompense
INSERT INTO UserRecompense (idUser, idRecompense, date_obtention) VALUES
(3, 1, '2023-03-01'),
(2, 2, '2023-03-01');

INSERT INTO Badge (nom, description, image) VALUES
('Badge 1', 'Description du badge 1', 'badge1.png'),
('Badge 2', 'Description du badge 2', 'badge2.png');
-- Insertion dans UserBadge
INSERT INTO UserBadge (idUser, idBadge, date_obtention) VALUES
(1, 1, '2023-03-01'),
(3, 2, '2023-03-01');

-- Insertion dans TransactionCoins
INSERT INTO TransactionCoins (idUser, type, montant, description) VALUES
(3, 'Gain', 20, 'Récompense pour une tâche terminée'),
(3, 'Depense', 10, 'Achat d\une récompense');

