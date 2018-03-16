/**
 * @file method-endpoints.ts
 * @author Alejandro D. Simi
 */

import * as fs from 'fs';
import * as path from 'path';

export class MethodEndpoint {
    protected examplesFile: string = null;

    public absolute: boolean = false;
    public brief: string = null;
    public examples: string = null;
    public path: string = null;

    constructor(params: any = {}) {
        const { absolute, brief, examples, examplesFile, path } = params;

        this.path = typeof path === 'string' ? path : null;
        this.absolute = typeof absolute === 'boolean' ? absolute : false;
        this.brief = typeof brief === 'string' ? brief : null;
        this.examplesFile = typeof examplesFile === 'string' ? examplesFile : null;

        if (Array.isArray(examples)) {
            this.examples = examples.join('\n');
        } else if (typeof examples === 'string') {
            this.examples = examples;
        } else {
            this.examples = null;
        }

        this.loadFromFile();
        this.parseExamples();
    }
    //
    // Protected methods.
    protected loadFromFile(): void {
        if (this.examplesFile) {
            try {
                this.examples = fs.readFileSync(path.join(__dirname, `../../endpoint-docs/${this.examplesFile}.html`)).toString();
            } catch (e) { }
        }
    }
    protected parseExamples(): void {
        if (this.examples) {
            this.examples = this.examples.replace(/%brief%/g, this.brief);
        }
    }
}