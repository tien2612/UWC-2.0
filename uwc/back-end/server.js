const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;

const url = 'mongodb+srv://uwc20:noname@cluster0.uzuscca.mongodb.net/uwc?retryWrites=true&w=majority';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.json());

// connect to MongoDB
client.connect((err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Connected to MongoDB');
  
  // edit worker infor
  app.put('/uwc/worker/:id', async (req, res) => {
    const id = req.body._id;
    const newData = req.body;
    delete req.body._id;
    try {
      const database = client.db('uwc');
      const collection = database.collection('worker');
      const result = await collection.updateOne({ _id:new ObjectId(req.params.id) }, { $set: newData });
  
      if (result.modifiedCount !== 1) {
        return res.sendStatus(404);
      }
  
      return res.sendStatus(200);
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  });
  
  
  // get all collection from mongo
  app.get('/uwc/worker', async (req, res) => {
    console.log('Accessed /uwc/worker route'); // added line
    try {
      const database = client.db('uwc');
      const collection = database.collection('worker');
      const workers = await collection.find().toArray();
      // return res.json(workers);
      // console.log(workers);
      return res.send({ data: workers });
      console.log(data);

    } catch (err) {
      return res.sendStatus(500);
    }
  });
  

  // start the server
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});