export const kebabToCamelCase = (text: string) => {
	return text.replace(/-([a-z])/g, function (g) {
		return g[1]!.toUpperCase(); 
	});
};

export const sentenceToLowerCase = (text: string) => {
	return text.replace(/([A-Z](?=[a-z]))/, s => s.toLowerCase());
};