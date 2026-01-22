export const kebabToCamelCase = (text: string) => {
	return text.replace(/-([a-z])/g, function (g) {
		return g[1]!.toUpperCase(); 
	});
};

export const sentenceToLowerCase = (text: string) => {
	return text.replace(/([A-Z](?=[a-z]))/, s => s.toLowerCase());
};

export function camelToKebabCase(value: string): string {
	return value.replace(/((?<=[a-z])[A-Z])/g, "-$1").toLowerCase();
};

export const pluralize = (noun: string, suffix: string = "s") => (plural: boolean) => {
	if (suffix === "ies") {
		return `${noun.slice(0, noun.length - 2)}${suffix}`;
	}

	return plural ? `${noun}${suffix}` : noun;
};