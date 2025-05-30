import React, { useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Papa from "papaparse";
import ExcelJS from "exceljs";

 const importMapping = {
  "First Name": "firstName",
  "Last Name": "lastName",
  "Title": "title",                
  "Seniority": "seniority",       
  "Departments": "departments",    
  "Mobile Phone": "mobilePhone",
  "Email": "email",               
  "Email Status": "EmailStatus",  
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
    EmailStatus: "",  
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

   const inputStyle = {
    margin: "10px",
    width: "100%",
    height: "40px",
    padding: "10px",
    fontSize: "13px",
    borderRadius: "8px",
    border: "1px solid #293145",
    backgroundColor: "#20293A",
    color: "#fff",
    outline: "none",
    transition: "border 0.2s",
  };
  const labelStyle = {
    fontSize: "13px",
    color: "#bfc9db",
    marginBottom: "5px",
    fontWeight: 500,
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
    margin: "10px 0",
    gap: "8px",
    fontSize: "13px",
  };
  const buttonStyle = {
    margin: "10px 0",
    padding: "12px 24px",
    fontSize: "15px",
    backgroundColor: "#6366F1",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 2px 8px rgba(99,102,241,0.08)",
    transition: "background 0.2s",
  };
  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#444",
    color: "#aaa",
    cursor: "not-allowed",
  };
  const formContainerStyle = {
    backgroundColor: "#20293A",
    padding: "32px",
    borderRadius: "16px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
    margin: "20px 0",
    maxWidth: "1100px",
    width: "100%",
    border: "1px solid #293145",
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

   const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop().toLowerCase();

    try {
      if (fileExtension === "csv") {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,  
          complete: (results) => {
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
         const headerRow = worksheet.getRow(1);
        if (headerRow) {
            headerRow.eachCell((cell) => {
                headers.push(cell.value ? cell.value.toString().trim() : '');
            });
        }
        
        const jsonData = [];
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber === 1 || row.values.length === 0) return;  
          const rowData = {};
          let hasValue = false;
          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const header = headers[colNumber - 1];
            if (header) { 
                 let cellValue = cell.value;
                if (typeof cellValue === 'object' && cellValue !== null && cellValue.text) {
                    cellValue = cellValue.text;  
                }
                rowData[header] = cellValue;
                if (cellValue !== null && cellValue !== '') {
                    hasValue = true;
                }
            }
          });
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
      setFileData([]);  
    }
  };

   const handleAddFile = async () => {
    if (fileData.length === 0) {
      alert("No data to add. Please upload a valid file.");
      return;
    }

    setIsProcessing(true);
    let successCount = 0;
    let errorCount = 0;
    const errors = [];  

    try {
      for (const [index, client] of fileData.entries()) {
         if (!client || Object.keys(client).length === 0 || Object.values(client).every(v => v === null || v === '')) {
            console.warn(`Skipping empty row ${index + 1}`);
            continue;
        }

        try {
           let newClient = JSON.parse(JSON.stringify({
              firstName: "", lastName: "", title: "", seniority: "", departments: "",
              mobilePhone: "", email: "", EmailStatus: "", company: { companyid: "", company: "", email: "", phone: "", employees: "", industry: "", seoDescription: "", personalid: "" },
              geo: { address: "", city: "", state: "", country: "" }, social: { linkedinUrl: "", facebookUrl: "", twitterUrl: "", companyid: "" },
              companyRevenue: { companyid: "", latestFunding: "", latestFundingAmount: "" }
          }));

          Object.entries(client).forEach(([csvKey, value]) => {
            if (!csvKey) return; 
            const normKey = normalizeKey(csvKey);
            const formKey = normalizedMapping[normKey];
            
            if (!formKey) {
               return;
            }

            let processedValue = value;

             if ((formKey === 'email' || formKey === 'company.email')) {
                if (typeof value === 'string') {
                     if (value.trim().startsWith('{') && value.trim().endsWith('}')) {
                        try {
                             const jsonString = value.replace(/""/g, '"'); 
                            const emailObj = JSON.parse(jsonString);
                            processedValue = emailObj.text || '';  
                        } catch (e) {
                            console.warn(`Impossible de parser l'email JSON: '${value}' à la ligne ${index + 1}. Utilisation de la valeur brute. Erreur: ${e.message}`);
                            processedValue = value;  
                        }
                    } else {
                        processedValue = value;  
                    }
                } else if (typeof value === 'object' && value !== null && value.text) {
                     processedValue = value.text;
                } else if (value === null || value === undefined) {
                    processedValue = ""; 
                } else {
                    processedValue = String(value);  
                }
            }
 
             if (formKey === 'EmailStatus') {
                 const validStatuses = ["Extrapolated", "Unavailable", "Unknown", "Valid"]; 
                if (typeof processedValue === 'string' && validStatuses.includes(processedValue)) {
                 } else if (processedValue === null || processedValue === undefined || processedValue === '') {
                    processedValue = ""; 
                } else {
                    console.warn(`Statut d'email invalide: '${processedValue}' à la ligne ${index + 1}. Défini comme vide.`);
                    processedValue = ""; 
                }
            }
 
            const keys = formKey.split('.');
            let current = newClient;
            for (let i = 0; i < keys.length - 1; i++) {
              if (current[keys[i]] === undefined || current[keys[i]] === null) { 
                current[keys[i]] = {};
              }
              current = current[keys[i]];
            }
             current[keys[keys.length - 1]] = processedValue;
          });

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
            continue;  
          }

           await addClientToDatabase(newClient);
          successCount++;

        } catch (error) {
          const errorMessage = `Ligne ${index + 1}: Erreur lors du traitement ou de l'ajout: ${error.message}. Client: ${JSON.stringify(client)}`;
          console.error(errorMessage, error);
          errors.push(errorMessage);
          errorCount++;
        }
      }

       let summaryMessage = `Traitement terminé.
Succès: ${successCount}
Erreurs: ${errorCount}`;
      if (errorCount > 0) {
          summaryMessage += `\n\nDétails des erreurs:\n${errors.slice(0, 10).join('\n')}`; 
          if (errors.length > 10) summaryMessage += "\n(et plus...)";
          alert("⚠️ Traitement terminé avec des erreurs. Voir la console pour les détails.");
      } else {
          alert("✅ Traitement terminé avec succès !");
      }
      console.log(summaryMessage);

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

   const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    
    setFormData(prevState => {
       const newState = JSON.parse(JSON.stringify(prevState));
      let current = newState;
      
      for (let i = 0; i < keys.length - 1; i++) {
         if (current[keys[i]] === undefined || current[keys[i]] === null) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newState;
    });
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       if (!formData.firstName || !formData.lastName || !formData.email || !formData.company?.company || !formData.EmailStatus) {
         throw new Error("Veuillez remplir tous les champs requis (*), y compris le statut de l'e-mail.");
      }

      console.log("Envoi du formulaire manuel:", formData);
      const response = await addClientToDatabase(formData);
      alert("✅ Client ajouté manuellement avec succès !");
      
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

   const formatLabel = (label) => {
     if (label === 'EmailStatus') return 'Email Status';
    return label
      .replace(/([A-Z])/g, " $1") 
      .replace(/_/g, " ")   
      .replace(/\./g, " > ")  
      .toLowerCase()  
      .replace(/(^|\s)\w/g, (c) => c.toUpperCase());  
  };

   return (
    <div style={{ display: "flex", width: "83vw", minHeight: "100vh", background: "#181F2A" }}>
      <Sidebar />
      <div style={{ flexGrow: 1, padding: "48px 0", color: "#fff", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1 style={{ color: "#fff", marginBottom: "28px", fontWeight: 700, letterSpacing: 1 }}>Add People</h1>

         <div style={formContainerStyle}>
          <h3 style={{ color: "#fff", marginBottom: 16 }}>Import Clients from File</h3>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            style={{
              fontSize: "16px",
              margin: "10px 0 18px 0",
              color: "#fff",
              background: "#232B3B",
              border: "1px solid #293145",
              borderRadius: "8px",
              padding: "10px",
            }}
            disabled={isProcessing}
            ref={fileInputRef}
          />
          <button 
            type="button" 
            style={isProcessing ? disabledButtonStyle : buttonStyle} 
            onClick={handleAddFile}
            disabled={isProcessing || fileData.length === 0}
          >
            {isProcessing ? `Traitement...` : "Traiter les données du fichier"} 
          </button>
          <p style={{ color: "#8CA0B3", fontSize: "13px", marginTop: "14px" }}>
            Formats supportés: CSV, Excel (.xlsx, .xls). Assurez-vous que les en-têtes correspondent au mapping.
          </p>
        </div>

         <form onSubmit={handleSubmit} style={formContainerStyle}>
          <h3 style={{ color: "#fff", marginBottom: 16 }}>Ajouter manuellement</h3>
          
           <h4 style={{ color: "#8CA0B3", marginTop: "20px", marginBottom: 8, fontWeight: 600 }}>Informations Personnelles</h4>
          <div style={containerStyle}>
             {["firstName", "lastName", "title", "seniority", "departments", "mobilePhone", "email"].map((field) => (
              <div style={inputContainerStyle} key={field}>
                <label style={labelStyle}>{formatLabel(field)}{["firstName", "lastName", "email"].includes(field) ? '*' : ''}:</label>
                <input
                  style={inputStyle}
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field] || ''}  
                  onChange={handleChange}
                  required={["firstName", "lastName", "email"].includes(field)}
                />
              </div>
            ))}
            <div style={inputContainerStyle}>
              <label style={labelStyle}>{formatLabel('EmailStatus')}*:</label>
              <select
                style={{ ...inputStyle, appearance: "auto", lineHeight: "normal", paddingRight: 24 }}
                name="EmailStatus"
                value={formData.EmailStatus || ''}
                onChange={handleChange}
                required
              >
                <option value="">-- Sélectionner Statut --</option>
                <option value="Valid">Valid</option>
                <option value="Extrapolated">Extrapolated</option>
                <option value="Unavailable">Unavailable</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
          </div>

           <h4 style={{ color: "#8CA0B3", marginTop: "20px", marginBottom: 8, fontWeight: 600 }}>Informations Compagnie</h4>
          <div style={containerStyle}>
             {["company", "email", "phone", "employees", "industry", "seoDescription"].map((field) => (
              <div style={inputContainerStyle} key={`company.${field}`}>
                <label style={labelStyle}>{formatLabel(`company.${field}`)}{field === 'company' ? '*' : ''}:</label>
                <input
                  style={inputStyle}
                  type={field === "email" ? "email" : "text"}
                  name={`company.${field}`}
                  value={formData.company[field] || ''}  
                  onChange={handleChange}
                  required={field === 'company'}  
                />
              </div>
            ))}
          </div>

           <h4 style={{ color: "#8CA0B3", marginTop: "20px", marginBottom: 8, fontWeight: 600 }}>Informations Géographiques</h4>
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

           <h4 style={{ color: "#8CA0B3", marginTop: "20px", marginBottom: 8, fontWeight: 600 }}>Réseaux Sociaux</h4>
          <div style={containerStyle}>
            {["linkedinUrl", "facebookUrl", "twitterUrl"].map((field) => (
              <div style={inputContainerStyle} key={`social.${field}`}>
                <label style={labelStyle}>{formatLabel(field)}:</label>
                <input
                  style={inputStyle}
                  type="url"
                  name={`social.${field}`}
                  value={formData.social[field] || ''}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

           <h4 style={{ color: "#8CA0B3", marginTop: "20px", marginBottom: 8, fontWeight: 600 }}>Financement Compagnie</h4>
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

          <button type="submit" style={buttonStyle}>Ajouter le Client</button>
        </form>
      </div>
    </div>
  );
};

export default AddPeople;
