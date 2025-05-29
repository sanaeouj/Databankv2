import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Container,
  DataGrid,
  Menu,
  MenuItem,
  Toolbar,
  Snackbar,
  Alert
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const drawerWidth = 250;

const People = () => {
  const location = useLocation();
  const initialFilter = location.state?.filter || {};
  const [filters, setFilters] = useState(initialFilter);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(
    Object.keys(initialFilter).length > 0
  );
  const [pageSize, setPageSize] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [exportMenuAnchorEl, setExportMenuAnchorEl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://databank-yndl.onrender.com/api/ressources/all"
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSnackbar({
          open: true,
          message: "Failed to fetch data",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const applyFilters = (data) => {
    return data.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        let itemValue = key.includes(".")
          ? key.split(".").reduce((acc, part) => acc?.[part], item)
          : item[key];
        if (itemValue === undefined || itemValue === null) return false;
        if (typeof itemValue === "object" && itemValue !== null) {
          itemValue = Object.values(itemValue).join(" ");
        }
        const normalizedValueToMatch = String(itemValue).toLowerCase().trim();
        const normalizedFilterValue = value.toLowerCase().trim();
        return normalizedValueToMatch.includes(normalizedFilterValue);
      });
    });
  };

  const filteredData = applyFilters(data);

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
    "revenue_Latest Funding": "Latest Funding Date",
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
    "socialcompanyid"
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
          headerName: headerMapping[key] || key
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          width: 200,
          renderCell: (params) => {
            if (key === "company_linkedinlink" || key === "company_website") {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const exportToCSV = () => {
    if (!filteredData.length) {
      alert("No data to export.");
      return;
    }

    const headers = Object.keys(headerMapping);
    
    const csvRows = filteredData.map(row => {
      return headers.map(header => {
        const fieldName = headerMapping[header];
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

    const headers = Object.keys(headerMapping);
    
    const exportData = filteredData.map(row => {
      const exportedRow = {};
      headers.forEach(header => {
        const fieldName = headerMapping[header];
        exportedRow[header] = row[fieldName] || '';
      });
      return exportedRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    
    XLSX.writeFile(workbook, "databank_export.xlsx");
  };

  const columns = getColumnsFromData(data);

  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh", bgcolor: "#181F2A" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          width: `calc(100vw - ${drawerWidth}px)`,
          minHeight: "100vh",
          bgcolor: "#181F2A",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowX: "auto",
          padding: 2,
        }}
      >
        <Paper
          sx={{
            bgcolor: "#20293A",
            borderRadius: 3,
            p: 3,
            mb: 3,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            color: "#fff",
            width: "100%",
          }}
        >
          <Typography variant="h5" sx={{ color: "#fff", mb: 2, fontWeight: 700 }}>
            People List
          </Typography>
          
          <Toolbar
            sx={{
              bgcolor: "#20293A",
              mb: 2,
              color: "#fff",
              borderRadius: 2,
              minHeight: 48,
              px: 0,
              justifyContent: "flex-start",
            }}
          >
            <Button
              onClick={(e) => setExportMenuAnchorEl(e.currentTarget)}
              startIcon={<DownloadIcon />}
              sx={{
                color: "#fff",
                bgcolor: "#293145",
                borderRadius: 2,
                fontWeight: 600,
                mr: 2,
                px: 2,
                "&:hover": {
                  bgcolor: "#60a5fa",
                  color: "#181F2A",
                },
              }}
            >
              Export
            </Button>
            <Menu
              anchorEl={exportMenuAnchorEl}
              open={Boolean(exportMenuAnchorEl)}
              onClose={() => setExportMenuAnchorEl(null)}
              PaperProps={{
                sx: {
                  bgcolor: "#20293A",
                  color: "#fff",
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  exportToCSV();
                  setExportMenuAnchorEl(null);
                }}
                sx={{
                  color: "#fff",
                  "&:hover": { bgcolor: "#293145", color: "#60a5fa" },
                }}
              >
                Download as CSV
              </MenuItem>
              <MenuItem
                onClick={() => {
                  exportToExcel();
                  setExportMenuAnchorEl(null);
                }}
                sx={{
                  color: "#fff",
                  "&:hover": { bgcolor: "#293145", color: "#60a5fa" },
                }}
              >
                Download as Excel
              </MenuItem>
            </Menu>
          </Toolbar>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  px: 2,
                  py: 1,
                  backgroundColor: "#1e1e1e",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "bold",
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Typography variant="body1" sx={{ color: "#fff" }}>
                  Total Results: {filteredData.length}
                </Typography>
              </Box>

              <Box sx={{ height: "70vh", width: "100%" }}>
                <DataGrid
                  rows={filteredData}
                  columns={columns}
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
                  }}
                />
              </Box>
            </>
          )}
        </Paper>

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
    </Box>
  );
};

export default People;