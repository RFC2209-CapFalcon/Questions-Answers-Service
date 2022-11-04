const db = require('../db/index.js');

/**
 * Retrieves a list of questions for a particular product. This list does not include any reported questions.
 * @param {*} req
 * @param {*} res
 */
exports.getQuestions = (req, res) => {
  if(!req.query.product_id) {
    res.status(422).send('Must supply a product_id');
  } else {
    const product_id = Number(req.query.product_id);
    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 5;

    res.send('Questions for product ' + product_id);
  }
}

/**
 * Returns answers for a given question. This list does not include any reported answers.
 * @param {*} req
 * @param {*} res
 */
exports.getAnswers = (req, res) => {
  const question_id = req.params.question_id;

  res.send('Answers for question ' + question_id);
}

/**
 * Adds a question for the given product
 * @param {*} req
 * @param {*} res
 */
exports.postQuestion = (req, res) => {
  res.status(201).send('POST question here!');
}

/**
 * Adds an answer for the given question
 * @param {*} req
 * @param {*} res
 */
exports.postAnswer = (req, res) => {
  res.status(201).send('POST answer here!');
}
/**
 * Updates a question to show it was found helpful.
 * @param {*} req
 * @param {*} res
 */
exports.helpfulQuestion = (req, res) => {
  res.status(204).send('PUT question helpful here!');
}

/**
 * Updates a question to show it was reported.
 * @param {*} req
 * @param {*} res
 */
exports.reportQuestion = (req, res) => {
  res.status(204).send('PUT question report here!');
}

/**
 * Updates an answer to show it was found helpful.
 * @param {*} req
 * @param {*} res
 */
exports.helpfulAnswer = (req, res) => {
  res.status(204).send('PUT answer helpful here!');
}

/**
 * Updates an answer to show it has been reported.
 * @param {*} req
 * @param {*} res
 */
exports.reportAnswer = (req, res) => {
  res.status(204).send('PUT answer report here!');
}