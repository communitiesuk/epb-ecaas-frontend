function formatData(value: string | number | boolean | undefined) {
	if (value === undefined) {
		return '';
	}

	if (typeof value == 'string') {
		const formattedString = value.split(/(?=[A-Z])/).join(" ");

		return (
			formattedString.charAt(0).toUpperCase() +
			formattedString.slice(1).toLowerCase()
		);
	}

	return value;
}

export default formatData