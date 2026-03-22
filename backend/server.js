const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/clients", (req, res) => {
  db.all("SELECT * FROM clients", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.get("/tasks/:clientId", (req, res) => {
  db.all("SELECT * FROM tasks WHERE client_id = ?", [req.params.clientId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.post("/tasks", (req, res) => {
  const { client_id, title, due_date } = req.body;
  if (!title || !due_date) return res.status(400).json({ error: "Missing fields" });

  db.run(`INSERT INTO tasks (client_id, title, due_date, status)
    VALUES (?, ?, ?, 'Pending')`,
    [client_id, title, due_date],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    });
});

app.put("/tasks/:id", (req, res) => {
  db.run("UPDATE tasks SET status = ? WHERE id = ?", [req.body.status, req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ updated: this.changes });
    });
});

app.listen(5000, () => console.log("Server running"));