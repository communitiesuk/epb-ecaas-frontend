import { objectFromEntries } from "ts-extras";
import type { FhsInputSchema } from "./fhsInputMapper";
import { FuelType } from "~/schema/api-schema.types";

export function mapHeatingSystemsData(state: EcaasState): Partial<FhsInputSchema> {
	return {
		...mapEnergySupplyData(state),
	};
}

export function mapEnergySupplyData(state: EcaasState): Pick<FhsInputSchema, 'EnergySupply'> {
	const { fuelType, co2PerKwh, co2PerKwhIncludingOutOfScope, kwhPerKwhDelivered, exported } = state.heatingSystems.energySupply.data;
	
	return {
		EnergySupply: {
			...objectFromEntries(fuelType.map((fuelType) => ([
				fuelType,
				{
					fuel: fuelType as FuelType,
					...(fuelType === FuelType.electricity ? { is_export_capable: exported } : {}),
					...(fuelType === FuelType.custom ? { factor: {
						"Emissions Factor kgCO2e/kWh": co2PerKwh!,
						"Emissions Factor kgCO2e/kWh including out-of-scope emissions": co2PerKwhIncludingOutOfScope!,
						"Primary Energy Factor kWh/kWh delivered": kwhPerKwhDelivered!
					} } : {}),
				}
			])))
		}
	};
}

// TODO need a mapHeatGenerationData function here, though this specifies products in the PCDB, heat pumps initially