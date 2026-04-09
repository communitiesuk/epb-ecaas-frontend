import replaceAll from "string.prototype.replaceall";

export default function (name: string) {
	const namePattern = replaceAll(replaceAll(name, "(", "\\("), ")", "\\)");
	return new RegExp(String.raw`^${namePattern}( \([0-9]+\))?$`);
}