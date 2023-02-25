const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb',
  port: 5432
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = (email) => {
  return pool
    .query(
      `SELECT DISTINCT * 
      FROM users
      WHERE users.email = $1
      `, [email]
    )
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool
    .query(
      `SELECT DISTINCT * 
      FROM users
      WHERE users.id = $1;
      `, [id]
    )
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  return pool
    .query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`, [user.name, user.email, user.password])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool
    .query(`SELECT reservations.*, properties.*, AVG(property_reviews.rating) as average_rating
      FROM property_reviews
      JOIN reservations ON reservation_id = reservations.id
      JOIN properties ON property_reviews.property_id = properties.id
      WHERE reservations.guest_id = $1
      GROUP BY properties.id, reservations.id
      ORDER BY start_date ASC
      LIMIT $2;`, [guest_id, limit]
    )
    .then((result) => {
      return result.rows;
    })
  // return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = (options, limit = 10) => {
  const queryParams = [];

  let queryString = `
  SELECT properties.*, AVG(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  if (options.owner_id || options.city || options.minimum_price_per_night && maximum_price_per_night) {
    queryString += `WHERE `;
  }

  if (options.city) {
    queryParams.push(`%${options.city}%`)
    queryString += `city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    if (options.city) {
      queryString += `AND`
    }
    queryParams.push(`%${options.owner_id}%`)
    queryString += `owner_id LIKE $${queryParams.length} `
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    if (options.owner_id || options.city) {
      queryString += `AND`
    }
    let minPrice = options.minimum_price_per_night * 100
    let maxPrice = options.maximum_price_per_night * 100

    queryParams.push(`${minPrice}`)
    queryParams.push(`${maxPrice}`)

    queryString += ` (properties.cost_per_night > $${queryParams.length - 1} AND properties.cost_per_night < $${queryParams.length})`
  }
  queryString += ` GROUP BY properties.id`

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += ` HAVING AVG(property_reviews.rating) >= $${queryParams.length}`
  }

  queryParams.push(limit);
  console.log(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length}
  `;

  console.log(queryString, queryParams);

  return pool.query(queryString, queryParams).then((res) => res.rows);

};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
