import express, { Application } from "express";
import chalk from "chalk";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

class App {
  app: Application = express();

  // 앱 초기화. 미들웨어 추가
  private init(): void {
    // 크로스 오리진 방지
    this.app.use(cors());
    // 로그 기록용
    this.app.use(morgan("dev"));
    // 보안용? 이라는데 좋다고 해서 가져옴
    this.app.use(helmet());
  }

  private connectDB(): void {
    // DB settings
  }

  /*
    - 서버 실행하는 함수
    @parm port: 서버가 돌아갈  포트
  */
  public start(port: number | string): void {
    console.log(chalk.bgCyan(" LOADING ") + chalk.cyan(` Please Wait ... `));
    // 초기화
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
