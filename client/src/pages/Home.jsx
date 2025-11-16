import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users as PeopleIcon, CheckCircle as CheckCircleIcon, TrendingUp as TrendingUpIcon, Building2 as ApartmentIcon, Plus as AddIcon } from "lucide-react";
import { fetchAPI, apiConfig } from "../config/api";
import styles from "./Home.module.css";

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

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

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

  const totalClients = data.length;
  const ClientValide = data.reduce((count, item) => count + (item.EmailStatus === "Extrapolated" ? 1 : 0), 0);
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

  const countryData = groupByCountry();
  const maxCountry = Math.max(...Object.values(countryData), 1);
  const completedTasks = tasks.filter((t) => t.completed).length;

  const StatCard = ({ icon, label, value, gradient = "primary" }) => {
    const gradients = {
      primary: "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)",
      success: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)",
      accent: "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)",
    };

    const valueGradients = {
      primary: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
      success: "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)",
      accent: "linear-gradient(135deg, #F59E0B 0%, #8B5CF6 100%)",
    };

    return (
      <div className={styles.statCard} style={{ background: gradients[gradient] }}>
        <div className={styles.statIconContainer}>{icon}</div>
        <div className={styles.statLabel}>{label}</div>
        <div className={styles.statValue} style={{ background: valueGradients[gradient] }}>
          {value}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.mainContent}>
        <div className={styles.appBar}>
          <div className={styles.toolbar}>
            <div className={styles.toolbarTitle}>Tableau de bord</div>
            <div className={styles.welcomeText}>Bienvenue, {userName}</div>
            <button className={styles.logoutButton} onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        </div>
        <div className={styles.contentContainer}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
            </div>
          ) : (
            <>
              <div className={styles.welcomeSection}>
                <h2 className={styles.welcomeTitle}>Bon retour, {userName} 👋</h2>
                <p className={styles.welcomeSubtitle}>
                  Voici ce qui se passe avec votre entreprise aujourd'hui.
                </p>
              </div>

              {/* Stat Cards */}
              <div className={styles.statsGrid}>
                <StatCard
                  icon={<PeopleIcon size={28} color="#06B6D4" />}
                  label="Total Clients"
                  value={totalClients}
                  gradient="primary"
                />
                <StatCard
                  icon={<CheckCircleIcon size={28} color="#10B981" />}
                  label="Clients Valides"
                  value={ClientValide}
                  gradient="success"
                />
                <StatCard
                  icon={<TrendingUpIcon size={28} color="#8B5CF6" />}
                  label="Managers"
                  value={ClientManager}
                  gradient="primary"
                />
                <StatCard
                  icon={<ApartmentIcon size={28} color="#F59E0B" />}
                  label="Entreprises"
                  value={calculateCompanies()}
                  gradient="accent"
                />
              </div>

              {/* Cards Section */}
              <div className={styles.cardsGrid}>
                {/* By Country */}
                <div className={styles.card}>
                  <h3 className={styles.cardTitle}>Par pays</h3>
                  <div className={styles.cardContent}>
                    {Object.entries(countryData).map(([country, count]) => (
                      <div key={country} style={{ marginBottom: "0.5rem" }}>
                        <div style={{ color: "#bfc9db", fontSize: "0.8rem", marginBottom: "0.25rem" }}>{country}</div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div style={{ width: "80%", marginRight: "0.5rem" }}>
                            <div style={{
                              width: "100%",
                              height: "8px",
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              borderRadius: "4px",
                              overflow: "hidden"
                            }}>
                              <div style={{
                                width: `${(count / maxCountry) * 100}%`,
                                height: "100%",
                                background: "linear-gradient(90deg, #8B5CF6 0%, #06B6D4 100%)",
                                transition: "width 0.3s ease"
                              }}></div>
                            </div>
                          </div>
                          <div style={{ color: "#bfc9db", fontSize: "0.85rem" }}>{count}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Task Manager */}
                <div className={styles.card} style={{ gridColumn: "span 2" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <h3 className={styles.cardTitle}>Gestionnaire de tâches</h3>
                    <div style={{ color: "#bfc9db", fontSize: "0.75rem" }}>
                      {completedTasks}/{tasks.length} completed
                    </div>
                  </div>
                  <div style={{
                    width: "100%",
                    height: "6px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "4px",
                    marginBottom: "0.5rem",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #10B981 0%, #06B6D4 100%)",
                      transition: "width 0.3s ease"
                    }}></div>
                  </div>
                  <div style={{ display: "flex", marginTop: "0.25rem", marginBottom: "0.5rem" }}>
                    <input
                      type="text"
                      placeholder="Add a new task..."
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
                      style={{
                        flex: 1,
                        padding: "0.5rem",
                        borderRadius: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        color: "#fff",
                        fontSize: "0.9rem",
                        marginRight: "0.5rem"
                      }}
                    />
                    <button
                      onClick={handleAddTask}
                      style={{
                        background: "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <AddIcon size={20} />
                    </button>
                  </div>
                  <div className={styles.cardContent}>
                    {tasks.length === 0 ? (
                      <div style={{ color: "#8CA0B3", textAlign: "center", padding: "2rem" }}>
                        Aucune tâche pour le moment
                      </div>
                    ) : (
                      <div>
                        {tasks.map((task, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "0.5rem",
                              marginBottom: "0.25rem",
                              backgroundColor: "#232B3B",
                              borderRadius: "6px",
                              color: "#fff",
                              fontSize: "0.85rem"
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => toggleComplete(index)}
                              style={{
                                marginRight: "0.75rem",
                                width: "18px",
                                height: "18px",
                                cursor: "pointer",
                                accentColor: "#10B981"
                              }}
                            />
                            <div style={{ flex: 1, textDecoration: task.completed ? "line-through" : "none", opacity: task.completed ? 0.6 : 1 }}>
                              {task.text}
                            </div>
                            <button
                              onClick={() => handleEditTask(index)}
                              style={{
                                background: "transparent",
                                border: "1px solid rgba(139, 92, 246, 0.3)",
                                color: "#8B5CF6",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "4px",
                                cursor: "pointer",
                                marginRight: "0.5rem",
                                fontSize: "0.8rem"
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTask(index)}
                              style={{
                                background: "transparent",
                                border: "1px solid rgba(239, 68, 68, 0.3)",
                                color: "#ef4444",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "0.8rem"
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
