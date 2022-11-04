const express = require('express');
const router = express.Router();
const controllers = require('../controllers.js');

/**
 * Endpoint for getting questions
 */
router.get('/questions:product_id?:page?:count?', (req, res) => {
  controllers.getQuestions(req, res);
});

/**
 * Endpoint for getting answers for a question
 */
router.get('/questions/:question_id/answers:page?:count?', (req, res) => {
  controllers.getAnswers(req, res);
});

/**
 * Endpoint for posting question
 */
router.post('/questions', (req, res) => {
  controllers.postQuestion(req, res);
});

/**
 * Endpoint for posting an answer for a question
 */
router.post('/questions/:question_id/answers', (req, res) => {
  controllers.postAnswer(req, res);
});

/**
 * Endpoint for marking a question as helpful
 */
router.put('/questions/:question_id/helpful', (req, res) => {
  controllers.helpfulQuestion(req, res);
});

/**
 * Endpoint for reporting a question
 */
 router.put('/questions/:question_id/report', (req, res) => {
  controllers.reportQuestion(req, res);
});

/**
 * Endpoint for marking an answer as helpful
 */
router.put('/answers/:answer_id/helpful', (req, res) => {
  controllers.helpfulAnswer(req, res);
});

/**
 * Endpoint for reporting an answer
 */
 router.put('/answers/:answer_id/report', (req, res) => {
  controllers.reportAnswer(req, res);
});


module.exports = router;