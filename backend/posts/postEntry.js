const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config({ path: '../.env' });
const PORT = process.env.POST_SERVER_PORT || 4000;

const uuid = require('uuid');
// Lowdb setup
const low = require('lowdb');
const jsonFile = require('lowdb/node');

const db = new low.Low(new jsonFile.JSONFile('postsDB.json'), null);

async function initializeDB() {
  await db.read();
  if (!db.data) {
    db.data = { posts: [] };
    await db.write();
  }
}

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// GET /posts
app.get('/posts', async (req, res) => {
  await db.read(); // make sure to get fresh data
  res.send(db.data.posts);
});

// POST /posts
app.post('/posts', async (req, res) => {
  const { title, content } = req.body;
  await db.read(); // read latest data

  db.data.posts.push({ _id: uuid.v4(), title, content });
  await db.write();

  res.send(db.data.posts);
});

// Wait for DB to initialize before starting server
initializeDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Post server is running on port: ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Failed to initialize DB:", err);
  });
