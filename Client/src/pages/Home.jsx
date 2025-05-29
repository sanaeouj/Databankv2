import React, { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  TextField,
  Paper,
  Container,
  CircularProgress,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AddIcon from '@mui/icons-material/Add';

const drawerWidth = 250;  
const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "User");
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      const nameParts = storedEmail.split("@")[0].split(".");
      const formattedName = nameParts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
      setUserName(formattedName);
    }
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    setTasks(storedTasks);

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://databank-yndl.onrender.com/api/ressources/all");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
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

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((task) => task.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      if (editIndex !== null) {
        const updatedTasks = tasks.map((task, index) => (index === editIndex ? { ...task, text: newTask } : task));
        setTasks(updatedTasks);
        setEditIndex(null);
      } else {
        setTasks([...tasks, { text: newTask, completed: false }]);
      }
      setNewTask("");
    }
  };

  const handleEditTask = (index) => {
    setEditIndex(index);
    setNewTask(tasks[index].text);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const toggleComplete = (index) => {
    const updatedTasks = tasks.map((task, i) => (i === index ? { ...task, completed: !task.completed } : task));
    setTasks(updatedTasks);
  };

  const progress = calculateProgress();
  const totalClients = data.length;
  const ClientValide = data.reduce((count, item) => count + (item.EmailStatus === "Valid" ? 1 : 0), 0);
  const ClientManager = data.filter((item) => item.title === "Manager" || item.title === "manager").length;

  const calculateCompanies = () => {
    const uniqueCompanies = new Set(
      data.map((item) =>
        typeof item.company?.company === "string"
          ? item.company.company.toLowerCase().trim()
          : null
      ).filter(Boolean)
    );
    return uniqueCompanies.size;
  };

  const groupByCountry = () => {
    return data.reduce((acc, item) => {
      const country = item.geo?.country;
      if (country) {
        acc[country] = (acc[country] || 0) + 1;
      }
      return acc;
    }, {});
  };

  const groupByTitle = () => {
    return data.reduce((acc, item) => {
      const title = item.title;
      if (title) {
        acc[title] = (acc[title] || 0) + 1;
      }
      return acc;
    }, {});
  };

  // Activités récentes (exemple statique)
  const recentActivity = [
    { text: "New client added", time: "2 minutes ago", color: "#4ADE80" },
    { text: "Email campaign sent", time: "1 hour ago", color: "#60A5FA" },
    { text: "Data updated", time: "3 hours ago", color: "#A78BFA" },
  ];

  const completedTasks = tasks.filter((t) => t.completed).length;
  const countryData = groupByCountry();
  const maxCountry = Math.max(...Object.values(countryData), 1);

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
          justifyContent: "center", // <-- centre verticalement dans la page web
          overflowX: "auto",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1400,
            mx: "auto",
          }}
        >
          {/* AppBar with Logout */}
          <AppBar position="static" sx={{ bgcolor: "#181F2A", boxShadow: "none", px: 4 }}>
            <Toolbar>
              <Typography variant="h5" sx={{ flexGrow: 1, color: "#fff", fontWeight: 700 }}>
                Dashboard
              </Typography>
              <Typography sx={{ color: "#bfc9db", mr: 2 }}>
                Welcome, {userName}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#f4e33d",
                  color: "#181F2A",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#ffe066", color: "#181F2A" },
                  boxShadow: "none",
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Toolbar>
          </AppBar>
          <Container sx={{ px: 3, pt: 4, flexGrow: 1, width: "100%" }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Typography variant="h6" gutterBottom sx={{ color: "#fff" }}>
                  Welcome back, {userName} 👋
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ color: "#bfc9db" }}>
                  Here’s what’s happening with your business today.
                </Typography>
                {/* Stat Cards */}
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3, mb: 4 }}>
                  <StatCard
                    icon={<PeopleIcon sx={{ fontSize: 32, color: "#60A5FA" }} />}
                    label="Total Customers"
                    value={totalClients}
                  />
                  <StatCard
                    icon={<CheckCircleIcon sx={{ fontSize: 32, color: "#4ADE80" }} />}
                    label="Valid Clients"
                    value={ClientValide}
                  />
                  <StatCard
                    icon={<TrendingUpIcon sx={{ fontSize: 32, color: "#A78BFA" }} />}
                    label="Client Managers"
                    value={ClientManager}
                  />
                  <StatCard
                    icon={<ApartmentIcon sx={{ fontSize: 32, color: "#FBBF24" }} />}
                    label="Companies"
                    value={calculateCompanies()}
                  />
                </Box>
                {/* Cards Section */}
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}>
                  {/* By Country */}
                  <Paper
                    sx={{
                      bgcolor: "#20293A",
                      p: 3,
                      borderRadius: 3,
                      height: 220,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>By Country</Typography>
                    <Box sx={{ flex: 1, overflowY: "auto" }}>
                      {Object.entries(countryData).map(([country, count]) => (
                        <Box key={country} sx={{ mb: 2 }}>
                          <Typography sx={{ color: "#bfc9db" }}>{country}</Typography>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box sx={{ width: "80%", mr: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={(count / maxCountry) * 100}
                                sx={{
                                  height: 8,
                                  borderRadius: 5,
                                  background: "#293145",
                                  "& .MuiLinearProgress-bar": { backgroundColor: "#6366F1" },
                                }}
                              />
                            </Box>
                            <Typography sx={{ color: "#fff", fontWeight: 600 }}>{count}</Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                  {/* Recent Activity */}
                  <Paper
                    sx={{
                      bgcolor: "#20293A",
                      p: 3,
                      borderRadius: 3,
                      height: 220,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>Recent Activity</Typography>
                    <Box sx={{ flex: 1, overflowY: "auto" }}>
                      {recentActivity.map((act, i) => (
                        <Box key={i} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: act.color, mr: 2 }} />
                          <Typography sx={{ color: "#fff", fontWeight: 500 }}>{act.text}</Typography>
                          <Typography sx={{ color: "#bfc9db", ml: "auto", fontSize: 12 }}>{act.time}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                  {/* Task Manager */}
                  <Paper
                    sx={{
                      bgcolor: "#20293A",
                      p: 3,
                      borderRadius: 3,
                      height: 220,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="h6" sx={{ color: "#fff" }}>Task Manager</Typography>
                      <Typography sx={{ color: "#bfc9db", fontSize: 14 }}>
                        {completedTasks}/{tasks.length} completed
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 8,
                        borderRadius: 5,
                        background: "#293145",
                        "& .MuiLinearProgress-bar": { backgroundColor: "#4ADE80" },
                        mb: 2,
                      }}
                    />
                    <Box sx={{ display: "flex", mt: 2 }}>
                      <TextField
                        placeholder="Add a new task..."
                        variant="outlined"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        size="small"
                        sx={{
                          flex: 1,
                          bgcolor: "#181F2A",
                          input: { color: "#fff" },
                          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#293145" },
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={handleAddTask}
                        sx={{
                          ml: 1,
                          minWidth: 40,
                          bgcolor: "#293145",
                          color: "#fff",
                          borderRadius: 2,
                          "&:hover": { bgcolor: "#4ADE80", color: "#181F2A" },
                          p: 0,
                        }}
                      >
                        <AddIcon />
                      </Button>
                    </Box>
                    <Box sx={{ flex: 1, overflowY: "auto", mt: 2 }}>
                      <List>
                        {tasks.map((task, index) => (
                          <ListItem key={index} sx={{ color: "#fff", bgcolor: "#232B3B", borderRadius: 1, mb: 1 }}>
                            <Checkbox
                              checked={task.completed}
                              onChange={() => toggleComplete(index)}
                              sx={{ color: "#4ADE80" }}
                            />
                            <ListItemText primary={task.text} />
                            <Button size="small" color="error" onClick={() => handleDeleteTask(index)}>Delete</Button>
                            <Button size="small" color="primary" onClick={() => handleEditTask(index)}>Edit</Button>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Paper>
                </Box>
              </>
            )}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

// Card composant pour les stats
const StatCard = ({ icon, label, value }) => (
  <Paper sx={{ bgcolor: "#20293A", p: 3, borderRadius: 3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
    <Box sx={{ mb: 1 }}>{icon}</Box>
    <Typography sx={{ color: "#bfc9db", fontSize: 16 }}>{label}</Typography>
    <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 32 }}>{value}</Typography>
  </Paper>
);

export default Home;