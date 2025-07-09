export type StandardPitchOption = '90' | 'custom';
export type StandardPitchOptionLabel = '90°' | 'Custom';

export function standardPitchOptions(): Record<StandardPitchOption, StandardPitchOptionLabel> {
	return {
		'90': '90°',
		custom: 'Custom'
	};
}

export type ZeroPitchOption = '0' | 'custom';
export type ZeroPitchOptionLabel = '0°' | 'Custom';

export function zeroPitchOptions(): Record<ZeroPitchOption, ZeroPitchOptionLabel> {
	return {
		'0': '0°',
		custom: 'Custom'
	};
}