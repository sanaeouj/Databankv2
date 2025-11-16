import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, CircularProgress, TextField, Button } from "@mui/material";
import FilterSidebar from "../components/FilterSidebar";
import ResultsTable from "../components/ResultsTable";
import { useLocation } from "react-router-dom";
import { fetchAPI, apiConfig } from "../config/api";


const People = () => {
  const location = useLocation();
  const initialFilter = location.state?.filter || {};
  const [filters, setFilters] = useState(initialFilter);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(Object.keys(initialFilter).length > 0);

   const [savedFilters, setSavedFilters] = useState(() => {
    const stored = localStorage.getItem("savedFilters");
    return stored ? JSON.parse(stored) : {};
  });
  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchAPI(apiConfig.endpoints.ressourcesAll);
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const flattenData = (data) => {
    return data.map(item => ({
      ...item,
      EmailStatus: item.EmailStatus || "Unavailable",
    }));
  };

  const applyFilters = (data) => {
    return flattenData(data).filter((item) => {
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

   const handleSaveFilter = () => {
    if (!filterName.trim()) return;
    const updated = { ...savedFilters, [filterName]: filters };
    setSavedFilters(updated);
    localStorage.setItem("savedFilters", JSON.stringify(updated));
    setFilterName("");
  };

  const filteredData = applyFilters(data);

  return (
    <Box sx={{ display: "flex", width: "100%", minHeight: "100vh", bgcolor: "#0F172A", m: 0, p: 0, gap: 0 }}>
      <Box
        component="main"
        sx={{
          width: "100%",
          minHeight: "100vh",
          bgcolor: "#0F172A",
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          overflowX: "hidden",
          overflowY: "auto",
          m: 0,  
          p: 0, 
        }}
      >
        <Box
          sx={{
            width: 250,
            minWidth: 250,
            maxWidth: 250,
            minHeight: "100vh",
            background: "rgba(32, 41, 58, 0.6)",
            backdropFilter: "blur(20px)",
            borderRight: "1px solid rgba(255, 255, 255, 0.1)",
            p: 0,
            m: 0,  
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            justifyContent: "flex-start",
            boxShadow: "4px 0 20px rgba(0, 0, 0, 0.2)",
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
         <Box
          sx={{
            flexGrow: 1,
            p: 0,
            minHeight: "100vh",
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
            bgcolor: "#181F2A",
          }}
        >
          <Box sx={{ px: 1, pt: 1, pb: 0.5 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: "#fff", 
                fontWeight: 700, 
                mb: 0.5,
                fontSize: "1.5rem",
                background: "linear-gradient(135deg, #fff 0%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Liste des personnes
            </Typography>
            <Typography variant="body2" sx={{ color: "#8CA0B3", mb: 2, fontSize: "0.875rem" }}>
              Recherchez et filtrez vos contacts pour trouver les personnes qui correspondent à vos critères.
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
                  input: { color: "#fff" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#293145" },
                  width: 180,
                }}
              />
              <Button
                variant="contained"
                onClick={handleSaveFilter}
                sx={{
                  background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  px: 3,
                  borderRadius: 2,
                  boxShadow: "0 4px 14px rgba(139, 92, 246, 0.4)",
                  transition: "all 0.3s ease",
                  "&:hover": { 
                    background: "linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(139, 92, 246, 0.5)",
                  },
                }}
              >
                Enregistrer
              </Button>
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1, px: 1, pb: 1, pt: 0.5, display: "flex", flexDirection: "column", minHeight: 0, overflowY: "auto" }}>
            <Paper 
              elevation={0}
              sx={{ 
                background: "rgba(32, 41, 58, 0.6)",
                backdropFilter: "blur(20px)",
                p: 0, 
                borderRadius: 3, 
                minHeight: 400, 
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                flexGrow: 1, 
                display: "flex", 
                flexDirection: "column" 
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
                  <CircularProgress />
                </Box>
              ) : showTable && filteredData.length > 0 ? (
                <ResultsTable data={filteredData} filters={filters} />
              ) : (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
                  <Typography variant="body1" sx={{ color: "gray" }}>
Please select a filter to view the table.                  </Typography>
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