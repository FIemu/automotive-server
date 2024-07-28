const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 8808;
const app = express();
require('dotenv').config()

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5u2j5fm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    client.connect();

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const db = client.db('automotiveDB');

    const brandsCollection = db.collection('brands');
    const productsCollection = db.collection('products');
    const cartsCollection = db.collection('carts');

    // for brandsCollections
    app.post('/brands', async (req, res) => {
      const brand = await req.body;
      console.log(brand);
      const result = await brandsCollection.insertOne(brand);
      res.send(result)
    })

    app.get('/brands', async (req, res) => {
      const result = await brandsCollection.find().toArray();
      res.send(result)
    })

    // for productsCollection
    app.post('/products', async (req, res) => {
      const product = await req.body;
      console.log(product)
      const result = await productsCollection.insertOne(product);
      res.send(result)
    })

    app.get('/products', async (req, res) => {
      const result = await productsCollection.find().toArray();
      res.send(result);
    })

    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const data = req.body;
      const filter = {
        _id: new ObjectId(id)
      };
      console.log(filter)
      const options = { upsert: true };
      const updatedProduct = {
        $set: {
          img_url: data.img_url,
          model_name: data.model_name,
          type_brand: data.type_brand,
          price: data.price,
          rating: data.rating,
          short_description: data.short_description
        }
      }
      const result = await productsCollection.updateOne(
        filter,
        updatedProduct,
        options
      )
      res.send(result)
    })

    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id)
      }
      const result = await productsCollection.deleteOne(query);
      res.send(result)
    })

    // for CartsCollection
    app.post('/carts', async (req, res) => {
      const cart = await req.body;
      const newCart = {
        brand_id: cart.brand_id,
        img_url: cart.img_url,
        model_name: cart.model_name,
        type_brand: cart.type_brand,
        price: cart.price,
        rating: cart.rating,
        short_description: cart.short_description,
      }
      const result = await cartsCollection.insertOne(newCart);
      res.send(result)
    })

    app.get('/carts', async (req, res) => {
      const result = await cartsCollection.find().toArray();
      res.send(result)
    })

    app.delete('/carts/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id)
      }
      const result = await cartsCollection.deleteOne(query)
      res.send(result)
    })


  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Server is running')
})

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})