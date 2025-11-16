/**
 * Middleware de gestion centralisée des erreurs
 */

const errorHandler = (err, req, res, next) => {
  console.error('Erreur serveur:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Erreur de validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Erreur de validation',
      message: err.message,
      details: err.details
    });
  }

  // Erreur de base de données
  if (err.code && err.code.startsWith('23')) {
    return res.status(400).json({
      error: 'Erreur de contrainte de base de données',
      message: 'Les données fournies violent une contrainte de la base de données'
    });
  }

  // Erreur de connexion à la base de données
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    return res.status(503).json({
      error: 'Service indisponible',
      message: 'Impossible de se connecter à la base de données'
    });
  }

  // Erreur par défaut
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Erreur serveur interne';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err.details 
    })
  });
};

module.exports = errorHandler;

