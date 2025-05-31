import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, CircularProgress, TextField, Button } from "@mui/material";
import Sidebar from "../components/Sidebar";
import FilterSidebar from "../components/FilterSidebar";
import ResultsTable from "../components/ResultsTable";
import { useLocation } from "react-router-dom";

// drawerWidth might still be relevant for Sidebar's internal logic or width
// const drawerWidth = 250; 

const People = () => {
  const location = useLocation();
  const initialFilter = location.state?.filter || {};
  const [filters, setFilters] = useState(initialFilter);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(Object.keys(initialFilter).length > 0);

  // State for saving filters
  const [savedFilters, setSavedFilters] = useState(() => {
    const stored = localStorage.getItem("savedFilters");
    return stored ? JSON.parse(stored) : {};
  });
  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://databank-yndl.onrender.com/api/ressources/all"
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Apply filters logic
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

  // Save filter logic
  const handleSaveFilter = () => {
    if (!filterName.trim()) return;
    const updated = { ...savedFilters, [filterName]: filters };
    setSavedFilters(updated);
    localStorage.setItem("savedFilters", JSON.stringify(updated));
    setFilterName("");
  };

  const filteredData = applyFilters(data);

  return (
    // Main container: display flex, full width/height, apply gap
    <Box sx={{ 
        display: "flex", 
        width: "100%", // Use full width of the parent 
        height: "100vh", 
        bgcolor: "#181F2A", 
        m: 0, 
        p: 0, 
        gap: '4px' // Apply 4px gap between direct children: Sidebar, FilterSidebar container, Results container
    }}>
      <Sidebar />
      
      {/* Filter Sidebar Container - Now a direct child */}
      <Box
        sx={{
          width: 250, // Keep fixed width for filter sidebar
          minWidth: 250,
          maxWidth: 250,
          height: "100vh",
          bgcolor: "#20293A",
          borderRight: "1px solid #232B3B",
          p: 0,
          m: 0,  
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          overflowY: 'auto', // Allow scrolling within filter sidebar if needed
          overflowX: 'hidden',
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

      {/* Results Area Container - Now a direct child */}
      <Box
        sx={{
          flexGrow: 1, // Takes remaining space
          height: "100vh",
          overflow: "hidden", // Hide overflow for this container
          display: "flex",
          flexDirection: "column",
          bgcolor: "#181F2A",
          p: 0, // Reset padding
        }}
      >
        {/* Header: People List Title & Save Filter */}
        <Box sx={{ px: 4, pt: 4, pb: 2 }}>
          <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700, mb: 0 }}>
            People List
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 2, mb: 2 }}>
            <TextField
              size="small"
              variant="outlined"
              placeholder="Enter filter name"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              sx={{
                bgcolor: "#20293A",
                borderRadius: '8px',
                input: { color: "#fff", fontSize: '12px', height: '20px' }, // Smaller input
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#293145" },
                width: 180,
              }}
            />
            <Button
              variant="contained"
              onClick={handleSaveFilter}
              sx={{
                bgcolor: "#6366F1",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.8rem", // Smaller button text
                px: 2,
                py: 0.5, // Adjust padding for smaller height
                textTransform: 'none',
                borderRadius: '8px',
                "&:hover": { bgcolor: "#4f52c1" },
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
        
        {/* Table Container - Takes remaining space in this column */}
        <Box sx={{ flexGrow: 1, px: 4, pb: 4, display: "flex", flexDirection: "column", overflow: 'hidden' }}>
          <Paper sx={{ 
              bgcolor: "#20293A", 
              p: 0, 
              borderRadius: 3, 
              boxShadow: "none", 
              flexGrow: 1, 
              display: "flex", 
              flexDirection: "column",
              overflow: 'hidden' // Important to contain the table
          }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
                <CircularProgress />
              </Box>
            ) : showTable && filteredData.length > 0 ? (
              // Ensure ResultsTable handles its own scrolling if needed
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
  );
};

export default People;

