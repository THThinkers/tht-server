import express, { Application } from "express";
import chalk from "chalk";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

class App {
  app: Application = express();

  private init(): void {
    this.app.use(cors());
    this.app.use(morgan("dev"));
    this.app.use(helmet());
  }

  private connectDB(): void {
    // DB settings
  }

  public start(port: number): void {
    console.log(chalk.bgCyan(" LOADING ") + chalk.cyan(` Please Wait ... `));
    this.init();
    // DB connect
    this.connectDB();
    this.app.listen(
      port,
      (): void => {
        console.log(
          chalk.bgGreen(" SUCCESS ") + chalk.green(` Listening On Port ${port}`)
        );
      }
    );
  }
}

export default App;
