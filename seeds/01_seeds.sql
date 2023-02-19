INSERT INTO users (name, email, password) VALUES ('Eva Stanley', 'sebastianguerra@ymail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (name, email, password) VALUES ('Louisa Meyer', 'jacksonrose@hotmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (name, email, password) VALUES ('Dominic Parks', 'victoriablackwell@outlook.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'Speed Lamp', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', '930', 6, 4, 8, 'Canada', '536 Namsub Highway', 'Soboske', 'Quebec', 28142, true);
INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'Blank Corner', 'description', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', '85234', 6, 4, 7, 'Canada', '651 Nami Road', 'Bohbatev', 'Alberta', 83680, true);
INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'Habit Mix', 'description', 'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg', '46058', 0, 5, 6, 'Canada', '1650 Hejto Center', 'Genwezuj', 'Newfoundland And Labrador', 44583, true);

INSERT INTO reservations(start_date, end_date, property_id, guest_id) VALUES ('2018-09-11', '2018-09-26', 2, 3);
INSERT INTO reservations(start_date, end_date, property_id, guest_id) VALUES ('2019-01-04', '2019-02-01', 2, 2);
INSERT INTO reservations(start_date, end_date, property_id, guest_id) VALUES ('2023-10-01', '2023-10-14', 1, 3);

INSERT INTO property_reviews(guest_id, property_id, reservation_id, rating, message) VALUES (3, 2, 1, 3, 'message');
INSERT INTO property_reviews(guest_id, property_id, reservation_id, rating, message) VALUES (2, 2, 2, 4, 'message');
INSERT INTO property_reviews(guest_id, property_id, reservation_id, rating, message) VALUES (3, 1, 3, 4, 'message');
