import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306, // Puerto por defecto es 3306
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar a la base de datos:', err);
    process.exit(1);
  }
  console.log('✅ Conectado a la base de datos MySQL');
});

export default db;