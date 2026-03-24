export function formatIntoPercentage(num: number) {
	let res = num; 

	if (num <= 1) {
		res = num * 100;
	}
	
	return `${res.toFixed(2)} %`;
}