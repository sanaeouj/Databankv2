/**
 * Service pour les opérations sur les revenus d'entreprise
 */
const { pool } = require('../config/database');

class RevenueService {
  /**
   * Créer des données de revenus
   */
  async create(data, companyid, client) {
    const { annualRevenue, totalFunding, latestFunding, latestFundingAmount } = data;

    const query = `
      INSERT INTO companyrevenue (
        "companyid", "Annual Revenue", "Total Funding", "Latest Funding", "Latest Funding Amount"
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      companyid,
      annualRevenue ? parseInt(annualRevenue, 10) : null,
      totalFunding ? parseInt(totalFunding, 10) : null,
      latestFunding || null,
      latestFundingAmount || null,
    ];

    const result = await client.query(query, values);
    return result.rows[0];
  }

  /**
   * Mettre à jour des données de revenus
   */
  async update(companyid, data, client) {
    const { latestFunding, latestFundingAmount } = data;

    // Parser la date si elle est fournie
    let parsedLatestFunding = null;
    if (latestFunding) {
      if (!isNaN(Date.parse(latestFunding))) {
        parsedLatestFunding = new Date(latestFunding).toISOString().split('T')[0];
      } else {
        parsedLatestFunding = new Date().toISOString().split('T')[0];
      }
    }

    const query = `
      UPDATE companyrevenue SET 
        "Latest Funding" = $1,  
        "Latest Funding Amount" = $2 
      WHERE companyid = $3
      RETURNING *
    `;

    const values = [
      parsedLatestFunding,
      latestFundingAmount ? parseInt(latestFundingAmount, 10) : null,
      companyid
    ];

    const result = await client.query(query, values);
    return result.rows[0];
  }

  /**
   * Supprimer des données de revenus
   */
  async delete(companyid, client) {
    const result = await client.query(
      'DELETE FROM companyrevenue WHERE companyid = $1 RETURNING *',
      [companyid]
    );
    return result.rows[0];
  }

  /**
   * Récupérer toutes les données de revenus
   */
  async getAll() {
    const result = await pool.query('SELECT * FROM companyrevenue');
    return result.rows;
  }
}

module.exports = new RevenueService();

