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
        question_id = questions.id
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
        product_id = ${product_id})`;

    // Selection of our SELECT query is formatted into JSON
    const SELECTION =
      `JSON_BUILD_OBJECT(
        'product_id', ${product_id},
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
          question_id = ${question_id}
        )`;

    // Selection of our SELECT query is formatted into JSON
    const SELECTION = `
      JSON_BUILD_OBJECT(
        'question', ${question_id},
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
   * POSTS passed args to database
   *
   * @param {number} product_id - id of product to post question to
   * @param {string} body - body of question
   * @param {string} asker_name - name of question's asker
   * @param {string} asker_email - email of question's asker
   * @returns - The result of our queries
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
     * Send query result to client
     */
    return db.query(`INSERT INTO questions ${FIELDS} VALUES ${VALUES}`)
      .then((res) => {res => {return res.rows[0]}})
      .catch((err) => {console.log(err)});
  },

  /**
   * POSTS passed args to database
   * @param {number} question_id - id of question to post answer to
   * @param {string} body - body of answer
   * @param {string} answerer_name - name of answerer's asker
   * @param {string} answerer_email - email of answerer's asker
   * @param {Array} photos - array of photos
   * @returns - The result of our queries
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
      '${answerer_email}',
    )`;

    /**
     * Send query result to client (we need to concatenate multiple query results, though)
     */
    return db.query(`INSERT INTO answers ${FIELDS} VALUES ${VALUES}`)
      .then((res) => {
        const answer_id = res.rows[0].id;
        // Add a photos array to the result
        res.rows[0].photos = [];

        // Initialize an array of promises to Promisify
        let promises = [];

        // Make queries to photos table to add photos and add those queries to promises array
        for (let i = 0; i < photos.length; i++) {
          let promise = db.query(`INSERT INTO photos (answer_id, url) VALUES (${answer_id}, '${photos[i]}')`)
            .then((res) => {
              res.rows[0].photos.push(res.rows[0]);
            })
          promises.push(promise);
        }

        // Once promises resolve, return result of queries
        return Promise.all(promises)
          .then(() => {
            return res.rows[0];
          });
      });
  },

  async queryHelpfulQuestion (question_id) {
    db.query();
  },

  async queryReportQuestion (question_id) {
    db.query();
  },

  async queryHelpfulAnswer (question_id) {
    db.query();
  },

  async queryReportAnswer (question_id) {
    db.query();
  },
};