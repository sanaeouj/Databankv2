import React, { useState, useRef } from "react";
import { Box, Typography, Paper } from "@mui/material";
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
import { fetchAPI, apiConfig } from "../config/api";

const normalizedMapping = Object.fromEntries(
  Object.entries(importMapping).map(([k, v]) => [normalizeKey(k), v])
);
const API_BASE_URL = apiConfig.baseURL;

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
     width: "100%",
    padding: "14px 18px",
    fontSize: "15px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    color: "#fff",
    outline: "none",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
  };
  const labelStyle = {
    fontSize: "13.5px",
    color: "#bfc9db",
    marginBottom: "0.5rem",
    fontWeight: 600,
  };
  const inputContainerStyle = {
    display: "flex",
    flexDirection: "column",
    margin: "0",  
    gap: "0.75rem",
    fontSize: "13px",
  };
  const buttonStyle = {
    margin: "1.5rem 0 0 0",
    padding: "14px 32px",
    fontSize: "15px",
    background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 700,
    boxShadow: "0 8px 24px rgba(139, 92, 246, 0.4), 0 0 20px rgba(139, 92, 246, 0.2)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: "-100%",
      width: "100%",
      height: "100%",
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
      transition: "left 0.5s",
    },
    "&:hover": {
      background: "linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)",
      transform: "translateY(-3px)",
      boxShadow: "0 12px 40px rgba(139, 92, 246, 0.5), 0 0 30px rgba(139, 92, 246, 0.3)",
      "&::before": {
        left: "100%",
      },
    },
    "&:active": {
      transform: "translateY(-1px)",
    },
  };
  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#444",
    color: "#aaa",
    cursor: "not-allowed",
  };
  // const formContainerStyle = {
  //   backgroundColor: "#20293A",
  //   padding: "32px",
  //   borderRadius: "16px",
  //   boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
  //   margin: "20px 0",
  //   maxWidth: "1100px",
  //   width: "100%",
  //   border: "1px solid #293145",
  // };

  const addClientToDatabase = async (client) => {
    try {
      return await fetchAPI(apiConfig.endpoints.clients, {
        method: "POST",
        body: JSON.stringify(client),
      });
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
                    console.warn(`Unable to parse email JSON: '${value}' at row ${index + 1}. Using raw value. Error: ${e.message}`);
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
                // Value is valid, keep it
              } else if (processedValue === null || processedValue === undefined || processedValue === '') {
                processedValue = "";
              } else {
                console.warn(`Invalid email status: '${processedValue}' at row ${index + 1}. Set as empty.`);
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

          if (!newClient.firstName || !newClient.lastName) {
            const missingFields = [];
            if (!newClient.firstName) missingFields.push("First Name");
            if (!newClient.lastName) missingFields.push("Last Name");
            const errorMessage = `Row ${index + 1}: Missing required fields after mapping: ${missingFields.join(', ')}. Client: ${JSON.stringify(client)}`;
            console.warn(errorMessage);
            errors.push(errorMessage);
            errorCount++;
            continue;
          }

          await addClientToDatabase(newClient);
          successCount++;

        } catch (error) {
          const errorMessage = `Row ${index + 1}: Error while processing or adding: ${error.message}. Client: ${JSON.stringify(client)}`;
          console.error(errorMessage, error);
          errors.push(errorMessage);
          errorCount++;
        }
      }

      let summaryMessage = `Processing finished.
Success: ${successCount}
Errors: ${errorCount}`;
      if (errorCount > 0) {
        summaryMessage += `\n\nError details:\n${errors.slice(0, 10).join('\n')}`;
        if (errors.length > 10) summaryMessage += "\n(and more...)";
        alert("⚠️ Processing finished with errors. See the console for details.");
      } else {
        alert("✅ Processing finished successfully!");
      }
      console.log(summaryMessage);

      setFileData([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }

    } catch (batchError) {
      console.error("Global batch processing error:", batchError);
      alert(`❌ A major error occurred during processing: ${batchError.message}`);
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
    if (!formData.firstName || !formData.lastName) {
      throw new Error("error: First Name and Last Name are required.");
    }

    await addClientToDatabase(formData);
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
    <Box sx={{ display: "flex", width: "100%", minHeight: "100vh", bgcolor: "#0F172A", m: 0, p: 0, gap: 0 }}>
      <Box 
        component="main"
        sx={{ 
          width: "100%",
          minHeight: "100vh",
          maxWidth: "100%",
          bgcolor: "#0F172A",
          color: "#fff", 
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex", 
          flexDirection: "column",
          p: 0,
          m: 0,
        }}
      >
          <Box sx={{ width: "100%", px: 3, pt: 3, pb: 3, m: 0, boxSizing: "border-box" }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: "#fff", 
              marginBottom: 1.5, 
              fontWeight: 700, 
              letterSpacing: 0.5,
              fontSize: "1.75rem",
              background: "linear-gradient(135deg, #fff 0%, #8B5CF6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Ajouter des personnes
          </Typography>
          <Typography variant="body2" sx={{ color: "#8CA0B3", mb: 3, fontSize: "0.95rem", lineHeight: 1.6 }}>
            Importez des clients depuis un fichier ou ajoutez-les manuellement.
          </Typography>

          <Paper
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)",
              backdropFilter: "blur(20px)",
              padding: 3,
              borderRadius: 0,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)",
              marginBottom: 2.5,
              width: "100%",
              boxSizing: "border-box",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderLeft: "none",
              borderRight: "none",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s ease",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: "linear-gradient(90deg, #8B5CF6 0%, #06B6D4 100%)",
              },
              "&:hover": {
                boxShadow: "0 12px 40px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.2)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: "#fff", 
                marginBottom: 2, 
                fontWeight: 700,
                fontSize: "1.1rem",
                background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              📁 Importer des clients depuis un fichier
            </Typography>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            style={{
              fontSize: "15px",
              margin: "0 0 1.5rem 0",
              color: "#fff",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "10px",
              padding: "12px 16px",
              width: "100%",
              boxSizing: "border-box",
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
            {isProcessing ? `Traitement en cours...`: "Traiter les données du fichier"} 
          </button>
          <Typography sx={{ color: "#8CA0B3", fontSize: "13px", marginTop: "1.5rem" }}>
            Formats supportés : CSV, Excel (.xlsx, .xls). Assurez-vous que les en-têtes correspondent au mapping.
          </Typography>
        </Paper>

          <Paper
            elevation={0}
            component="form"
            onSubmit={handleSubmit}
            sx={{
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)",
              backdropFilter: "blur(20px)",
              padding: 2,
              borderRadius: 0,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)",
              width: "100%",
              boxSizing: "border-box",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderLeft: "none",
              borderRight: "none",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s ease",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: "linear-gradient(90deg, #8B5CF6 0%, #06B6D4 100%)",
              },
              "&:hover": {
                boxShadow: "0 12px 40px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.2)",
              },
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: "#fff", 
                marginBottom: 2.5, 
                fontWeight: 700,
                fontSize: "1.1rem",
                background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ✏️ Ajouter manuellement
            </Typography>
          
           <Typography 
             variant="h6" 
             sx={{ 
               color: "#fff", 
               mt: 3, 
               mb: 2, 
               fontWeight: 700,
               fontSize: "1rem",
               textTransform: "uppercase",
               letterSpacing: "0.8px",
               background: "linear-gradient(135deg, rgba(139, 92, 246, 0.8) 0%, rgba(6, 182, 212, 0.8) 100%)",
               WebkitBackgroundClip: "text",
               WebkitTextFillColor: "transparent",
               backgroundClip: "text",
             }}
           >
             👤 Informations Personnelles
           </Typography>
          <Box sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(3, 1fr)" },
            gap: "1.5rem",
            width: "100%",
            mb: 3
          }}>
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
              <input
                style={inputStyle}
                type="text"
                name="EmailStatus"
                value={formData.EmailStatus || 'Unavailable'}  
                onChange={handleChange}
                required
              />
            </div>
          </Box>

           <Typography 
             variant="h6" 
             sx={{ 
               color: "#fff", 
               mt: 1.5, 
               mb: 1, 
               fontWeight: 700,
               fontSize: "0.9rem",
               textTransform: "uppercase",
               letterSpacing: "0.5px",
               background: "linear-gradient(135deg, rgba(139, 92, 246, 0.8) 0%, rgba(6, 182, 212, 0.8) 100%)",
               WebkitBackgroundClip: "text",
               WebkitTextFillColor: "transparent",
               backgroundClip: "text",
             }}
           >
             🏢 Informations Compagnie
           </Typography>
          <Box sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(3, 1fr)" },
            gap: "1.5rem",
            width: "100%",
            mb: 3
          }}>
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
          </Box>

           <Typography 
             variant="h6" 
             sx={{ 
               color: "#fff", 
               mt: 1.5, 
               mb: 1, 
               fontWeight: 700,
               fontSize: "0.9rem",
               textTransform: "uppercase",
               letterSpacing: "0.5px",
               background: "linear-gradient(135deg, rgba(139, 92, 246, 0.8) 0%, rgba(6, 182, 212, 0.8) 100%)",
               WebkitBackgroundClip: "text",
               WebkitTextFillColor: "transparent",
               backgroundClip: "text",
             }}
           >
             🌍 Informations Géographiques
           </Typography>
          <Box sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(3, 1fr)" },
            gap: "1.5rem",
            width: "100%",
            mb: 3
          }}>
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
          </Box>

           <Typography 
             variant="h6" 
             sx={{ 
               color: "#fff", 
               mt: 1.5, 
               mb: 1, 
               fontWeight: 700,
               fontSize: "0.9rem",
               textTransform: "uppercase",
               letterSpacing: "0.5px",
               background: "linear-gradient(135deg, rgba(139, 92, 246, 0.8) 0%, rgba(6, 182, 212, 0.8) 100%)",
               WebkitBackgroundClip: "text",
               WebkitTextFillColor: "transparent",
               backgroundClip: "text",
             }}
           >
             📱 Réseaux Sociaux
           </Typography>
          <Box sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(3, 1fr)" },
            gap: "1.5rem",
            width: "100%",
            mb: 3
          }}>
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
          </Box>

           <Typography 
             variant="h6" 
             sx={{ 
               color: "#fff", 
               mt: 1.5, 
               mb: 1, 
               fontWeight: 700,
               fontSize: "0.9rem",
               textTransform: "uppercase",
               letterSpacing: "0.5px",
               background: "linear-gradient(135deg, rgba(139, 92, 246, 0.8) 0%, rgba(6, 182, 212, 0.8) 100%)",
               WebkitBackgroundClip: "text",
               WebkitTextFillColor: "transparent",
               backgroundClip: "text",
             }}
           >
             💰 Financement Compagnie
           </Typography>
          <Box sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(3, 1fr)" },
            gap: "1.5rem",
            width: "100%",
            mb: 3
          }}>
            <div style={inputContainerStyle} key={`companyRevenue.latestFundingAmount`}>
              <label style={labelStyle}>{formatLabel("latestFundingAmount")}:</label>
              <input
                style={inputStyle}
                type="number"
                name={`companyRevenue.latestFundingAmount`}
                value={formData.companyRevenue["latestFundingAmount"] || ''}
                onChange={handleChange}
              />
            </div>
          </Box>

          <Box sx={{ mt: 4, mb: 2 }}>
            <button type="submit" style={buttonStyle}>Ajouter le Client</button>
          </Box>
        </Paper>
          </Box>
      </Box>
    </Box>
  );
};

export default AddPeople;