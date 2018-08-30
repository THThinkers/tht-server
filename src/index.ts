// For Dotenv
import dotenv from "dotenv";
dotenv.config();

import App from "./App";

const PORT: number | string = process.env.APP_PORT || 4000;
const app: App = new App();

app.start(PORT);
