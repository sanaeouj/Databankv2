/**
 * Routes pour les opérations sur les clients
 */
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { validateClient, validateUpdate, validateDelete } = require('../middleware/validator');

// Récupérer toutes les personnes
router.get('/ressources', clientController.getAllPeople.bind(clientController));

// Récupérer toutes les ressources combinées
router.get('/ressources/all', clientController.getAllCombined.bind(clientController));

// Créer un nouveau client
router.post('/clients', validateClient, clientController.createClient.bind(clientController));

// Supprimer un client
router.delete('/ressources/delete/:id', validateDelete, clientController.deleteClient.bind(clientController));

// Mettre à jour un client
router.put('/ressources/update/:id', validateUpdate, clientController.updateClient.bind(clientController));

module.exports = router;

