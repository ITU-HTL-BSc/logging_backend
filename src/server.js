const express = require("express");
const cors = require("cors");
const logger = require("./logger");
const db = require("./db");

const app = express();

// OS_BROWSER_IMPLEMENTATION
const env = "mac_safari_consolelog";

app.use(cors());
app.use(express.json());

app.get("/healthCheck", (_, res) => {
  res.status(200).send({ status: "OK" });
});

app.post("/log", (req, res) => {
  const { level, ...logData } = req.body;
  logger[level](logData);
  res.sendStatus(200);
});

app.post("/metric", (req, res) => {
  const { exec_time } = req.query;

  if (!exec_time) {
    res.status(400).send("Missing metric parameters.");
    return;
  }
  logger.metric(`Added metric: ${exec_time}`);
  db.insertMetrics(env, parseFloat(exec_time));
  res.sendStatus(200);
});

const PORT = 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  console.log(`Server is running on port ${PORT}`);
  db.dbInit(env);
});
