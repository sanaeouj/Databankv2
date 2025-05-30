import React from "react";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Typography,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { FilterX } from "lucide-react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#60a5fa" },
    secondary: { main: "#a78bfa" },
    error: { main: "#f87171" },
    background: { default: "#181F2A", paper: "#20293A" },
    text: { primary: "#fff", secondary: "#bfc9db", disabled: "#8CA0B3" },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: ["Inter", "Segoe UI", "Roboto", "sans-serif"].join(","),
    button: { textTransform: "none" },
  },
});

const FilterSidebar = ({ filters, setFilters, data }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [name]: value,
      };
      if (name === "geo.country") {
        delete newFilters["geo.state"];
        delete newFilters["geo.city"];
      } else if (name === "geo.state") {
        delete newFilters["geo.city"];
      }
      return newFilters;
    });
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const getUniqueValues = (key, filter = {}) => {
    if (!data || data.length === 0) return [];
    const effectiveFilter = {};
    if (filter) {
      Object.keys(filter).forEach((filterKey) => {
        if (key.includes("geo.")) {
          if (filterKey.includes("geo.")) {
            effectiveFilter[filterKey] = filter[filterKey];
          }
        } else {
          effectiveFilter[filterKey] = filter[filterKey];
        }
      });
    }

    const values = data
      .filter((item) => {
        return Object.keys(effectiveFilter).every((filterKey) => {
          if (!effectiveFilter[filterKey]) return true;
          const keys = filterKey.split(".");
          const itemValue = keys.reduce((acc, part) => {
            if (acc && typeof acc === "object" && part in acc) {
              return acc[part];
            }
            return undefined;
          }, item);
          return itemValue === effectiveFilter[filterKey];
        });
      })
      .map((item) => {
        const keys = key.split(".");
        return keys.reduce((acc, part) => {
          if (acc && typeof acc === "object" && part in acc) {
            return acc[part];
          }
          return undefined;
        }, item);
      })
      .filter((value) => value !== undefined && value !== null && value !== "");
    return Array.from(new Set(values)).sort();
  };

  const fields = [
    ["Title", "title"],
    ["Email Status", "EmailStatus"],
    ["Industry", "company.industry"],
    ["Seniority", "seniority"],
    ["Departments", "departments"],
    ["Company", "company.company"],
    ["Country", "geo.country"],
    ["State", "geo.state", { "geo.country": filters["geo.country"] }],
    [
      "City",
      "geo.city",
      {
        "geo.country": filters["geo.country"],
        "geo.state": filters["geo.state"],
      },
    ],
  ];

  const renderDropdown = (label, key, filter = {}) => {
    const values = getUniqueValues(key, filter);
    const isDisabled = Object.keys(filter).some((filterKey) => !filters[filterKey]);
    return (
      <Box key={key} sx={{ mt: 2, width: "100%" }}>
        <Typography
          variant="body2"
          sx={{
            color: isDisabled ? "text.disabled" : "text.secondary",
            mb: 1,
            fontWeight: 600,
            width: "100%",
          }}
        >
          {label}
        </Typography>
        <FormControl fullWidth sx={{ width: "100%" }}>
          <Select
            name={key}
            value={filters[key] || ""}
            onChange={handleChange}
            displayEmpty
            disabled={isDisabled}
            sx={{
              color: "text.primary",
              height: 40,
              fontSize: 14,
              borderRadius: 2,
              bgcolor: "#232B3B",
              width: "100%",
              "&:hover": { bgcolor: alpha("#fff", 0.05) },
              "& .MuiSelect-icon": { color: "text.secondary" },
              "&.Mui-disabled": {
                opacity: 0.7,
                bgcolor: alpha("#fff", 0.02),
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: "#20293A",
                  color: "#fff",
                  "& .MuiMenuItem-root:hover": {
                    bgcolor: alpha("#60a5fa", 0.15),
                  },
                  "& .Mui-selected": {
                    bgcolor: alpha("#60a5fa", 0.15),
                  },
                  "& .Mui-disabled": {
                    opacity: 0.5,
                  },
                },
              },
            }}
          >
            <MenuItem value="" disabled>
              Select {label}
            </MenuItem>
            {values.map((value, index) => (
              <MenuItem key={index} value={value}>
                {typeof value === "string" ? value : JSON.stringify(value)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          width: 250,
          p: 0,
          bgcolor: "background.paper",
          color: "text.primary",
          borderRight: "1px solid #232E3E",
          height: "100vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <Box sx={{ py: 2, width: "100%" }}>
          <Typography variant="h6" fontWeight={700} sx={{ color: "#fff", mb: 1, px: 2 }}>
            Filtres
          </Typography>
          <Button
            variant="outlined"
            onClick={handleResetFilters}
            startIcon={<FilterX size={18} color="#fff" />}
            sx={{
              mb: 1,
              color: "#fff",
              borderColor: alpha("#fff", 0.2),
              borderRadius: 2,
              fontWeight: 600,
              mx: 2,
              width: "calc(100% - 32px)",
              minHeight: 32,
              fontSize: 14,
              "&:hover": {
                bgcolor: alpha("#60a5fa", 0.08),
                borderColor: "#60a5fa",
                color: "#60a5fa",
              },
            }}
          >
            Clear all
          </Button>
          <Divider sx={{ width: "100%", mb: 1, borderColor: "#232E3E" }} />
          <Box sx={{ px: 2 }}>
            {fields.map(([label, key, condition]) => renderDropdown(label, key, condition))}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default FilterSidebar;