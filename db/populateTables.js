const db = require('./index.js');
const fs = require('fs');

/**
 * Select database (I think this is what this does)
 */
db.query('SELECT NOW()');

/**
 * Create questions table and populate if necessary
 */
db.query(`CREATE TABLE IF NOT EXISTS questions(
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  body VARCHAR(1000) NOT NULL,
  date_written VARCHAR(15) NOT NULL,
  asker_name VARCHAR(60) NOT NULL,
  asker_email VARCHAR(60) NOT NULL,
  reported BOOLEAN NOT NULL,
  helpful INTEGER NOT NULL DEFAULT 0)`)
  .then(() => {
    fs.existsSync('/home/miles/Desktop/Hack-Reactor/questions-answers-service/csv-data/questions.csv', (exists) => {
      if (exists) {
        db.query(`COPY questions FROM '/home/miles/Desktop/Hack-Reactor/questions-answers-service/csv-data/questions.csv' csv header;`);
      }
    })
  })
  .then(() => {
    /**
     * Create answers table and populate if necessary
     */
    const createAnswers = db.query(`CREATE TABLE IF NOT EXISTS answers (
      id SERIAL PRIMARY KEY,
      question_id INTEGER NOT NULL,
      body VARCHAR(1000) NOT NULL,
      date_written VARCHAR(15) NOT NULL,
      answerer_name VARCHAR(60) NOT NULL,
      answerer_email VARCHAR(60) NOT NULL,
      reported BOOLEAN NOT NULL,
      helpful INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (question_id) REFERENCES questions(id))`)
      .then(() => {
        fs.existsSync('/home/miles/Desktop/Hack-Reactor/questions-answers-service/csv-data/answers.csv', (exists) => {
          if (exists) {
            db.query(`COPY answers FROM '/home/miles/Desktop/Hack-Reactor/questions-answers-service/csv-data/answers.csv' csv header;`);
          }
        });
      })
      .then(() => {
        /**
         * Create photos table and populate if necessary
         */
        const photos = db.query(`CREATE TABLE IF NOT EXISTS photos (
          id SERIAL NOT NULL PRIMARY KEY,
          answer_id INTEGER NOT NULL,
          url VARCHAR(2048) NOT NULL,
          FOREIGN KEY (answer_id) REFERENCES answers(id))`)
          .then(() => {
            fs.existsSync('/home/miles/Desktop/Hack-Reactor/questions-answers-service/csv-data/answers_photos.csv', (exists) => {
              if (exists) {
                db.query(`COPY photos FROM '/home/miles/Desktop/Hack-Reactor/questions-answers-service/csv-data/answers_photos.csv' csv header;`);
              }
            });
          });
      });
  });



