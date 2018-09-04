import express, { Application } from 'express';
import chalk from 'chalk';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
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
  app: Application = express();

  // 앱 초기화. 미들웨어 추가
  private init(): void {
    // 보안용
    // http 헤더를 설정해서 일반적인 보안 옵션을 제공하는듯함
    this.app.use(helmet());
    // 크로스 오리진 방지 - UI서버 따로 만들거면 프록시 하는 걸로 바꿔주면 좋을 듯
    this.app.use(cors());
    // 로그 기록용
    this.app.use(morgan('dev'));
    // Passport
    this.app.use(passport.initialize());
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
}

export default App;
