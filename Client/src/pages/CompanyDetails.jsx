import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  TableHead,
  Divider,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { ArrowLeft } from "lucide-react";

const API_BASE_URL = "https://databank-yndl.onrender.com";

const CompanyDetails = ({ company, onBack }) => {
  const [openEmployeesDialog, setOpenEmployeesDialog] = useState(false);
  const [employees, setEmployees] = useState([]);

  // Function to flatten nested company data for easier access
  const flattenCompanyData = (companyObj) => {
    const result = {};
    const flatten = (obj, prefix = "") => {
      for (const key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
          flatten(obj[key], prefix ? `${prefix}.${key}` : key);
        } else {
          result[prefix ? `${prefix}.${key}` : key] = obj[key];
        }
      }
    };
    flatten(companyObj);
    return result;
  };

  // Fetch employees for the selected company
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/company/employees/${encodeURIComponent(company.company)}`
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert(`Failed to fetch employees: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEmployeesClick = () => {
    fetchEmployees();
    setOpenEmployeesDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenEmployeesDialog(false);
    setEmployees([]);
  };

  const flattenedData = flattenCompanyData(company);

  // Format values for display
  const formatValue = (key, value) => {
    if (!value) return "N/A";
    return value.toString();
  };

  // Group keys by prefixes for better display
  const groupKeysByPrefix = (data) => {
    const grouped = {};
    Object.keys(data).forEach((key) => {
      const prefix = key.includes(".") ? key.split(".")[0] : "General";
      if (!grouped[prefix]) grouped[prefix] = [];
      grouped[prefix].push(key);
    });
    return grouped;
  };

  const groupedData = groupKeysByPrefix(flattenedData);

  return (
    <Box sx={{ p: 3, bgcolor: "#181F2A", minHeight: "100vh" }}>
      <Button
        startIcon={<ArrowLeft />}
        onClick={onBack}
        sx={{
          mb: 2,
          color: "#fff",
          bgcolor: "#293145",
          borderRadius: 2,
          "&:hover": { bgcolor: "#4ADE80", color: "#181F2A" },
          fontWeight: 600,
        }}
      >
        Back to companies
      </Button>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: "#fff" }}>
        {company.company || "N/A"}
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 3, color: "#bfc9db" }}>
        {company.industry || "N/A"}  - {company.employees || "N/A"} employees 
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Chip label="Overview" variant="outlined" sx={{ color: "#fff", borderColor: "#6366F1" }} />
        <Chip label="Employees" variant="outlined" onClick={handleEmployeesClick} sx={{ color: "#fff", borderColor: "#6366F1" }} />
      </Box>
      {Object.entries(groupedData).map(([section, keys]) => (
        <React.Fragment key={section}>
          <Divider sx={{ my: 3, borderColor: "#293145" }} />
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#8CA0B3" }}>
            {section.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 3, bgcolor: "#232B3B" }}>
            <Table>
              <TableBody>
                {keys.map((key) => (
                  <TableRow key={key}>
                    <TableCell sx={{ fontWeight: 'bold', width: '30%', color: "#bfc9db", bgcolor: "#232B3B" }}>
                      {key.split('.').pop().replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </TableCell>
                    <TableCell sx={{ color: "#fff", bgcolor: "#232B3B" }}>
                      {formatValue(key, flattenedData[key])}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </React.Fragment>
      ))}

      {/* Dialog for Employees */}
      <Dialog open={openEmployeesDialog} onClose={handleCloseDialog} fullWidth maxWidth="md"
        PaperProps={{ sx: { bgcolor: "#20293A", color: "#fff", borderRadius: 3 } }}>
        <DialogTitle sx={{ color: "#fff" }}>Employees Information</DialogTitle>
        <DialogContent>
          {employees && employees.length > 0 ? (
            <TableContainer component={Paper} sx={{ bgcolor: "#232B3B" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "#bfc9db" }}>First Name</TableCell>
                    <TableCell sx={{ color: "#bfc9db" }}>Last Name</TableCell>
                    <TableCell sx={{ color: "#bfc9db" }}>Title</TableCell>
                    <TableCell sx={{ color: "#bfc9db" }}>Seniority</TableCell>
                    <TableCell sx={{ color: "#bfc9db" }}>Departments</TableCell>
                    <TableCell sx={{ color: "#bfc9db" }}>Mobile Phone</TableCell>
                    <TableCell sx={{ color: "#bfc9db" }}>Email</TableCell>
                    <TableCell sx={{ color: "#bfc9db" }}>Email Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.personalid}>
                      <TableCell sx={{ color: "#fff" }}>{employee["First Name"]}</TableCell>
                      <TableCell sx={{ color: "#fff" }}>{employee["Last Name"]}</TableCell>
                      <TableCell sx={{ color: "#fff" }}>{employee.title || "N/A"}</TableCell>
                      <TableCell sx={{ color: "#fff" }}>{employee.seniority || "N/A"}</TableCell>
                      <TableCell sx={{ color: "#fff" }}>{employee.departments || "N/A"}</TableCell>
                      <TableCell sx={{ color: "#fff" }}>{employee.mobilePhone}</TableCell>
                      <TableCell sx={{ color: "#fff" }}>{employee.email || "N/A"}</TableCell>
                      <TableCell sx={{ color: "#fff" }}>{employee.emailStatus}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography sx={{ color: "#fff" }}>No employee data available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: "#fff" }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompanyDetails;