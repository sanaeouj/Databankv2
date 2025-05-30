import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import Sidebar from "../components/Sidebar";
import FilterSidebar from "../components/FilterSidebar";
import ResultsTable from "../components/ResultsTable";
import { useLocation } from "react-router-dom";

// Assuming Sidebar width is defined elsewhere or implicitly, e.g., 250px

const People = () => {
  const location = useLocation();
  const initialFilter = location.state?.filter || {};
  const [filters, setFilters] = useState(initialFilter);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(Object.keys(initialFilter).length > 0);

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
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

   const applyFilters = (data) => {
    // Filtering logic remains the same
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

  return (
    // Main container: Use 100% width and flex display.
    // Add gap property here to control spacing between Sidebar and the main content Box.
    <Box sx={{ 
        display: "flex", 
        width: "100%", 
        height: "100vh", 
        bgcolor: "#181F2A",
        gap: '4px' // Apply 4px gap between flex children (Sidebar and main content)
    }}>
      <Sidebar /> {/* Sidebar component */}
      
      {/* Main content area (FilterSidebar + ResultsTable) */}
      {/* Removed ml: '4px' from here */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // Allow this Box to take remaining horizontal space
          minHeight: "100vh",
          bgcolor: "#181F2A", // Background for the main content area
          display: "flex",
          flexDirection: "row", // Arrange FilterSidebar and ResultsTable side-by-side
          alignItems: "stretch", // Make children fill height
          overflow: "hidden", // Prevent content overflow issues
          // ml: '4px' // Removed this margin
        }}
      >
         {/* Filter Sidebar Container */}
         <Box
          sx={{
            width: 250, // Fixed width for the filter sidebar
            minWidth: 250,
            maxWidth: 250,
            height: "100vh", // Full height
            bgcolor: "#20293A", // Background for the filter sidebar itself
            borderRight: "1px solid #232B3B", // Optional border
            p: 0, // No padding inside filter container
            m: 0, // No margin around filter container
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          {loading ? (
            <Paper sx={{ bgcolor: "#20293A", p: 2, boxShadow: "none" }}>
              <Typography variant="h6" sx={{ color: "#fff" }}>
                Chargement des filtres...
              </Typography>
            </Paper>
          ) : (
            <FilterSidebar
              filters={filters}
              setFilters={(newFilters) => {
                setFilters(newFilters);
                setShowTable(true);
              }}
              data={data}
            />
          )}
        </Box>
        
        {/* Results Area (People List + Table) */}
        <Box
          sx={{
            flexGrow: 1, // Allow this area to take remaining space after FilterSidebar
            height: "100vh", // Full height
            overflow: "auto", // Allow scrolling if content exceeds height
            display: "flex",
            flexDirection: "column",
            bgcolor: "#181F2A", // Background for the results area
            p: 0, // Reset padding, specific padding applied below
          }}
        >
          {/* Header: People List */}
          <Box sx={{ px: 4, pt: 4, pb: 2 }}>
            <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700, mb: 0 }}>
              People List
            </Typography>
          </Box>
          
          {/* Table Container */}
          <Box sx={{ flexGrow: 1, px: 4, pb: 4, display: "flex", flexDirection: "column" }}>
            <Paper sx={{ bgcolor: "#20293A", p: 0, borderRadius: 3, minHeight: 400, boxShadow: "none", flexGrow: 1, display: "flex", flexDirection: "column" }}>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
                  <CircularProgress />
                </Box>
              ) : showTable && filteredData.length > 0 ? (
                <ResultsTable data={filteredData} filters={filters} />
              ) : (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
                  <Typography variant="body1" sx={{ color: "gray" }}>
                    Veuillez sélectionner un filtre pour afficher le tableau.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default People;

