import React, { useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Papa from "papaparse";
import ExcelJS from "exceljs";

// Ajout de "Email Status" au mapping
const importMapping = {
  "First Name": "firstName",
  "Last Name": "lastName",
  "Title": "title",                
  "Seniority": "seniority",       
  "Departments": "departments",    
  "Mobile Phone": "mobilePhone",
  "Email": "email",               
  "Email Status": "EmailStatus", // Ajouté ici
  "company_companyid": "company.companyid",
  "Company": "company.company",
  "Company Email": "company.email",
  "Company Phone": "company.phone",
  "Employees": "company.employees",
  "Industry": "company.industry",
  "SEO Description": "company.seoDescription",
  "company_personalid": "company.personalid",
  "City": "geo.city",
  "Address": "geo.address",
  "State": "geo.state",
  "Country": "geo.country",
  "Latest Funding Date": "companyRevenue.latestFunding",
  "Latest Funding Amount": "companyRevenue.latestFundingAmount",
  "revenue_companyid": "companyRevenue.companyid",
  "LinkedIn": "social.linkedinUrl",
  "Facebook": "social.facebookUrl",
  "Twitter": "social.twitterUrl",
  "social_companyid": "social.companyid"
};
const normalizeKey = (key) => key.trim().replace(/\s+/g, ' ').toLowerCase();
const normalizedMapping = Object.fromEntries(
  Object.entries(importMapping).map(([k, v]) => [normalizeKey(k), v])
);
const API_BASE_URL = "https://databank-yndl.onrender.com";

const AddPeople = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    title: "",
    seniority: "",
    departments: "",
    mobilePhone: "",
    email: "",
    EmailStatus: "", // Assurez-vous que l'état initial est cohérent
    company: {
      companyid: "",
      company: "",
      email: "",
      phone: "",
      employees: "",
      industry: "",
      seoDescription: "",
      personalid: ""
    },
    geo: {
      address: "",
      city: "",
      state: "",
      country: "",
    },
    social: {
      linkedinUrl: "",
      facebookUrl: "",
      twitterUrl: "",
      companyid: ""
    },
    companyRevenue: {
      companyid: "",
      latestFunding: "",
      latestFundingAmount: "",
    },
  });

  const [fileData, setFileData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // Styles (inchangés)
  const inputStyle = {
    margin: "10px",
    width: "100%",
    height: "40px",
    padding: "10px",
    fontSize: "13px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#1e1e1e",
    color: "#fff",
  };

  const labelStyle = {
    fontSize: "13px",
    color: "#fff",
    marginBottom: "5px",
  };

  const containerStyle = {
    margin: "10px 0",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "20px",
    alignItems: "center",
  };

  const inputContainerStyle = {
    display: "flex",
    flexDirection: "column",
    margin: "20px",
    gap: "10px",
    fontSize: "13px",
  };

  const buttonStyle = {
    margin: "10px",
    padding: "10px",
    fontSize: "13px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#cccccc",
    cursor: "not-allowed",
  };

  const formContainerStyle = {
    backgroundColor: "#2c2c2c",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    margin: "10px 0",
  };

  // Fonction API (inchangée)
  const addClientToDatabase = async (client) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to add client");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error adding client:", error);
      throw error;
    }
  };

  // Gestion changement fichier (inchangée)
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop().toLowerCase();

    try {
      if (fileExtension === "csv") {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true, // Ajouté pour ignorer les lignes vides
          complete: (results) => {
            // Filtrer les lignes où toutes les valeurs sont vides ou null
            const filteredData = results.data.filter(row => 
                Object.values(row).some(val => val !== null && val !== '')
            );
            setFileData(filteredData);
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
            alert("Error parsing CSV file. Please check the file format and content.");
          }
        });
      } else if (fileExtension === "xlsx" || fileExtension === "xls") {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        const worksheet = workbook.worksheets[0];
        const headers = [];
        // Lire les en-têtes de la première ligne
        const headerRow = worksheet.getRow(1);
        if (headerRow) {
            headerRow.eachCell((cell) => {
                headers.push(cell.value ? cell.value.toString().trim() : '');
            });
        }
        
        const jsonData = [];
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber === 1 || row.values.length === 0) return; // Skip header row and empty rows
          const rowData = {};
          let hasValue = false;
          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const header = headers[colNumber - 1];
            if (header) { 
                // Gestion spéciale pour les objets avec hyperlink (typiques d'ExcelJS pour les liens)
                let cellValue = cell.value;
                if (typeof cellValue === 'object' && cellValue !== null && cellValue.text) {
                    cellValue = cellValue.text; // Prendre seulement le texte du lien
                }
                rowData[header] = cellValue;
                if (cellValue !== null && cellValue !== '') {
                    hasValue = true;
                }
            }
          });
          // Ajouter la ligne seulement si elle contient au moins une valeur
          if (hasValue && Object.keys(rowData).length > 0) {
            jsonData.push(rowData);
          }
        });
        setFileData(jsonData);
      } else {
        throw new Error("Unsupported file type. Please use CSV, XLSX, or XLS.");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      alert(`Error processing file: ${error.message}`);
      setFileData([]); // Réinitialiser les données en cas d'erreur
    }
  };

  // Gestion de l'ajout depuis le fichier (MODIFIÉ)
  const handleAddFile = async () => {
    if (fileData.length === 0) {
      alert("No data to add. Please upload a valid file.");
      return;
    }

    setIsProcessing(true);
    let successCount = 0;
    let errorCount = 0;
    const errors = []; // Pour stocker les erreurs spécifiques

    try {
      for (const [index, client] of fileData.entries()) {
        // Vérifier si la ligne est vide ou ne contient que des clés vides
        if (!client || Object.keys(client).length === 0 || Object.values(client).every(v => v === null || v === '')) {
            console.warn(`Skipping empty row ${index + 1}`);
            continue;
        }

        try {
          // Créer une copie profonde de l'état initial pour chaque client
          let newClient = JSON.parse(JSON.stringify({
              firstName: "", lastName: "", title: "", seniority: "", departments: "",
              mobilePhone: "", email: "", EmailStatus: "", company: { companyid: "", company: "", email: "", phone: "", employees: "", industry: "", seoDescription: "", personalid: "" },
              geo: { address: "", city: "", state: "", country: "" }, social: { linkedinUrl: "", facebookUrl: "", twitterUrl: "", companyid: "" },
              companyRevenue: { companyid: "", latestFunding: "", latestFundingAmount: "" }
          }));

          Object.entries(client).forEach(([csvKey, value]) => {
            if (!csvKey) return; // Ignorer les clés vides/null
            const normKey = normalizeKey(csvKey);
            const formKey = normalizedMapping[normKey];
            
            if (!formKey) {
              // console.warn(`Clé non mappée CSV: '${csvKey}' (Normalisée: '${normKey}') à la ligne ${index + 1}`);
              return;
            }

            let processedValue = value;

            // --- Correction pour l'email (personnel et compagnie) --- 
            if ((formKey === 'email' || formKey === 'company.email')) {
                if (typeof value === 'string') {
                    // Essayer de parser si ça ressemble à du JSON
                    if (value.trim().startsWith('{') && value.trim().endsWith('}')) {
                        try {
                            // Remplacer les doubles guillemets échappés ("" par ") typiques du CSV
                            const jsonString = value.replace(/""/g, '"'); 
                            const emailObj = JSON.parse(jsonString);
                            processedValue = emailObj.text || ''; // Extraire la propriété 'text'
                        } catch (e) {
                            console.warn(`Impossible de parser l'email JSON: '${value}' à la ligne ${index + 1}. Utilisation de la valeur brute. Erreur: ${e.message}`);
                            processedValue = value; // Fallback
                        }
                    } else {
                        processedValue = value; // C'est déjà une chaîne simple
                    }
                } else if (typeof value === 'object' && value !== null && value.text) {
                     // Gérer le cas où ExcelJS retourne un objet (pour les liens hypertextes)
                    processedValue = value.text;
                } else if (value === null || value === undefined) {
                    processedValue = ""; // Assurer une chaîne vide pour null/undefined
                } else {
                    processedValue = String(value); // Convertir en chaîne si ce n'est ni string ni object{text}
                }
            }
            // --- Fin Correction Email --- 

            // --- Correction pour EmailStatus --- 
            if (formKey === 'EmailStatus') {
                // Assurer que le statut est une des valeurs attendues ou vide
                const validStatuses = ["Extrapolated", "Unavailable", "Unknown", "Valid"]; // Ajouter 'Valid' si c'est une option possible
                if (typeof processedValue === 'string' && validStatuses.includes(processedValue)) {
                    // La valeur est déjà correcte
                } else if (processedValue === null || processedValue === undefined || processedValue === '') {
                    processedValue = ""; // Statut vide si non fourni ou invalide
                } else {
                    console.warn(`Statut d'email invalide: '${processedValue}' à la ligne ${index + 1}. Défini comme vide.`);
                    processedValue = ""; // Ou définir une valeur par défaut comme 'Unknown'
                }
            }
             // --- Fin Correction EmailStatus --- 

            const keys = formKey.split('.');
            let current = newClient;
            for (let i = 0; i < keys.length - 1; i++) {
              if (current[keys[i]] === undefined || current[keys[i]] === null) { // Vérifier undefined aussi
                current[keys[i]] = {};
              }
              current = current[keys[i]];
            }
            // Assigner la valeur traitée
            current[keys[keys.length - 1]] = processedValue;
          });

          // Validation des champs requis après mapping
          if (!newClient.firstName || !newClient.lastName || !newClient.email || !newClient.company?.company) {
            const missingFields = [];
            if (!newClient.firstName) missingFields.push("First Name");
            if (!newClient.lastName) missingFields.push("Last Name");
            if (!newClient.email) missingFields.push("Email");
            if (!newClient.company?.company) missingFields.push("Company Name");
            const errorMessage = `Ligne ${index + 1}: Champs requis manquants après mapping: ${missingFields.join(', ')}. Client: ${JSON.stringify(client)}`;
            console.warn(errorMessage);
            errors.push(errorMessage);
            errorCount++;
            continue; // Passer au client suivant
          }

          // console.log(`Client traité ${index + 1}/${fileData.length}:`, newClient);
          await addClientToDatabase(newClient);
          successCount++;

        } catch (error) {
          const errorMessage = `Ligne ${index + 1}: Erreur lors du traitement ou de l'ajout: ${error.message}. Client: ${JSON.stringify(client)}`;
          console.error(errorMessage, error);
          errors.push(errorMessage);
          errorCount++;
        }
      }

      // Afficher un résumé
      let summaryMessage = `Traitement terminé.
Succès: ${successCount}
Erreurs: ${errorCount}`;
      if (errorCount > 0) {
          summaryMessage += `\n\nDétails des erreurs:\n${errors.slice(0, 10).join('\n')}`; // Afficher les 10 premières erreurs
          if (errors.length > 10) summaryMessage += "\n(et plus...)";
          alert("⚠️ Traitement terminé avec des erreurs. Voir la console pour les détails.");
      } else {
          alert("✅ Traitement terminé avec succès !");
      }
      console.log(summaryMessage);

      // Réinitialiser après traitement
      setFileData([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }

    } catch (batchError) {
      console.error("Erreur globale du traitement par lot:", batchError);
      alert(`❌ Une erreur majeure est survenue durant le traitement: ${batchError.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Gestion changement manuel (inchangée, mais l'état formData est maintenant plus propre)
  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    
    setFormData(prevState => {
      // Création d'une copie profonde pour éviter les mutations directes
      const newState = JSON.parse(JSON.stringify(prevState));
      let current = newState;
      
      for (let i = 0; i < keys.length - 1; i++) {
        // Initialiser les objets imbriqués s'ils n'existent pas
        if (current[keys[i]] === undefined || current[keys[i]] === null) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newState;
    });
  };

  // Gestion soumission manuelle (inchangée)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validation simple côté client
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.company?.company || !formData.EmailStatus) {
         // Ajout de la validation pour EmailStatus
        throw new Error("Veuillez remplir tous les champs requis (*), y compris le statut de l'e-mail.");
      }

      console.log("Envoi du formulaire manuel:", formData);
      const response = await addClientToDatabase(formData);
      alert("✅ Client ajouté manuellement avec succès !");
      
      // Réinitialiser le formulaire
      setFormData({
        firstName: "", lastName: "", title: "", seniority: "", departments: "",
        mobilePhone: "", email: "", EmailStatus: "", company: { companyid: "", company: "", email: "", phone: "", employees: "", industry: "", seoDescription: "", personalid: "" },
        geo: { address: "", city: "", state: "", country: "" }, social: { linkedinUrl: "", facebookUrl: "", twitterUrl: "", companyid: "" },
        companyRevenue: { companyid: "", latestFunding: "", latestFundingAmount: "" }
      });

    } catch (error) {
      console.error("Erreur lors de la soumission manuelle:", error);
      alert(`❌ Erreur: ${error.message}`);
    }
  };

  // Formatage label (inchangé)
  const formatLabel = (label) => {
    // Gérer spécifiquement EmailStatus pour un meilleur affichage
    if (label === 'EmailStatus') return 'Email Status';
    return label
      .replace(/([A-Z])/g, " $1") // Ajoute un espace avant les majuscules
      .replace(/_/g, " ") // Remplace les underscores par des espaces
      .replace(/\./g, " > ") // Remplace les points par ' > '
      .toLowerCase() // Tout en minuscules
      .replace(/(^|\s)\w/g, (c) => c.toUpperCase()); // Majuscule au début de chaque mot
  };

  // Rendu JSX (structure inchangée, mais les valeurs affichées devraient être correctes)
  return (
    <div style={{ display: "flex", width: "90vw", height: "100vh", backgroundColor: "#242424" }}>
      <Sidebar />
      <div style={{ flexGrow: 1, padding: "50px", color: "#333", overflowY: "auto" }}>
        <h1 style={{ color: "#fff", marginBottom: "20px" }}>Add People</h1>

        {/* Section Importation Fichier */}
        <div style={formContainerStyle}>
          <h3 style={{ color: "#fff" }}>Import Clients from File</h3>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            style={{ fontSize: "16px", margin: "10px", color: "#fff" }}
            disabled={isProcessing}
            ref={fileInputRef}
          />
          <button 
            type="button" 
            style={isProcessing ? disabledButtonStyle : buttonStyle} 
            onClick={handleAddFile}
            disabled={isProcessing || fileData.length === 0}
          >
            {isProcessing ? `Traitement (${successCount}/${fileData.length})...` : "Traiter les données du fichier"} 
          </button>
          <p style={{ color: "#aaa", fontSize: "12px", marginTop: "10px" }}>
            Formats supportés: CSV, Excel (.xlsx, .xls). Assurez-vous que les en-têtes correspondent au mapping.
          </p>
        </div>

        {/* Section Formulaire Manuel */}
        <form onSubmit={handleSubmit} style={formContainerStyle}>
          <h3 style={{ color: "#fff" }}>Ajouter manuellement</h3>
          
          {/* Informations Personnelles */}
          <h4 style={{ color: "#ccc", marginTop: "20px" }}>Informations Personnelles</h4>
          <div style={containerStyle}>
            {/* Champs texte simples */}
            {["firstName", "lastName", "title", "seniority", "departments", "mobilePhone", "email"].map((field) => (
              <div style={inputContainerStyle} key={field}>
                <label style={labelStyle}>{formatLabel(field)}{["firstName", "lastName", "email"].includes(field) ? '*' : ''}:</label>
                <input
                  style={inputStyle}
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field] || ''} // Afficher chaîne vide si null/undefined
                  onChange={handleChange}
                  required={["firstName", "lastName", "email"].includes(field)}
                />
              </div>
            ))}
            {/* Champ Select pour EmailStatus */}
            <div style={inputContainerStyle}>
              <label style={labelStyle}>{formatLabel('EmailStatus')}*:</label>
              <select
                style={{ ...inputStyle, appearance: "auto", lineHeight: "normal" }} // Style légèrement ajusté pour select
                name="EmailStatus"
                value={formData.EmailStatus || ''} // Assurer une valeur contrôlée
                onChange={handleChange}
                required
              >
                <option value="">-- Sélectionner Statut --</option>
                <option value="Valid">Valid</option> {/* Ajout de Valid si pertinent */} 
                <option value="Extrapolated">Extrapolated</option>
                <option value="Unavailable">Unavailable</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
          </div>

          {/* Informations Compagnie */}
          <h4 style={{ color: "#ccc", marginTop: "20px" }}>Informations Compagnie</h4>
          <div style={containerStyle}>
            {/* Utilisation de l'objet company dans formData */}
            {["company", "email", "phone", "employees", "industry", "seoDescription"].map((field) => (
              <div style={inputContainerStyle} key={`company.${field}`}>
                <label style={labelStyle}>{formatLabel(`company.${field}`)}{field === 'company' ? '*' : ''}:</label>
                <input
                  style={inputStyle}
                  type={field === "email" ? "email" : "text"}
                  name={`company.${field}`}
                  value={formData.company[field] || ''} // Accès correct à l'objet imbriqué
                  onChange={handleChange}
                  required={field === 'company'} // Seul le nom de la compagnie est requis ici
                />
              </div>
            ))}
          </div>

          {/* Informations Géographiques */}
          <h4 style={{ color: "#ccc", marginTop: "20px" }}>Informations Géographiques</h4>
          <div style={containerStyle}>
             {["address", "city", "state", "country"].map((field) => (
              <div style={inputContainerStyle} key={`geo.${field}`}>
                <label style={labelStyle}>{formatLabel(`geo.${field}`)}:</label>
                <input
                  style={inputStyle}
                  type="text"
                  name={`geo.${field}`}
                  value={formData.geo[field] || ''}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

          {/* Informations Sociales */}
          <h4 style={{ color: "#ccc", marginTop: "20px" }}>Réseaux Sociaux</h4>
           <div style={containerStyle}>
             {["linkedinUrl", "facebookUrl", "twitterUrl"].map((field) => (
              <div style={inputContainerStyle} key={`social.${field}`}>
                <label style={labelStyle}>{formatLabel(field)}:</label>
                <input
                  style={inputStyle}
                  type="url" // Utiliser type url pour une meilleure validation
                  name={`social.${field}`}
                  value={formData.social[field] || ''}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

          {/* Informations Revenus Compagnie */}
          <h4 style={{ color: "#ccc", marginTop: "20px" }}>Financement Compagnie</h4>
           <div style={containerStyle}>
             {["latestFunding", "latestFundingAmount"].map((field) => (
              <div style={inputContainerStyle} key={`companyRevenue.${field}`}>
                <label style={labelStyle}>{formatLabel(field)}:</label>
                <input
                  style={inputStyle}
                  type={field === 'latestFunding' ? 'date' : 'number'}
                  name={`companyRevenue.${field}`}
                  value={formData.companyRevenue[field] || ''}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

          {/* Bouton Soumission Manuelle */}
          <button type="submit" style={buttonStyle}>Ajouter le Client</button>
        </form>
      </div>
    </div>
  );
};

export default AddPeople;
