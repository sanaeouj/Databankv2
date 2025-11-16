/**
 * Point d'entrée principal du serveur
 * Architecture MVC refactorisée
 */
require('dotenv').config();
const app = require('./config/app');
const { testConnection } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Import des routes
const healthRoutes = require('./routes/healthRoutes');
const clientRoutes = require('./routes/clientRoutes');
const companyRoutes = require('./routes/companyRoutes');

// Routes
app.use('/api', healthRoutes);
app.use('/api', clientRoutes);
app.use('/api', companyRoutes);

// Middleware 404 (doit être après toutes les routes)
app.use(notFound);

// Middleware de gestion d'erreurs (doit être en dernier)
app.use(errorHandler);

// Démarrer le serveur
const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Tester la connexion à la base de données
    const dbConnected = await testConnection();
    
    if (!dbConnected && process.env.NODE_ENV === 'production') {
      console.error('❌ Impossible de se connecter à la base de données. Arrêt du serveur.');
      process.exit(1);
    }

    app.listen(port, () => {
      console.log('\n🚀 Serveur démarré avec succès!');
      console.log(`📍 Port: ${port}`);
      console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API disponible sur: http://localhost:${port}/api`);
      console.log(`💚 Health check: http://localhost:${port}/api/health`);
      console.log(`📊 Base de données: ${dbConnected ? '✅ Connectée' : '⚠️  Non connectée'}\n`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer();

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu, arrêt gracieux du serveur...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT reçu, arrêt gracieux du serveur...');
  process.exit(0);
});
