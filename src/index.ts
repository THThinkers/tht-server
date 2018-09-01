// For Dotenv
import dotenv from "dotenv";
dotenv.config();

import App, { IServerSettings } from "./App";

const serverSettings: IServerSettings = {
  port: process.env.APP_PORT || 4000,
  dbUrl: `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${
    process.env.DB_URL
  }:27017/tht`
};
const app: App = new App();

app.start(serverSettings);
