import { FuelType } from "~/schema/api-schema.types";
import { mapEnergySupplyData } from "./heatingSystemsMapper";
import type { FhsInputSchema } from "./fhsInputMapper";

describe("heating systems mapper", () => {
	it("maps energy supplies that include gas only", () => {
		// Arrange
		const state = {
			heatingSystems: {
				energySupply: {
					data: {
						fuelType: [FuelType.mains_gas],
					},
					complete: true
				}
			}
		} as EcaasState;

		// Act
		const result = mapEnergySupplyData(state);

		// Assert
		const expectedResult: Pick<FhsInputSchema, 'EnergySupply'> = {
			EnergySupply: {
				mains_gas: {
					fuel: FuelType.mains_gas,
				}
			},
		};

		expect(result).toEqual(expectedResult);
	});

	it("maps energy supplies that include exported electricity", () => {
		// Arrange
		const state = {
			heatingSystems: {
				energySupply: {
					data: {
						fuelType: [FuelType.mains_gas, FuelType.electricity],
						exported: true
					},
					complete: true
				}
			}
		} as EcaasState;

		// Act
		const result = mapEnergySupplyData(state);

		// Assert
		const expectedResult: Pick<FhsInputSchema, 'EnergySupply'> = {
			EnergySupply: {
				mains_gas: {
					fuel: FuelType.mains_gas,
				},
				electricity: {
					fuel: FuelType.electricity,
					is_export_capable: true
				}
			},
		};

		expect(result).toEqual(expectedResult); 
	});

	it("maps energy supplies that include electricity and custom fuel types", () => {
		// Arrange
		const state = {
			heatingSystems: {
				energySupply: {
					data: {
						fuelType: [FuelType.electricity, FuelType.custom, FuelType.mains_gas],
						exported: true,
						co2PerKwh: 3.2,
						co2PerKwhIncludingOutOfScope: 4.8,
						kwhPerKwhDelivered: 1.0,
					},
					complete: true
				}
			}
		} as EcaasState;

		// Act
		const result = mapEnergySupplyData(state);

		// Assert
		const expectedResult: Pick<FhsInputSchema, 'EnergySupply'> = {
			EnergySupply: {
				electricity: {
					fuel: FuelType.electricity,
					is_export_capable: true
				},
				custom: {
					fuel: FuelType.custom,
					factor: {
						"Emissions Factor kgCO2e/kWh": 3.2,
						"Emissions Factor kgCO2e/kWh including out-of-scope emissions": 4.8,
						"Primary Energy Factor kWh/kWh delivered": 1.0,
					}
				},
				mains_gas: {
					fuel: FuelType.mains_gas,
				}
			},
		};

		expect(result).toEqual(expectedResult);
	});
});