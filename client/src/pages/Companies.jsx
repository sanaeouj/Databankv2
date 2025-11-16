// Companies.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  InputBase,
  IconButton,
  Paper,
  CssBaseline,
  Container,
  createTheme,
  ThemeProvider,
  Link,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Search as SearchIcon, X as ClearIcon } from "lucide-react";
import axios from "axios";
import CompanyDetails from "./CompanyDetails";
import { apiConfig } from "../config/api";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#6366F1" },
    secondary: { main: "#60a5fa" },
    background: { default: "#181F2A", paper: "#20293A" },
    text: { primary: "#fff", secondary: "#bfc9db" },
  },
  typography: {
    fontFamily: ["Inter", "Segoe UI", "Roboto", "sans-serif"].join(","),
    button: { textTransform: "none" },
    h4: { fontWeight: 700, letterSpacing: 1 },
    h5: { fontWeight: 700, letterSpacing: 1 },
  },
});

const Companies = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${apiConfig.baseURL}${apiConfig.endpoints.companies}`);
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
      <Box sx={{ display: "flex", width: "100%", minHeight: "100vh", bgcolor: "#0F172A", m: 0, p: 0, gap: 0 }}>
        <Box sx={{ flexGrow: 1, p: 0, m: 0, bgcolor: "#0F172A", width: "100%", minHeight: "100vh", overflowY: "auto" }}>
          <Container maxWidth={false} sx={{ p: 1, m: 0, pb: 1.5 }}>
            {selectedCompany ? (
              <CompanyDetails 
                company={selectedCompany} 
                onBack={() => setSelectedCompany(null)} 
              />
            ) : (
              <>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 0.5,
                    fontWeight: 700,
                    fontSize: "1.5rem",
                    background: "linear-gradient(135deg, #fff 0%, #8B5CF6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontFamily: "Inter, Segoe UI, Roboto, sans-serif",
                  }}
                >
                  Liste des entreprises
                </Typography>
                <Typography variant="body2" sx={{ color: "#8CA0B3", mb: 2, fontSize: "0.875rem" }}>
                  Explorez et recherchez parmi toutes vos entreprises enregistrées.
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    background: "rgba(35, 43, 59, 0.6)",
                    backdropFilter: "blur(20px)",
                    borderRadius: 3,
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "rgba(139, 92, 246, 0.3)",
                    },
                  }}
                >
                  <SearchIcon size={20} color="#8CA0B3" />
                  <InputBase
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                      ml: 2,
                      flex: 1,
                      color: "#fff",
                      fontFamily: "Inter, Segoe UI, Roboto, sans-serif",
                      fontSize: "16px",
                    }}
                    endAdornment={
                      searchTerm && (
                        <IconButton onClick={() => setSearchTerm("")}>
                          <ClearIcon size={16} color="#8CA0B3" />
                        </IconButton>
                      )
                    }
                  />
                </Paper>
                <Box sx={{ height: 600, width: "70vw" }}>
                  <DataGrid
                    rows={filteredData}
                    columns={displayedColumns}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    getRowId={(row) => row.company}
                    sx={{
                      bgcolor: "#20293A",
                      color: "#fff",
                      fontFamily: "Inter, Segoe UI, Roboto, sans-serif",
                      fontSize: "15px",
                      borderRadius: 3,
                      "& .MuiDataGrid-columnHeaders": {
                        bgcolor: "#20293A",
                        color: "#8CA0B3",
                        fontWeight: "bold",
                        fontSize: "15px",
                        fontFamily: "Inter, Segoe UI, Roboto, sans-serif",
                      },
                      "& .MuiDataGrid-row": {
                        bgcolor: "#20293A",
                        color: "#fff",
                        fontFamily: "Inter, Segoe UI, Roboto, sans-serif",
                      },
                      "& .MuiDataGrid-row:hover": {
                        bgcolor: "#232B3B",
                      },
                      "& .MuiDataGrid-cell": {
                        bgcolor: "#20293A",
                        color: "#fff",
                        fontFamily: "Inter, Segoe UI, Roboto, sans-serif",
                        fontSize: "15px",
                      },
                      "& .MuiDataGrid-footerContainer": {
                        bgcolor: "#20293A",
                        color: "#8CA0B3",
                        fontFamily: "Inter, Segoe UI, Roboto, sans-serif",
                      },
                    }}
                  />
                </Box>
              </>
            )}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Companies;