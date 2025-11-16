/**
 * Controller pour les opérations sur les clients
 */
const clientService = require('../services/clientService');
const companyDetailsService = require('../services/companyDetailsService');

class ClientController {
  /**
   * Récupérer toutes les personnes
   */
  async getAllPeople(req, res, next) {
    try {
      const personalDetailsService = require('../services/personalDetailsService');
      const people = await personalDetailsService.getAll();
      res.status(200).json(people);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupérer toutes les ressources combinées
   */
  async getAllCombined(req, res, next) {
    try {
      const data = await clientService.getAllCombined();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Créer un nouveau client
   */
  async createClient(req, res, next) {
    try {
      const result = await clientService.createComplete(req.body);
      res.status(201).json({
        message: 'Client ajouté avec succès.',
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Supprimer un client
   */
  async deleteClient(req, res, next) {
    try {
      const { id } = req.params;
      const result = await clientService.deleteComplete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mettre à jour un client
   */
  async updateClient(req, res, next) {
    try {
      const { id } = req.params;
      const result = await clientService.updateComplete(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ClientController();

