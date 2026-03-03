export function getUpdatedOrientation(currentOrientation: number, difference: number) {

	const current = currentOrientation === 360 ? 0 : currentOrientation;

	const newOrienation = current + difference;
  
	if (newOrienation > 360) {
		return Math.abs(360 - newOrienation);
	}  
	if (newOrienation < 0) {
		return 360 + newOrienation;
	}
	return newOrienation;
}