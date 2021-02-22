export interface ResponseBody {
    code: number;
    message: string;
    data?: object;
}

export interface Response {
    statusCode: number;
    body: string;
}
