/**
 * Controller pour les endpoints de santé
 */
const { testConnection } = require('../config/database');

class HealthController {
  /**
   * Vérifier la santé du serveur et de la base de données
   */
  async checkHealth(req, res) {
    try {
      const dbConnected = await testConnection();
      
      if (dbConnected) {
        res.status(200).json({
          status: 'OK',
          message: 'Serveur fonctionnel',
          database: 'connectée',
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          status: 'ERROR',
          message: 'Serveur fonctionnel mais base de données non accessible',
          database: 'non connectée',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      res.status(503).json({
        status: 'ERROR',
        message: 'Erreur lors de la vérification de santé',
        database: 'non connectée',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = new HealthController();

