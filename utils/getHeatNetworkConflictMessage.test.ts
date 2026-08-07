import { describe, expect, it } from "vitest";
import { getHeatNetworkConflictMessage } from "./getHeatNetworkConflictMessage";

describe("getHeatNetworkConflictMessage", () => {
	it("returns undefined when no heat source is provided", () => {
		expect(getHeatNetworkConflictMessage(undefined)).toBeUndefined();
	});

	it("returns a conflict message when a non-booster heat pump is added", () => {
		expect(
			getHeatNetworkConflictMessage({
				typeOfHeatSource: "heatPump",
				typeOfHeatPump: "airSource",
			}),
		).toEqual({
			beforeLinkText:
				"A heat network cannot be added as it isn't compatible with the heat pump already entered.",
			link: undefined,
			afterLinkText: undefined,
		});
	});

	it("does not return a conflict message when a booster heat pump is added", () => {
		expect(
			getHeatNetworkConflictMessage({
				typeOfHeatSource: "heatPump",
				typeOfHeatPump: "booster",
			}),
		).toBeUndefined();
	});

	it.each([
		["boiler", "boiler"],
		["heatBattery", "heat battery"],
		["immersionHeater", "immersion heater"],
		["pointOfUse", "point of use"],
		["solarThermalSystem", "solar thermal system"],
	])(
		"returns a conflict message when a %s is added",
		(typeOfHeatSource, label) => {
			expect(
				getHeatNetworkConflictMessage({
					typeOfHeatSource,
				}),
			).toEqual({
				beforeLinkText: `A heat network cannot be added as it isn't compatible with the ${label} already entered.`,
				link: undefined,
				afterLinkText: undefined,
			});
		},
	);

	it("returns a linked conflict message when a domestic hot water heat source is added", () => {
		expect(
			getHeatNetworkConflictMessage(
				{
					typeOfHeatSource: "boiler",
				},
				"domesticHotWater",
			),
		).toEqual({
			beforeLinkText:
				"A heat network cannot be added as it isn't compatible with the boiler already entered in ",
			link: {
				text: "domestic hot water",
				url: getUrl("domesticHotWater"),
			},
			afterLinkText: ".",
		});
	});

	it("returns undefined for a heat source that is compatible with heat networks", () => {
		expect(
			getHeatNetworkConflictMessage({
				typeOfHeatSource: "heatInterfaceUnit",
			}),
		).toBeUndefined();
	});
});