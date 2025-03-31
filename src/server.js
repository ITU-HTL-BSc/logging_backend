const express = require("express");
const cors = require("cors");
const logger = require("./logger");
const db = require("./db");

const app = express();

// map from id to set of log messages
const idToLogs = new Map();
// implementation_docker/local_browser
const env = "console_chrome";

app.use(cors());
app.use(express.json());

app.get("/healthCheck", (_, res) => {
    res.status(200).send({ status: "OK" });
});

app.post("/log", (req, res) => {
    const { level, ...logData } = req.body;
    addToSet(logData["id"], logData["msg"]);
    logger[level](logData);
    res.sendStatus(200);
});

app.get("/logs", (_, res) => {
    const sizes = {};
    idToLogs.forEach((value, key) => {
        sizes[key] = value.size;
    });
    res.status(200).send(sizes);
});

function addToSet(id, msg) {
    if (!idToLogs.has(id)) {
        idToLogs.set(id, new Set());
    }
    idToLogs.get(id).add(msg);
}

app.post("/metric", (req, res) => {
    const { exec_time, lines_per_sec } = req.query;

    if (!exec_time || !lines_per_sec) {
        res.status(400).send("Missing metric parameters.");
        return;
    }
    logger.metric(`Added metric: ${exec_time}, ${lines_per_sec}`);
    db.insertMetrics(env, parseFloat(exec_time), parseFloat(lines_per_sec));
    res.sendStatus(200);
});

const PORT = 3000;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    console.log(`Server is running on port ${PORT}`);
    db.dbInit(env);
});
