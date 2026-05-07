import { isEcaasForm, type EcaasForm } from "./ecaasStore.schema";
import type { Product } from "~/pcdb/pcdb.types";

function getLegacyHeatNetworkForms(state: Record<string, unknown>): EcaasForm<Record<string, unknown>>[] {
	const storeState = state as Partial<EcaasState>;
	const spaceHeatingHeatSources = storeState.spaceHeating?.heatSource?.data;
	const domesticHotWaterHeatSources = storeState.domesticHotWater?.heatSources?.data;
	const forms = [
		...(Array.isArray(spaceHeatingHeatSources) ? spaceHeatingHeatSources : []),
		...(Array.isArray(domesticHotWaterHeatSources) ? domesticHotWaterHeatSources : []),
	];

	return forms.filter(isEcaasForm) as EcaasForm<Record<string, unknown>>[];
}

export async function patchLegacySubHeatNetworkNames(
	state: Record<string, unknown>,
): Promise<Record<string, unknown>> {
	const forms = getLegacyHeatNetworkForms(state);

	for (const form of forms) {
		if (form.data.typeOfHeatSource !== "heatNetwork") {
			continue;
		}

		const subHeatNetworkId = typeof form.data.subHeatNetworkId === "string" ? form.data.subHeatNetworkId : undefined;
		if (!subHeatNetworkId) {
			continue;
		}

		const productReference = typeof form.data.productReference === "string" ? form.data.productReference : undefined;
		if (!productReference) {
			continue;
		}

		try {
			const product = await $fetch<Product>(
				`/api/products/${encodeURIComponent(productReference)}?testDataId=${encodeURIComponent(subHeatNetworkId)}`,
			);
			const subHeatNetworkName = (product as { testData: { subheatNetworkName?: string } })?.testData?.subheatNetworkName;
			if (typeof subHeatNetworkName === "string" && subHeatNetworkName) {
				form.data.subHeatNetworkName = subHeatNetworkName;
				delete form.data.subHeatNetworkId;
			}
		} catch {
			// leave the form data unchanged if fetch fails
		}
	}

	return state;
}
