const fs = require("fs");
const path = require("path");
const pino = require("pino");

const logDir = path.resolve(__dirname, "../logs");
const logFile = path.join(logDir, "app.log");

fs.mkdirSync(logDir, { recursive: true });
fs.writeFileSync(logFile, "");

const options = {
    level: "info",
    customLevels: {
        metric: 35,
    },
};

const transport = pino.transport({
    targets: [
      {
        level: 'info',
        target: 'pino/file',
        options: {
          destination: logFile,
        },
      },
      {
        level: 35,
        target: 'pino/file',
      },
    ],
  });

const logger = pino(options, transport);

module.exports = logger;
