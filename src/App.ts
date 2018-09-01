import express, { Application } from "express";
import chalk from "chalk";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import mongoose from "mongoose";

// Server Interface
export interface IServerSettings {
  dbUrl: string;
  port: number | string;
}

class App {
  app: Application = express();

  // 앱 초기화. 미들웨어 추가
  private init(): void {
    // 보안용
    // http 헤더를 설정해서 일반적인 보안 옵션을 제공하는듯함
    this.app.use(helmet());
    // 크로스 오리진 방지
    this.app.use(cors());
    // 로그 기록용
    this.app.use(morgan("dev"));
  }

  private async connectDB(dburl: string): Promise<void | Error> {
    console.log(chalk.bgBlue(" DATABASE ") + chalk.blue(" Connecting DB"));
    // DB settings
    try {
      await mongoose.connect(
        dburl,
        { useNewUrlParser: true }
      );
      console.log(
        chalk.bgBlue(" DATABASE ") + chalk.blue(" DB Connection Success ")
      );
    } catch (err) {
      console.log(
        chalk.bgRed("  ERROR  ") + chalk.red(" DB Connection Failed")
      );
      return Promise.reject(err);
    }
  }

  /*
    - 서버 실행하는 함수
    @parm port: 서버가 돌아갈  포트
  */
  public async start(settings: IServerSettings): Promise<void> {
    const { port, dbUrl } = settings;
    console.log(chalk.bgCyan(" LOADING ") + chalk.cyan(` Please Wait ... `));
    try {
      // 초기화
      this.init();
      // DB connect
      await this.connectDB(dbUrl);
      this.app.listen(
        port,
        (): void => {
          console.log(
            chalk.bgGreen(" SUCCESS ") +
              chalk.green(` Listening On Port ${port}`)
          );
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
}

export default App;
