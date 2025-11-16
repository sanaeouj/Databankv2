/**
 * Routes pour les endpoints de santé
 */
const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

// Vérifier la santé du serveur
router.get('/health', healthController.checkHealth.bind(healthController));

module.exports = router;

