import bodyParser from 'body-parser';
import chalk from 'chalk';
import cors from 'cors';
import express, { Application } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import uncaughtHandler from './handlers/uncaught';
import passport from './passport';
import routes from './routes';

// Server Interface
export interface IServerSettings {
  // Databaser Url
  dbUrl: string;
  // Port
  port: number | string;
}

class App {
  public app: Application = express();

  // 서버 실행하는 함수
  public async start(settings: IServerSettings): Promise<void> {
    const { port, dbUrl } = settings;
    console.log(chalk.bgCyan(' LOADING ') + chalk.cyan(` Please Wait ... `));
    try {
      // 초기화
      this.init();
      // DB connect
      await this.connectDB(dbUrl);
      // Start The App
      this.app.listen(
        port,
        (): void => {
          console.log(
            chalk.bgGreen(' SUCCESS ') +
              chalk.green(` Listening On Port ${port}`),
          );
        },
      );
    } catch (err) {
      console.log(err);
    }
  }

  // 앱 초기화. 미들웨어 추가
  private init(): void {
    // uncaught 에러 핸들링
    uncaughtHandler();
    // 보안용
    // http 헤더를 설정해서 일반적인 보안 옵션을 제공하는듯함
    this.app.use(helmet());
    // 크로스 오리진 방지 - UI서버 따로 만들거면 프록시 하는 걸로 바꿔주면 좋을 듯
    this.app.use(cors());
    // 로그 기록용
    this.app.use(morgan('dev'));
    // body 사용
    this.app.use(bodyParser());
    // express 에서 session 사용하기 위한 설정 - 세부 설정 필요.
    this.app.use(
      session({
        secret: process.env.SESSION_KEY!,
      }),
    );
    // Passport 설정 - Passport session은 passport/index.ts 파일 커맨트 참고.
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    // REST Api 라우팅
    this.app.use('/api', routes);
  }

  private async connectDB(dburl: string): Promise<void | Error> {
    console.log(chalk.bgBlue(' DATABASE ') + chalk.blue(' Connecting DB'));
    // DB settings
    try {
      await mongoose.connect(
        dburl,
        { useNewUrlParser: true },
      );
      console.log(
        chalk.bgBlue(' DATABASE ') + chalk.blue(' DB Connection Success '),
      );
    } catch (err) {
      console.log(
        chalk.bgRed('  ERROR  ') + chalk.red(' DB Connection Failed'),
      );
      return Promise.reject(err);
    }
  }
}

export default App;
