/**
 * Service pour les opérations sur les détails d'entreprise
 */
const { pool } = require('../config/database');

class CompanyDetailsService {
  /**
   * Récupérer toutes les entreprises
   */
  async getAll() {
    const result = await pool.query(
      'SELECT "company", "Email", "Phone", "employees", "industry", "SEO Description", linkedinlink, website FROM companydetails ORDER BY companyid DESC'
    );
    return result.rows;
  }

  /**
   * Récupérer une entreprise par ID
   */
  async getById(id) {
    const result = await pool.query('SELECT * FROM companydetails WHERE companyid = $1', [id]);
    return result.rows[0];
  }

  /**
   * Récupérer une entreprise par personalid
   */
  async getByPersonalid(personalid) {
    const result = await pool.query(
      'SELECT * FROM companydetails WHERE personalid = $1',
      [personalid]
    );
    return result.rows[0];
  }

  /**
   * Créer une nouvelle entreprise
   */
  async create(data, personalid, client) {
    const {
      company,
      email,
      phone,
      employees,
      industry,
      seoDescription
    } = data;

    const query = `
      INSERT INTO companydetails (
        "company", "Email", "Phone", "employees", "industry", 
        "SEO Description", "personalid"
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      company || '',
      email || '',
      phone || '',
      parseInt(employees, 10) || null,
      industry || '',
      seoDescription || '',
      personalid
    ];

    const result = await client.query(query, values);
    return result.rows[0];
  }

  /**
   * Mettre à jour une entreprise
   */
  async update(personalid, data, client) {
    const {
      company,
      email,
      phone,
      employees,
      industry,
      seoDescription
    } = data;

    const query = `
      UPDATE companydetails SET 
        company = $1, 
        "Email" = $2, 
        "Phone" = $3, 
        employees = $4, 
        industry = $5, 
        "SEO Description" = $6 
      WHERE personalid = $7
      RETURNING *
    `;

    const values = [
      company,
      email,
      phone,
      parseInt(employees, 10),
      industry,
      seoDescription,
      personalid
    ];

    const result = await client.query(query, values);
    return result.rows[0];
  }

  /**
   * Supprimer une entreprise
   */
  async delete(personalid, client) {
    // Récupérer le companyid avant suppression
    const company = await this.getByPersonalid(personalid);
    if (!company) return null;

    const result = await client.query(
      'DELETE FROM companydetails WHERE personalid = $1 RETURNING *',
      [personalid]
    );
    return { deleted: result.rows[0], companyid: company.companyid };
  }

  /**
   * Récupérer les employés d'une entreprise
   */
  async getEmployees(companyName) {
    const query = `
      SELECT 
        pd.personalid, 
        pd."First Name", 
        pd."Last Name", 
        pd.title, 
        pd.seniority, 
        pd.departments, 
        pd."mobilePhone" as "mobilePhone", 
        pd.email, 
        pd."EmailStatus" as "emailStatus"
      FROM personaldetails pd
      INNER JOIN companydetails cd ON pd.personalid = cd.personalid
      WHERE cd.company ILIKE $1
      ORDER BY pd."Last Name"
    `;

    const result = await pool.query(query, [`%${companyName}%`]);
    return result.rows;
  }
}

module.exports = new CompanyDetailsService();

