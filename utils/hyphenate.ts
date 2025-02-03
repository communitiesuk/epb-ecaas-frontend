function hyphenate(value: string | undefined) {
	if (value === undefined) {
		return '';
	}

	if (typeof value == 'string') {
		const formattedString = value.trim().replaceAll(" ","-");

		return (
			formattedString.toLowerCase()
		);
	}

}

export default hyphenate;

