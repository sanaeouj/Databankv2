/**
 * Routes pour les opérations sur les entreprises
 */
const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

// Récupérer toutes les entreprises
router.get('/companies', companyController.getAllCompanies.bind(companyController));

// Récupérer les employés d'une entreprise
router.get('/company/employees/:company', companyController.getEmployees.bind(companyController));

module.exports = router;

