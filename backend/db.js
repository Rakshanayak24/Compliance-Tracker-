const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db");

db.serialize(() => {

  // CLIENTS TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT,
      country TEXT,
      entity_type TEXT
    )
  `);

  // TASKS TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER,
      title TEXT,
      category TEXT,
      due_date TEXT,
      status TEXT
    )
  `);

  // SEED CLIENTS (only if empty)
  db.get("SELECT COUNT(*) as count FROM clients", (err, row) => {
    if (row.count === 0) {
      const clients = [
        ["Acme Corp", "India", "Pvt Ltd"],
        ["Beta Ltd", "India", "LLP"],
        ["Gamma Inc", "USA", "C Corp"],
        ["Delta Solutions", "UK", "Ltd"],
        ["Epsilon Tech", "India", "Startup"],
        ["Zeta Holdings", "UAE", "LLC"],
        ["Theta Enterprises", "India", "Pvt Ltd"],
        ["Lambda Systems", "Germany", "GmbH"],
        ["Omega Group", "Singapore", "Pte Ltd"],
        ["Nova Finance", "India", "NBFC"]
      ];

      const stmt = db.prepare(
        "INSERT INTO clients (company_name, country, entity_type) VALUES (?, ?, ?)"
      );

      clients.forEach(c => stmt.run(c));
      stmt.finalize();

      console.log("✅ Seeded clients");
    }
  });

  // SEED TASKS (only if empty)
  db.get("SELECT COUNT(*) as count FROM tasks", (err, row) => {
    if (row.count === 0) {
      const tasks = [
  // Acme Corp (client_id: 1)
  [1, "GST Filing", "Tax", "2026-03-10", "Completed"],
  [1, "Income Tax Return", "Tax", "2025-08-25", "Pending"],
  [1, "TDS Filing", "Tax", "2026-04-15", "Completed"],

  // Beta Ltd (client_id: 2)
  [2, "Annual Filing", "Compliance", "2026-04-01", "Pending"],
  [2, "GST Filing", "Tax", "2026-02-10", "Completed"],
  [2, "Audit Report", "Audit", "2025-07-20", "Pending"],

  // Gamma Inc (client_id: 3)
  [3, "Audit Submission", "Audit", "2026-02-15", "Completed"],
  [3, "VAT Filing", "Tax", "2025-09-10", "Pending"],
  [3, "Payroll Filing", "HR", "2026-03-25", "Completed"],

  // Delta Solutions (client_id: 4)
  [4, "VAT Filing", "Tax", "2025-09-01", "Pending"],
  [4, "Compliance Check", "Compliance", "2026-05-05", "Completed"],
  [4, "Audit Prep", "Audit", "2026-01-15", "Completed"],

  // Epsilon Tech (client_id: 5)
  [5, "TDS Filing", "Tax", "2026-05-10", "Pending"],
  [5, "GST Filing", "Tax", "2026-02-01", "Completed"],
  [5, "HR Compliance", "HR", "2025-08-01", "Pending"],

  // Zeta Holdings (client_id: 6)
  [6, "Company Renewal", "Compliance", "2026-06-20", "Pending"],
  [6, "Audit Filing", "Audit", "2026-03-12", "Completed"],
  [6, "Tax Filing", "Tax", "2025-07-01", "Pending"],

  // Theta Enterprises (client_id: 7)
  [7, "GST Filing", "Tax", "2025-07-10", "Pending"],
  [7, "Audit Report", "Audit", "2026-01-01", "Completed"],
  [7, "Compliance Filing", "Compliance", "2026-04-20", "Completed"],

  // Lambda Systems (client_id: 8)
  [8, "Payroll Filing", "HR", "2026-03-30", "Pending"],
  [8, "Tax Filing", "Tax", "2026-02-15", "Completed"],
  [8, "Audit Prep", "Audit", "2025-06-01", "Pending"],

  // Omega Group (client_id: 9)
  [9, "Financial Audit", "Audit", "2026-01-10", "Completed"],
  [9, "GST Filing", "Tax", "2025-08-05", "Pending"],
  [9, "Compliance Filing", "Compliance", "2026-03-01", "Completed"],

  // Nova Finance (client_id: 10)
  [10, "NBFC Filing", "Compliance", "2026-02-28", "Pending"],
  [10, "Audit Filing", "Audit", "2026-01-20", "Completed"],
  [10, "Tax Filing", "Tax", "2025-09-15", "Pending"]
];

      const stmt = db.prepare(
        "INSERT INTO tasks (client_id, title, category, due_date, status) VALUES (?, ?, ?, ?, ?)"
      );

      tasks.forEach(t => stmt.run(t));
      stmt.finalize();

      console.log("✅ Seeded tasks");
    }
  });

});

module.exports = db;