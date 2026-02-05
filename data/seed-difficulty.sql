-- Clear existing questions to avoid duplicates if necessary
-- truncate public.questions;

insert into public.questions (question_text, options, correct_answer, category, difficulty, type) values
-- EUROPE - BEGINNER
('Quelle est la capitale de la France ?', '["Lyon", "Marseille", "Paris", "Bordeaux"]', 'Paris', 'Europe', 'Beginner', 'capital'),
('Quelle est la capitale de l''Allemagne ?', '["Munich", "Francfort", "Berlin", "Hambourg"]', 'Berlin', 'Europe', 'Beginner', 'capital'),
('Quelle est la capitale de l''Italie ?', '["Milan", "Venise", "Naples", "Rome"]', 'Rome', 'Europe', 'Beginner', 'capital'),
('Quelle est la capitale de l''Espagne ?', '["Barcelone", "Madrid", "Valence", "Séville"]', 'Madrid', 'Europe', 'Beginner', 'capital'),
('Quelle est la capitale du Royaume-Uni ?', '["Manchester", "Liverpool", "Londres", "Édimbourg"]', 'Londres', 'Europe', 'Beginner', 'capital'),

-- EUROPE - INTERMEDIATE
('Quelle est la capitale de la Pologne ?', '["Cracovie", "Varsovie", "Gdansk", "Wroclaw"]', 'Varsovie', 'Europe', 'Intermediate', 'capital'),
('Quelle est la capitale de la Grèce ?', '["Thessalonique", "Patras", "Athènes", "Héraklion"]', 'Athènes', 'Europe', 'Intermediate', 'capital'),
('Quelle est la capitale de la Suède ?', '["Oslo", "Helsinki", "Copenhague", "Stockholm"]', 'Stockholm', 'Europe', 'Intermediate', 'capital'),
('Quelle est la capitale du Portugal ?', '["Porto", "Lisbonne", "Faro", "Coimbra"]', 'Lisbonne', 'Europe', 'Intermediate', 'capital'),
('Quelle est la capitale de la Norvège ?', '["Bergen", "Oslo", "Trondheim", "Stavanger"]', 'Oslo', 'Europe', 'Intermediate', 'capital'),

-- EUROPE - PROFESSIONAL
('Quelle est la capitale du Monténégro ?', '["Cetinje", "Podgorica", "Budva", "Kotor"]', 'Podgorica', 'Europe', 'Professional', 'capital'),
('Quelle est la capitale de l''Estonie ?', '["Riga", "Vilnius", "Tallinn", "Tartu"]', 'Tallinn', 'Europe', 'Professional', 'capital'),
('Quelle est la capitale de la Slovaquie ?', '["Prague", "Bratislava", "Kosice", "Zilina"]', 'Bratislava', 'Europe', 'Professional', 'capital'),
('Quelle est la capitale de la Moldavie ?', '["Cluj", "Chisinau", "Tiraspol", "Iasi"]', 'Chisinau', 'Europe', 'Professional', 'capital'),

-- AMERICAS - BEGINNER
('Quelle est la capitale des États-Unis ?', '["New York", "Chicago", "Washington D.C.", "Los Angeles"]', 'Washington D.C.', 'Americas', 'Beginner', 'capital'),
('Quelle est la capitale du Canada ?', '["Toronto", "Vancouver", "Ottawa", "Montreal"]', 'Ottawa', 'Americas', 'Beginner', 'capital'),
('Quelle est la capitale du Brésil ?', '["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"]', 'Brasília', 'Americas', 'Beginner', 'capital'),
('Quelle est la capitale du Mexique ?', '["Guadalajara", "Monterrey", "Mexico", "Cancun"]', 'Mexico', 'Americas', 'Beginner', 'capital'),
('Quelle est la capitale de l''Argentine ?', '["Rosario", "Cordoba", "Buenos Aires", "Mendoza"]', 'Buenos Aires', 'Americas', 'Beginner', 'capital'),

-- AMERICAS - INTERMEDIATE
('Quelle est la capitale du Chili ?', '["Valparaiso", "Concepcion", "Santiago", "Antofagasta"]', 'Santiago', 'Americas', 'Intermediate', 'capital'),
('Quelle est la capitale du Pérou ?', '["Cusco", "Arequipa", "Lima", "Trujillo"]', 'Lima', 'Americas', 'Intermediate', 'capital'),
('Quelle est la capitale de la Colombie ?', '["Medellin", "Cali", "Bogotá", "Carthagène"]', 'Bogotá', 'Americas', 'Intermediate', 'capital'),
('Quelle est la capitale de Cuba ?', '["Santiago de Cuba", "Havane", "Varadero", "Holguin"]', 'Havane', 'Americas', 'Intermediate', 'capital'),
('Quelle est la capitale de la Jamaïque ?', '["Montego Bay", "Kingston", "Ocho Rios", "Negril"]', 'Kingston', 'Americas', 'Intermediate', 'capital'),

-- AMERICAS - PROFESSIONAL
('Quelle est la capitale du Suriname ?', '["Georgetown", "Cayenne", "Paramaribo", "Port of Spain"]', 'Paramaribo', 'Americas', 'Professional', 'capital'),
('Quelle est la capitale du Guyana ?', '["Cayenne", "Georgetown", "Paramaribo", "Belmopan"]', 'Georgetown', 'Americas', 'Professional', 'capital'),
('Quelle est la capitale du Belize ?', '["Belmopan", "Belize City", "San Ignacio", "Orange Walk"]', 'Belmopan', 'Americas', 'Professional', 'capital'),
('Quelle est la capitale du Paraguay ?', '["Encarnacion", "Ciudad del Este", "Asuncion", "Concepcion"]', 'Asuncion', 'Americas', 'Professional', 'capital'),

-- ASIA - BEGINNER
('Quelle est la capitale du Japon ?', '["Osaka", "Kyoto", "Tokyo", "Seoul"]', 'Tokyo', 'Asia', 'Beginner', 'capital'),
('Quelle est la capitale de la Chine ?', '["Shanghai", "Pékin", "Hong Kong", "Canton"]', 'Pékin', 'Asia', 'Beginner', 'capital'),
('Quelle est la capitale de l''Inde ?', '["Mumbai", "Calcutta", "New Delhi", "Bangalore"]', 'New Delhi', 'Asia', 'Beginner', 'capital'),
('Quelle est la capitale de la Corée du Sud ?', '["Busan", "Incheon", "Seoul", "Daegu"]', 'Seoul', 'Asia', 'Beginner', 'capital'),
('Quelle est la capitale de la Thaïlande ?', '["Phuket", "Chiang Mai", "Bangkok", "Pattaya"]', 'Bangkok', 'Asia', 'Beginner', 'capital'),

-- ASIA - INTERMEDIATE
('Quelle est la capitale de l''Indonésie ?', '["Bali", "Surabaya", "Jakarta", "Bandung"]', 'Jakarta', 'Asia', 'Intermediate', 'capital'),
('Quelle est la capitale du Vietnam ?', '["Ho Chi Minh Ville", "Da Nang", "Hanoï", "Huê"]', 'Hanoï', 'Asia', 'Intermediate', 'capital'),
('Quelle est la capitale des Philippines ?', '["Cebu", "Davao", "Manille", "Quezon City"]', 'Manille', 'Asia', 'Intermediate', 'capital'),
('Quelle est la capitale de l''Arabie Saoudite ?', '["Djeddah", "La Mecque", "Riyad", "Médine"]', 'Riyad', 'Asia', 'Intermediate', 'capital'),
('Quelle est la capitale de la Turquie ?', '["Istanbul", "Ankara", "Izmir", "Antalya"]', 'Ankara', 'Asia', 'Intermediate', 'capital'),

-- ASIA - PROFESSIONAL
('Quelle est la capitale du Bhoutan ?', '["Paro", "Punakha", "Thimphou", "Phuentsholing"]', 'Thimphou', 'Asia', 'Professional', 'capital'),
('Quelle est la capitale du Tadjikistan ?', '["Douchanbé", "Khodjent", "Kulyab", "Kurgan-Tyube"]', 'Douchanbé', 'Asia', 'Professional', 'capital'),
('Quelle est la capitale de Brunei ?', '["Bandar Seri Begawan", "Tutong", "Kuala Belait", "Bangar"]', 'Bandar Seri Begawan', 'Asia', 'Professional', 'capital'),
('Quelle est la capitale du Turkménistan ?', '["Achgabat", "Turkmenabat", "Dashoguz", "Mary"]', 'Achgabat', 'Asia', 'Professional', 'capital'),

-- AFRICA - BEGINNER
('Quelle est la capitale de l''Égypte ?', '["Alexandrie", "Gizeh", "Le Caire", "Louxor"]', 'Le Caire', 'Africa', 'Beginner', 'capital'),
('Quelle est l''une des capitales de l''Afrique du Sud ?', '["Johannesburg", "Durban", "Pretoria", "Soweto"]', 'Pretoria', 'Africa', 'Beginner', 'capital'),
('Quelle est la capitale du Nigeria ?', '["Lagos", "Kano", "Abuja", "Ibadan"]', 'Abuja', 'Africa', 'Beginner', 'capital'),
('Quelle est la capitale du Maroc ?', '["Casablanca", "Marrakech", "Rabat", "Fès"]', 'Rabat', 'Africa', 'Beginner', 'capital'),
('Quelle est la capitale du Kenya ?', '["Mombasa", "Kisumu", "Nairobi", "Nakuru"]', 'Nairobi', 'Africa', 'Beginner', 'capital'),

-- AFRICA - INTERMEDIATE
('Quelle est la capitale du Sénégal ?', '["Saint-Louis", "Dakar", "Thiès", "Ziguinchor"]', 'Dakar', 'Africa', 'Intermediate', 'capital'),
('Quelle est la capitale du Ghana ?', '["Kumasi", "Tamale", "Accra", "Takoradi"]', 'Accra', 'Africa', 'Intermediate', 'capital'),
('Quelle est la capitale de l''Éthiopie ?', '["Aroua", "Lalibela", "Addis-Abeba", "Bahir Dar"]', 'Addis-Abeba', 'Africa', 'Intermediate', 'capital'),
('Quelle est la capitale de l''Algérie ?', '["Oran", "Constantine", "Alger", "Annaba"]', 'Alger', 'Africa', 'Intermediate', 'capital'),
('Quelle est la capitale de la Tunisie ?', '["Sousse", "Sfax", "Tunis", "Bizerte"]', 'Tunis', 'Africa', 'Intermediate', 'capital'),

-- AFRICA - PROFESSIONAL
('Quelle est la capitale de Djibouti ?', '["Tadjoura", "Obock", "Djibouti", "Ali Sabieh"]', 'Djibouti', 'Africa', 'Professional', 'capital'),
('Quelle est la capitale des Comores ?', '["Moutsamoudou", "Moroni", "Fomboni", "Domoni"]', 'Moroni', 'Africa', 'Professional', 'capital'),
('Quelle est la capitale de l''Érythrée ?', '["Massaoua", "Asmara", "Assab", "Keren"]', 'Asmara', 'Africa', 'Professional', 'capital'),
('Quelle est la capitale du Lesotho ?', '["Teyateyaneng", "Mafeteng", "Maseru", "Leribe"]', 'Maseru', 'Africa', 'Professional', 'capital'),

-- OCEANIA - BEGINNER
('Quelle est la capitale de l''Australie ?', '["Sydney", "Melbourne", "Canberra", "Perth"]', 'Canberra', 'Oceania', 'Beginner', 'capital'),
('Quelle est la capitale de la Nouvelle-Zélande ?', '["Auckland", "Christchurch", "Wellington", "Hamilton"]', 'Wellington', 'Oceania', 'Beginner', 'capital'),
('Quelle est la capitale des Fidji ?', '["Nadi", "Suva", "Lautoka", "Labasa"]', 'Suva', 'Oceania', 'Beginner', 'capital'),

-- OCEANIA - INTERMEDIATE
('Quelle est la capitale de la Papouasie-Nouvelle-Guinée ?', '["Lae", "Mount Hagen", "Port Moresby", "Madang"]', 'Port Moresby', 'Oceania', 'Intermediate', 'capital'),
('Quelle est la capitale des Îles Salomon ?', '["Gizo", "Auki", "Honiara", "Tulagi"]', 'Honiara', 'Oceania', 'Intermediate', 'capital'),

-- OCEANIA - PROFESSIONAL
('Quelle est la capitale des Tuvalu ?', '["Alapi", "Fongafale", "Funafuti", "Vaiaku"]', 'Funafuti', 'Oceania', 'Professional', 'capital'),
('Quelle est la capitale des Palaos ?', '["Koror", "Airai", "Ngerulmud", "Melekeok"]', 'Ngerulmud', 'Oceania', 'Professional', 'capital'),
('Quelle est la capitale de Kiribati ?', '["Tarawa", "Bairiki", "Betio", "Eita"]', 'Tarawa', 'Oceania', 'Professional', 'capital'),

-- FLAGS (Generic World for mixed fun)
('Quel pays a pour drapeau un fond blanc avec un rond rouge ?', '["Japon", "Bangladesh", "Corée du Sud", "Tunisie"]', 'Japon', 'Asia', 'Beginner', 'flag'),
('Quel pays a un drapeau avec une feuille d''érable ?', '["USA", "Canada", "Liban", "Suisse"]', 'Canada', 'Americas', 'Beginner', 'flag'),
('Quel pays a un drapeau bleu, blanc, rouge (horizontal) avec des armoiries ?', '["France", "Slovaquie", "Russie", "Croatie"]', 'Slovaquie', 'Europe', 'Professional', 'flag'),
('Quel pays a un drapeau vert avec un croissant blanc et une étoile ?', '["Pakistan", "Turquie", "Algérie", "Tunisie"]', 'Pakistan', 'Asia', 'Intermediate', 'flag');
