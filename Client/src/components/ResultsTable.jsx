import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Paper, TextField } from "@mui/material";
import * as XLSX from "xlsx";
import CustomToolbar from "./CustomToolbar";

const ResultsTable = ({ data = [], filters }) => {
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const headerMapping = {
    "First Name": "First Name",
    "Last Name": "Last Name",
    "title": "Title",
    "seniority": "Seniority",
    "departments": "Departments",
    "mobilePhone": "Mobile Phone",
    "email": "Email",
    "EmailStatus": "Email Status",
    "company_company": "Company",
    "company_Email": "Company Email",
    "company_Phone": "Company Phone",
    "company_employees": "Employees",
    "company_industry": "Industry",
    "company_SEO Description": "SEO Description",
    "company_linkedinlink": "Company LinkedIn",
    "company_website": "Company Website",
    "geo_address": "Address",
    "geo_city": "City",
    "geo_state": "State",
    "geo_country": "Country",
    "social_Company Linkedin Url": "LinkedIn",
    "social_Facebook Url": "Facebook",
    "social_Twitter Url": "Twitter",
    "revenue_Annual Revenue": "Annual Revenue",
    "revenue_Total Funding": "Total Funding",
    "revenue_Latest Funding Amount": "Latest Funding Amount",
    "revenue_Latest Funding": "Latest Funding Date",
  };

  const hiddenColumns = [
    "personalid",
    "companyid",
    "company_companyid",
    "companycompanyid",
    "company_personalid",
    "geoid",
    "geocompanyid",
    "revenueid",
    "revenue.companyid",
    "revenue_companyid",
    "revenuecompanyid",
    "socialid",
    "social_companyid",
    "socialcompanyid"
  ];

  const flattenData = (data) => {
    return data.map(item => ({
      "personalid": item.personalid,
      "First Name": item["First Name"] || "",
      "Last Name": item["Last Name"] || "",
      "title": item.title || "",
      "seniority": item.seniority || "",
      "departments": item.departments || "",
      "mobilePhone": item.mobilePhone || "",
      "email": item.email || "",
      "EmailStatus": item.EmailStatus || "",
      "company_company": item.company?.company || "",
      "company_Email": item.company?.Email || "",
      "company_Phone": item.company?.Phone || "",
      "company_employees": item.company?.employees || "",
      "company_industry": item.company?.industry || "",
      "company_SEO Description": item.company?.["SEO Description"] || "",
      "company_linkedinlink": item.company?.linkedinlink || "",
      "company_website": item.company?.website || "",
      "geo_address": item.geo?.address || "",
      "geo_city": item.geo?.city || "",
      "geo_state": item.geo?.state || "",
      "geo_country": item.geo?.country || "",
      "revenue_Latest Funding": item.revenue?.["Latest Funding"] || "",
      "revenue_Latest Funding Amount": item.revenue?.["Latest Funding Amount"] || "",
      "social_Company Linkedin Url": item.social?.["Company Linkedin Url"] || "",
      "social_Facebook Url": item.social?.["Facebook Url"] || "",
      "social_Twitter Url": item.social?.["Twitter Url"] || ""
    }));
  };

  const getColumnsFromData = (data) => {
    if (!data || !data.length) return [];
    const columns = [];
    const sampleItem = flattenData([data[0]])[0];
    for (const key in sampleItem) {
      if (!hiddenColumns.some((hc) => key.includes(hc))) {
        columns.push({
          field: key,
          headerName:
            headerMapping[key] ||
            key
              .split("_")
              .map(
                (word) => word.charAt(0).toUpperCase() + word.slice(1)
              )
              .join(" "),
          width: 200,
          renderCell: (params) => {
            if (
              key === "company_linkedinlink" ||
              key === "company_website"
            ) {
              return params.value ? (
                <a
                  href={
                    params.value.startsWith("http://") ||
                    params.value.startsWith("https://")
                      ? params.value
                      : `https://${params.value}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#90caf9" }}
                >
                  {key === "company_linkedinlink" ? "LinkedIn" : "Website"}
                </a>
              ) : (
                ""
              );
            }
            if (key === "revenue_Latest Funding") {
              return params.value ? new Date(params.value).toLocaleDateString("fr-FR") : "";
            } else if (key.includes("Url")) {
              return params.value ? (
                <a
                  href={
                    params.value.startsWith("http://") ||
                    params.value.startsWith("https://")
                      ? params.value
                      : `https://${params.value}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#90caf9" }}
                >
                  LINK
                </a>
              ) : (
                ""
              );
            }
            return params.value || "";
          },
        });
      }
    }
    return columns;
  };

  useEffect(() => {
    const applyFilters = () => {
      if (!data || !data.length) return [];
      return flattenData(data).filter((row) => {
        return Object.entries(filterValues).every(([key, value]) => {
          if (!value) return true;
          const cellValue = row[key]?.toString().toLowerCase() || "";
          return cellValue.includes(value.toLowerCase());
        });
      });
    };
    setFilteredData(applyFilters());
  }, [data, filterValues]);

  // Export CSV/Excel
  const importMapping = {
    "First Name": "First Name",
    "Last Name": "Last Name",
    "Title": "title",
    "Seniority": "seniority",
    "Departments": "departments",
    "Mobile Phone": "mobilePhone",
    "Email": "email",
    "Email Status": "EmailStatus",
    "Company": "company_company",
    "Company Email": "company_Email",
    "Company Phone": "company_Phone",
    "Employees": "company_employees",
    "Industry": "company_industry",
    "SEO Description": "company_SEO Description",
    "Company LinkedIn": "company_linkedinlink",
    "Company Website": "company_website",
    "Address": "geo_address",
    "City": "geo_city",
    "State": "geo_state",
    "Country": "geo_country",
    "Latest Funding Date": "revenue_Latest Funding",
    "Latest Funding Amount": "revenue_Latest Funding Amount",
    "LinkedIn": "social_Company Linkedin Url",
    "Facebook": "social_Facebook Url",
    "Twitter": "social_Twitter Url"
  };

  const exportToCSV = () => {
    if (!filteredData.length) {
      alert("No data to export.");
      return;
    }
    const headers = Object.keys(importMapping);
    const csvRows = filteredData.map(row => {
      return headers.map(header => {
        const fieldName = importMapping[header];
        const cellValue = row[fieldName];
        return `"${(cellValue !== null && cellValue !== undefined ? cellValue.toString().replace(/"/g, '""') : '')}"`;
      }).join(',');
    });
    csvRows.unshift(headers.map(h => `"${h}"`).join(','));
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'databank_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    if (!filteredData.length) {
      alert("No data to export.");
      return;
    }
    const headers = Object.keys(importMapping);
    const exportData = filteredData.map(row => {
      const exportedRow = {};
      headers.forEach(header => {
        const fieldName = importMapping[header];
        exportedRow[header] = row[fieldName] || '';
      });
      return exportedRow;
    });
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "databank_export.xlsx");
  };

  // Columns sans actions
  const displayedColumns = getColumnsFromData(data).filter((col) => {
    const visibleCol = visibleColumns.find((vCol) => vCol.field === col.field);
    return visibleCol ? visibleCol.visible : true;
  });

  return (
    <Paper
      sx={{
        bgcolor: "#20293A",
        borderRadius: 3,
        p: 0,
        mb: 0,
        boxShadow: "none",
        color: "#fff",
        width: "100%",
        overflow: "auto",
        borderRight: "1px solid #232E3E",
      }}
    >
      <Box sx={{ px: 4, pt: 4, pb: 2 }}>
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700, mb: 0 }}>
          Results Table
        </Typography>
      </Box>
      <CustomToolbar
        exportToCSV={exportToCSV}
        exportToExcel={exportToExcel}
        setSettingsDialogOpen={setSettingsDialogOpen}
      />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          p: 2,
          bgcolor: "#232B3B",
          borderRadius: 2,
          mb: 2,
        }}
      >
        {displayedColumns.map((col) => (
          <TextField
            key={col.field}
            label={col.headerName}
            value={filterValues[col.field] || ""}
            onChange={(e) =>
              setFilterValues((prev) => ({
                ...prev,
                [col.field]: e.target.value,
              }))
            }
            variant="outlined"
            size="small"
            sx={{
              flex: 1,
              minWidth: "150px",
              bgcolor: "#181F2A",
              input: { color: "#fff" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#293145" },
              "& .MuiInputLabel-root": { color: "#bfc9db" },
            }}
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "#bfc9db" } }}
          />
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 4,
          py: 1,
          bgcolor: "#20293A",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "bold",
          mb: 2,
        }}
      >
        <Typography variant="body1" sx={{ color: "#fff" }}>
          Total Filter: {filteredData.length}
        </Typography>
      </Box>
      <Box sx={{ height: "60vh", width: "100%" }}>
        <DataGrid
          rows={filteredData}
          columns={displayedColumns}
          getRowId={(row) => row.personalid || Math.random()}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 20, 100]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            fontSize: "16px",
            backgroundColor: "#1e1e1e",
            color: "white",
            borderRadius: 2,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#232B3B",
              color: "#fff",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-row": {
              backgroundColor: "#1e1e1e",
              color: "#fff",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#232B3B",
              color: "#fff",
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "#232B3B",
              color: "#fff",
            },
            "& .MuiDataGrid-cell": {
              backgroundColor: "#1e1e1e",
              color: "#fff",
              textAlign: "center",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              color: "#fff",
              textAlign: "center",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
            "& .MuiDataGrid-columnHeaderCheckbox": { color: "#fff" },
            "& .MuiDataGrid-rowCheckbox": { color: "#fff" },
            "& .MuiTablePagination-displayedRows": { color: "#fff" },
            "& .MuiTablePagination-actions": { color: "#fff" },
            "& .MuiTablePagination-selectIcon": { color: "#fff" },
            "& .MuiTablePagination-selectLabel": { color: "#fff" },
            "& .MuiTablePagination-menuItem": { color: "#fff" },
            "& .MuiTablePagination-menuItem:hover": {
              backgroundColor: "#444",
              color: "#fff",
            },
            "& .MuiTablePagination-menuItem.selected": {
              backgroundColor: "#444",
              color: "#fff",
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default ResultsTable;