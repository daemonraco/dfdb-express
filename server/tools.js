'use strict';

const fs = require('fs');
const path = require('path');

class Tools {
    //
    // Constructor
    constructor() {
        this._loaded = false;
        this._load();
    }
    //
    // Public methods.
    packageData() {
        return this._packageData;
    }
    version() {
        return this._packageData.version;
    }
    //
    // Protected methods.
    _load() {
        if (!this._loaded) {
            this._loaded = true;

            this._packageData = require(path.join(__dirname, '../package.json'));
        }
    }
}

const instance = new Tools();

module.exports = instance;
