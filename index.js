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

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eiraya6.mongodb.net/?retryWrites=true&w=majority`;

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

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    const documentationTypeCollection = client.db('likho').collection('documentationTypes');

    // API Routes
    // ... (existing routes)

    // File Upload Route
    app.post('/api/upload', upload.single('file'), (req, res) => {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const fileContent = req.file.buffer.toString('utf8');

      // Save fileContent to a database or file
      // For example, you can create a new file and save the content
      fs.writeFileSync('uploaded_file.txt', fileContent);

      res.json({ fileContent });
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
