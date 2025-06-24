import { ApplianceKey, FlueGasExhaustSituation, MassDistributionClass, WwhrsType } from '../schema/api-schema.types';

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
	const replaced = value.replaceAll(/_/g, ' ').trim();
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

export type ApplianceKeyDisplay = 'Fridge' | 'Freezer' | 'Fridge freezer' | 'Dishwasher' | 'Oven' | 'Washing machine' | 'Tumble dryer' | 'Hobs' | 'Kettle' | 'Microwave' | 'Lighting' | 'Other';

export function displayApplianceKey(value: ApplianceKey): ApplianceKeyDisplay {
	switch (value) {
		case ApplianceKey.Fridge:
			return 'Fridge';
		case ApplianceKey.Freezer:
			return 'Freezer';
		case ApplianceKey.Fridge_Freezer:
			return 'Fridge freezer';
		case ApplianceKey.Dishwasher:
			return 'Dishwasher';
		case ApplianceKey.Oven:
			return 'Oven';
		case ApplianceKey.Clothes_washing:
			return 'Washing machine';
		case ApplianceKey.Clothes_drying:
			return 'Tumble dryer';
		case ApplianceKey.Hobs:
			return 'Hobs';
		case ApplianceKey.Kettle:
			return 'Kettle';
		case ApplianceKey.Microwave:
			return 'Microwave';
		case ApplianceKey.lighting:
			return 'Lighting';
		case ApplianceKey.Otherdevices:
			return 'Other';
		default:
			value satisfies never;
			throw new Error(`Missed a appliance key case: ${value}`);
	}
}

export function displaySnakeToSentenceCase(value: string): string {
	const replaced = value.replaceAll(/_/g, ' ');
	return replaced.charAt(0).toUpperCase() + replaced.slice(1).toLowerCase();
}

export function displayWwhrsType(value: WwhrsType): WwhrsTypeDisplay {
	switch (value) {
		case WwhrsType.WWHRS_InstantaneousSystemA:
			return 'A';
		case WwhrsType.WWHRS_InstantaneousSystemB:
			return 'B';
		case WwhrsType.WWHRS_InstantaneousSystemC:
			return 'C';
		default:
			value satisfies never;
			throw new Error(`Missed a Wwhrs type case: ${value}`);
	}
}

export type WwhrsTypeDisplay = 'A' | 'B' | 'C';

export const applianceDisplays = {
	[ApplianceKey.Clothes_drying]: "Clothes drying",
	[ApplianceKey.Clothes_washing]: "Clothes washing",
	[ApplianceKey.Dishwasher]: "Dishwasher",
	[ApplianceKey.Freezer]: "Freezer",
	[ApplianceKey.Fridge]: "Fridge",
	[ApplianceKey.Fridge_Freezer]: "Fridge freezer",
	[ApplianceKey.Hobs]: "Hobs",
	[ApplianceKey.Kettle]: "Kettle",
	[ApplianceKey.Microwave]: "Microwave",
	[ApplianceKey.Otherdevices]: "Other devices",
	[ApplianceKey.Oven]: "Oven",
	[ApplianceKey.lighting]: "Lighting"
} as const;

type ApplianceDisplay = typeof applianceDisplays[ApplianceKey];

export function displayDeliveryEnergyUseKey<T extends string>(key: T): T extends ApplianceKey ? ApplianceDisplay : string {
	return (Object.values(ApplianceKey).includes(key as ApplianceKey)) ? applianceDisplays[key as ApplianceKey] : key;
}