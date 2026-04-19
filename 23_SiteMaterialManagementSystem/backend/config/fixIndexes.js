// Run this once if signup keeps failing:
// node config/fixIndexes.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected');
  const db = mongoose.connection.db;
  const collection = db.collection('users');

  try {
    await collection.dropIndex('username_1');
    console.log('✅ Dropped old username index');
  } catch (e) {
    console.log('ℹ️ No old index to drop:', e.message);
  }

  // Recreate as sparse so null values don't conflict
  await collection.createIndex({ username: 1 }, { unique: true, sparse: true });
  console.log('✅ Recreated sparse username index');
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
