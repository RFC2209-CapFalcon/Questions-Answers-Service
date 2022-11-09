require('dotenv').config();

const db = require('./index.js');
const fs = require('fs');

const PATH_TO_DATA = process.env.PATH_TO_DATA;

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
  reported BOOLEAN NOT NULL DEFAULT false,
  helpful INTEGER NOT NULL DEFAULT 0)`)
.then(() => {
  db.query(`CREATE TABLE IF NOT EXISTS answers (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL,
    body VARCHAR(1000) NOT NULL,
    date_written VARCHAR(15) NOT NULL,
    answerer_name VARCHAR(60) NOT NULL,
    answerer_email VARCHAR(60) NOT NULL,
    reported BOOLEAN NOT NULL DEFAULT false,
    helpful INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (question_id) REFERENCES questions(id))`)
  .then(() => {
    db.query(`CREATE TABLE IF NOT EXISTS photos (
      id SERIAL NOT NULL PRIMARY KEY,
      answer_id INTEGER NOT NULL,
      url VARCHAR(2048) NOT NULL,
      FOREIGN KEY (answer_id) REFERENCES answers(id))`)
    .then(() => {
      db.query(`
        CREATE INDEX question_index ON questions (id);
        CREATE INDEX product_id_index ON questions (product_id);

        CREATE INDEX answer_index ON answers (id);
        CREATE INDEX question_id_index ON answers (question_id);

        CREATE INDEX photo_index ON photos (id);
        CREATE INDEX photos_answer_index ON photos (answer_id);
      `)
      .catch(() => {
        console.log('Indexes already created');
      });
    })
    .then(() => {
      /**
       * Populates questions/answers/photos tables with data from csv.
       */
      const canPopulateQuestionsTable = fs.existsSync(`${PATH_TO_DATA}/questions.csv`);
      const canPopulateAnswersTable =  fs.existsSync(`${PATH_TO_DATA}/answers.csv`);
      const canPopulatePhotosTable = fs.existsSync(`${PATH_TO_DATA}/answers_photos.csv`);

      if (canPopulateQuestionsTable) {
        db.query(`COPY questions FROM '${PATH_TO_DATA}/questions.csv' csv header;`)
          .then(() => { // Reset serial sequence
            db.query(`SELECT pg_catalog.setval(pg_get_serial_sequence('questions', 'id'), MAX(id)) FROM questions;`);
          })
          .catch(() => {
            console.log('Did not copy data from questions csv - this usually means the data has already been copied.');
          })
          .then(() => {
            if (canPopulateAnswersTable) {
              db.query(`COPY answers FROM '${PATH_TO_DATA}/answers.csv' csv header;`)
                .then(() => { // Reset serial sequence
                  db.query(`SELECT pg_catalog.setval(pg_get_serial_sequence('answers', 'id'), MAX(id)) FROM answers;`);
                })
                .catch(() => {
                  console.log('Did not copy data from answers csv - this usually means the data has already been copied.');
                })
                .then(() => {
                  if (canPopulatePhotosTable) {
                    db.query(`COPY photos FROM '${PATH_TO_DATA}/answers_photos.csv' csv header;`)
                      .then(() => { // Reset serial sequence
                        db.query(`SELECT pg_catalog.setval(pg_get_serial_sequence('photos', 'id'), MAX(id)) FROM photos;`);
                      })
                      .catch(() => {
                        console.log('Did not copy data from answers_photos csv - this usually means the data has already been copied.');
                      })
                      .then(() => {
                        console.log('Finished seeding.');
                      });
                  } else {
                    console.log('Could not find photos.csv - did not copy');
                  }
                });
          } else {
            console.log('Could not find answers.csv - did not copy');
          }
        });
      } else {
        console.log('Could not find questions.csv - did not copy');
      }
    })
  });
});