/**
 * @file response.ts
 * @author Alejandro D. Simi
 */

export class Response {
    public body: any = {};
    public errorBody: any = null;
    public skip: boolean = false;
    public status: number = 200;
}