// ts-node가 ts-config의 file option을 사용하지 않기 때문에 폴더 따로 뺴줌. (typeRoots는 지원)
// typeRoots도 스트럭쳐가 따로 있음. declare 해주는 모듈 폴더 안에 index.d.ts파일 넣어줘야 식별가능.

// import 밑에서 따로 해주는이유 : https://stackoverflow.com/questions/39040108/import-class-in-definition-file-d-ts
declare global {
  namespace Express {
    // These open interfaces may be extended in an application-specific manner via declaration merging.
    // See for example method-override.d.ts (https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/method-override/index.d.ts)
    export interface Request {
      sgMail: {
        send: (
          msg: Partial<import ('../../src/utils/sendgrid').IMessage> &
            Pick<
              import ('../../src/utils/sendgrid').IMessage,
              'to' | 'subject' | 'text'
            >,
        ) => void;
      };
    }
  }
}

export interface Error {
  isOperational?: boolean;
}
