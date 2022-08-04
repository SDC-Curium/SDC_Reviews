/* eslint-disable no-console */
const models = require("./models");

module.exports = {
  getReview: (req, res) => {
    const productId = req.query.product_id;
    const count = req.query.count || 5;
    const page = req.query.page || 1;
    const sort = req.query.sort || "helpfulness";

    models.getReview(productId, sort, count, page, (err, data) => {
      if (err) {
        res.status(422).send("invalid product_id provided");
      } else {
        const formattedData = {
          product: req.query.product_id,
          page,
          count,
          results: data.rows,
        };
        res.send(formattedData);
      }
    });
  },
  getMeta: (req, res) => {
    const productId = req.query.product_id;
    models.getMeta(productId, (err, data) => {
      if (err) {
        res.status(422).send("invalid product_id provided");
      } else {
        res.send(data.rows[0].json_build_object);
      }
    });
  },
  postReview: (req, res) => {
    models.postReview(req.body, (err) => {
      if (err) {
        console.log(err);
        res.status(422).send("Missing fields");
      } else {
        res.send(204);
      }
    });
  },
  putHelpful: (req, res) => {
    models.putHelpful(req.params.review_id, (err) => {
      if (err) {
        console.log(err);
        res.send(422);
      } else {
        res.send(204);
      }
    });
  },
  putReport: (req, res) => {
    models.putReport(req.params.review_id, (err) => {
      if (err) {
        console.log(err);
        res.send(422);
      } else {
        res.send(204);
      }
    });
  },
};
