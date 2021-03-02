import * as dotenv from 'dotenv'
dotenv.config()

import { MongoClient } from 'mongodb'

import {
  DB_NAME,
  JOURNAL_COLLECTION_NAME,
  PROCESS_COLLECTION_NAME,
  QUEUE_COLLECTION_NAME,
} from '../modifiers/mongoModifier'

async function createCollection(db, name) {
  await db.createCollection(name)
  console.log(`Created collection ${name}`)
}

MongoClient.connect(
  process.env.DB_CONNECTION,
  { useUnifiedTopology: true },
  async (err, connection) => {
    if (err) {
      throw err
    }

    const db = connection.db(DB_NAME)

    await createCollection(db, JOURNAL_COLLECTION_NAME)
    await db.collection(QUEUE_COLLECTION_NAME).createIndex('process_id')
    await createCollection(db, PROCESS_COLLECTION_NAME)
    await createCollection(db, QUEUE_COLLECTION_NAME)
    await db.collection(QUEUE_COLLECTION_NAME).createIndex('deploy_time')
    await db.collection(QUEUE_COLLECTION_NAME).createIndex('process_id')

    connection.close()
  },
)
