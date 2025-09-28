const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

const PORT = process.env.COMMENT_SERVER_PORT || 4001;

const uuid = require('uuid');
// Lowdb setup
const low = require('lowdb');
const jsonFile = require('lowdb/node');
const db = new low.Low(new jsonFile.JSONFile('commentsDB.json'),null);

async function initializeDB() {
  await db.read();
  if (!db.data) {
    db.data = { comments: [] };
    await db.write();
  }
}

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// GET /comments - get all comments
app.get('/comments', async (req, res) => {
  await db.read(); // make sure to load latest data
  res.send(db.data.comments);
});

// POST /comments - add a new comment
app.post('/comments', async (req, res) => {
  const { postId, content } = req.body;
  await db.read();

  db.data.comments.push({ _id: uuid.v4(), postId, content });
  await db.write();

  res.send(db.data.comments);
});

// Initialize DB and then start server
initializeDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Comments server running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize DB:', err);
  });
