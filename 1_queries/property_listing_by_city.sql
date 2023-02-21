SELECT properties.id as id, properties.title as title, properties.cost_per_night as cost_per_night, AVG(property_reviews.rating) as average_rating
FROM properties
LEFT JOIN properties_reviews ON properties.id = property_id
WHERE properties.city LIKE '%ancouve%'
GROUP BY properties.id
HAVING avg(property_reviews.rating) >= 4
ORDER BY cost_per_night ASC
LIMIT 10;