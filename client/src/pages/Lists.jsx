import React, { useState, useEffect } from 'react';
import {
  Box, Typography, List, ListItem, ListItemText,
  IconButton, Button, Container, Divider, Fade,
  Fab, Tooltip, InputBase, Paper, InputAdornment, CssBaseline
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Plus as PlusIcon, Search as SearchIcon, X as ClearIcon,
  Filter as FilterIcon, Trash2 as DeleteIcon, ExternalLink, FilterX
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { apiConfig } from "../config/api";

// Utilisation de la configuration API locale
const API_BASE_URL = apiConfig.baseURL;

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6366F1' },
    secondary: { main: '#60a5fa' },
    error: { main: '#f87171' },
    background: { default: '#181F2A', paper: '#20293A' },
    text: { primary: '#fff', secondary: '#bfc9db' },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: ['Inter', 'Segoe UI', 'Roboto', 'sans-serif'].join(','),
    button: { textTransform: 'none' },
    h4: { fontWeight: 700, letterSpacing: 1 },
    h6: { fontWeight: 600 },
  }
});

const Lists = () => {
  const [savedFilters, setSavedFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('savedFilters');
    if (stored) {
      setSavedFilters(JSON.parse(stored));
    } else {
      const mockFilters = {
        'Active Projects': { status: 'active', priority: ['high', 'medium'] },
        'Marketing Team': { department: 'marketing' },
        'Urgent': { priority: 'high' }
      };
      localStorage.setItem('savedFilters', JSON.stringify(mockFilters));
      setSavedFilters(mockFilters);
    }
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  const handleDeleteFilter = (name) => {
    const updated = { ...savedFilters };
    delete updated[name];
    localStorage.setItem('savedFilters', JSON.stringify(updated));
    setSavedFilters(updated);
  };

  const handleApplyFilter = (name) => {
    const filter = savedFilters[name];
    navigate('/people', { state: { filter } });
  };

  const filtered = Object.keys(savedFilters).filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", width: "100%", minHeight: "100vh", bgcolor: "#0F172A", m: 0, p: 0, gap: 0 }}>
        <Box sx={{ flexGrow: 1, width: "100%", p: 0, m: 0, minHeight: "100vh", overflowY: "auto" }}>
          <Container maxWidth="lg" sx={{ p: 1, m: 0, pb: 10 }}>
          <Typography 
            variant="h5" 
            sx={{
              mb: 0.5, 
              fontWeight: 700,
              fontSize: "1.25rem",
              background: "linear-gradient(135deg, #fff 0%, #8B5CF6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily: "Inter, Segoe UI, Roboto, sans-serif"
            }}
          >
            Filtres enregistrés
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.5, fontSize: "0.8rem" }}>
            Visualisez, gérez et appliquez vos filtres de recherche précédemment enregistrés
          </Typography>
          <Divider sx={{ mb: 1.5, opacity: 0.1 }} />

          <Fade in={!isLoading}>
            <Box>
              {/* Search Bar */}
                <Box sx={{
                  position: 'relative', 
                  borderRadius: 2,
                  background: 'rgba(32, 41, 58, 0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                  '&:hover': { 
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                  },
                  width: '100%', 
                  mb: 2,
                  transition: 'all 0.2s ease',
                }}>
                <Box sx={{ position: 'absolute', height: '100%', display: 'flex', alignItems: 'center', pl: 2 }}>
                  <SearchIcon size={20} color="#9ca3af" />
                </Box>
                <InputBase
                  placeholder="Search saved filters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    color: '#fff',
                    pl: 5,
                    py: 1.5,
                    width: '100%',
                    fontFamily: "Inter, Segoe UI, Roboto, sans-serif"
                  }}
                  endAdornment={searchTerm && (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setSearchTerm('')}>
                        <ClearIcon size={16} color="#9ca3af" />
                      </IconButton>
                    </InputAdornment>
                  )}
                />
              </Box>

              {/* List */}
              {filtered.length > 0 ? (
                <List sx={{ width: '100%', p: 0 }}>
                  {filtered.map((name) => (
                    <ListItem
                      key={name}
                      onMouseEnter={() => setIsHovered(name)}
                      onMouseLeave={() => setIsHovered(null)}
                    sx={{
                      background: 'rgba(32, 41, 58, 0.6)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid',
                      borderColor: isHovered === name
                        ? 'rgba(99, 102, 241, 0.5)'
                        : 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      mb: 1,
                      px: 1.5, 
                      py: 1,
                      transition: 'all 0.3s ease',
                      boxShadow: isHovered === name ? '0 4px 20px rgba(139, 92, 246, 0.3)' : '0 2px 10px rgba(0,0,0,0.1)',
                      '&:hover': {
                        background: 'rgba(35, 43, 59, 0.8)',
                        borderColor: 'rgba(139, 92, 246, 0.5)',
                        boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                      disableGutters
                      secondaryAction={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<ExternalLink size={16} />}
                            onClick={() => handleApplyFilter(name)}
                            sx={{
                              mr: 1, textTransform: 'none',
                              color: '#8B5CF6',
                              borderColor: '#8B5CF6',
                              fontFamily: "Inter, Segoe UI, Roboto, sans-serif",
                              '&:hover': {
                                bgcolor: 'rgba(139, 92, 246, 0.08)',
                                borderColor: '#8B5CF6'
                              }
                            }}
                          >
                            Apply
                          </Button>
                          <IconButton
                            onClick={() => handleDeleteFilter(name)}
                            sx={{
                              color: '#f87171',
                              '&:hover': {
                                bgcolor: 'rgba(248,113,113,0.1)'
                              }
                            }}
                          >
                            <DeleteIcon size={18} />
                          </IconButton>
                        </Box>
                      }
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FilterIcon
                          size={18}
                          color={isHovered === name ? '#8B5CF6' : '#8CA0B3'}
                          style={{ marginRight: 12 }}
                        />
                        <ListItemText
                          primary={<Typography sx={{
                            fontWeight: 500,
                            color: isHovered === name ? '#fff' : '#bfc9db',
                            fontFamily: "Inter, Segoe UI, Roboto, sans-serif"
                          }}>{name}</Typography>}
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    bgcolor: '#20293A',
                    borderRadius: 2,
                    border: '1px dashed #232B3B',
                  }}
                >
                  <FilterX size={40} color="#8CA0B3" strokeWidth={1.5} />
                  <Box sx={{ mt: 1.5, textAlign: 'center' }}>
                    <Typography variant="h6" color="#bfc9db" gutterBottom sx={{ fontSize: "1rem", mb: 0.5 }}>
                      {searchTerm ? 'No matching filters found' : 'No saved filters yet'}
                    </Typography>
                    <Typography variant="body2" color="#bfc9db" sx={{ fontSize: "0.875rem" }}>
                      {searchTerm
                        ? `No filters match "${searchTerm}". Try a different search term.`
                        : 'Save filters from the people page to view them here.'}
                    </Typography>
                  </Box>
                </Paper>
              )}
            </Box>
          </Fade>
          </Container>

          <Tooltip title="Create new filter" placement="left">
            <Fab
              color="primary"
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                boxShadow: `0 8px 16px rgba(139, 92, 246, 0.25)`,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 12px 20px rgba(139, 92, 246, 0.3)`
                },
                transition: 'all 0.2s ease-in-out'
              }}
              onClick={() => navigate('/people')}
            >
              <PlusIcon size={24} />
            </Fab>
          </Tooltip>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Lists;