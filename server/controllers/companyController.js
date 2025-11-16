/**
 * Controller pour les opérations sur les entreprises
 */
const companyDetailsService = require('../services/companyDetailsService');

class CompanyController {
  /**
   * Récupérer toutes les entreprises
   */
  async getAllCompanies(req, res, next) {
    try {
      const companies = await companyDetailsService.getAll();
      res.status(200).json(companies);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupérer les employés d'une entreprise
   */
  async getEmployees(req, res, next) {
    try {
      const { company } = req.params;
      const employees = await companyDetailsService.getEmployees(company);

      if (employees.length === 0) {
        return res.status(404).json({
          message: `Aucun employé trouvé pour l'entreprise: ${company}`
        });
      }

      res.status(200).json(employees);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CompanyController();

