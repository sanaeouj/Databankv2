import React, { useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Papa from "papaparse";
import ExcelJS from "exceljs";

const importMapping = {
  "First Name": "firstName",
  "Last Name": "lastName",
  Title: "title",
  Seniority: "seniority",
  Departments: "departments",
  "Mobile Phone": "mobilePhone",
  Email: "email",
  "Email Status": "EmailStatus",
  company_companyid: "company.companyid",
  Company: "company.company",
  "Company Email": "company.email",
  "Company Phone": "company.phone",
  Employees: "company.employees",
  Industry: "company.industry",
  "SEO Description": "company.seoDescription",
  company_personalid: "company.personalid",
  City: "geo.city",
  Address: "geo.address",
  State: "geo.state",
  Country: "geo.country",
  "Latest Funding Amount": "companyRevenue.latestFundingAmount",
  revenue_companyid: "companyRevenue.companyid",
  LinkedIn: "social.linkedinUrl",
  Facebook: "social.facebookUrl",
  Twitter: "social.twitterUrl",
  social_companyid: "social.companyid",
};
const normalizeKey = (key) => key.trim().replace(/\s+/g, " ").toLowerCase();
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
      personalid: "",
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
      companyid: "",
    },
    companyRevenue: {
      companyid: "",
      latestFunding: "",
      latestFundingAmount: "",
    },
  });

  const [fileData, setFileData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const fileInputRef = useRef(null);

  const inputStyle = {
    width: "220px",
    height: "32px",
    margin: "10px",
    padding: "10px",
    fontSize: "13px",
    borderRadius: "6px",
    border: "1px solid #293145",
    backgroundColor: "#20293A",
    color: "#fff",
    outline: "none",
    transition: "border 0.2s",
  };
  const labelStyle = {
    width: "120px",
    fontSize: "13px",
    color: "#bfc9db",
    marginBottom: "5px",
    fontWeight: 500,
  };
  const containerStyle = {
    margin: "10px 10px 0 10px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "18px",
    alignItems: "center",
  };
  const inputContainerStyle = {
    display: "flex",
    flexDirection: "column",
    margin: "0 0 14px 0",
    gap: "4px",
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

  const addClientToDatabase = async (client) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client),
      });
      if (!response.ok) {
        let errorDetails = "Failed to add client";
        try {
          const errorJson = await response.json();
          errorDetails = JSON.stringify(errorJson);
        } catch (jsonError) {
          errorDetails = await response.text();
        }
        throw new Error(
          `${
            errorDetails || "Failed to add client"
          }. Client data: ${JSON.stringify(client)}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error adding client:", error);
      const message = error.message.includes("Client data:")
        ? error.message
        : `Error adding client: ${error.message}`;
      throw new Error(message);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop().toLowerCase();
    setFileData([]);
    setSuccessCount(0);
    setErrorCount(0);

    try {
      if (fileExtension === "csv") {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const filteredData = results.data.filter((row) =>
              Object.values(row).some((val) => val !== null && val !== "")
            );
            setFileData(filteredData);
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
            alert(
              "Error parsing CSV file. Please check the file format and content."
            );
          },
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
            headers.push(cell.value ? cell.value.toString().trim() : "");
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
              if (typeof cellValue === "object" && cellValue !== null) {
                if (cellValue.text) {
                  cellValue = cellValue.text;
                } else if (cellValue.result) {
                  cellValue = cellValue.result;
                } else if (cellValue instanceof Date) {
                  cellValue = cellValue.toISOString();
                } else {
                  cellValue = JSON.stringify(cellValue);
                }
              }
              rowData[header] =
                cellValue !== null && cellValue !== undefined
                  ? String(cellValue)
                  : "";
              if (rowData[header] !== "") {
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
    let currentSuccessCount = 0;
    let currentErrorCount = 0;
    const errors = [];
    setSuccessCount(0);
    setErrorCount(0);

    try {
      for (const [index, client] of fileData.entries()) {
        if (
          !client ||
          Object.keys(client).length === 0 ||
          Object.values(client).every(
            (v) => v === null || v === "" || v === undefined
          )
        ) {
          console.warn(`Skipping empty or invalid row ${index + 1}`);
          continue;
        }

        try {
          let newClient = JSON.parse(
            JSON.stringify({
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
                personalid: "",
              },
              geo: { address: "", city: "", state: "", country: "" },
              social: {
                linkedinUrl: "",
                facebookUrl: "",
                twitterUrl: "",
                companyid: "",
              },
              companyRevenue: {
                companyid: "",
                latestFunding: "",
                latestFundingAmount: "",
              },
            })
          );

          Object.entries(client).forEach(([csvKey, value]) => {
            if (!csvKey) return;
            const normKey = normalizeKey(csvKey);
            const formKey = normalizedMapping[normKey];
            if (!formKey) {
              return;
            }

            let processedValue =
              value !== null && value !== undefined ? String(value).trim() : "";

            if (formKey === "email" || formKey === "company.email") {
              if (
                processedValue.startsWith("{") &&
                processedValue.endsWith("}")
              ) {
                try {
                  const emailObj = JSON.parse(
                    processedValue.replace(/""/g, '"')
                  );
                  processedValue = (emailObj.text || "").trim();
                } catch (e) {
                  console.warn(
                    `Row ${
                      index + 1
                    }: Unable to parse email JSON: '${value}'. Using raw value. Error: ${
                      e.message
                    }`
                  );
                }
              }
            }

            const keys = formKey.split(".");
            let current = newClient;
            for (let i = 0; i < keys.length - 1; i++) {
              if (current[keys[i]] === undefined || current[keys[i]] === null) {
                current[keys[i]] = {};
              }
              current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = processedValue;
          });

          // Champs obligatoires minimum pour éviter le rejet backend
          if (!newClient.firstName) newClient.firstName = "Unknown";
          if (!newClient.lastName) newClient.lastName = "Unknown";
          if (!newClient.company.company) newClient.company.company = "Unknown";

          // EmailStatus logic
          const validStatuses = [
            "",
            "Extrapolated",
            "Unavailable",
            "Unknown",
            "Valid",
            "Verified",
          ];
          if (!newClient.email) {
            newClient.EmailStatus = "Extrapolated";
          } else {
            const currentStatus = newClient.EmailStatus;
            if (currentStatus && validStatuses.includes(currentStatus)) {
              // ok
            } else {
              if (currentStatus) {
                console.warn(
                  `Row ${
                    index + 1
                  }: Invalid email status: '${currentStatus}' with present email. Setting to empty.`
                );
              }
              newClient.EmailStatus = "";
            }
          }

          await addClientToDatabase(newClient);
          currentSuccessCount++;
        } catch (error) {
          const errorMessage = `Row ${index + 1}: Error adding to DB: ${
            error.message
          }`;
          console.error(errorMessage);
          errors.push(errorMessage);
          currentErrorCount++;
        }
        setSuccessCount(currentSuccessCount);
        setErrorCount(currentErrorCount);
      }

      let summaryMessage = `Processing finished.\nSuccess: ${currentSuccessCount}\nErrors: ${currentErrorCount}`;
      if (currentErrorCount > 0) {
        summaryMessage += `\n\nError details (first 10):\n${errors
          .slice(0, 10)
          .join("\n")}`;
        if (errors.length > 10)
          summaryMessage += "\n(See console for all errors)";
        alert(
          "⚠️ Processing finished with errors. Check the console for details. Some rows might have been rejected by the server due to missing required data."
        );
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
      alert(
        `❌ A major error occurred during processing: ${batchError.message}`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    setFormData((prevState) => {
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
        throw new Error(
          "Veuillez remplir tous les champs requis (*), y compris le statut de l'e-mail."
        );
      }
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        throw new Error("Le format de l'adresse e-mail est invalide.");
      }
      const validStatuses = ["", "Extrapolated", "Unavailable", "Unknown", "Valid", "Verified"];
      if (!validStatuses.includes(formData.EmailStatus)) {
        throw new Error("Veuillez sélectionner un statut d'e-mail valide.");
      }

      console.log("Envoi du formulaire manuel:", formData);
      const response = await addClientToDatabase(formData);
      alert("✅ Client ajouté manuellement avec succès !");

      setFormData({
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
          personalid: "",
        },
        geo: { address: "", city: "", state: "", country: "" },
        social: {
          linkedinUrl: "",
          facebookUrl: "",
          twitterUrl: "",
          companyid: "",
        },
        companyRevenue: {
          companyid: "",
          latestFunding: "",
          latestFundingAmount: "",
        },
      });
    } catch (error) {
      console.error("Erreur lors de la soumission manuelle:", error);
      alert(`❌ Erreur: ${error.message}`);
    }
  };

  const formatLabel = (label) => {
    if (label === "EmailStatus") return "Email Status";
    return label
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/\./g, " > ")
      .trim()
      .replace(/^\w|\s\w/g, (c) => c.toUpperCase());
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        background: "#181F2A",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <Sidebar />
      <div
        style={{
          flexGrow: 1,
          color: "#fff",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingLeft: "20px",
        }}
      >
        <h1
          style={{
            color: "#fff",
            marginBottom: "28px",
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          Add People
        </h1>

        {/* Import Section */}
        <div style={formContainerStyle}>
          <h3 style={{ color: "#fff", marginBottom: 16 }}>
            Import Clients from File
          </h3>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            style={{
              display: "block",
              width: "100%",
              boxSizing: "border-box",
              fontSize: "14px",
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
            {isProcessing
              ? `Processing... (${successCount + errorCount}/${
                  fileData.length
                })`
              : "Process File Data"}
          </button>
          {(isProcessing || successCount > 0 || errorCount > 0) && (
            <p
              style={{ color: "#8CA0B3", fontSize: "13px", marginTop: "14px" }}
            >
              Processed: {successCount + errorCount} / {fileData.length} |
              Success: {successCount} | Errors: {errorCount}
            </p>
          )}
          <p style={{ color: "#8CA0B3", fontSize: "13px", marginTop: "14px" }}>
            Supported formats: CSV, Excel (.xlsx, .xls). All rows will be
            attempted. Email Status set to 'Extrapolated' if Email is missing.
          </p>
        </div>

        {/* Manual Add Section */}
        <form onSubmit={handleSubmit} style={formContainerStyle}>
          <h3 style={{ color: "#fff", marginBottom: 16 }}>Add Manually</h3>

          {/* Personal Info */}
          <h4
            style={{
              color: "#8CA0B3",
              marginTop: "20px",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            Personal Information
          </h4>
          <div style={containerStyle}>
            {[
              "firstName",
              "lastName",
              "title",
              "seniority",
              "departments",
              "mobilePhone",
              "email",
            ].map((field) => (
              <div style={inputContainerStyle} key={field}>
                <label style={labelStyle}>
                  {formatLabel(field)}
                  {["firstName", "lastName", "email"].includes(field)
                    ? "*"
                    : ""}
                  :
                </label>
                <input
                  style={inputStyle}
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  required={["firstName", "lastName", "email"].includes(field)}
                />
              </div>
            ))}
            {/* Email Status Dropdown */}
            <div style={inputContainerStyle}>
              <label style={labelStyle}>{formatLabel("EmailStatus")}*:</label>
              <select
                style={inputStyle}
                name="EmailStatus"
                value={formData.EmailStatus || ""}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Status
                </option>
                <option value="Extrapolated">Extrapolated</option>
                <option value="Unavailable">Unavailable</option>
                <option value="Unknown">Unknown</option>
                <option value="Valid">Valid</option>
              </select>
            </div>
          </div>

          {/* Company Info */}
          <h4
            style={{
              color: "#8CA0B3",
              marginTop: "20px",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            Company Information
          </h4>
          <div style={containerStyle}>
            {[
              "company.company",
              "company.email",
              "company.phone",
              "company.employees",
              "company.industry",
              "company.seoDescription",
            ].map((field) => (
              <div style={inputContainerStyle} key={field}>
                <label style={labelStyle}>
                  {formatLabel(field)}
                  {field === "company.company" ? "*" : ""}:
                </label>
                <input
                  style={inputStyle}
                  type={
                    field.includes("email")
                      ? "email"
                      : field.includes("phone")
                      ? "tel"
                      : "text"
                  }
                  name={field}
                  value={
                    field.split(".").reduce((o, k) => o?.[k], formData) || ""
                  }
                  onChange={handleChange}
                  required={field === "company.company"}
                />
              </div>
            ))}
          </div>

          {/* Geo Info */}
          <h4
            style={{
              color: "#8CA0B3",
              marginTop: "20px",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            Location
          </h4>
          <div style={containerStyle}>
            {["geo.address", "geo.city", "geo.state", "geo.country"].map(
              (field) => (
                <div style={inputContainerStyle} key={field}>
                  <label style={labelStyle}>{formatLabel(field)}:</label>
                  <input
                    style={inputStyle}
                    type="text"
                    name={field}
                    value={
                      field.split(".").reduce((o, k) => o?.[k], formData) || ""
                    }
                    onChange={handleChange}
                  />
                </div>
              )
            )}
          </div>

          {/* Social Info */}
          <h4
            style={{
              color: "#8CA0B3",
              marginTop: "20px",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            Social Media
          </h4>
          <div style={containerStyle}>
            {[
              "social.linkedinUrl",
              "social.facebookUrl",
              "social.twitterUrl",
            ].map((field) => (
              <div style={inputContainerStyle} key={field}>
                <label style={labelStyle}>{formatLabel(field)}:</label>
                <input
                  style={inputStyle}
                  type="url"
                  name={field}
                  value={
                    field.split(".").reduce((o, k) => o?.[k], formData) || ""
                  }
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

          {/* Revenue Info */}
          <h4
            style={{
              color: "#8CA0B3",
              marginTop: "20px",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            Funding (Optional)
          </h4>
          <div style={containerStyle}>
            <div style={inputContainerStyle}>
              <label style={labelStyle}>
                {formatLabel("companyRevenue.latestFundingAmount")}:
              </label>
              <input
                style={inputStyle}
                type="text"
                name="companyRevenue.latestFundingAmount"
                value={formData.companyRevenue?.latestFundingAmount || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" style={buttonStyle}>
            Add Client Manually
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPeople;
