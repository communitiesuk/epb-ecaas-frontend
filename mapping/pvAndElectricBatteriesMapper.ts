import type { EmptyObject } from "type-fest";
import type { FhsInputSchema } from "./fhsInputMapper";
import { objectFromEntries } from "ts-extras";
import { FuelType, type SchemaWindowShadingObject } from "~/schema/api-schema.types";

export function mapPvAndElectricBatteriesData(state: EcaasState): Partial<FhsInputSchema> {
	return {
		...mapPvSystemData(state),
		...mapElectricBatteryData(state),
		...mapPvDiverterData(state),
	};
}

export function mapPvSystemData(state: EcaasState): Pick<FhsInputSchema, 'OnSiteGeneration'> {
	return {
		OnSiteGeneration: objectFromEntries(state.pvAndBatteries.pvSystem.data.map((system) => {
			const { name, elevationalHeight, lengthOfPV, widthOfPV, inverterIsInside, inverterPeakPowerAC, inverterPeakPowerDC, inverterType, orientation, peakPower, pitch, ventilationStrategy } = system;

			return [
				name,
				{
					EnergySupply: FuelType.electricity,
					base_height: elevationalHeight,
					height: lengthOfPV,
					width: widthOfPV,
					inverter_is_inside: inverterIsInside,
					inverter_peak_power_ac: inverterPeakPowerAC,
					inverter_peak_power_dc: inverterPeakPowerDC,
					inverter_type: inverterType,
					orientation360: orientation,
					peak_power: peakPower,
					pitch,
					shading: [] as SchemaWindowShadingObject[], // not included yet
					type: "PhotovoltaicSystem",
					ventilation_strategy: ventilationStrategy,
				}
			] as const;
		})),
	};
}

export function mapElectricBatteryData(_state: EcaasState): Partial<FhsInputSchema> {
	return {};
}

/* Function unused yet while no diverter data to map. **/
export function mapPvDiverterData(_state: EcaasState): EmptyObject {
	return {};
}
