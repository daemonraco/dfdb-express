'use strict';

const fs = require('fs');
const path = require('path');
const { tmpdir } = require('os');

const resultsPath = path.join(tmpdir(), `${Math.random().toString(36).replace(/[^a-z]+/g, '')}.out`);
const readmePath = path.join(__dirname, `../README.md`);

const inject = (section, data, isCode, next) => {
    const openPattern = new RegExp(`<!-- AUTO:${section}.* -->`);
    const closePattern = new RegExp(`<!-- /AUTO -->`);

    const readmeLines = fs.readFileSync(readmePath)
        .toString()
        .split('\n');
    let newReadmeContents = '';
    let ignoring = false;
    readmeLines.forEach(line => {
        if (ignoring) {
            if (line.match(closePattern)) {
                ignoring = false;

                newReadmeContents += `${line}\n`;
            }
        } else {
            newReadmeContents += `${line}\n`;
            if (line.match(openPattern)) {
                ignoring = true;

                newReadmeContents += isCode ? '```\n' : '';
                newReadmeContents += `${data}\n`;
                newReadmeContents += isCode ? '```\n' : '';
            }
        }
    });

    fs.writeFileSync(readmePath, newReadmeContents);
    next();
};

const steps = [];
steps.push(next => {
    let html = [];
    let pieces = {};

    const pat = /^(.+)\.json$/;
    const dir = path.join(__dirname, '../endpoint-docs');
    fs.readdirSync(dir)
        .filter(x => x.match(pat))
        .map(x => {
            return {
                method: x.replace(pat, '$1'),
                path: path.join(dir, x)
            };
        })
        .forEach(x => {
            const data = require(x.path);
            data.forEach(y => {
                const key = `${y.path}|${x.method}`;
                pieces[key] = `* \`[${x.method.toUpperCase()}] /rest/mydb${y.path}\`` + (y.brief ? ` ${y.brief}` : ``);
            });
        });

    Object.keys(pieces).sort().forEach(x => html.push(pieces[x]));

    inject('endpoints', html.join('\n'), false, next);
});
steps.push(next => {
    fs.unlink(resultsPath);
    next();
});
steps.push(next => {
    const readmeLines = fs.readFileSync(readmePath)
        .toString()
        .split('\n');

    while (readmeLines[readmeLines.length - 1] === '') {
        readmeLines.pop();
    }
    readmeLines.push('');

    fs.writeFileSync(readmePath, readmeLines.join('\n'));
    next();
});

const run = () => {
    const step = steps.shift();
    if (step) {
        step(run);
    } else {
        process.exit();
    }
}
run();
