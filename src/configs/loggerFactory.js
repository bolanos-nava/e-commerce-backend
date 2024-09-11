// export default class LoggerFactory {
//   #logger;

//   constructor(logger) {
//     this.#logger = logger;
//   }

//   async getLogger() {
//     switch (this.#logger) {
//       case 'winston': {
//         const { logger } = await import('./logger.js');
//         return logger;
//       }
//       case 'console':
//       default:
//         return console;
//     }
//   }
// }
