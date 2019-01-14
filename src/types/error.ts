export interface IError extends Error {
  isOperational?: boolean; // 이 에러가 시스템 상 에러인지 아닌지,
}
