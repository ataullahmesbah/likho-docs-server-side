const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eiraya6.mongodb.net/your-database-name?retryWrites=true&w=majority`;

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eiraya6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Connect to MongoDB
async function run() {
  try {
    await client.connect();

    // Define collections
    const documentationTypeCollection = client.db('likho').collection('documentationTypes');
    const blogPostCollection = client.db('likho').collection('blogPosts');
    const templatesCollection = client.db('likho').collection('templates');
    const ckEditCollection = client.db('likho').collection('ckEditCollection');





    // Create Blog Post Route
    app.post('/blogPosts', async (req, res) => {
      try {
        const newBlogPost = await blogPostCollection.insertOne(req.body);
        res.status(201).json(newBlogPost);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get All Blog Posts Route
    app.get('/blogPosts', async (req, res) => {
      try {
        const blogPosts = await blogPostCollection.find().toArray();
        res.json(blogPosts);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });


    // Get All templates Route
    app.get('/templates', async (req, res) => {
      try {
        const templates = await templatesCollection.find().toArray();
        res.json(templates);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Example server route for creating a new data entry
    app.post('/templates', async (req, res) => {
      try {
        // Assuming req.body contains the data sent from the client
        const newTemplate = await templatesCollection.insertOne(req.body);
        res.status(201).json(newTemplate);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });



    app.post('/ckEditData', async (req, res) => {
      try {
        const newData = req.body; // Assuming req.body contains the data from CKEditor
        const result = await ckEditCollection.insertOne(newData);
        res.status(201).json(result.ops[0]);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });







    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Likho is running');
});

app.listen(port, () => {
  console.log(`Likho is running: ${port}`);
});
