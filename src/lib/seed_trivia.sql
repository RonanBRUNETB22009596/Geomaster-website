-- Questions Débutant (Endonymes simples, Symboles)
INSERT INTO questions (question_text, options, correct_answer, category, difficulty, type) VALUES
('Quel pays est appelé "Italia" dans sa langue officielle ?', '["Italie", "Espagne", "Grèce", "France"]', 'Italie', 'Europe', 'Beginner', 'text'),
('Quel pays est appelé "España" dans sa langue officielle ?', '["Espagne", "Portugal", "Mexique", "Argentine"]', 'Espagne', 'Europe', 'Beginner', 'text'),
('Quel pays est célèbre pour ses tulipes et ses moulins à vent ?', '["Pays-Bas", "Belgique", "Danemark", "Allemagne"]', 'Pays-Bas', 'Europe', 'Beginner', 'text'),
('Quel est le plus grand pays d''Amérique du Sud par la superficie ?', '["Brésil", "Argentine", "Pérou", "Colombie"]', 'Brésil', 'Americas', 'Beginner', 'text'),
('Quel pays est appelé "Nippon" par ses habitants ?', '["Japon", "Chine", "Corée du Sud", "Thaïlande"]', 'Japon', 'Asia', 'Beginner', 'text');

-- Questions Intermédiaire (Endonymes, Faits géographiques)
INSERT INTO questions (question_text, options, correct_answer, category, difficulty, type) VALUES
('Quel pays est appelé "Sverige" dans sa langue officielle ?', '["Suède", "Norvège", "Danemark", "Finlande"]', 'Suède', 'Europe', 'Intermediate', 'text'),
('Quel pays est appelé "Deutschland" dans sa langue officielle ?', '["Allemagne", "Autriche", "Pays-Bas", "Suisse"]', 'Allemagne', 'Europe', 'Intermediate', 'text'),
('Quel pays possède le plus grand nombre d''îles au monde (plus de 200 000) ?', '["Suède", "Indonésie", "Philippines", "Canada"]', 'Suède', 'World', 'Intermediate', 'text'),
('Le "Franc Suisse" est la monnaie de quel pays ?', '["Suisse", "Autriche", "Liechtenstein", "Allemagne"]', 'Suisse', 'Europe', 'Intermediate', 'text'),
('Quel pays d''Afrique a la plus grande population (plus de 200 millions) ?', '["Nigeria", "Éthiopie", "Égypte", "Afrique du Sud"]', 'Nigeria', 'Africa', 'Intermediate', 'text'),
('Quel pays est appelé "Hrvatska" dans sa langue officielle ?', '["Croatie", "Serbie", "Slovénie", "Slovaquie"]', 'Croatie', 'Europe', 'Intermediate', 'text');

-- Questions Professionnel (Endonymes complexes, Trivia obscure, PIB)
INSERT INTO questions (question, options, correct_answer, category, difficulty, type) VALUES
('Quel pays est appelé "Suomi" dans sa langue officielle ?', '["Finlande", "Estonie", "Hongrie", "Islande"]', 'Finlande', 'Europe', 'Professional', 'text'),
('Quel pays est appelé "Magyarország" dans sa langue officielle ?', '["Hongrie", "Bulgarie", "Roumanie", "Pologne"]', 'Hongrie', 'Europe', 'Professional', 'text'),
('Quel pays possède environ 173 000 bunkers construits sous le régime d''Enver Hoxha ?', '["Albanie", "Corée du Nord", "Suisse", "Israël"]', 'Albanie', 'Europe', 'Professional', 'text'),
('Quel pays compte le plus de pyramides (plus que l''Égypte) ?', '["Soudan", "Mexique", "Pérou", "Irak"]', 'Soudan', 'Africa', 'Professional', 'text'),
('Quel est le seul pays d''Asie du Sud-Est sans accès à la mer ?', '["Laos", "Cambodge", "Vietnam", "Thaïlande"]', 'Laos', 'Asia', 'Professional', 'text'),
('Quel pays est appelé "Shqipëria" par ses habitants ?', '["Albanie", "Kosovo", "Arménie", "Géorgie"]', 'Albanie', 'Europe', 'Professional', 'text'),
('Quel pays a le PIB le plus élevé d''Afrique (en 2023-2024) ?', '["Afrique du Sud", "Nigeria", "Égypte", "Algérie"]', 'Afrique du Sud', 'Africa', 'Professional', 'text'),
('Quel pays est surnommé "Le pays du Matin Calme" ?', '["Corée du Sud", "Japon", "Vietnam", "Chine"]', 'Corée du Sud', 'Asia', 'Professional', 'text');
