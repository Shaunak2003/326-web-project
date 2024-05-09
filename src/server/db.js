import PouchDB from 'pouchdb'
var db = new PouchDB('items');

export async function createItem(item) {
    console.log("db.js - ", item)
    await db.put(item)
}

export async function loadAllItems() {
    const result = await db.allDocs({ include_docs: true, attachments: true });
    return result.rows.map((row) => row.doc);
}

export async function removeItem(productID, productRev){
    await db.remove(productID, productRev)
}

export async function loadItems(category){
    const result = await db.allDocs({ include_docs: true, attachments: true });
    return result.rows.map(row => row.doc).filter(item => item.category === category)
}

export async function searchByName(searchParams){
    const result = await db.allDocs({ include_docs: true, attachments: true })
    return result.rows.map(row => row.doc).filter(item => item.name.replaceAll(' ', '').toLowerCase().includes(searchParams))
}