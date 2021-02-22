export default class Result {

    constructor(private readonly statusCode: number,
        private readonly code: number,
        private readonly message: string,
        private readonly data?: object) {
    }

    /**
     * Serverless: According to the API Gateway specs, the body content must be stringified
     */
    bodyToString () {
      return {
        statusCode: this.statusCode,
        body: JSON.stringify({
          code: this.code,
          message: this.message,
          data: this.data,
        }),
      };
    }
  }
