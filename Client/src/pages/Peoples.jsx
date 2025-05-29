import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Container,
} from "@mui/material";
import FilterSidebar from "../components/FilterSidebar";
import Sidebar from "../components/Sidebar";
import ResultsTable from "../components/ResultsTable";
import { useLocation } from "react-router-dom";

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
  const [savedFilters, setSavedFilters] = useState(() => {
    const stored = localStorage.getItem("savedFilters");
    return stored ? JSON.parse(stored) : {};
  });
  const [filterName, setFilterName] = useState("");

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

  const handleSaveFilter = () => {
    if (!filterName.trim()) return;
    const updated = { ...savedFilters, [filterName]: filters };
    setSavedFilters(updated);
    localStorage.setItem("savedFilters", JSON.stringify(updated));
    setFilterName("");
  };

  const handleDeleteSavedFilter = (name) => {
    const updated = { ...savedFilters };
    delete updated[name];
    setSavedFilters(updated);
    localStorage.setItem("savedFilters", JSON.stringify(updated));
  };

  const filteredData = applyFilters(data);

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
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1400,
            mx: "auto",
            mt: 4,
            display: "flex",
            gap: 3,
          }}
        >
          {/* Filter Sidebar */}
          <Box sx={{ minWidth: 260 }}>
            {loading ? (
              <Paper sx={{ bgcolor: "#20293A", p: 2 }}>
                <Typography variant="h6" sx={{ color: "#fff" }}>
                  Loading filters...
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
          {/* Main Content */}
          <Box sx={{ flexGrow: 1 }}>
            <Paper sx={{ bgcolor: "#20293A", p: 3, mb: 3, borderRadius: 3 }}>
              <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700, mb: 1 }}>
                People List
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  size="small"
                  variant="outlined"
                  placeholder="Enter filter name"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  sx={{
                    bgcolor: "#181F2A",
                    input: { color: "#fff" },
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#293145" },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSaveFilter}
                  sx={{
                    bgcolor: "#293145",
                    color: "#fff",
                    borderRadius: 2,
                    "&:hover": { bgcolor: "#4ADE80", color: "#181F2A" },
                  }}
                >
                  Save
                </Button>
              </Box>
            </Paper>
            <Paper sx={{ bgcolor: "#20293A", p: 3, borderRadius: 3, minHeight: 400 }}>
              {showTable ? (
                <ResultsTable data={filteredData} filters={filters} />
              ) : (
                <Typography variant="body1" sx={{ color: "gray" }}>
                  Please select a filter to display the table.
                </Typography>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default People;
