export function obfuscateEmail(email: string): string {
	const [username, domain] = email.split("@");

	if (!username || !domain) {
		return email;
	}

	const firstTwoCharacters = username.slice(0, 2);
	const remainingCharacters = "*".repeat(Math.max(0, username.length - 2));

	return `${firstTwoCharacters}${remainingCharacters}@${domain}`;
}