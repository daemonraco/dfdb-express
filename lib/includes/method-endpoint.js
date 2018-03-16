"use strict";
/**
 * @file method-endpoints.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
class MethodEndpoint {
    constructor(params = {}) {
        this.examplesFile = null;
        this.absolute = false;
        this.brief = null;
        this.examples = null;
        this.path = null;
        const { absolute, brief, examples, examplesFile, path } = params;
        this.path = typeof path === 'string' ? path : null;
        this.absolute = typeof absolute === 'boolean' ? absolute : false;
        this.brief = typeof brief === 'string' ? brief : null;
        this.examplesFile = typeof examplesFile === 'string' ? examplesFile : null;
        if (Array.isArray(examples)) {
            this.examples = examples.join('\n');
        }
        else if (typeof examples === 'string') {
            this.examples = examples;
        }
        else {
            this.examples = null;
        }
        this.loadFromFile();
        this.parseExamples();
    }
    //
    // Protected methods.
    loadFromFile() {
        if (this.examplesFile) {
            try {
                this.examples = fs.readFileSync(path.join(__dirname, `../../endpoint-docs/${this.examplesFile}.html`)).toString();
            }
            catch (e) { }
        }
    }
    parseExamples() {
        if (this.examples) {
            this.examples = this.examples.replace(/%brief%/g, this.brief);
        }
    }
}
exports.MethodEndpoint = MethodEndpoint;
