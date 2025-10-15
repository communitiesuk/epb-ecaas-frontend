import type { ValidateFunction } from "ajv/dist/2020";
import { ajv } from "../schema/validator";
import { mapFhsInputData } from "./fhsInputMapper";
import type { FhsInputSchema } from "./fhsInputMapper";
import { resolveState } from "~/stores/resolve";
import { defaultControlName, defaultElectricityEnergySupplyName, defaultZoneName } from "~/mapping/common";
import { centimetre } from "../utils/units/length";
import { unitValue } from "~/utils/units";
import type { SchemaSimulationTime } from "~/schema/aliases";

const baseForm = {
	data: [],
	complete: true as const,
};

const expectedHouseInput: FhsInputSchema = {
	ColdWaterSource: {
		"mains water": {
			start_day: 0,
			temperatures: [3, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7],
			time_series_step: 1,
		},
	},
	Control: {},
	EnergySupply: {
		["mains elec"]: {
			fuel: "electricity",
			is_export_capable: true,
		},
	},
	Events: {},
	ExternalConditions: {
		shading_segments: [
			{ start360: 0, end360: 10 },
			{ start360: 10, end360: 20 },
			{ start360: 20, end360: 30 },
			{ start360: 30, end360: 40 },
			{ start360: 40, end360: 50 },
			{ start360: 50, end360: 60 },
			{
				start360: 60, end360: 70, shading: [
					{
						distance: 1,
						height: 2,
						type: "obstacle",
					},
				],
			},
			{
				start360: 70, end360: 80, shading: [
					{
						distance: 1,
						height: 2,
						type: "obstacle",
					},
				],
			},
			{
				start360: 80, end360: 90, shading: [
					{
						distance: 1,
						height: 2,
						type: "obstacle",
					},
				],
			},
			{ start360: 90, end360: 100 },
			{ start360: 100, end360: 110 },
			{ start360: 110, end360: 120 },
			{ start360: 120, end360: 130 },
			{ start360: 130, end360: 140 },
			{ start360: 140, end360: 150 },
			{ start360: 150, end360: 160 },
			{ start360: 160, end360: 170 },
			{ start360: 170, end360: 180 },
			{ start360: 180, end360: 190 },
			{ start360: 190, end360: 200 },
			{ start360: 200, end360: 210 },
			{ start360: 210, end360: 220 },
			{ start360: 220, end360: 230 },
			{ start360: 230, end360: 240 },
			{ start360: 240, end360: 250 },
			{ start360: 250, end360: 260 },
			{ start360: 260, end360: 270 },
			{ start360: 270, end360: 280 },
			{ start360: 280, end360: 290 },
			{ start360: 290, end360: 300 },
			{ start360: 300, end360: 310 },
			{ start360: 310, end360: 320 },
			{ start360: 320, end360: 330 },
			{ start360: 330, end360: 340 },
			{ start360: 340, end360: 350 },
			{ start360: 350, end360: 360 },
		],
	},
	General: {
		build_type: "house",
		storeys_in_building: 2,
	},
	HeatingControlType: "SeparateTempControl",
	HotWaterDemand: {
		Shower: {
			"some-mixer-shower-name": {
				ColdWaterSource: "mains water",
				flowrate: 14,
				type: "MixerShower",
			},
		},
		Bath: {},
		Other: {},
	},
	HotWaterSource: {
		"hw cylinder": {
			ColdWaterSource: "mains water",
			HeatSource: {
				["some-heat-pump-name"]: {
					name: "some-heat-pump-name",
					EnergySupply: "mains elec",
					heater_position: 0.1,
					type: "HeatSourceWet",
					temp_flow_limit_upper: 65,
					thermostat_position: 0.33,
					Controlmin: "min",
					Controlmax: "max",
				},
			},
			daily_losses: 34,
			volume: 200,
			type: "StorageTank",
			init_temp: 20.0,
		},
	},
	InfiltrationVentilation: {
		CombustionAppliances: {},
		Leaks: {
			ventilation_zone_height: 8,
			env_area: 320,
			test_pressure: "Standard",
			test_result: 4,
		},
		MechanicalVentilation: {
			"kitchen exhaust fan": {
				EnergySupply: "mains elec",
				design_outdoor_air_flow_rate: 55,
				sup_air_flw_ctrl: "ODA",
				sup_air_temp_ctrl: "CONST",
				vent_type: "Intermittent MEV",
				SFP: 1.5,
				position_exhaust: {},
			},
		},
		Vents: {
			"only vent": {
				area_cm2: 75,
				mid_height_air_flow_path: 1.9,
				orientation360: 90,
				pitch: 180,
			},
		},
		ach_max_static_calcs: 2,
		altitude: 100,
		cross_vent_possible: false,
		noise_nuisance: false,
		shield_class: "Shielded",
		terrain_class: "Suburban",
		ventilation_zone_base_height: 3,
	},
	NumberOfBedrooms: 7,
	OnSiteGeneration: {},
	PartGcompliance: true,
	PartO_active_cooling_required: false,
	SimulationTime: {
		start: 0,
		end: 8,
		step: 1,
	},
	// SpaceCoolSystem: {
	// 	"some-aircon-unit-name": {
	// 		type: "AirConditioning",
	// 		EnergySupply: "mains elec",
	// 		cooling_capacity: 60,
	// 		efficiency: 4,
	// 		frac_convective: 0.2
	// 	}
	// },
	SpaceHeatSystem: {
		"some-wet-distribution": {
			type: "WetDistribution",
			HeatSource: {
				name: "some-heat-pump-name",
				temp_flow_limit_upper: 65,
			},
			Zone: defaultZoneName,
			design_flow_temp: 12,
			design_flow_rate: 4,
			ecodesign_controller: {
				ecodesign_control_class: 8,
				max_outdoor_temp: 34,
				min_flow_temp: 21,
				min_outdoor_temp: 20,
			},
			emitters: [
				{
					c: 9,
					frac_convective: 4,
					n: 3,
					wet_emitter_type: "radiator",
				},
				{
					c: 9,
					frac_convective: 4,
					n: 3,
					wet_emitter_type: "radiator",
				},
			],
			temp_diff_emit_dsgn: 31,
			thermal_mass: 0.14,
			Control: defaultControlName,
			variable_flow: false,
			pipework: [],
		},
	},
	GroundFloorArea: 40,
	HeatSourceWet: {
		"some-heat-pump-name": {
			EnergySupply: defaultElectricityEnergySupplyName,
			type: "HeatPump",
			product_reference: "HEATPUMP-LARGE",
		},
	},
	Zone: {
		[defaultZoneName]: {
			BuildingElement: {
				"ground-floor (floor)": {
					type: "BuildingElementGround",
					area: 40,
					total_area: 40,
					u_value: 1,
					thermal_resistance_floor_construction: 1,
					areal_heat_capacity: "Very light",
					mass_distribution_class: "I",
					perimeter: 100,
					psi_wall_floor_junc: 1,
					thickness_walls: 0.08,
					floor_type: "Slab_no_edge_insulation",
					pitch: 0,
				},
			},
			Lighting: {
				efficacy: 56.0,
				bulbs: {
					led: {
						count: 6,
						power: 6,
						efficacy: 120,
					},
				},
			},
			SpaceHeatSystem: ["some-wet-distribution"],
			ThermalBridging: {},
			volume: 300,
		},
	},
	temp_internal_air_static_calcs: 20.0, // dummy value - this goes away in later schemas
};

const expectedFlatInput: FhsInputSchema = {
	ColdWaterSource: {
		"mains water": {
			start_day: 0,
			temperatures: [3, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7],
			time_series_step: 1,
		},
	},
	Control: {},
	EnergySupply: {
		["mains elec"]: {
			fuel: "electricity",
			is_export_capable: false,
			ElectricBattery: {
				capacity: 12,
				charge_discharge_efficiency_round_trip: 1,
				battery_location: "inside",
				grid_charging_possible: true,
				maximum_charge_rate_one_way_trip: 90,
				minimum_charge_rate_one_way_trip: 80,
				maximum_discharge_rate_one_way_trip: 20,
			},
			"tariff": "Variable Time of Day Tariff",
			"threshold_charges": [
				0.8,
				0.8,
				0.7,
				0.4,
				0,
				0,
				0,
				0.2,
				0.5,
				0.7,
				0.8,
				0.8,
			],
			"threshold_prices": [
				20,
				20,
				20,
				20,
				20,
				20,
				20,
				20,
				20,
				20,
				20,
				20,
			],
		},
	},
	Events: {},
	ExternalConditions: {
		shading_segments: [
			{
				start360: 0, end360: 10, shading: [
					{
						distance: 0.5,
						height: 1,
						type: "obstacle",
					},
				],
			},
			{
				start360: 10, end360: 20, shading: [
					{
						distance: 2,
						height: 5,
						type: "overhang",
					},
					{
						distance: 0.5,
						height: 1,
						type: "obstacle",
					},
				],
			},
			{
				start360: 20, end360: 30, shading: [
					{
						distance: 2,
						height: 5,
						type: "overhang",
					},
				],
			},
			{
				start360: 30, end360: 40, shading: [
					{
						distance: 2,
						height: 5,
						type: "overhang",
					},
				],
			},
			{ start360: 40, end360: 50 },
			{ start360: 50, end360: 60 },
			{ start360: 60, end360: 70 },
			{ start360: 70, end360: 80 },
			{ start360: 80, end360: 90 },
			{ start360: 90, end360: 100 },
			{ start360: 100, end360: 110 },
			{ start360: 110, end360: 120 },
			{ start360: 120, end360: 130 },
			{ start360: 130, end360: 140 },
			{ start360: 140, end360: 150 },
			{ start360: 150, end360: 160 },
			{ start360: 160, end360: 170 },
			{ start360: 170, end360: 180 },
			{ start360: 180, end360: 190 },
			{ start360: 190, end360: 200 },
			{ start360: 200, end360: 210 },
			{ start360: 210, end360: 220 },
			{ start360: 220, end360: 230 },
			{ start360: 230, end360: 240 },
			{ start360: 240, end360: 250 },
			{ start360: 250, end360: 260 },
			{ start360: 260, end360: 270 },
			{ start360: 270, end360: 280 },
			{ start360: 280, end360: 290 },
			{ start360: 290, end360: 300 },
			{ start360: 300, end360: 310 },
			{ start360: 310, end360: 320 },
			{ start360: 320, end360: 330 },
			{ start360: 330, end360: 340 },
			{ start360: 340, end360: 350 },
			{ start360: 350, end360: 360 },
		],
	},
	General: {
		build_type: "flat",
		storeys_in_building: 6,
		storey_of_dwelling: 3,
	},
	HeatingControlType: "SeparateTempControl",
	HotWaterDemand: {
		Shower: {
			"mixer shower 1 name": {
				ColdWaterSource: "mains water",
				flowrate: 19,
				type: "MixerShower",
			},
			"mixer shower 2 name": {
				ColdWaterSource: "mains water",
				flowrate: 28,
				type: "MixerShower",
			},
			"electric shower 1 name": {
				ColdWaterSource: "mains water",
				rated_power: 20,
				EnergySupply: "mains elec",
				type: "InstantElecShower",
			},
		},
		Bath: {
			"small bath name": {
				ColdWaterSource: "mains water",
				size: 80,
			},
			"medium bath name": {
				ColdWaterSource: "mains water",
				size: 180,
			},
			"large bath name": {
				ColdWaterSource: "mains water",
				size: 400,
			},
		},
		Other: {
			"kitchen sink name": {
				ColdWaterSource: "mains water",
				flowrate: 7.4,
			},
			"bathroom basin name": {
				ColdWaterSource: "mains water",
				flowrate: 6.4,
			},
			"cloakroom basin name": {
				ColdWaterSource: "mains water",
				flowrate: 6.4,
			},
		},
	},
	HotWaterSource: {
		"hw cylinder": {
			ColdWaterSource: "mains water",
			HeatSource: {
				["heat pump 1 name"]: {
					name: "heat pump 1 name",
					EnergySupply: "mains elec",
					heater_position: 0.1,
					type: "HeatSourceWet",
					temp_flow_limit_upper: 65,
					thermostat_position: 0.33,
					Controlmin: "min",
					Controlmax: "max",
				},
			},
			daily_losses: 10,
			volume: 80,
			type: "StorageTank",
			primary_pipework: [{
				internal_diameter_mm: 15,
				external_diameter_mm: 22,
				length: 5,
				insulation_thickness_mm: 13,
				insulation_thermal_conductivity: 0.035,
				surface_reflectivity: true,
				pipe_contents: "water",
				location: "internal",
			},
			{
				internal_diameter_mm: 28,
				external_diameter_mm: 28,
				length: 32,
				insulation_thickness_mm: 13,
				insulation_thermal_conductivity: 0.040,
				surface_reflectivity: false,
				pipe_contents: "glycol25",
				location: "external",
			}],
			init_temp: 20.0,
		},
	},
	InfiltrationVentilation: {
		CombustionAppliances: {},
		Leaks: {
			ventilation_zone_height: 1,
			env_area: 5,
			test_pressure: "Pulse test only",
			test_result: 10,
		},
		MechanicalVentilation: {
			"mvhr vent 1 name": {
				EnergySupply: "mains elec",
				design_outdoor_air_flow_rate: 17,
				sup_air_flw_ctrl: "ODA",
				sup_air_temp_ctrl: "CONST",
				vent_type: "MVHR",
				measured_air_flow_rate: 37,
				measured_fan_power: 12.26,
				mvhr_eff: 1,
				mvhr_location: "inside",
				ductwork: [{
					cross_section_shape: "circular",
					duct_type: "supply",
					internal_diameter_mm: 50,
					external_diameter_mm: 55,
					insulation_thermal_conductivity: 1,
					insulation_thickness_mm: 5,
					length: 4,
					reflective: true,
				}],
				position_exhaust: {},
				position_intake: {},
			},
			"mvhr vent 2 name": {
				EnergySupply: "mains elec",
				design_outdoor_air_flow_rate: 3,
				sup_air_flw_ctrl: "ODA",
				sup_air_temp_ctrl: "CONST",
				vent_type: "MVHR",
				measured_air_flow_rate: 37,
				measured_fan_power: 12.26,
				mvhr_eff: 0,
				mvhr_location: "outside",
				ductwork: [],
				position_exhaust: {},
				position_intake: {},
			},
			"centralised MEV name": {
				EnergySupply: "mains elec",
				design_outdoor_air_flow_rate: 8,
				sup_air_flw_ctrl: "ODA",
				sup_air_temp_ctrl: "CONST",
				vent_type: "Centralised continuous MEV",
				measured_air_flow_rate: 37,
				measured_fan_power: 12.26,
				position_exhaust: {},
			},
		},
		Vents: {
			"only vent": {
				area_cm2: 75,
				mid_height_air_flow_path: 1.9,
				orientation360: 90,
				pitch: 180,
			},
		},
		ach_max_static_calcs: 2,
		altitude: 30,
		cross_vent_possible: true,
		noise_nuisance: true,
		shield_class: "Normal",
		terrain_class: "OpenField",
		ventilation_zone_base_height: 1,
	},
	NumberOfBedrooms: 2,
	OnSiteGeneration: {
		"pv system 1": {
			EnergySupply: "mains elec",
			peak_power: 2,
			ventilation_strategy: "moderately_ventilated",
			pitch: 15,
			orientation360: 90,
			base_height: 1,
			height: 0.4,
			width: 0.5,
			inverter_peak_power_ac: 3,
			inverter_peak_power_dc: 3.8,
			inverter_is_inside: true,
			inverter_type: "optimised_inverter",
			type: "PhotovoltaicSystem",
			shading: [],
		},
	},
	PartGcompliance: true,
	PartO_active_cooling_required: true,
	SimulationTime: {
		start: 0,
		end: 8,
		step: 1,
	} as SchemaSimulationTime,
	// SpaceCoolSystem: {},
	SpaceHeatSystem: {
		"instant elec heater 1": {
			rated_power: 10,
			type: "InstantElecHeater",
			EnergySupply: "mains elec",
			Control: defaultControlName,
		},
		"instant elec heater 2": {
			rated_power: 13,
			type: "InstantElecHeater",
			EnergySupply: "mains elec",
			Control: defaultControlName,
		},
	},
	GroundFloorArea: 38,
	HeatSourceWet: {
		"heat pump 1 name": {
			EnergySupply: defaultElectricityEnergySupplyName,
			type: "HeatPump",
			product_reference: "HEATPUMP-SMALL",
		},
	},
	Zone: {
		[defaultZoneName]: {
			BuildingElement: {
				"ground floor 1 (floor)": {
					type: "BuildingElementGround",
					area: 12,
					total_area: 12,
					u_value: 5,
					thermal_resistance_floor_construction: 2,
					areal_heat_capacity: "Very light",
					mass_distribution_class: "E: Mass concentrated at external side",
					perimeter: 40,
					edge_insulation: [{
						edge_thermal_resistance: 2.4,
						type: "horizontal",
						width: 0.32,
					}],
					psi_wall_floor_junc: 0.4,
					thickness_walls: 0.05,
					floor_type: "Slab_edge_insulation",
					pitch: 0,
				},
				"ground floor 2 (floor)": {
					type: "BuildingElementGround",
					area: 26,
					total_area: 26,
					depth_basement_floor: 2,
					u_value: 5,
					thermal_resistance_floor_construction: 2,
					areal_heat_capacity: "Very light",
					mass_distribution_class: "D: Mass equally distributed",
					perimeter: 21,
					thermal_resist_walls_base: 3,
					psi_wall_floor_junc: 0.8,
					thickness_walls: 0.04,
					floor_type: "Heated_basement",
					pitch: 0,
				},
				"internal floor 1 (floor)": {
					type: "BuildingElementAdjacentUnconditionedSpace_Simple",
					area: 6,
					areal_heat_capacity: "Very light",
					mass_distribution_class: "IE: Mass divided over internal and external side",
					thermal_resistance_unconditioned_space: 1,
					pitch: 180,
					u_value: 0.01,
				},
				"internal floor 2 (floor)": {
					type: "BuildingElementAdjacentConditionedSpace",
					area: 4,
					u_value: 0.01,
					areal_heat_capacity: "Medium",
					mass_distribution_class: "M",
					pitch: 180,
				},
				"exposed floor 1 (floor)": {
					height: 5,
					width: 2,
					base_height: 1,
					area: 10,
					solar_absorption_coeff: 0.4,
					areal_heat_capacity: "Medium",
					mass_distribution_class: "D: Mass equally distributed",
					pitch: 180,
					orientation360: 0,
					u_value: 0.1,
					type: "BuildingElementOpaque",
					is_external_door: false,
				},
				"party wall 1 (wall)": {
					area: 15,
					areal_heat_capacity: "Very light",
					mass_distribution_class: "E: Mass concentrated at external side",
					pitch: 90,
					type: "BuildingElementAdjacentConditionedSpace",
					u_value: 1,
				},
				"external wall 1 (wall)": {
					type: "BuildingElementOpaque",
					area: 20,
					areal_heat_capacity: "Light",
					base_height: 1,
					height: 2.6,
					is_external_door: false,
					mass_distribution_class: "D: Mass equally distributed",
					orientation360: 30,
					solar_absorption_coeff: 0.2,
					u_value: 1,
					width: 3,
					pitch: 90,
				},
				"internal wall 1 (wall)": {
					area: 15,
					areal_heat_capacity: "Very light",
					mass_distribution_class: "I: Mass concentrated at internal side",
					pitch: 90,
					type: "BuildingElementAdjacentConditionedSpace",
					u_value: 0.01,
				},
				"front door (door)": {
					area: 20,
					areal_heat_capacity: "Light",
					base_height: 1,
					height: 2.6,
					is_external_door: true,
					mass_distribution_class: "I: Mass concentrated at internal side",
					orientation360: 30,
					pitch: 90,
					solar_absorption_coeff: 0.2,
					type: "BuildingElementOpaque",
					u_value: 1,
					width: 1.2,
				},
				"external glazed door (door)": {
					base_height: 0.2,
					frame_area_fraction: 0.3,
					free_area_height: 2,
					g_value: 0.5,
					height: 3,
					max_window_open_area: 3,
					mid_height: 1.5,
					orientation360: 20,
					pitch: 90,
					shading: [],
					type: "BuildingElementTransparent",
					u_value: 0.8,
					width: 1,
					window_part_list: [{
						mid_height_air_flow_path: 3,
					}],
				},
				"wall to garage (wall)": {
					area: 20,
					areal_heat_capacity: "Very light",
					mass_distribution_class: "D: Mass equally distributed",
					pitch: 90,
					thermal_resistance_unconditioned_space: 2.5,
					type: "BuildingElementAdjacentUnconditionedSpace_Simple",
					u_value: 1,
				},
				"ceiling to heated space (ceiling)": {
					type: "BuildingElementAdjacentConditionedSpace",
					area: 16,
					areal_heat_capacity: "Light",
					mass_distribution_class: "I: Mass concentrated at internal side",
					pitch: 0,
					u_value: 0.01,
				},
				"ceiling to unheated space (ceiling)": {
					type: "BuildingElementAdjacentUnconditionedSpace_Simple",
					area: 20,
					areal_heat_capacity: "Very light",
					mass_distribution_class: "IE: Mass divided over internal and external side",
					pitch: 45,
					thermal_resistance_unconditioned_space: 3.4,
					u_value: 2.2,
				},
				"roof 1 (roof)": {
					pitch: 20,
					orientation360: 180,
					height: 2.5,
					width: 10,
					base_height: 0,
					area: 25,
					solar_absorption_coeff: 0.63,
					u_value: 0.1,
					areal_heat_capacity: "Very light",
					mass_distribution_class: "I: Mass concentrated at internal side",
					type: "BuildingElementOpaque",
					is_external_door: false,
					is_unheated_pitched_roof: false,
				},
				"bathroom door (door)": {
					area: 1.4,
					areal_heat_capacity: "Very light",
					mass_distribution_class: "IE: Mass divided over internal and external side",
					pitch: 90,
					type: "BuildingElementAdjacentConditionedSpace",
					u_value: 0.01,
				},
				"door to garage (door)": {
					area: 1.4,
					areal_heat_capacity: "Very light",
					mass_distribution_class: "IE: Mass divided over internal and external side",
					pitch: 90,
					thermal_resistance_unconditioned_space: 2.5,
					type: "BuildingElementAdjacentUnconditionedSpace_Simple",
					u_value: 1,
				},
				"bedroom window (window)": {
					type: "BuildingElementTransparent",
					pitch: 90,
					orientation360: 90,
					height: 2,
					width: 2,
					base_height: 1,
					u_value: 0.1,
					g_value: 0.2,
					mid_height: 2,
					frame_area_fraction: 0.2, // inverse openingToFrameRatio (1 - 0.8) 
					max_window_open_area: 1,
					free_area_height: 1,
					window_part_list: [{
						mid_height_air_flow_path: 1,
					}],
					shading: [
						{
							type: "overhang",
							depth: 0.5,
							distance: 0.5,
						},
						{
							type: "sidefinleft",
							depth: 0.25,
							distance: 1,
						},
						{
							type: "sidefinright",
							depth: 0.25,
							distance: 1,
						}],
				},
			},
			SpaceHeatSystem: ["instant elec heater 1", "instant elec heater 2"],
			ThermalBridging: {
				"linear thermal bridge (bridge)": {
					junction_type: "E3: SILL",
					length: 1.2,
					linear_thermal_transmittance: 0.03,
					type: "ThermalBridgeLinear",
				},
				"point thermal bridge 1 (bridge)": {
					heat_transfer_coeff: 0.045,
					type: "ThermalBridgePoint",
				},
				"point thermal bridge 2 (bridge)": {
					heat_transfer_coeff: 0.035,
					type: "ThermalBridgePoint",
				},
				"point thermal bridge 3 (bridge)": {
					heat_transfer_coeff: 0.067,
					type: "ThermalBridgePoint",
				},
			},
			Lighting: {
				efficacy: 56.0,
				bulbs: {
					incandescent: {
						count: 2,
						power: 60,
						efficacy: 14,
					},
					led: {
						count: 5,
						power: 6,
						efficacy: 120,
					},
				},
			},
			volume: 550,
		},
	},
	temp_internal_air_static_calcs: 20.0, // dummy value - this goes away in later schemas
};

// custom vitest matcher so we can get more useful JSON validation errors
expect.extend({
	toPassJsonSchema(isValid: boolean, validator: ValidateFunction<unknown>) {
		const errors = validator.errors?.map(({ message }) => message).join("; ");
		return {
			message: () => isValid ? "" : `JSON validation errors: ${errors}`,
			pass: isValid,
		};
	},
});

describe("FHS input mapper", () => {
	const store = useEcaasStore();

	afterEach(() => store.$reset());

	it("maps input state with a build type of house to an FHS input request", () => {
		// Arrange
		const dwellingDetails: DwellingDetails = {
			generalSpecifications: {
				...baseForm,
				data: {
					typeOfDwelling: "house",
					storeysInDwelling: 2,
					numOfBedrooms: 7,
					coolingRequired: false,
				},
			},
			shading: {
				...baseForm,
				data: [{
					...baseForm,
					data: {
						name: "Tree",
						startAngle: 60,
						endAngle: 90,
						objectType: "obstacle",
						height: 2,
						distance: 1,
					},
				}],
			},
			externalFactors: {
				...baseForm,
				data: {
					altitude: 100,
					typeOfExposure: "Shielded",
					terrainType: "Suburban",
					noiseNuisance: false,
				},
			},
		};

		const infiltrationAndVentilation: InfiltrationAndVentilation = {
			mechanicalVentilation: {
				...baseForm,
				data: [{
					...baseForm,
					data: {
						id: "kitchen exhaust fan",
						name: "kitchen exhaust fan",
						typeOfMechanicalVentilationOptions: "Intermittent MEV",
						airFlowRate: 55,
					},
				}],
			},
			ductwork: {
				...baseForm, // skipping ductwork as our mechanical ventilation isn't an MVHR
			},
			vents: {
				...baseForm,
				data: [{
					...baseForm,
					data: {
						name: "only vent",
						typeOfVent: "airBrick",
						effectiveVentilationArea: 75,
						openingRatio: 0.2,
						midHeightOfZone: 1.9,
						orientation: 90,
						pitch: 180,
					},
				}],
			},
			combustionAppliances: {
				"open_fireplace": {
					...baseForm,
				},
				"closed_with_fan": {
					...baseForm,
				},
				"open_gas_flue_balancer": {
					...baseForm,
				},
				"open_gas_kitchen_stove": {
					...baseForm,
				},
				"open_gas_fire": {
					...baseForm,
				},
				"closed_fire": {
					...baseForm,
				},
			},
			// skipping combustion appliances they have been removed for summer
			naturalVentilation: {
				...baseForm,
				data: {
					ventilationZoneHeight: 8,
					dwellingEnvelopeArea: 320,
					dwellingElevationalLevelAtBase: 3,
					crossVentilationPossible: false,
					maxRequiredAirChangeRate: 2.1,
				},
			},
			airPermeability: {
				...baseForm,
				data: {
					testPressure: "Standard",
					airTightnessTestResult: 4,
				},
			},
		};

		const dwellingFabric: DwellingFabric = {
			dwellingSpaceZoneParameters: {
				...baseForm,
				data: {
					area: 100,
					volume: 300,
					// spaceHeatingSystemForThisZone: "some-wet-distribution",
					// spaceCoolingSystemForThisZone: [{
					// 	name: "some-aircon-unit-name",
					// }],
					// spaceHeatControlSystemForThisZone: []
				},
			},
			dwellingSpaceLighting: {
				...baseForm,
				data: {
					numberOfBulbs: 6,
				},
			},
			dwellingSpaceFloors: {
				dwellingSpaceGroundFloor: {
					...baseForm,
					data: [{
						...baseForm,
						data: {
							name: "ground-floor",
							surfaceArea: 40,
							pitch: 0,
							uValue: 1,
							thermalResistance: 1,
							arealHeatCapacity: "Very light",
							massDistributionClass: "I",
							perimeter: 100,
							psiOfWallJunction: 1,
							thicknessOfWalls: 80,
							typeOfGroundFloor: "Slab_no_edge_insulation",
						},
					}],
				},
				dwellingSpaceInternalFloor: {
					...baseForm,
				},
				dwellingSpaceExposedFloor: {
					...baseForm,
				},
			},
			dwellingSpaceWalls: {
				dwellingSpaceExternalWall: {
					...baseForm,
				},
				dwellingSpaceInternalWall: {
					...baseForm,
				},
				dwellingSpacePartyWall: {
					...baseForm,
				},
				dwellingSpaceWallToUnheatedSpace: {
					...baseForm,
				},
			},
			dwellingSpaceCeilingsAndRoofs: {
				dwellingSpaceCeilings: {
					...baseForm,
				},
				dwellingSpaceRoofs: {
					...baseForm,
				},
			},
			dwellingSpaceDoors: {
				dwellingSpaceExternalUnglazedDoor: {
					...baseForm,
				},
				dwellingSpaceExternalGlazedDoor: {
					...baseForm,
				},
				dwellingSpaceInternalDoor: {
					...baseForm,
				},
			},
			dwellingSpaceWindows: {
				...baseForm,
			},
			dwellingSpaceThermalBridging: {
				dwellingSpaceLinearThermalBridges: {
					...baseForm,
				},
				dwellingSpacePointThermalBridges: {
					...baseForm,
				},
			},
		};

		const heatingAndCoolingSystems: heatingAndCoolingSystems = {
			heatGeneration: {
				heatPump: {
					...baseForm,
					data: [{
						...baseForm,
						data: {
							id: "some-heat-pump-id",
							name: "some-heat-pump-name",
							productReference: "HEATPUMP-LARGE",
						},
					}],
				},
				boiler: {
					...baseForm,
				},
				heatBattery: {
					...baseForm,
				},
				heatInterfaceUnit: {
					...baseForm,
				},
				heatNetwork: {
					...baseForm,
				},
			},
			energySupply: {
				...baseForm,
				data: {
					fuelType: ["electricity"],
					exported: true,
				},
			},
			heatEmitting: {
				wetDistribution: {
					...baseForm,
					data: [{
						...baseForm,
						data: {
							name: "some-wet-distribution",
							heatSource: "some-heat-pump-id",
							thermalMass: 0.14,
							designTempDiffAcrossEmitters: 31,
							designFlowTemp: 12,
							designFlowRate: 4,
							ecoDesignControllerClass: "8",
							minimumFlowTemp: 21,
							minOutdoorTemp: 20,
							maxOutdoorTemp: 34,
							convectionFractionWet: 4,
							typeOfSpaceHeater: "radiator",
							numberOfRadiators: 2,
							exponent: 3,
							constant: 9,
						},
					}],
				},
				instantElectricHeater: {
					...baseForm,
				},
				electricStorageHeater: {
					...baseForm,
				},
				warmAirHeatPump: {
					...baseForm,
				},
			},
			cooling: {
				airConditioning: {
					...baseForm,
					data: [{
						data: {
							name: "some-aircon-unit-name",
							coolingCapacity: 60,
							seasonalEnergyEfficiencyRatio: 4,
							convectionFraction: 0.2,
						},
					}],
				},
			},
		};

		const domesticHotWater: DomesticHotWater = {
			waterHeating: {
				hotWaterCylinder: {
					...baseForm,
					data: [{
						...baseForm,
						data: {
							id: "some-hot-water-cyclinder",
							name: "hw cylinder",
							heatSource: "some-heat-pump-id",
							storageCylinderVolume: 200,
							dailyEnergyLoss: 34,
						},
					}],
				},
				immersionHeater: {
					...baseForm,
				},
				solarThermal: {
					...baseForm,
				},
				pointOfUse: {
					...baseForm,
				},
				heatPump: {
					...baseForm,
				},
				combiBoiler: {
					...baseForm,
				},
				heatBattery: {
					...baseForm,
				},
				smartHotWaterTank: {
					...baseForm,
				},
				heatInterfaceUnit: {
					...baseForm,
				},
			},
			hotWaterOutlets: {
				mixedShower: {
					...baseForm,
					data: [{
						...baseForm,
						data: {
							id: "some-mixer-shower-id",
							name: "some-mixer-shower-name",
							flowRate: 14,
						},
					}],
				},
				electricShower: {
					...baseForm,
				},
				bath: {
					...baseForm,
				},
				otherOutlets: {
					...baseForm,
				},
			},
			pipework: {
				primaryPipework: {
					...baseForm,
				},
				secondaryPipework: {
					...baseForm,
				},
			},
			wwhrs: {
				...baseForm,
			},
		};

		const pvAndBatteries: PvAndBatteries = {
			pvSystems: {
				...baseForm,
			},
			electricBattery: {
				...baseForm,
			},
		};

		store.$state = {
			dwellingDetails,
			domesticHotWater,
			dwellingFabric,
			infiltrationAndVentilation,
			heatingAndCoolingSystems,
			pvAndBatteries,
		};

		const expectedResult: FhsInputSchema = expectedHouseInput;

		// Act
		const fhsInputData = mapFhsInputData(resolveState(store.$state));

		// Assert
		expect(fhsInputData).toBeDefined();
		expect(fhsInputData).toEqual(expectedResult);
	});

	it("maps input state with a build type of flat to an FHS input request", () => {
		// Arrange
		const dwellingDetails: DwellingDetails = {
			generalSpecifications: {
				...baseForm,
				data: {
					typeOfDwelling: "flat",
					storeysInDwelling: 6,
					storeyOfFlat: 3,
					numOfBedrooms: 2,
					coolingRequired: true,
				},
			},
			shading: {
				...baseForm,
				data: [{
					...baseForm,
					data: {
						name: "tree house",
						startAngle: 10,
						endAngle: 40,
						objectType: "overhang",
						height: 5,
						distance: 2,
					},
				},
				{
					...baseForm,
					data: {
						name: "obstacle",
						startAngle: 1,
						endAngle: 12,
						objectType: "obstacle",
						height: 1,
						distance: 0.5,
					},
				}],
			},
			externalFactors: {
				...baseForm,
				data: {
					altitude: 30,
					typeOfExposure: "Normal",
					terrainType: "OpenField",
					noiseNuisance: true,
				},
			},
		};

		const infiltrationAndVentilation: InfiltrationAndVentilation = {
			mechanicalVentilation: {
				...baseForm,
				data: [{
					...baseForm,
					data: {
						id: "mvhr vent 1 id",
						name: "mvhr vent 1 name",
						typeOfMechanicalVentilationOptions: "MVHR",
						airFlowRate: 17,
						mvhrLocation: "inside" as const,
						mvhrEfficiency: 1,
					},
				},
				{
					...baseForm,
					data: {
						id: "mvhr vent 2 id",
						name: "mvhr vent 2 name",
						typeOfMechanicalVentilationOptions: "MVHR",
						airFlowRate: 3,
						mvhrLocation: "outside" as const,
						mvhrEfficiency: 0,
					},
				},
				{
					...baseForm,
					data: {
						id: "centralised MEV id",
						name: "centralised MEV name",
						typeOfMechanicalVentilationOptions: "Centralised continuous MEV",
						airFlowRate: 8,
					},
				}],
			},
			ductwork: {
				...baseForm,
				data: [{
					...baseForm,
					data: {
						name: "ductwork 1",
						mvhrUnit: "mvhr vent 1 name",
						ductType: "supply",
						ductworkCrossSectionalShape: "circular" as const,
						internalDiameterOfDuctwork: 50,
						externalDiameterOfDuctwork: 55,
						insulationThickness: 5,
						lengthOfDuctwork: 4,
						thermalInsulationConductivityOfDuctwork: 1,
						surfaceReflectivity: true,
					},
				}],
			},
			vents: {
				...baseForm,
				data: [{
					...baseForm,
					data: {
						name: "only vent",
						typeOfVent: "airBrick",
						effectiveVentilationArea: 75,
						openingRatio: 0.2,
						midHeightOfZone: 1.9,
						orientation: 90,
						pitch: 180,
					},
				}],
			},
			combustionAppliances: {
				"open_fireplace": {
					...baseForm,
				},
				"closed_with_fan": {
					...baseForm,
				},
				"open_gas_flue_balancer": {
					...baseForm,
				},
				"open_gas_kitchen_stove": {
					...baseForm,
				},
				"open_gas_fire": {
					...baseForm,
				},
				"closed_fire": {
					...baseForm,
				},
			},
			naturalVentilation: {
				...baseForm,
				data: {
					ventilationZoneHeight: 1,
					dwellingEnvelopeArea: 5,
					dwellingElevationalLevelAtBase: 1,
					crossVentilationPossible: true,
					maxRequiredAirChangeRate: 2,
				},
			},
			airPermeability: {
				...baseForm,
				data: {
					testPressure: "Pulse test only",
					airTightnessTestResult: 10,
				},
			},
		};

		const dwellingFabric: DwellingFabric = {
			dwellingSpaceZoneParameters: {
				...baseForm,
				data: {
					area: 16,
					volume: 550,
					// spaceHeatingSystemForThisZone: "instant elec heater 1",
					// spaceCoolingSystemForThisZone: [],
					// spaceHeatControlSystemForThisZone: []
				},
			},
			dwellingSpaceLighting: {
				...baseForm,
				data: {
					numberOfBulbs: 5,
				},
			},
			dwellingSpaceFloors: {
				dwellingSpaceGroundFloor: {
					...baseForm,
					data: [
						{
							...baseForm,
							data: {
								name: "ground floor 1",
								surfaceArea: 12,
								pitch: 0,
								uValue: 5,
								thermalResistance: 2,
								arealHeatCapacity: "Very light",
								massDistributionClass: "E",
								perimeter: 40,
								psiOfWallJunction: 0.4,
								thicknessOfWalls: 50,
								typeOfGroundFloor: "Slab_edge_insulation" as const,
								edgeInsulationType: "horizontal" as const,
								edgeInsulationWidth: unitValue(32, centimetre),
								edgeInsulationThermalResistance: 2.4,
							},
						},
						{
							...baseForm,
							data: {
								name: "ground floor 2",
								surfaceArea: 26,
								pitch: 0,
								uValue: 5,
								thermalResistance: 2,
								arealHeatCapacity: "Very light",
								massDistributionClass: "D",
								perimeter: 21,
								psiOfWallJunction: 0.8,
								typeOfGroundFloor: "Heated_basement",
								thicknessOfWalls: 40,
								depthOfBasementFloorBelowGround: 2,
								thermalResistanceOfBasementWalls: 3,
							},
						},
					],
				},
				dwellingSpaceInternalFloor: {
					...baseForm,
					data: [
						{
							...baseForm,
							data: {
								name: "internal floor 1",
								typeOfInternalFloor: AdjacentSpaceType.unheatedSpace,
								surfaceAreaOfElement: 6,
								arealHeatCapacity: "Very light",
								massDistributionClass: "IE",
								thermalResistanceOfAdjacentUnheatedSpace: 1,
							},
						},
						{
							...baseForm,
							data: {
								name: "internal floor 2",
								typeOfInternalFloor: AdjacentSpaceType.heatedSpace,
								surfaceAreaOfElement: 4,
								arealHeatCapacity: "Medium",
								massDistributionClass: "M",
							},
						},
					],
				},
				dwellingSpaceExposedFloor: {
					...baseForm,
					data: [{
						...baseForm,
						data: {
							name: "exposed floor 1",
							length: 5,
							width: 2,
							elevationalHeight: 1,
							surfaceArea: 10,
							solarAbsorption: 0.4,
							arealHeatCapacity: "Medium",
							massDistributionClass: "D",
							pitch: 180,
							orientation: 0,
							uValue: 0.1,
						},
					}],
				},
			},
			dwellingSpaceWalls: {
				dwellingSpacePartyWall: {
					...baseForm,
					data: [{
						...baseForm,
						data: {
							name: "party wall 1",
							pitchOption: "90",
							pitch: 45,
							surfaceArea: 15,
							uValue: 1,
							arealHeatCapacity: "Very light",
							massDistributionClass: "E",
						},
					}],
				},
				dwellingSpaceExternalWall: {
					...baseForm,
					data: [
						{
							...baseForm,
							data: {
								name: "external wall 1",
								pitchOption: "90",
								pitch: 45,
								orientation: 30,
								height: 2.6,
								length: 3,
								elevationalHeight: 1,
								surfaceArea: 20,
								solarAbsorption: 0.2,
								uValue: 1,
								arealHeatCapacity: "Light",
								massDistributionClass: "D",
							},
						},
					],
				},
				dwellingSpaceInternalWall: {
					...baseForm,
					data: [{
						...baseForm,
						data: {
							name: "internal wall 1",
							pitchOption: "90",
							pitch: 90,
							surfaceAreaOfElement: 15,
							arealHeatCapacity: "Very light",
							massDistributionClass: "I",
						},
					}],
				},
				dwellingSpaceWallToUnheatedSpace: {
					...baseForm,
					data: [{
						...baseForm,
						data: {
							name: "wall to garage",
							pitchOption: "custom",
							pitch: 90,
							surfaceAreaOfElement: 20,
							uValue: 1,
							arealHeatCapacity: "Very light",
							massDistributionClass: "D",
							thermalResistanceOfAdjacentUnheatedSpace: 2.5,
						},
					}],
				},
			},
			dwellingSpaceCeilingsAndRoofs: {
				dwellingSpaceCeilings: {
					...baseForm,
					data: [{
						...baseForm,
						data: {
							name: "ceiling to heated space",
							type: AdjacentSpaceType.heatedSpace,
							surfaceArea: 16,
							arealHeatCapacity: "Light",
							massDistributionClass: "I",
							pitchOption: "0",
						},
					},
					{
						...baseForm,
						data: {
							name: "ceiling to unheated space",
							type: AdjacentSpaceType.unheatedSpace,
							surfaceArea: 20,
							arealHeatCapacity: "Very light",
							massDistributionClass: "IE",
							pitch: 45,
							pitchOption: "custom",
							thermalResistanceOfAdjacentUnheatedSpace: 3.4,
							uValue: 2.2,
						},
					},
					],
				},
				dwellingSpaceRoofs: {
					...baseForm,
					data: [{
						...baseForm,
						data: {
							name: "roof 1",
							typeOfRoof: "flat",
							pitch: 20,
							orientation: 180,
							length: 2.5,
							width: 10,
							elevationalHeightOfElement: 0,
							surfaceArea: 25,
							solarAbsorptionCoefficient: 0.63,
							uValue: 0.1,
							arealHeatCapacity: "Very light",
							massDistributionClass: "I",
						},
					}],
				},
			},
			dwellingSpaceDoors: {
				dwellingSpaceExternalUnglazedDoor: {
					...baseForm,
					data: [{
						...baseForm,
						data: {
							name: "front door",
							pitchOption: "90",
							pitch: 90,
							orientation: 30,
							height: 2.6,
							width: 1.2,
							elevationalHeight: 1,
							surfaceArea: 20,
							solarAbsorption: 0.2,
							uValue: 1,
							arealHeatCapacity: "Light",
							massDistributionClass: "I",
						},
					}],
				},
				dwellingSpaceExternalGlazedDoor: {
					...baseForm,
					data: [{
						...baseForm,
						data: {
							name: "external glazed door",
							height: 3,
							width: 1,
							uValue: 0.8,
							pitchOption: "90",
							pitch: 90,
							orientation: 20,
							solarTransmittance: 0.5,
							elevationalHeight: 0.2,
							midHeight: 1.5,
							openingToFrameRatio: 0.7,
							midHeightOpenablePart1: 3,
							maximumOpenableArea: 3,
							heightOpenableArea: 2,
						},
					}],
				},
				dwellingSpaceInternalDoor: {
					...baseForm,
					data: [{
						...baseForm,
						data: {
							typeOfInternalDoor: AdjacentSpaceType.heatedSpace,
							name: "bathroom door",
							surfaceArea: 1.4,
							arealHeatCapacity: "Light",
							massDistributionClass: "IE",
							pitchOption: "90",
							pitch: 90,
						},
					},
					{
						...baseForm,
						data: {
							typeOfInternalDoor: AdjacentSpaceType.unheatedSpace,
							name: "door to garage",
							surfaceArea: 1.4,
							arealHeatCapacity: "Very light",
							massDistributionClass: "IE",
							pitchOption: "90",
							pitch: 90,
							uValue: 1,
							thermalResistanceOfAdjacentUnheatedSpace: 2.5,
						},
					}],
				},
			},
			dwellingSpaceWindows: {
				...baseForm,
				data: [{
					...baseForm,
					data: {
						name: "bedroom window",
						orientation: 90,
						height: 2,
						width: 2,
						uValue: 0.1,
						pitchOption: "90",
						pitch: 90,
						solarTransmittance: 0.2,
						elevationalHeight: 1,
						midHeight: 2,
						numberOpenableParts: "1",
						overhangDepth: 0.5,
						overhangDistance: 0.5,
						sideFinRightDepth: 0.25,
						sideFinRightDistance: 1,
						sideFinLeftDepth: 0.25,
						sideFinLeftDistance: 1,
						curtainsOrBlinds: true,
						treatmentType: "curtains" as const,
						thermalResistivityIncrease: 1,
						solarTransmittanceReduction: 0.1,
						midHeightOpenablePart1: 1,
						openingToFrameRatio: 0.8,
						maximumOpenableArea: 1,
						heightOpenableArea: 1,
						curtainsControlObject: "auto_motorised" as const,
					},
				}],
			},
			dwellingSpaceThermalBridging: {
				dwellingSpaceLinearThermalBridges: {
					...baseForm,
					data: [{
						...baseForm,
						data: {
							name: "linear thermal bridge",
							typeOfThermalBridge: "E3: Sill",
							linearThermalTransmittance: 0.03,
							length: 1.2,
						},
					}],
				},
				dwellingSpacePointThermalBridges: {
					...baseForm,
					data: [{
						...baseForm,
						data: {
							name: "point thermal bridge 1",
							heatTransferCoefficient: 0.045,
						},
					},
					{
						...baseForm,
						data: {
							name: "point thermal bridge 2",
							heatTransferCoefficient: 0.035,
						},
					},
					{
						...baseForm,
						data: {
							name: "point thermal bridge 3",
							heatTransferCoefficient: 0.067,
						},
					}],
				},
			},
		};

		const heatingAndCoolingSystems: heatingAndCoolingSystems = {
			heatGeneration: {
				heatPump: {
					...baseForm,
					data: [{
						...baseForm,
						data: {
							id: "heat pump 1 id",
							name: "heat pump 1 name",
							productReference: "HEATPUMP-SMALL",
						},
					}],
				},
				boiler: {
					...baseForm,
				},
				heatBattery: {
					...baseForm,
				},
				heatInterfaceUnit: {
					...baseForm,
				},
				heatNetwork: {
					...baseForm,
				},
			},
			energySupply: {
				...baseForm,
				data: {
					fuelType: ["electricity"],
					exported: false,
				},
			},
			heatEmitting: {
				wetDistribution: {
					...baseForm,
				},
				instantElectricHeater: {
					...baseForm,
					data: [{
						...baseForm,
						data: {
							name: "instant elec heater 1",
							ratedPower: 10,
							convectionFractionInstant: 1,
						},
					},
					{
						...baseForm,
						data: {
							name: "instant elec heater 2",
							ratedPower: 13,
							convectionFractionInstant: 0.8,
						},
					}],
				},
				electricStorageHeater: {
					...baseForm,
				},
				warmAirHeatPump: {
					...baseForm,
				},
			},
			cooling: {
				airConditioning: {
					...baseForm,
				},
			},
		};

		const domesticHotWater: DomesticHotWater = {
			waterHeating: {
				hotWaterCylinder: {
					...baseForm,
					data: [{
						...baseForm,
						data: {
							id: "hw cylinder 1 id",
							name: "hw cylinder 1 name",
							heatSource: "heat pump 1 id",
							storageCylinderVolume: 80,
							dailyEnergyLoss: 10,
						},
					}],
				},
				immersionHeater: {
					...baseForm,
				},
				solarThermal: {
					...baseForm,
				},
				pointOfUse: {
					...baseForm,
				},
				heatPump: {
					...baseForm,
				},
				combiBoiler: {
					...baseForm,
				},
				heatBattery: {
					...baseForm,
				},
				smartHotWaterTank: {
					...baseForm,
				},
				heatInterfaceUnit: {
					...baseForm,
				},
			},
			hotWaterOutlets: {
				mixedShower: {
					...baseForm,
					data: [
						{
							...baseForm,
							data: {
								id: "mixer shower 1 id",
								name: "mixer shower 1 name",
								flowRate: 19,
							},
						},
						{
							...baseForm,
							data: {
								id: "mixer shower 2 id",
								name: "mixer shower 2 name",
								flowRate: 28,
							},
						},
					],
				},
				electricShower: {
					...baseForm,
					data: [
						{
							...baseForm,
							data: {
								id: "electric shower 1 id",
								name: "electric shower 1 name",
								ratedPower: 20,
							},
						},
					],
				},
				bath: {
					...baseForm,
					data: [
						{
							...baseForm,
							data: {
								name: "small bath name",
								id: "small bath id",
								size: 80,
								flowRate: 8,
							},
						},
						{
							...baseForm,
							data: {
								name: "medium bath name",
								id: "medium bath id",
								size: 180,
								flowRate: 8,
							},
						},
						{
							...baseForm,
							data: {
								name: "large bath name",
								id: "large bath id",
								size: 400,
								flowRate: 14,
							},
						},
					],
				},
				otherOutlets: {
					...baseForm,
					data: [
						{
							...baseForm,
							data: {
								id: "kitchen sink id",
								name: "kitchen sink name",
								flowRate: 7.4,
							},
						},
						{
							...baseForm,
							data: {
								id: "bathroom basin id",
								name: "bathroom basin name",
								flowRate: 6.4,
							},
						},
						{
							...baseForm,
							data: {
								id: "cloakroom basin id",
								name: "cloakroom basin name",
								flowRate: 6.4,
							},
						},
					],
				},
			},
			pipework: {
				primaryPipework: {
					...baseForm,
					data: [{
						...baseForm,
						data: {
							name: "pipework 1",
							internalDiameter: 15,
							externalDiameter: 22,
							length: 5,
							insulationThickness: 13,
							thermalConductivity: 0.035,
							surfaceReflectivity: true,
							pipeContents: "water",
							hotWaterCylinder: "hw cylinder 1 id",
							location: "internal",
						},
					},
					{
						...baseForm,
						data: {
							name: "external pipework",
							internalDiameter: 28,
							externalDiameter: 28,
							length: 32,
							insulationThickness: 13,
							thermalConductivity: 0.040,
							surfaceReflectivity: false,
							pipeContents: "glycol25",
							hotWaterCylinder: "hw cylinder 1 id",
							location: "external",
						},
					}],
				},
				secondaryPipework: {
					...baseForm,
					data: [{
						...baseForm,
						data: {
							name: "secondary pipework",
							length: 5,
							location: "internal",
							internalDiameter: 14,
						},
					},
					{
						...baseForm,
						data: {
							name: "external secondary pipework",
							length: 15,
							location: "external",
							internalDiameter: 20,
						},
					}],
				},
			},
			wwhrs: {
				...baseForm,
			},
		};

		const pvAndBatteries: PvAndBatteries = {
			pvSystems: {
				...baseForm,
				data: [{
					...baseForm,
					data: {
						name: "pv system 1",
						peakPower: 2,
						ventilationStrategy: "moderately_ventilated",
						pitch: 15,
						orientation: 90,
						elevationalHeight: 1,
						lengthOfPV: 0.4,
						widthOfPV: 0.5,
						inverterPeakPowerAC: 3,
						inverterPeakPowerDC: 3.8,
						inverterIsInside: true,
						inverterType: "optimised_inverter",
					},
				}],
			},
			electricBattery: {
				...baseForm,
				data: [{
					...baseForm,
					data: {
						name: "electric battery 1",
						capacity: 12,
						chargeEfficiency: 1,
						location: "inside",
						gridChargingPossible: true,
						maximumChargeRate: 90,
						minimumChargeRate: 80,
						maximumDischargeRate: 20,
					},
				}],
			},
		};

		store.$state = {
			dwellingDetails,
			domesticHotWater,
			dwellingFabric,
			infiltrationAndVentilation,
			heatingAndCoolingSystems,
			pvAndBatteries,
		};

		const expectedResult: FhsInputSchema = expectedFlatInput;

		// Act
		const fhsInputData = mapFhsInputData(resolveState(store.$state));

		// Assert
		expect(fhsInputData).toBeDefined();
		expect(fhsInputData).toEqual(expectedResult);
	});

	test("the expected results pass against the current FHS input schema", () => {
		const expectedsToTest = [expectedHouseInput, expectedFlatInput];

		const validate = ajv.getSchema("fhs")!;

		for (const input of expectedsToTest) {
			expect(validate(input)).toPassJsonSchema(validate);
		}
	});
});
