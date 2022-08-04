const db = require("./db");

module.exports = {
  getReview: (productId, sort, count, page, callback) => {
    const pageNum = page * count - count;
    const query = {
      text: `SELECT
      u.id,
      u.rating,
      u.summary,
      u.recommend,
      u.response,
      u.body,
      u.date,
      u.reviewer_name,
      u.helpfulness,
      (SELECT COALESCE(json_agg(photosARR), '[]') AS photos FROM (SELECT id, url FROM photos  WHERE review_id = u.id) AS photosARR)
      FROM review u
      WHERE product_id = $1 AND reported = false
      ORDER BY ${sort} DESC
      LIMIT $2 OFFSET $3`,
      values: [productId, count, pageNum],
    };
    db.query(query, (err, results) => callback(err, results));
  },
  getMeta: (productId, callback) => {
    const query = {
      text: `SELECT json_build_object(
        'product_id', (
          SELECT product_id FROM review WHERE product_id = $1 LIMIT 1
        ),
        'ratings', (
          SELECT json_build_object (
            '1', (SELECT COUNT(*) from review WHERE rating = 1 AND product_id = $1),
            '2', (SELECT COUNT(*) from review WHERE rating = 2 AND product_id = $1),
            '3', (SELECT COUNT(*) from review WHERE rating = 3 AND product_id = $1),
            '4', (SELECT COUNT(*) from review WHERE rating = 4 AND product_id = $1),
            '5', (SELECT COUNT(*) from review WHERE rating = 5 AND product_id = $1)
          )
        ),
        'recommended' , (
          SELECT json_build_object (
            'false', (SELECT COUNT(recommend) FROM review WHERE recommend = false AND product_id = $1),
            'true', (SELECT COUNT(recommend) FROM review WHERE recommend = true AND product_id = $1)
          )
        ),
        'characteristics', (
              SELECT jsonb_object_agg(name, json_build_object('id', characteristics_id, 'value', value))
              FROM characteristics
              JOIN characteristic_review
              ON characteristics.id = characteristic_review.characteristics_id
              WHERE characteristics.product_id = $1)
              )`,
      values: [productId],
    };
    db.query(query, (err, results) => callback(err, results));
  },
  postReview: (data, callback) => {
    const characteristicId = Object.keys(data.characteristic);
    const characteristicValue = Object.values(data.characteristic);
    const query = `WITH insert_review AS (
        INSERT INTO review(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
        VALUES (nextval('review_id_seq'), ${data.product_id}, ${data.rating}, current_timestamp, '${data.summary}', '${data.body}', '${data.recommend}', false, '${data.name}', '${data.email}', 0, 0)
        RETURNING id
      ),
        insert_photos AS (
          INSERT INTO photos(id, review_id, url)
          VALUES (nextval('photos_id_seq'), (SELECT id FROM insert_review), UNNEST(ARRAY['${data.photos}']))
      )
          INSERT INTO characteristic_review (id, characteristics_id, review_id, value)
          VALUES (nextval('characteristic_review_id_seq'), UNNEST(ARRAY[${characteristicId}]), (SELECT id FROM insert_review), UNNEST(ARRAY[${characteristicValue}]))`;
    db.query(query, (err) => callback(err));
  },
  putHelpful: (reviewId, callback) => {
    const query = {
      text: `UPDATE review SET helpfulness = helpfulness + 1 WHERE id = $1`,
      values: [reviewId],
    };
    db.query(query, (err) => callback(err));
  },
  putReport: (reviewId, callback) => {
    const query = {
      text: `UPDATE review SET reported = true WHERE id = $1`,
      values: [reviewId],
    };
    db.query(query, (err) => callback(err));
  },
};
