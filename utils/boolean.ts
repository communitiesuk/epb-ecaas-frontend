export function displayBoolean(value: boolean | undefined): BooleanDisplay | undefined {
	if (typeof value === 'undefined') {
		return undefined;
	}
  
	return value ? 'Yes' : 'No';
}

type BooleanDisplay = 'Yes' | 'No';