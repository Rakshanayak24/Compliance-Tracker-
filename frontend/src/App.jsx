import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://compliance-tracker-gpfw.onrender.com";

export default function App() {
  const [clients, setClients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Load clients
  useEffect(() => {
    axios.get(API + "/clients")
      .then(res => setClients(res.data))
      .catch(err => console.error(err));
  }, []);

  // Load tasks
  useEffect(() => {
    if (!selected) return;

    axios.get(API + "/tasks/" + selected.id)
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));
  }, [selected]);

  // Add Task
  const addTask = async () => {
    if (!selected) {
      alert("Select a client first");
      return;
    }

    const title = prompt("Task title");
    const category = prompt("Category (Tax / Compliance / Audit / HR)");
    const date = prompt("Due date (YYYY-MM-DD)");

    if (!title || !date) return;

    await axios.post(API + "/tasks", {
      client_id: selected.id,
      title,
      category,
      due_date: date
    });

    const res = await axios.get(API + "/tasks/" + selected.id);
    setTasks(res.data);
  };

  // Mark Done
  const markDone = async (id) => {
    await axios.put(API + "/tasks/" + id, {
      status: "Completed"
    });

    const res = await axios.get(API + "/tasks/" + selected.id);
    setTasks(res.data);
  };

  const today = new Date();

  // Stats
  const total = tasks.length;
  const pending = tasks.filter(t => t.status === "Pending").length;
  const overdueCount = tasks.filter(
    t => t.status === "Pending" && new Date(t.due_date) < today
  ).length;

  // Filters
  const filteredTasks = tasks.filter(t => {
    return (
      (statusFilter === "All" || t.status === statusFilter) &&
      (categoryFilter === "All" || t.category === categoryFilter)
    );
  });

  return (
    <div style={{ display: "flex", gap: 40, padding: 20, fontFamily: "Arial" }}>

      {/* CLIENTS */}
      <div style={{ width: 240 }}>
        <h2>Clients</h2>
        {clients.map(c => (
          <div
            key={c.id}
            onClick={() => setSelected(c)}
            style={{
              padding: 12,
              marginBottom: 8,
              border: "1px solid #ccc",
              borderRadius: 8,
              cursor: "pointer",
              background: selected?.id === c.id ? "#d0ebff" : "#f9f9f9",
              fontWeight: selected?.id === c.id ? "bold" : "normal"
            }}
          >
            {c.company_name}
          </div>
        ))}
      </div>

      {/* TASKS */}
      <div style={{ flex: 1 }}>
        <h2>
          Tasks {selected ? `for ${selected.company_name}` : "(Select a client)"}
        </h2>

        {/* Stats */}
        <div style={{ marginBottom: 12 }}>
          <b>Total:</b> {total} |{" "}
          <b>Pending:</b> {pending} |{" "}
          <b>Overdue:</b> {overdueCount}
        </div>

        {/* Controls */}
        <div style={{ marginBottom: 12 }}>
          <button onClick={addTask} style={{ marginRight: 10 }}>
            + Add Task
          </button>

          <select
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ marginRight: 10 }}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Tax">Tax</option>
            <option value="Compliance">Compliance</option>
            <option value="Audit">Audit</option>
            <option value="HR">HR</option>
          </select>
        </div>

        {!selected && <p>Select a client to view tasks</p>}

        {/* TASK LIST */}
        {filteredTasks.map(t => {
          const overdue =
            t.status === "Pending" &&
            new Date(t.due_date) < today;

          return (
            <div
              key={t.id}
              style={{
                border: "1px solid #ddd",
                padding: 14,
                marginBottom: 10,
                borderRadius: 10,
                background: overdue ? "#ff4d4d" : "#ffffff",
                color: overdue ? "white" : "black",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
              }}
            >
              <div style={{ fontSize: 16, fontWeight: "bold" }}>
                {t.title}
              </div>

              <div>Status: {t.status}</div>
              <div>Category: {t.category || "General"}</div>
              <div>Due: {t.due_date}</div>

              {t.status === "Pending" && (
                <button
                  onClick={() => markDone(t.id)}
                  style={{ marginTop: 6 }}
                >
                  Mark Done
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
