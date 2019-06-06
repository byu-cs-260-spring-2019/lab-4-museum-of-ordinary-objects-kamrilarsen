const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');

const firebaseApp = firebase.initializeApp(
  functions.config().firebase
);
const app = express();

// Create a new item in the museum: takes a title and a path to an image.
var db = firebase.firestore();
var itemsRef = db.collection('items');

app.post('/api/items', async (req, res) => {
  try {
    let querySnapshot = await itemsRef.get();
    let numRecords = querySnapshot.docs.length;
    let item = {
      id: numRecords + 1,
      title: req.body.title,
      path: req.body.path
    };
    itemsRef.doc(item.id.toString()).set(item);
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all of the items in the museum.
app.get('/api/items', async (req, res) => {
  try{
    let querySnapshot = await itemsRef.get();
    res.send(querySnapshot.docs.map(doc => doc.data()));
  }catch(err){
    res.sendStatus(500);
  }
});

exports.app = functions.https.onRequest(app);