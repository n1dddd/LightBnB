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

const getUserWithEmail = (email) => { //returns user object by querying their email to database
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT DISTINCT * 
      FROM users
      WHERE users.email = $1
      `, [email]
    )
      .then((result) => {
        let user = result.rows[0];
        resolve(user);
      })
      .catch((err) => {
        reject(console.log(err.message));
      });
  }
  );
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) { //returns user object by querying their id to database
  return new Promise((resolve, reject) => {
    pool
      .query(
        `SELECT DISTINCT * 
      FROM users
      WHERE users.id = $1;
      `, [id]
      )
      .then((result) => {
        let user = result.rows[0];
        resolve(user);
      })
      .catch((err) => {
        reject(console.log(err.message));
      });
  });
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) { //adds user to database
  return new Promise((resolve, reject) => {
    pool
      .query(
        `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`, [user.name, user.email, user.password])
      .then((result) => {
        let newUser = result.rows;
        console.log(newUser);
        resolve(newUser);
      })
      .catch((err) => {
        reject(console.log(err.message));
      });
  });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) { //returns all reservations based on guest ID
  return new Promise((resolve, reject) => {
    pool
      .query(`
      SELECT reservations.*, properties.*, AVG(property_reviews.rating) as average_rating
      FROM property_reviews
      JOIN reservations ON reservation_id = reservations.id
      JOIN properties ON property_reviews.property_id = properties.id
      WHERE reservations.guest_id = $1
      GROUP BY properties.id, reservations.id
      ORDER BY start_date ASC
      LIMIT $2;`, [guest_id, limit]
      )
      .then((result) => {
        let allReservations = result.rows;
        resolve(allReservations);
      })
      .catch((err) => {
        reject(console.log(err.message));
      });
  });
};
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

  //Base query below

  let queryString = ` 
  SELECT properties.*, AVG(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  /*
  Query options from search function,
  all scenarios covered below.
  Depending on options passed,
  build from base query above.
  */

  if (options.owner_id || options.city || options.minimum_price_per_night && options.maximum_price_per_night) {
    queryString += `WHERE `; //if any options above selected, add WHERE to base query string
  }

  if (options.city) {
    queryParams.push(`%${options.city}%`); //first push into empty queryParams, therefore queryParams[0]
    queryString += `city LIKE $${queryParams.length} `; //$${queryParams.length} cleverly uses array length as the INT for the parameterized variable $X (in this case $X = $1), which maps to queryParams[X] (or the value [0] = options.city)
  }

  if (options.owner_id) {
    if (options.city) {
      queryString += `AND`;
    }
    queryParams.push(parseInt(options.owner_id));
    queryString += `owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    if (options.owner_id || options.city) {
      queryString += `AND`;
    }
    let minPrice = options.minimum_price_per_night * 100; // * 100 because price stored in cents in database
    let maxPrice = options.maximum_price_per_night * 100;

    queryParams.push(`${minPrice}`);
    queryParams.push(`${maxPrice}`);

    queryString += ` (properties.cost_per_night > $${queryParams.length - 1} AND properties.cost_per_night < $${queryParams.length}) `;
  }
  queryString += `GROUP BY properties.id`;

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += ` HAVING AVG(property_reviews.rating) >= $${queryParams.length}`;
  }

  queryParams.push(limit);
  console.log(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length}
  `;

  console.log(queryString, queryParams);

  return new Promise((resolve, reject) => {
    pool
      .query(queryString, queryParams)
      .then((res) => {
        let getAllPropertiesQuery = res.rows;
        resolve(getAllPropertiesQuery);
      })
      .catch((err) => {
        reject(console.log(err.message));
      });
  });
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) { //add a property using the passed property object
  const queryParams = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms
  ];
  let queryString = `
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
  RETURNING *;`;

  return new Promise((resolve, reject) => {
    pool
      .query(queryString, queryParams)
      .then((res) => {
        let newProperty = res.rows;
        resolve(newProperty);
      })
      .catch((err) => {
        reject(console.log(err.message));
      });
  });
};
exports.addProperty = addProperty;
