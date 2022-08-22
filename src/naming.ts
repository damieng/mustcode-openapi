export function htmlEncodeMin(text: string | undefined): string | undefined {
    return text
        ?.trim()
        ?.replace(/<[/]?code>/g, '`')
        ?.replace(/</g, '&lt;')
        ?.replace(/>/g, '&gt;');
}

export function makeName(endpoint: string): string {
    return endpoint?.replace(/[// -]/g, "");
}

export function makeSingular(text: string): string {
    return text?.endsWith('s') ? text.substring(0, text.length - 1) : text;
}

export function split(text: string): string[] {
    return text?.split(/[ -/?_]/g);
}

const defaultRemoveWords = new Set(['a', 'an', 'the', 'post', '?']);

export function clean(words: string[] | string, removeWords: Set<string> = defaultRemoveWords): string[] {
    words = typeof (words) === 'string' ? split(words) : words;
    return words.filter(word => !removeWords.has(word));
}

export function pascalCase(words: string[]): string[] {
    return words.map(capitalizeWord);
}

export function camelCase(text: string[]): string[] {
    return text.map((w, i) => i == 0 ? w.toLowerCase() : capitalizeWord(w));
}

export function capitalizeWord(word: string): string {
    if (!word) return word;
    return word.substr(0, 1).toUpperCase() + word.substring(1);
}

export function makePascalCase(text: string, join: string = ''): string {
    return pascalCase(clean(split(text))).join(join);
}

export function makeSnakeCase(text: string, join: string = ''): string {
    return clean(split(text).map(t => t.toLowerCase())).join(join);
}

export function makeCamelCase(text: string, join: string = ''): string {
    return camelCase(clean(split(text))).join(join);
}

export function replaceEndWith(text: string, end: string, replacement: string): string {
    if (!text.endsWith(end)) return text;
    return text.substring(0, text.length - end.length) + replacement;
}

export function makeGenericType(getTypeName: (type: string) => string, types: string[] | string, optional: string | undefined = undefined): string {
    types = typeof (types) === 'string' ? [types] : types;
    if (optional) types.push(optional);

    let output = '';
    let nextType = types.shift();
    while (nextType) {
        const nextTypeName = getTypeName(nextType);
        output += output.length > 0 ? '<' + nextTypeName + '>' : nextTypeName;
        nextType = types.shift();
    }

    return output;
}
