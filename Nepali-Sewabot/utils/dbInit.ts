import * as SQLite from 'expo-sqlite'

export const db = SQLite.openDatabaseSync("chat.db");

export const initializeDB = async (userId:string) => {
  console.log("userId:",userId)
  const tableName = `messages_${userId}`;
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender TEXT,
        content TEXT,
        timestamp TEXT,
        session_id TEXT
      );
    `);
    //  await db.execAsync(`ALTER TABLE messages ADD COLUMN session_id TEXT;`);
    console.log("✅ SQLite table ready");
  } catch (error) {
    console.error("❌ Failed to create SQLite table", error);
  }
};

export const getDB=()=>db;