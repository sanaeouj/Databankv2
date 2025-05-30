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
  Link,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Search as SearchIcon, X as ClearIcon } from "lucide-react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import CompanyDetails from "./CompanyDetails";

const drawerWidth = 250;

const Companies = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);

  const fetchCompanies = async () => {
    try {
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
            color: "#6366F1",
            textDecoration: "none",
            fontWeight: 600,
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
    <Box sx={{ display: "flex", width: "83vh", minHeight: "100vh", bgcolor: "#181F2A", m: 0, p: 0 }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          width: `calc(100vw - ${drawerWidth}px)`,
          minHeight: "100vh",
          bgcolor: "#181F2A",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          overflow: "hidden",
          m: 0,
          p: 0,
        }}
      >
        <Box sx={{ px: 4, pt: 4, pb: 2 }}>
          <Typography
            variant="h5"
            sx={{
              color: "#fff",
              fontWeight: 700,
              mb: 0,
              letterSpacing: 1,
            }}
          >
            Companies List
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1, px: 4, pb: 4, display: "flex", flexDirection: "column" }}>
          <Paper
            sx={{
              bgcolor: "#20293A",
              p: 3,
              borderRadius: 3,
              mb: 3,
              boxShadow: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <SearchIcon size={20} color="#9ca3af" />
            <InputBase
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                ml: 2,
                flex: 1,
                color: "#fff",
                width: "100%",
                fontSize: "16px",
              }}
              endAdornment={
                searchTerm && (
                  <IconButton onClick={() => setSearchTerm("")}>
                    <ClearIcon size={16} color="#9ca3af" />
                  </IconButton>
                )
              }
            />
          </Paper>
          <Paper sx={{ bgcolor: "#20293A", p: 0, borderRadius: 3, minHeight: 400, boxShadow: "none", flexGrow: 1, display: "flex", flexDirection: "column" }}>
            {selectedCompany ? (
              <CompanyDetails 
                company={selectedCompany} 
                onBack={() => setSelectedCompany(null)} 
              />
            ) : (
              <Box sx={{ height: 600, width: "100%" }}>
                <DataGrid
                  rows={filteredData}
                  columns={displayedColumns}
                  pageSize={10}
                  rowsPerPageOptions={[5, 10, 20]}
                  getRowId={(row) => row.company}
                  sx={{
                    bgcolor: "#20293A",
                    color: "#fff",
                    borderRadius: 3,
                    fontSize: "16px",
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
                    "& .MuiDataGrid-cell": {
                      bgcolor: "#20293A",
                      color: "#fff",
                    },
                    "& .MuiDataGrid-footerContainer": {
                      bgcolor: "#20293A",
                      color: "#fff",
                    },
                  }}
                />
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Companies;