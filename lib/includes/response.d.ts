/**
 * @file response.ts
 * @author Alejandro D. Simi
 */
export declare class Response {
    body: any;
    errorBody: any;
    skip: boolean;
    status: number;
    ui: UIData;
}
export declare class UIData {
    authType: string;
    restUri: string;
    subUri: string;
    uri: string;
}
