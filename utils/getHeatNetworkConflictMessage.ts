import type { ConflictMessage } from "~/common.types";

const incompatibleHeatSourceLabels = {
	boiler: "boiler",
	heatBattery: "heat battery",
	immersionHeater: "immersion heater",
	pointOfUse: "point of use",
	solarThermalSystem: "solar thermal system",
} as const;

export type HeatNetworkCompatibleHeatSource = {
	typeOfHeatSource: string;
	typeOfHeatPump?: string;
};

type HeatSourceLocation = "spaceHeating" | "domesticHotWater";

export function getHeatNetworkConflictMessage(
	heatSource: HeatNetworkCompatibleHeatSource | undefined,
	context: HeatSourceLocation = "spaceHeating",
): ConflictMessage | undefined {
	if (!heatSource?.typeOfHeatSource) {
		return;
	}

	const isDomesticHotWater = context === "domesticHotWater";

	const link = isDomesticHotWater
		? {
			text: "domestic hot water",
			url: getUrl("domesticHotWater"),
		}
		: undefined;

	const createConflictMessage = (heatSourceLabel: string): ConflictMessage => ({
		beforeLinkText: isDomesticHotWater
			? `A heat network cannot be added as it isn't compatible with the ${heatSourceLabel} already entered in `
			: `A heat network cannot be added as it isn't compatible with the ${heatSourceLabel} already entered.`,
		link,
		afterLinkText: isDomesticHotWater ? "." : undefined,
	});

	if (
		heatSource.typeOfHeatSource === "heatPump" &&
		heatSource.typeOfHeatPump !== "booster"
	) {
		return createConflictMessage("heat pump");
	}

	if (heatSource.typeOfHeatSource in incompatibleHeatSourceLabels) {
		const label =
			incompatibleHeatSourceLabels[
				heatSource.typeOfHeatSource as keyof typeof incompatibleHeatSourceLabels
			];

		return createConflictMessage(label);
	}

	return;
}