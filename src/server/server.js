import express, { response } from "express";
import logger from "morgan";
import bodyParser from "body-parser";
//import db from '../server/db.js';
import * as db from "./db.js";

const headerFields = { "Content-Type": "text/html" };

//function calls
async function saveItem(response, item){
    if (item === undefined){
        response.writeHead(400, headerFields);
        response.write("Item not saved?//??");
        response.end();
    }
    try{
        await db.createItem(item)
        response.writeHead(200, headerFields)
        response.end()
    }
    catch (err){
        response.writeHead(500, headerFields)
        response.end()
    }
}

async function displayAllItems(response){
    try{
        const results = await db.loadAllItems();
        console.log("server.js - ", results);
        response.setHeader("Content-Type", "application/json");
        response.status(200).send(JSON.stringify(results))
    }
    catch (err){
        console.error(err); 
        response.writeHead(500, headerFields);
        response.end(JSON.stringify({ error: "Internal Server Error" }));
    } 
}

const app = express();
const port = 3000;
app.use(logger("dev"));
app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("src/client"));

const MethodNotAllowedHandler = async (request, response) => {
    response.status(405).type('text/plain').send('Method Not Allowed');
  };

  //app routes
  app.route('/create').post(async (req, res) => {
    const item = req.body
    console.log("server.js - ", item)
    saveItem(res, item)
  }).all(MethodNotAllowedHandler)


  app.route('/all').get(async (req, res) => {
    const options = req.query
    displayAllItems(res)
  }).all(MethodNotAllowedHandler)

  app.route("*").all(async (request, response) => {
    response.status(404).send(`Not found: ${request.path}`);
  });
  
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });