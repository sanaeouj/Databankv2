/**
 * Configuration de la base de données PostgreSQL
 */
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'company_db',
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Nombre maximum de clients dans le pool
  idleTimeoutMillis: 30000, // Fermer les clients inactifs après 30 secondes
  connectionTimeoutMillis: 2000, // Timeout de connexion de 2 secondes
});

// Test de connexion à la base de données
pool.on('connect', () => {
  console.log('✅ Connexion à la base de données PostgreSQL établie');
});

pool.on('error', (err) => {
  console.error('❌ Erreur de connexion à PostgreSQL:', err.message);
  if (process.env.NODE_ENV !== 'production') {
    console.warn('⚠️  Vérifiez que PostgreSQL est démarré et que les variables d\'environnement sont correctes.');
  }
});

// Fonction pour tester la connexion
const testConnection = async () => {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Erreur de test de connexion:', error);
    return false;
  }
};

module.exports = {
  pool,
  testConnection,
};

