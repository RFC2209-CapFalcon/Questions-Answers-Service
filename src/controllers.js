const service = require('./services.js');
/**
 * Retrieves a list of questions for a particular product. This list does not include any reported questions.
 * @param {{product_id, page, count}} req
 * @param {Object} res
 */
exports.getQuestions = async (req, res) => {
  const product_id = Number(req.query.product_id);
  const page = Number(req.query.page) || 1;
  const count = Number(req.query.count) || 5;

  // Require a valid product_id
  if(!req.query.product_id || isNaN(product_id)) {
    res.status(422).send('Must supply a valid product_id');
  } else {

    /**
     *
     */
    service.queryGetQuestions(product_id, page, count)
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).end();
      });
  }
}

/**
 * Returns answers for a given question. This list does not include any reported answers.
 * @param {{question_id, page, count}} req
 * @param {Object} res
 */
exports.getAnswers = (req, res) => {
  const question_id = Number(req.params.question_id);
  const page = Number(req.query.page) || 1;
  const count = Number(req.query.count) || 5;

  // Require question_id
  if(!req.params.question_id || isNaN(question_id)) {
    res.status(422).send('Must supply a valid question_id');
  } else {

    // Check we can process entities
    if (isNaN(page) || isNaN(count)) {
      res.status(422).send('Error: Cannot process request.  Check formatting of fields in query');
    } else {

      /**
       *
       */
      service.queryGetAnswers(question_id, page, count)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).end();
      });
    }
  }
}

/**
 * Adds a question for the given product
 *
 * @param {{product_id, body, name, email}} req
 * @param {Object} res
 */
exports.postQuestion = (req, res) => {
  const product_id = Number(req.body.product_id);
  const body = req.body.body;
  const name = req.body.name;
  const email = req.body.email;

  // Check that we are prepared to process input
  const bodyIsValid = body && typeof body === 'string' && body.length > 0 && body.length <= 1000;
  const nameIsValid = name && typeof name === 'string' && name.length > 0 && name.length <= 60;
  const emailIsValid = email && typeof email === 'string' && email.length > 0 && email.length <= 60;

  // Require product_id, body, name, email
  if(!req.body.product_id || !body || !name || !email) {
    res.status(422).send('Error: Missing a product_id, body, name, or email.');
  } else {

    // Check we can process entities
    if (isNaN(product_id)  || !bodyIsValid || !nameIsValid || !emailIsValid) {
      res.status(422).send('Error: Cannot process request.  Something wrong with input');
    } else {

      /**
       * Call service to POST question, then send appropriate response based in service' success
       */
      service.queryPostQuestion(product_id, body, name, email)
        .then((created) => {

          if (created) {
            res.status(201).send('Created');

          } else {
            res.status(500).end();

          }
        })
        .catch((err) => {
          console.log(err)
        });
    }

  }
}

/**
 * Adds an answer for the given question
 *
 * @param {{question_id, body, name, email, photos}} req
 * @param {Object} res
 */
exports.postAnswer = (req, res) => {
  const question_id = Number(req.params.question_id);
  const body = req.body.body;
  const name = req.body.name;
  const email = req.body.email;
  const photos = req.body.photos || [];

  // Check that we are prepared to process input
  const bodyIsValid = body && typeof body === 'string' && body.length > 0 && body.length <= 1000;
  const nameIsValid = name && typeof name === 'string' && name.length > 0 && name.length <= 60;
  const emailIsValid = email && typeof email === 'string' && email.length > 0 && email.length <= 60;
  const photosIsValid = Array.isArray(photos) && photos.length <= 5;

  // Check that photos contains only strings
  for (let i = 0; i < photos.length; i++) {
    if (typeof photos[i] !== 'string' && photos[i].length <= 2048) {
      photosIsValid = false;
    }
  }

  // Require question_id, body, name, email
  if(!req.params.question_id || !body || !name || !email) {
    res.status(422).send('Error: Missing a question_id, body, name, or email.');
  } else {

    // Check we can process entities
    if (isNaN(question_id)  || !bodyIsValid || !nameIsValid || !emailIsValid || !photosIsValid) {
      res.status(422).send('Error: Cannot process request.  Something wrong with input');
    } else {

      /**
       * Call service to POST answer, then send appropriate response based in service' success
       */
      service.queryPostAnswer(question_id, body, name, email, photos)
        .then((created) => {
          if (created) {
            res.status(201).send('Created');

          } else {
            res.status(500).end();

          }
        })
        .catch((err) => {
          console.log(err)
          res.status(500).end();

        });
    }
  }
}

/**
 * Updates a question to show it was found helpful.
 *
 * @param {{question_id}} req
 * @param {Object} res
 */
exports.helpfulQuestion = (req, res) => {
  const question_id = Number(req.params.question_id);

  // Require question_id
  if (!req.params.question_id || isNaN(question_id)) {
    res.status(404).send('Error: Must supply a valid question_id');
  } else {
    service.queryHelpfulQuestion(question_id)
      .then((put) => { // Whether we successfully PUT or not
        if (put) {
          res.status(204).end();

        } else {
          res.status(500).end();
        }

      })
      .catch((error) => {
        console.log(error);
        res.status(500).end();
      });
  }
}

/**
 * Updates a question to show it was reported.
 *
 * @param {{question_id}} req
 * @param {Object} res
 */
exports.reportQuestion = (req, res) => {
  const question_id = Number(req.params.question_id);

  // Require question_id
  if (!req.params.question_id || isNaN(question_id)) {
    res.status(404).send('Error: Must supply a valid question_id');
  } else {
    service.queryReportQuestion(question_id)
      .then((put) => { // Whether we successfully PUT or not
        if (put) {
          res.status(204).end();

        } else {
          res.status(500).end();
        }

      })
      .catch((error) => {
        console.log(error);
        res.status(500).end();
      });
  }
}

/**
 * Updates an answer to show it was found helpful.
 *
 * @param {{answer_id}} req
 * @param {Object} res
 */
exports.helpfulAnswer = (req, res) => {
  const answer_id = Number(req.params.answer_id);

  // Require answer_id
  if (!req.params.answer_id || isNaN(answer_id)) {
    res.status(404).send('Error: Must supply a valid answer_id');
  } else {
    service.queryHelpfulAnswer(answer_id)
      .then((put) => { // Whether we successfully PUT or not
        if (put) {
          res.status(204).end();

        } else {
          res.status(500).end();
        }

      })
      .catch((error) => {
        console.log(error);
        res.status(500).end();
      });
  }
}

/**
 * Updates an answer to show it has been reported.
 *
 * @param {{answer_id}} req
 * @param {Object} res
 */
exports.reportAnswer = (req, res) => {
  const answer_id = Number(req.params.answer_id);

  // Require answer_id
  if (!req.params.answer_id || isNaN(answer_id)) {
    res.status(404).send('Error: Must supply a valid answer_id');
  } else {
    service.queryReportAnswer(answer_id)
      .then((put) => { // Whether we successfully PUT or not
        if (put) {
          res.status(204).end();

        } else {
          res.status(500).end();
        }

      })
      .catch((error) => {
        console.log(error);
        res.status(500).end();
      });
  }
}