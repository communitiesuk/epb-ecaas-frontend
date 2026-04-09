import type { HotWaterOutletType } from "~/stores/ecaasStore.schema";

export function getHotWaterOutletDefaultName(type: HotWaterOutletType | undefined): string {
	if (!type) return "";
	switch (type) {
		case "mixedShower":
			return "Mixer shower";
		case "electricShower":
			return "Electric shower";
		case "bath":
			return "Bath";
		default:
			return "";
	}
}
