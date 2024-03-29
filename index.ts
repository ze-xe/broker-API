import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import compression from "compression";
import route from "./src/routes/apiRoute";
import morgan from "morgan";
const app = express();

const httpServer = createServer(app);

app.use(compression());

require("dotenv").config();

app.use(cors({
    origin: '*'
}));

app.use(helmet());
app.use(express.json());
app.use(morgan("tiny"));
app.use("/", route);
const port = process.env.PORT;

let server = httpServer.listen(port ?? 3010, function () {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

function stop() {
    server.close();
}

module.exports = server;
module.exports.stop = stop;