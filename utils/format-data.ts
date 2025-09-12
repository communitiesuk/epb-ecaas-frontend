export default formatData;

function formatData(
	value: string | number | boolean | undefined,
	capitaliseFirstLetter: boolean,
) {
	if (value === undefined) {
		return "";
	}

	if (typeof value == "string") {
		const formattedString = value.split(/(?=[A-Z](?=[a-z]))/)
			.map((s, i) => i > 0 ? s.toLowerCase() : s)
			.join(" ");

		if (capitaliseFirstLetter) {
			return formattedString.charAt(0).toUpperCase() + formattedString.slice(1);
		}
		
		return formattedString.toLowerCase();
	}

	return value;
}