export default function (name: string) {
	const namePattern = name.replaceAll("(", "\\(").replaceAll(")", "\\)");
	return new RegExp(String.raw`^${namePattern}( \([0-9]+\))?$`);
}