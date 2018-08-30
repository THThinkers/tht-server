// For Dotenv
import dotenv from "dotenv";
dotenv.load();

import App from "./App";

const PORT: number = 8080;
const app: App = new App();

app.start(PORT);
