/**
 * Middleware pour gérer les routes non trouvées (404)
 */
const notFound = (req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
};

module.exports = notFound;

