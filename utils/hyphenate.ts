import replaceAll from "string.prototype.replaceall";

function hyphenate(value: string | undefined) {
	if (value === undefined) {
		return "";
	}
	const formattedString = replaceAll(value.trim(), " ","-");

	return formattedString.toLowerCase();
}

export default hyphenate;

