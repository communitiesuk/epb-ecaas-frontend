import type { StandardPitchOption } from "~/stores/ecaasStore.types";

export function pitchOptions(): Record<StandardPitchOption, Capitalize<StandardPitchOption>> {
	return {
		'90': '90',
		custom: 'Custom'
	};
}