import type { SchemaFuelType } from "~/schema/aliases";

export function useEnergySupplies(allowedFuelTypes?: SchemaFuelType[]) {
	const store = useEcaasStore();
	const { fuelType } = store.dwellingDetails.generalSpecifications.data;

	let energySupplies = fuelType !== undefined
		? [...new Set([...fuelType])]
			.map(x => [x, energySupplyOptions[x]] as [SchemaFuelType, string])
			.filter(([fuel]) =>
				allowedFuelTypes === undefined || allowedFuelTypes.includes(fuel),
			)
		: [["electricity", energySupplyOptions["electricity"]]] as [SchemaFuelType, string][];

	if (allowedFuelTypes && !allowedFuelTypes.includes("electricity")) {
		energySupplies = energySupplies.filter(x => x[0] !== "electricity");
	}

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