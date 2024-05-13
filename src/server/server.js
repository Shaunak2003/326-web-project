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
        response.write("Item not saved");
        response.end();
    }
    try{
        await db.createItem(item)
        response.writeHead(200, headerFields)
        response.end()
    }
    catch (err){
        console.log(err)
        response.writeHead(500, headerFields)
        response.end()
    }
}

async function displayAllItems(response){
    try{
        const results = await db.loadAllItems();
        //console.log("server.js - ", results);
        response.setHeader("Content-Type", "application/json");
        response.status(200).send(JSON.stringify(results))
    }
    catch (err){
        console.error(err); 
        response.writeHead(500, headerFields);
        response.end(JSON.stringify({ error: "Internal Server Error" }));
    } 
}

async function buyProduct(response, productID, productRev){
    try{
        await db.removeItem(productID, productRev)
        response.writeHead(200, headerFields)
        response.end()
    }
    catch (err){
        console.log(err)
        response.writeHead(500, headerFields)
        response.end()
    }
}

async function displayItems(response, category){
    try{
        const results = await db.loadItems(category);
        //console.log("server.js - ", results);
        response.setHeader("Content-Type", "application/json");
        response.status(200).send(JSON.stringify(results))
    }
    catch (err){
        console.error(err); 
        response.writeHead(500, headerFields);
        response.end(JSON.stringify({ error: "Internal Server Error" }));
    }
}

async function searchItems(response, searchParams){
    try{
        const results = await db.searchByName(searchParams);
        //console.log("server.js - ", results);
        response.setHeader("Content-Type", "application/json");
        response.status(200).send(JSON.stringify(results))
    }
    catch{
        console.error(err); 
        response.writeHead(500, headerFields);
        response.end(JSON.stringify({ error: "Internal Server Error" }));
    }
}

async function signUp(response, email, password){
    try{
        const result = await db.createAccount(email, password)
        if (result.success){
            response.writeHead(200, headerFields)
            response.end()
        }
        else{
            response.writeHead(409, headerFields)
            response.end()
        }
    }
    catch (err){
        response.writeHead(503, headerFields)
        response.end()
    }
}

async function updateProductInfo(response, id, rev, category, newValue){
    try{
        await db.updateProduct(id, rev, category, newValue)
        response.writeHead(200, headerFields)
        response.end()
    }
    catch (err){
        console.log(err)
        response.writeHead(500, headerFields)
        response.end()
    }
}

async function login(response, email, password){
    try{
        const result = await db.getAccount(email, password)
        if (result.success){
            response.writeHead(200, headerFields)
            response.end()
        }
        else{
            response.writeHead(400, headerFields)
            response.end()
        }
    }
    catch (err){
        response.writeHead(500, headerFields)
        response.end()
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
    //console.log("server.js - ", item)
    if (item.email !== undefined){
        const {email, password} = item
        signUp(res, email, password)
    }
    else saveItem(res, item)
  }).all(MethodNotAllowedHandler)

  app.route('/all').get(async (req, res) => {
    displayAllItems(res)
  }).all(MethodNotAllowedHandler)

  app.route('/delete').delete(async (req, res) => {
    const options = req.query
    buyProduct(res, options.productID, options.productRev)
  }).all(MethodNotAllowedHandler)

  app.route('/read').get(async (req, res) => {
    const options = req.query
    //console.log("server.js - ", options)
    if (options.email !== undefined) login(res, options.email, options.password)
    else if (options.category !== undefined) displayItems(res, options.category.toLowerCase())
    else searchItems(res, options.searchParams.toLowerCase())
  }).all(MethodNotAllowedHandler)

  /* app.route('/signup').post(async (req, res) => {
    const {email, password} = req.body
    signUp(res, email, password)
  }).all(MethodNotAllowedHandler) */
  
  app.route('/update').put(async (req, res) => {
    const options = req.body
    //console.log("server.js - ", options)
    const {id, rev, field, newValue} = options
    //console.log("server.js id - ", options.id)
    updateProductInfo(res, id, rev, field, newValue)
  }).all(MethodNotAllowedHandler)

   app.route("*").all(async (request, response) => {
    response.status(404).send(`Not found: ${request.path}`);
  });
  
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });