import type { SchemaFuelType } from "~/schema/aliases";

export function useEnergySupplies() {
	const store = useEcaasStore();
	const { fuelType } = store.dwellingDetails.generalSpecifications.data; 

	const energySupplies = fuelType !== undefined ?
		[...new Set([...fuelType, "elecOnly" as keyof typeof energySupplyOptions])].map(x => {

			if (x === "elecOnly") {
				return ["electricity", energySupplyOptions[x]] as [SchemaFuelType, string];
			}
			return [x, energySupplyOptions[x]] as [SchemaFuelType, string];
		
		}).filter(x => typeof x !== "undefined") : [];

	return energySupplies;
}