export const kebabToCamelCase = (text: string) => {
	return text.replace(/-([a-z])/g, function (g) { return g[1]!.toUpperCase(); });
};