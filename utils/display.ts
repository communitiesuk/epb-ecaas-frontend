import { MassDistributionClass } from '../schema/api-schema.types';

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