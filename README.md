# MustCode

Code generator based on Handlebars - with Mustache syntax.

## Running

Install dependencies and compile:

`npm install`
`npm run compile`

Run with Node:

`node bin/src/app.js xml-or-json-file-or-url template-folder output-folder`.

Run with VS Code:

A default run configuration exists at `./vscode/launch.json`. You can modify it as needed to run the generation for a specific language.

## Viewing generated files

The generated output can be found in the `./output` directory.
