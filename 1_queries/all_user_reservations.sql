SELECT reservations.id as id, properties.title, properties.cost_per_night, reservations.start_date, AVG(property_reviews.rating) as average_rating
FROM property_reviews
JOIN reservations ON reservation_id = reservations.id
JOIN properties ON property_reviews.property_id = properties.id
WHERE reservations.guest_id = 1
GROUP BY properties.id, reservations.id
ORDER BY start_date ASC
LIMIT 10;