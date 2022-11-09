const db = require('../db/index.js');

module.exports = {
  /**
   * Returns the questions for a particular product to send as response
   *
   * @param {number} product_id - id of product to get questions for
   * @param {number} page - sets how many x amount of counts to skip in return
   * @param {number} count - sets number of results to return
   * @returns - data to send as response
   */
  async queryGetQuestions (product_id, page, count) {

    // Array of photos
    const PHOTOS = `(
      SELECT COALESCE (
        json_agg(
          json_build_object(
            'id', id,
            'url', url
          )
        ),'[]'::json)
      FROM
        photos
      WHERE
        answer_id = answers.id
      )`;

    // Object aggregate of answers
    const ANSWERS = `(
      SELECT
        json_object_agg ( id, (
          SELECT
            json_build_object (
              'id', id,
              'body', body,
              'date', date_written,
              'answerer_name', answerer_name,
              'reported', reported,
              'helpfulness', helpful,
              'photos', ${PHOTOS}
            )
        ))
      FROM
        answers
      WHERE
        question_id = questions.id AND reported = false
      )`;

    // Array of questions
    const RESULTS = `
      (SELECT
        json_agg(
          json_build_object(
            'question_id', id,
            'question_body', body,
            'question_date', date_written,
            'asker_name', asker_name,
            'question_helpfulness', helpful,
            'reported', reported,
            'answers', ${ANSWERS}
          )
        )
      FROM
        questions
      WHERE
        product_id = ${product_id} AND reported = false
      )`;

    // Selection of our SELECT query is formatted into JSON
    const SELECTION =
      `JSON_BUILD_OBJECT(
        'product_id', CAST (${product_id} AS varchar),
        'results', ${RESULTS}
      )`;

    /**
     * Send query result to client
     */
    return db.query(`SELECT ${SELECTION} AS output`)
      .then(res => {return res.rows[0].output});
  },

  /**
   * Returns the answers for a particular question to send as response
   *
   * @param {number} question_id - id of question to get answers for
   * @param {number} page - sets how many x amount of counts to skip in return
   * @param {number} count - sets number of results to return
   * @returns - data to send as response
   */
  async queryGetAnswers (question_id, page, count) {

    // Array of photos
    const PHOTOS = `(
      SELECT COALESCE (
        json_agg(
          json_build_object(
            'id', id,
            'url', url
          )
        ),'[]'::json)
      FROM
        photos
      WHERE
        answer_id = answers.id
      )`;

      // Array of answers
      const RESULTS = `(
        SELECT
          json_agg(
              json_build_object (
                'answer_id', id,
                'body', body,
                'date', date_written,
                'answerer_name', answerer_name,
                'reported', reported,
                'helpfulness', helpful,
                'photos', ${PHOTOS}
              )
          )
        FROM
          answers
        WHERE
          question_id = ${question_id} AND reported = false
        )`;

    // Selection of our SELECT query is formatted into JSON
    const SELECTION = `
      JSON_BUILD_OBJECT(
        'question', CAST (${question_id} AS varchar),
        'page', ${page},
        'count', ${count},
        'results', ${RESULTS}
      )`;

    /**
     * Send query result to client
     */
    return db.query(`SELECT ${SELECTION} AS output `)
      .then(res => {return res.rows[0].output});
  },

  /**
   * POSTS question to database
   *
   * @param {number} product_id - id of product to post question to
   * @param {string} body - body of question
   * @param {string} asker_name - name of question's asker
   * @param {string} asker_email - email of question's asker
   * @returns - Whether we succesfully POSTED to our database
   */
  async queryPostQuestion (product_id, body, asker_name, asker_email) {
    let date = new Date().getTime();

    // Fields of questions table
    const FIELDS = `(
      product_id,
      body,
      date_written,
      asker_name,
      asker_email
    )`;

    // Values to add to database
    const VALUES = `(
      ${product_id},
      '${body}',
      '${date}',
      '${asker_name}',
      '${asker_email}'
    )`;


    /**
     * Send query result (success/fail) to client
     */
    return db.query(`INSERT INTO questions ${FIELDS} VALUES ${VALUES}`)
      .then(() => {
        return true;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });

  },

  /**
   * POSTS answer to database
   * @param {number} question_id - id of question to post answer to
   * @param {string} body - body of answer
   * @param {string} answerer_name - name of answerer's asker
   * @param {string} answerer_email - email of answerer's asker
   * @param {Array} photos - array of photos
   * @returns - Whether we succesfully POSTED to our database
   */
  async queryPostAnswer (question_id, body, answerer_name, answerer_email, photos) {
    let date = new Date().getTime();

    // Fields of answers table
    const FIELDS = `(
      question_id,
      body,
      date_written,
      answerer_name,
      answerer_email
    )`;

    // Values to add to database
    const VALUES = `(
      ${question_id},
      '${body}',
      '${date}',
      '${answerer_name}',
      '${answerer_email}'
    )`;

    /**
     * Send query result (success/fail) to client
     */
    return db.query(`INSERT INTO answers ${FIELDS} VALUES ${VALUES} RETURNING id`)
      .then((res) => {
        if (photos.length === 0) {
          return true;

        } else {
          const answer_id = res.rows[0].id;

          // Initialize an array of promises to Promisify
          let promises = [];

          // Make queries to photos table to add photos and add those queries to promises array
          for (let i = 0; i < photos.length; i++) {
            let promise = db.query(`INSERT INTO photos (answer_id, url) VALUES (${answer_id}, '${photos[i]}')`)
              .then((res) => {
                res.rows[0].photos.push(res.rows[0]);
              })
              .catch((error) => {
                console.log(error);
              })
            promises.push(promise);
          }

          // Once promises resolve, return result of queries
          return Promise.all(promises)
            .then(() => {
              return true;
            })
            .catch((error) => {
              console.log(error);
              return false;
            });
        }
      })
      .catch((error) => {
        console.log('error');
        return false;
      });
  },

  /**
   *
   * @param {number} question_id - id of question to mark as helpful
   * @returns - whether our query was successful or not
   */
  async queryHelpfulQuestion (question_id) {
    return db.query(`UPDATE questions SET helpful = helpful + 1 WHERE id = ${question_id}`)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  },

  /**
   *
   * @param {number} question_id - id of question to report
   * @returns - whether our query was successful or not
   */
  async queryReportQuestion (question_id) {
    return db.query(`UPDATE questions SET reported = true WHERE id = ${question_id}`)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  },

  /**
   *
   * @param {number} answer_id - id of answer to mark as helpful
   * @returns - whether our query was successful or not
   */
  async queryHelpfulAnswer (answer_id) {
    return db.query(`UPDATE answers SET helpful = helpful + 1 WHERE id = ${answer_id}`)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  },

  /**
   *
   * @param {number} answer_id - id of answer to mark as helpful
   * @returns - whether our query was successful or not
   */
  async queryReportAnswer (answer_id) {
    return db.query(`UPDATE answers SET reported = true WHERE id = ${answer_id}`)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  },
};