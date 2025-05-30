import React, { useState, useRef } from "react";
import {
  Menu,
  MenuItem,
  Button,
  Toolbar,
  Box,
  CircularProgress,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Papa from "papaparse";
import ExcelJS from "exceljs";

const CustomToolbar = ({ exportToCSV, exportToExcel, setSettingsDialogOpen, onImportData }) => {
  const [exportMenuAnchorEl, setExportMenuAnchorEl] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // Import logic
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop().toLowerCase();

    try {
      if (fileExtension === "csv") {
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            setFileData(results.data.filter(row => Object.keys(row).length > 0));
          },
          error: () => {
            alert("Error parsing CSV file. Please check the file format.");
          }
        });
      } else if (fileExtension === "xlsx" || fileExtension === "xls") {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        const worksheet = workbook.worksheets[0];
        const headers = [];
        worksheet.getRow(1).eachCell((cell) => headers.push(cell.value));
        const jsonData = [];
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber === 1) return;
          const rowData = {};
          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const header = headers[colNumber - 1];
            if (header) rowData[header] = cell.value;
          });
          if (Object.keys(rowData).length > 0) jsonData.push(rowData);
        });
        setFileData(jsonData);
      } else {
        throw new Error("Unsupported file type");
      }
    } catch (error) {
      alert(`Error processing file: ${error.message}`);
    }
  };

  const handleProcessFile = async () => {
    setIsProcessing(true);
    if (onImportData) {
      await onImportData(fileData);
    }
    setIsProcessing(false);
    setFileData([]);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  return (
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
      {/* Import logic */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          disabled={isProcessing}
        />
        <Button
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          startIcon={<UploadFileIcon />}
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
          disabled={isProcessing}
        >
          Import
        </Button>
        {fileData.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleProcessFile}
            disabled={isProcessing}
            sx={{
              fontWeight: 600,
              borderRadius: 2,
              px: 2,
              minWidth: 120,
              bgcolor: "#60a5fa",
              color: "#181F2A",
              "&:hover": { bgcolor: "#293145", color: "#fff" },
            }}
          >
            {isProcessing ? <CircularProgress size={20} color="inherit" /> : "Process File Data"}
          </Button>
        )}
      </Box>
      {/* Export logic */}
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
  );
};

export default CustomToolbar;