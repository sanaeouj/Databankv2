/**
 * Service principal pour les opérations sur les clients (combinaison de toutes les entités)
 */
const { pool } = require('../config/database');
const personalDetailsService = require('./personalDetailsService');
const companyDetailsService = require('./companyDetailsService');
const geoService = require('./geoService');
const socialService = require('./socialService');
const revenueService = require('./revenueService');

class ClientService {
  /**
   * Récupérer toutes les ressources combinées
   */
  async getAllCombined() {
    const personalDetails = await pool.query('SELECT * FROM personaldetails');
    const companyDetails = await pool.query('SELECT * FROM companydetails');
    const geoLocalisation = await pool.query('SELECT * FROM geolocalisation');
    const companyRevenue = await pool.query('SELECT * FROM companyrevenue');
    const socialDetails = await pool.query('SELECT * FROM socialdetails');

    const combinedData = personalDetails.rows.map((personal) => {
      const company = companyDetails.rows.find(c => c.personalid === personal.personalid);
      const geo = geoLocalisation.rows.find(g => g.companyid === (company ? company.companyid : null));
      const revenue = companyRevenue.rows.find(r => r.companyid === (company ? company.companyid : null));
      const social = socialDetails.rows.find(s => s.companyid === (company ? company.companyid : null));

      return {
        ...personal,
        company: company ? { ...company } : {},
        geo: geo ? {
          city: geo.city,
          address: geo.address,
          state: geo.state,
          country: geo.country,
        } : {},
        revenue: revenue ? { ...revenue } : {},
        social: social ? { ...social } : {},
      };
    });

    return combinedData;
  }

  /**
   * Créer un client complet avec toutes ses données associées
   */
  async createComplete(clientData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const {
        firstName,
        lastName,
        title,
        seniority,
        departments,
        mobilePhone,
        email,
        EmailStatus,
        company,
        geo,
        social,
        companyRevenue,
      } = clientData;

      // 1. Créer les détails personnels
      const personalData = await personalDetailsService.create({
        firstName,
        lastName,
        title,
        seniority,
        departments,
        mobilePhone,
        email,
        EmailStatus
      }, client);

      const personalid = personalData.personalid;

      // 2. Créer les détails d'entreprise
      const companyData = await companyDetailsService.create(company, personalid, client);
      const companyid = companyData.companyid;

      // 3. Créer la géolocalisation (optionnel)
      let geoData = null;
      if (geo && (geo.address || geo.city || geo.state || geo.country)) {
        try {
          geoData = await geoService.create(geo, companyid, personalid, client);
        } catch (geoError) {
          // Si la géolocalisation existe déjà, on la met à jour
          if (geoError.code === '23505') { // Violation de contrainte unique
            geoData = await geoService.update(companyid, geo, client);
          } else {
            throw geoError;
          }
        }
      }

      // 4. Créer les détails sociaux (optionnel)
      let socialData = null;
      if (social && (social.linkedinUrl || social.facebookUrl || social.twitterUrl)) {
        try {
          socialData = await socialService.create(social, companyid, client);
        } catch (socialError) {
          // Si les détails sociaux existent déjà, on les met à jour
          if (socialError.code === '23505') { // Violation de contrainte unique
            socialData = await socialService.update(companyid, social, client);
          } else {
            throw socialError;
          }
        }
      }

      // 5. Créer les revenus (optionnel)
      let revenueData = null;
      if (companyRevenue && (companyRevenue.latestFunding || companyRevenue.latestFundingAmount)) {
        try {
          revenueData = await revenueService.create(companyRevenue, companyid, client);
        } catch (revenueError) {
          // Si les revenus existent déjà, on les met à jour
          if (revenueError.code === '23505') { // Violation de contrainte unique
            revenueData = await revenueService.update(companyid, companyRevenue, client);
          } else {
            throw revenueError;
          }
        }
      }

      await client.query('COMMIT');

      return {
        personalDetails: personalData,
        companyDetails: companyData,
        ...(geoData && { geolocalisation: geoData }),
        ...(socialData && { socialDetails: socialData }),
        ...(revenueData && { companyRevenue: revenueData }),
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Supprimer un client complet avec toutes ses données associées
   */
  async deleteComplete(id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Récupérer le companyid avant suppression
      const company = await companyDetailsService.getByPersonalid(id);
      const companyid = company ? company.companyid : null;

      // Supprimer dans l'ordre inverse des dépendances
      if (companyid) {
        await socialService.delete(companyid, client);
        await revenueService.delete(companyid, client);
        await geoService.delete(companyid, client);
        await companyDetailsService.delete(id, client);
      }

      await personalDetailsService.delete(id, client);

      await client.query('COMMIT');
      return { message: 'Client supprimé avec succès' };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Mettre à jour un client complet
   */
  async updateComplete(id, updateData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const {
        personalDetails,
        companyDetails,
        geoDetails,
        revenueDetails,
        socialDetails
      } = updateData;

      // Récupérer le companyid
      const company = await companyDetailsService.getByPersonalid(id);
      const companyid = company ? company.companyid : null;

      // Mettre à jour les détails personnels
      if (personalDetails) {
        await personalDetailsService.update(id, personalDetails, client);
      }

      // Mettre à jour les détails d'entreprise
      if (companyDetails) {
        await companyDetailsService.update(id, companyDetails, client);
      }

      // Mettre à jour la géolocalisation
      if (geoDetails && companyid) {
        await geoService.update(companyid, geoDetails, client);
      }

      // Mettre à jour les revenus
      if (revenueDetails && companyid) {
        await revenueService.update(companyid, revenueDetails, client);
      }

      // Mettre à jour les réseaux sociaux
      if (socialDetails && companyid) {
        await socialService.update(companyid, socialDetails, client);
      }

      await client.query('COMMIT');
      return { message: 'Données mises à jour avec succès' };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new ClientService();

