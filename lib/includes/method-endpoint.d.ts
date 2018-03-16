export declare class MethodEndpoint {
    protected examplesFile: string;
    absolute: boolean;
    brief: string;
    examples: string;
    path: string;
    constructor(params?: any);
    protected loadFromFile(): void;
    protected parseExamples(): void;
}
