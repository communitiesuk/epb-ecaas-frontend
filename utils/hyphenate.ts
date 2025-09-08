function hyphenate(value: string | undefined) {
	if (value === undefined) {
		return "";
	}
	const formattedString = value.trim().replaceAll(" ","-");

	return formattedString.toLowerCase();
}

export default hyphenate;

