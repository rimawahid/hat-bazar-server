const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors')
const bodyParser = require('body-Parser')
require('dotenv').config()

const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kdwca.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    //console.log('connection err', err)
  const adminCollection = client.db("product").collection("admin");
   
    const clientCollection = client.db("product").collection("client");

    app.get('/product', (req, res) => {
      adminCollection.find()
      .toArray((err,items) => {
        res.send(items)
        
      })
    })

    app.post ('/addProduct', (req, res) => {
        const newProduct = req.body;
       
        adminCollection.insertOne(newProduct)
        .then(result => {
       
        res.send(result.insertedCount > 0)
        })
    })

    app.delete('/deleteProduct/:id', (req, res) => {
      const id = ObjectID(req.params.id);
      
      adminCollection.findOneAndDelete({_id: id})
      .then(result => {
        
        res.send(result.deletedCount > 0)
      })
  })

  app.get('/buyData', (req, res) => {
    clientCollection
        .find({ email: req.query.email })
        .toArray((err, result) => {
            res.send(result);
        });
});

app.post('/addBuyData', (req, res) => {
    const newfood = req.body;
    clientCollection.insertOne(newfood).then((result) => {
        res.send(result.insertedCount > 0);
    });
});

  //client.close();
});




app.listen(port)