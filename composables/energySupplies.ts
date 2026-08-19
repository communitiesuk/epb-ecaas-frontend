import type { SchemaFuelType } from "~/schema/aliases";

export function useEnergySupplies() {
	const store = useEcaasStore();
	const { fuelType } = store.dwellingDetails.generalSpecifications.data; 

	const energySupplies = fuelType !== undefined
		? [...new Set([...fuelType])]
			.map(x => [x, energySupplyOptions[x]] as [SchemaFuelType, string])
			.filter(x => typeof x !== "undefined")
		: [["electricity", energySupplyOptions["electricity"]]] as [SchemaFuelType, string][];

	function getDefaultEnergySupply() {
		if (energySupplies.length === 1) {
			return energySupplies[0]![0];
		}
	}

	return {
		energySupplies,
		getDefaultEnergySupply,
	};
}