import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  Snackbar,
  Alert,
  Typography,
  Button,
} from "@mui/material";
import * as XLSX from "xlsx";
import axios from "axios";
import CustomToolbar from "./CustomToolbar";
import DeleteIcon from "@mui/icons-material/Delete";

const ResultsTable = ({ data = [], filters, onDataUpdate }) => {
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({});
  const [savedFilters, setSavedFilters] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [deletedIds, setDeletedIds] = useState(new Set());
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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
    "socialcompanyid",
    "revenue_Latest Funding" 
  ];

  const flattenData = (data) => {
    return data.map(item => {
      return {
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
      };
    });
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
          width: 150,
          minWidth: 120,
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
              return formatDate(params.value);
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
      return flattenData(data)
        .filter((row) => !deletedIds.has(row.personalid))
        .filter((row) => {
          return Object.entries(filterValues).every(([key, value]) => {
            if (!value) return true;
            const cellValue = row[key]?.toString().toLowerCase() || "";
            return cellValue.includes(value.toLowerCase());
          });
        });
    };
    setFilteredData(applyFilters());
  }, [data, filterValues, deletedIds]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const handleDeleteRow = async (row) => {
    if (!window.confirm(`Are you sure you want to delete this row?`)) {
      return;
    }
    try {
      await axios.delete(
        `https://databank-yndl.onrender.com/api/ressources/delete/${row.personalid}`
      );
      setDeletedIds(prev => new Set([...prev, row.personalid]));
      if (onDataUpdate) {
        onDataUpdate(row.personalid);
      }
      setSnackbar({
        open: true,
        message: "Row deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Delete error:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete row.",
        severity: "error",
      });
    }
  };

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

  const SettingsDialog = () => (
    <Dialog
      open={settingsDialogOpen}
      onClose={() => setSettingsDialogOpen(false)}
      sx={{ backgroundColor: "#20293A", color: "white" }}
    >
      <DialogTitle style={{ backgroundColor: "#20293A", color: "white" }}>
        Filter
      </DialogTitle>
      <DialogContent style={{ backgroundColor: "#20293A", color: "white" }}>
        {getColumnsFromData(data).map((col) => {
          const visibleCol = visibleColumns.find(
            (vCol) => vCol.field === col.field
          );
          return (
            <FormControlLabel
              key={col.field}
              control={
                <Checkbox
                  checked={visibleCol?.visible || false}
                  onChange={() =>
                    setVisibleColumns((prev) =>
                      prev.map((vCol) =>
                        vCol.field === col.field
                          ? { ...vCol, visible: !vCol.visible }
                          : vCol
                      )
                    )
                  }
                  sx={{ color: "#6366F1" }}
                />
              }
              label={col.headerName}
            />
          );
        })}
      </DialogContent>
      <DialogActions style={{ backgroundColor: "#20293A", color: "white" }}>
        <Button
          onClick={() => setSettingsDialogOpen(false)}
          style={{ color: "white" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  const displayedColumns = [
    ...getColumnsFromData(data).filter((col) => {
      const visibleCol = visibleColumns.find((vCol) => vCol.field === col.field);
      return visibleCol ? visibleCol.visible : true;
    }),
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "4px" }}>
          <Button
            onClick={() => handleDeleteRow(params.row)}
            startIcon={<DeleteIcon />}
            variant="contained"
            color="error"
            size="small"
            sx={{ fontSize: "0.7rem", px: 1 }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        backgroundColor: "#20293A",
        color: "white",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      <CustomToolbar
        exportToCSV={exportToCSV}
        exportToExcel={exportToExcel}
        setSettingsDialogOpen={setSettingsDialogOpen}
      />
      
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          padding: 1,
          height: "auto",
          backgroundColor: "#1a2332",
          borderBottom: "1px solid #333",
          overflow: "visible"
        }}
      >
        {displayedColumns
          .filter((col) => col.field !== "actions")
          .slice(0, 6)
          .map((col) => (
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
                minWidth: "140px",
                maxWidth: "180px",
                flex: "1 1 140px",
                fontSize: "14px"
              }}
              InputProps={{ style: { color: "white", fontSize: "14px" } }}
              InputLabelProps={{ style: { color: "white", fontSize: "14px" } }}
            />
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "8px 16px",
          backgroundColor: "#20293A",
          borderBottom: "1px solid #333"
        }}
      >
        <Typography variant="body2" sx={{ color: "white", fontSize: "0.9rem" }}>
          Total Results: {filteredData.length}
        </Typography>
      </Box>

      {/* DataGrid */}
      <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
        <DataGrid
          rows={filteredData}
          columns={displayedColumns}
          getRowId={(row) => row.personalid || Math.random()}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 20, 50]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            fontSize: "14px",
            height: "100%",
            backgroundColor: "#20293A",
            color: "white",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#1a2332",
              color: "white",
              fontWeight: "bold",
              fontSize: "14px"
            },
            "& .MuiDataGrid-row": {
              backgroundColor: "#20293A",
              color: "white",
              fontSize: "14px"
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#2a3441",
              color: "white",
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "#1a2332",
              color: "white",
            },
            "& .MuiDataGrid-cell": {
              backgroundColor: "#20293A",
              color: "white",
              padding: "4px 8px",
              fontSize: "14px"
            },
            "& .MuiCheckbox-root": {
              color: "#6366F1",
            },
            "& .Mui-checked": {
              color: "#6366F1 !important",
            },
          }}
        />
      </Box>

      <SettingsDialog />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResultsTable;