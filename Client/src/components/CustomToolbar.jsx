import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  Button,
  Toolbar,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile"; // Ajout de l'icône import

const CustomToolbar = ({ exportToCSV, exportToExcel, setSettingsDialogOpen, onImportClick }) => {
  const [exportMenuAnchorEl, setExportMenuAnchorEl] = useState(null);

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
      <Button
        onClick={onImportClick}
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
      >
        Import
      </Button>
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