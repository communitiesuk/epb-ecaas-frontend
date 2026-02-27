import type { SchemaHeatSourceWetDetails } from "~/schema/aliases";

export const immersionHeaterPositionValues: Record<ImmersionHeaterPosition, number> = {
	top: 1.0,
	middle: 0.5,
	bottom: 0,
};

export const defaultZoneName: string = "dwellingspace";
export const defaultElectricityEnergySupplyName = "mains elec";
export const minOutdoorTemp = 0;
export const maxOutdoorTemp = 15;
export const defaultConvectiveType = "Air heating (convectors, fan coils etc.)"; // we don't ask for this in the UI yet so defaulting

export const defaultHeatSourceWetDetails = {
	type: "HeatPump",
	EnergySupply: defaultElectricityEnergySupplyName,
	backup_ctrl_type: "None",
	min_temp_diff_flow_return_for_hp_to_operate: 0,
	min_modulation_rate_35: 0.35,
	min_modulation_rate_55: 0.4,
	modulating_control: true,
	power_crankcase_heater: 0.01,
	power_heating_circ_pump: 0.015,
	power_off: 0.015,
	power_source_circ_pump: 0.010,
	power_standby: 0.015,
	power_max_backup: 0.1,
	sink_type: "Water",
	source_type: "OutsideAir",
	temp_lower_operating_limit: -5,
	temp_return_feed_max: 70,
	time_constant_onoff_operation: 2, // 2 hours as initial guess
	test_data_EN14825: [
		{
			test_letter: "A",
			capacity: 8.4,
			cop: 4.6,
			design_flow_temp: 35,
			temp_outlet: 34,
			temp_source: 0,
			temp_test: -7,
		},
		{
			test_letter: "B",
			capacity: 8.3,
			cop: 4.9,
			design_flow_temp: 35,
			temp_outlet: 30,
			temp_source: 0,
			temp_test: 2,
		},
		{
			test_letter: "C",
			capacity: 8.3,
			cop: 5.1,
			design_flow_temp: 35,
			temp_outlet: 27,
			temp_source: 0,
			temp_test: 7,
		},
		{
			test_letter: "D",
			capacity: 8.2,
			cop: 5.4,
			design_flow_temp: 35,
			temp_outlet: 24,
			temp_source: 0,
			temp_test: 12,
		},
		{
			test_letter: "F",
			capacity: 8.4,
			cop: 4.6,
			design_flow_temp: 35,
			temp_outlet: 34,
			temp_source: 0,
			temp_test: -7,
		},
	],
	var_flow_temp_ctrl_during_test: true,
} as const satisfies SchemaHeatSourceWetDetails;