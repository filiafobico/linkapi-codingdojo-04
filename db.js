const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://user:LrrjtB8ECRiA4MGx@prf-5gwgv.gcp.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect( err => {
  if (err) {
    console.error(err);
    exit(1);
  }
  global.db = client.db("patio-control");
  console.info('Connected on database');
});
