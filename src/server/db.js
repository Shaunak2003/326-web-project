import PouchDB from 'pouchdb'
var db = new PouchDB('items');

export async function createItem(item) {
    console.log("db.js - ", item)
    await db.put(item)
}

export async function loadAllItems() {
    const result = await db.allDocs({ include_docs: true });
    return result.rows.map((row) => row.doc);
  }