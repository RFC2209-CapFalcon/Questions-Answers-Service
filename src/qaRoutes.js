const express = require('express');
const router = express.Router();

/**
 * Endpoint for getting questions
 */
router.get('/questions/:product_id', (req, res) => {
  const product_id = req.params.product_id;
  if (!product_id) {
    res.send('no');
  } else {
    res.send('yes')
  }

});

/**
 * Endpoint for getting answers for a question
 */
router.get('/questions/:question_id/answers', (req, res) => {
  res.send('hello');
});

/**
 * Endpoint for posting question
 */
 router.post('/questions/', (req, res) => {
  res.send('POST question here!');
});

/**
 * Endpoint for posting an answer for a question
 */
router.post('/questions/:question_id/answers', (req, res) => {
  res.send('POST question here!');
});

/**
 *
 */
router.put('/questions/:question_id/helpful', (req, res) => {

});

/**
 *
 */
 router.put('/questions/:question_id/report', (req, res) => {

});

/**
 *
 */
router.put('/answers/:answer_id/helpful', (req, res) => {

});

/**
 *
 */
 router.put('/answers/:answer_id/report', (req, res) => {

});


module.exports = router;