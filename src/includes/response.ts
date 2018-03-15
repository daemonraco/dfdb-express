/**
 * @file response.ts
 * @author Alejandro D. Simi
 */

export class Response {
    public body: any = {};
    public errorBody: any = null;
    public skip: boolean = false;
    public status: number = 200;
    public ui: UIData = null;
}

export class UIData {
    public restUri: string = '/';
    public subUri: string = '/';
    public uri: string = '/';
}