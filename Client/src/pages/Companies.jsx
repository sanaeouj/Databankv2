// Companies.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Container,
  CircularProgress,
  AppBar,
  Toolbar,
  Button,
  CssBaseline,
  createTheme,
  ThemeProvider,
  alpha,
  Link,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import CompanyDetails from "./CompanyDetails";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#60a5fa" },
    secondary: { main: "#a78bfa" },
    background: { default: "#333", paper: "#1e1e1e" },
    text: { primary: "#f3f4f6", secondary: "#d1d5db" },
  },
  typography: {
    fontFamily: ["Inter", "Segoe UI", "Roboto", "sans-serif"].join(","),
    button: { textTransform: "none" },
  },
});

const drawerWidth = 250;

const Companies = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://databank-yndl.onrender.com/api/companies");
      const companies = response.data;

      const companyCount = {};
      companies.forEach((company) => {
        companyCount[company.company] =
          (companyCount[company.company] || 0) + 1;
      });

      const uniqueCompanies = Object.keys(companyCount).map((companyName) => {
        const firstOccurrence = companies.find(
          (company) => company.company === companyName
        );
        return {
          ...firstOccurrence,
          count: companyCount[companyName],
        };
      });

      setData(uniqueCompanies);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const displayedColumns = [
    { 
      field: "company", 
      headerName: "Company Name", 
      width: 200, 
      flex: 1,
      renderCell: (params) => (
        <Link
          component="button"
          onClick={() => setSelectedCompany(params.row)}
          sx={{
            color: "primary.main",
            textDecoration: "none",
            '&:hover': {
              textDecoration: "underline",
            },
          }}
        >
          {params.value}
        </Link>
      )
    },
    { field: "industry", headerName: "Industry", width: 150 },
    { field: "Phone", headerName: "Phone", width: 150 },
    { field: "Email", headerName: "Email", width: 200 },
    { field: "employees", headerName: "Employees", width: 100 },
    { field: "count", headerName: "Count People", width: 150 },
    {
      field: "SEO Description",
      headerName: "SEO Description",
      width: 300,
      flex: 1,
    },
  ];

  const filteredData = data.filter((row) =>
    row.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
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
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 1400, mx: "auto" }}>
            <AppBar position="static" sx={{ bgcolor: "#181F2A", boxShadow: "none", px: 4 }}>
              <Toolbar>
                <Typography variant="h5" sx={{ flexGrow: 1, color: "#fff", fontWeight: 700 }}>
                  Companies
                </Typography>
              </Toolbar>
            </AppBar>
            <Container sx={{ px: 3, pt: 4, flexGrow: 1, width: "100%" }}>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {selectedCompany ? (
                    <CompanyDetails 
                      company={selectedCompany} 
                      onBack={() => setSelectedCompany(null)} 
                    />
                  ) : (
                    <Paper
                      sx={{
                        bgcolor: "#20293A",
                        p: 3,
                        borderRadius: 3,
                        boxShadow: 2,
                        width: "100%",
                        minHeight: 400,
                      }}
                    >
                      <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
                        Company List
                      </Typography>
                      <Box sx={{ height: 500, width: "100%" }}>
                        <DataGrid
                          rows={filteredData}
                          columns={displayedColumns}
                          getRowId={(row) => row.company}
                          pageSize={10}
                          rowsPerPageOptions={[5, 10, 20]}
                          sx={{
                            bgcolor: "#20293A",
                            color: "#fff",
                            borderRadius: 2,
                            "& .MuiDataGrid-columnHeaders": {
                              bgcolor: "#20293A",
                              color: "#fff",
                              fontWeight: "bold",
                            },
                            "& .MuiDataGrid-row": {
                              bgcolor: "#20293A",
                              color: "#fff",
                            },
                            "& .MuiDataGrid-row:hover": {
                              bgcolor: "#232B3B",
                            },
                          }}
                        />
                      </Box>
                    </Paper>
                  )}
                </>
              )}
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Companies;