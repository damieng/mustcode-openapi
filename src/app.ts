import { readdir, readFile, writeFile } from "fs/promises"
import fetch, { Headers, Request, Response } from "node-fetch"
import { exit } from "process"
import Handlebars from "handlebars"
import path from "path"
import * as naming from "./naming"
import xml2js from "xml2js"

run(process.argv)

async function run(args: string[]) {
    if (args.length != 5) {
        console.warn(`Usage: mustcode model-file-or-url templates-folder output-folder`)
        return 0
    }

    const [modelFileNameOrUrl, templateFolder, outFolder] = args.slice(2)

    console.log(`Generating ${templateFolder} to ${outFolder} from ${modelFileNameOrUrl}\n`)

    const model = await getModel(modelFileNameOrUrl)

    registerHelpers();

    const templateFileNames = await readdir(templateFolder, {})
    for (const templateFileName of templateFileNames) {
        processTemplate(templateFileName, model, templateFolder, outFolder)
    }
}

function registerHelpers() {
    Handlebars.registerHelper('PascalCase', (str) => naming.makePascalCase(str));
    Handlebars.registerHelper('CamelCase', (str) => naming.makeCamelCase(str));
    Handlebars.registerHelper('SnakeCase', (str) => naming.makeSnakeCase(str));
    Handlebars.registerHelper('MakeName', (str) => naming.makeName(str));
    Handlebars.registerHelper('HtmlEncode', (str) => naming.htmlEncodeMin(str));
}

async function processTemplate(templateFileName: string, model: object, templateFolder: string, outFolder: string) {
    const inFileName = path.join(templateFolder, templateFileName)
    console.log(` < Processing template ${inFileName}`)
    const templateFileContents = await readFile(inFileName, 'utf-8')

    const compiled = Handlebars.compile(templateFileContents)
    const output = compiled(model);

    const outFileName = path.join(outFolder, templateFileName)
    console.log(` > Writing output ${templateFileName}`)
    await writeFile(outFileName, output, 'utf-8');
}

async function getModel(url: string): Promise<object> {
    const isHttp = url.startsWith("http:") || url.startsWith("https:")
    const parser = isHttp ? parseHttp : parseFile
    return await parser(url)
}

async function parseHttp(modelFileNameOrUrl: string) {
    const response: Response = await downloadModel(modelFileNameOrUrl)
    const contentType = response.headers.get("Content-Type")?.split(";")[0]
    switch (contentType) {
        case "application/json": return await response.json()
        case "application/xml": return await xml2js.parseStringPromise(await response.text())
        default: throw new Error(`Can not parse Content-Type ${contentType}`)
    }
}

async function parseFile(modelFileNameOrUrl: string) {
    const contents = await readFile(modelFileNameOrUrl, 'utf-8')
    const fileExtension = path.extname(modelFileNameOrUrl)
    switch (fileExtension) {
        case ".json": return JSON.parse(contents)
        case ".xml": return await xml2js.parseStringPromise(contents)
        default: throw new Error(`Can not parse file extension ${fileExtension}`)
    }
}

async function downloadModel(url: string): Promise<Response> {
    const request = new Request(url, {
        headers: new Headers({ 'Accept': 'application/json, application/xml' })
    })
    const response = await fetch(request)
    if (!response.ok)
        error(`Error: Status Code ${response.status} trying to download ${url}`)
    return response
}

function error(text: string): void {
    console.error(text)
    exit(1)
}