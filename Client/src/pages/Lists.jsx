import React, { useState, useEffect } from 'react';
import {
  Box, Typography, List, ListItem, ListItemText,
  IconButton, Button, Container, Divider, Fade,
  Fab, Tooltip, InputBase, Paper, InputAdornment, CssBaseline
} from '@mui/material';
import { createTheme, ThemeProvider, alpha, useTheme } from '@mui/material/styles';
import {
  Plus as PlusIcon, Search as SearchIcon, X as ClearIcon,
  Filter as FilterIcon, Trash2 as DeleteIcon, ExternalLink, FilterX
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Préparation pour un éventuel appel API
const API_BASE_URL = "https://databank-yndl.onrender.com";

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
  const theme = useTheme();

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
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10 }}>
        <Container maxWidth="md" sx={{ pt: 5 }}>
          <Typography variant="h4" sx={{
            mb: 1, fontWeight: 700,
            color: "#fff",
            fontFamily: "Inter, Segoe UI, Roboto, sans-serif"
          }}>
            Saved Filters
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            View, manage, and apply your previously saved search filters
          </Typography>
          <Divider sx={{ mb: 3, opacity: 0.1 }} />

          <Fade in={!isLoading}>
            <Box>
              {/* Search Bar */}
              <Box sx={{
                position: 'relative', borderRadius: 2,
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: '#232B3B' },
                width: '100%', mb: 3,
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
                        bgcolor: '#20293A',
                        border: '1px solid',
                        borderColor: isHovered === name
                          ? '#6366F1'
                          : 'transparent',
                        borderRadius: 2,
                        mb: 1.5,
                        px: 2, py: 1.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: '#232B3B',
                          boxShadow: `0 4px 12px rgba(0,0,0,0.18)`,
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
                              color: '#6366F1',
                              borderColor: '#6366F1',
                              fontFamily: "Inter, Segoe UI, Roboto, sans-serif",
                              '&:hover': {
                                bgcolor: 'rgba(99,102,241,0.08)',
                                borderColor: '#6366F1'
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
                          color={isHovered === name ? '#6366F1' : '#8CA0B3'}
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
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    bgcolor: '#20293A',
                    borderRadius: 2,
                    border: '1px dashed #232B3B',
                  }}
                >
                  <FilterX size={48} color="#8CA0B3" strokeWidth={1.5} />
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="h6" color="#bfc9db" gutterBottom>
                      {searchTerm ? 'No matching filters found' : 'No saved filters yet'}
                    </Typography>
                    <Typography variant="body2" color="#bfc9db">
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
              boxShadow: `0 8px 16px rgba(99,102,241,0.25)`,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 20px rgba(99,102,241,0.3)`
              },
              transition: 'all 0.2s ease-in-out'
            }}
            onClick={() => navigate('/people')}
          >
            <PlusIcon size={24} />
          </Fab>
        </Tooltip>
      </Box>
    </ThemeProvider>
  );
};

export default Lists;