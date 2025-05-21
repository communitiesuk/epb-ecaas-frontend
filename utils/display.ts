import { FlueGasExhaustSituation, MassDistributionClass } from '../schema/api-schema.types';

export function displayBoolean(value: boolean | undefined): BooleanDisplay | undefined {
	if (typeof value === 'undefined') {
		return undefined;
	}
  
	return value ? 'Yes' : 'No';
}

type BooleanDisplay = 'Yes' | 'No';

export function displayMassDistributionClass(value: MassDistributionClass | undefined): MassDistributionClassDisplay | undefined {
	switch (value) {
		case MassDistributionClass.I:
			return 'Internal';
		case MassDistributionClass.E:
			return 'External';
		case MassDistributionClass.IE:
			return 'Divided';
		case MassDistributionClass.D:
			return 'Equally';
		case MassDistributionClass.M:
			return 'Inside';
		default:
			return undefined;
	}
}

type MassDistributionClassDisplay = 'Internal' | 'External' | 'Divided' | 'Equally' | 'Inside';

export function sentenceCase(value: string): string {
	const replaced = value.replaceAll(/_/g, ' ');
	return replaced.charAt(0).toUpperCase() + replaced.slice(1).toLowerCase();
}

export type FlueGasExhaustSituationDisplay = 'Into separate duct' | 'Into room' | 'Into mechanical vent';

export function displayFlueGasExhaustSituation(value: FlueGasExhaustSituation): FlueGasExhaustSituationDisplay {
	switch (value) {
		case FlueGasExhaustSituation.into_separate_duct:
			return 'Into separate duct';
		case FlueGasExhaustSituation.into_room:
			return 'Into room';
		case FlueGasExhaustSituation.into_mech_vent:
			return 'Into mechanical vent';
		default:
			value satisfies never;
			throw new Error(`Missed a flue gas exhaust situation case: ${value}`);
	}
}
