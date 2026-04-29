import { emptyValueRendering } from "~/utils/display";

export function formatHeatNetworkProductName(heatNetworkName: string, subheatNetworkName: string): string {
	return `${heatNetworkName} - ${subheatNetworkName}`;
}

export async function getHeatNetworkProductName(
	productReference: string | undefined,
	subHeatNetworkId: string | undefined,
): Promise<string> {
	if (!productReference || !subHeatNetworkId) {
		return emptyValueRendering;
	}

	try {
		const response = await fetch(`/api/products/${productReference}?testDataId=${subHeatNetworkId}`);

		if (!response.ok) {
			return emptyValueRendering;
		}

		const product = await response.json() as Record<string, unknown> | undefined;

		if (!product) {
			return emptyValueRendering;
		}

		const heatNetworkName = product.communityHeatNetworkName as string | undefined;
		const subheatNetworkName = (product.subheatNetworkName as string | undefined)
			?? ((product.testData as Record<string, unknown> | undefined)?.subheatNetworkName as string | undefined);

		if (!heatNetworkName || !subheatNetworkName) {
			return emptyValueRendering;
		}

		return formatHeatNetworkProductName(heatNetworkName, subheatNetworkName);
	} catch {
		return emptyValueRendering;
	}
}
