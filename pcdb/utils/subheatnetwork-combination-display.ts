import type { DisplayProduct } from "../pcdb.types";

export function generateHeatNetworkSubNetworkDisplayProductCombinations(item: Record<string, unknown>): DisplayProduct[] {
	const communityHeatNetworkName = typeof item.communityHeatNetworkName === "string" ? item.communityHeatNetworkName : "";
	const testData = Array.isArray(item.testData) ? item.testData as Record<string, unknown>[] : [];

	return testData.map((entry) => {
		const productId = item?.productID?.toString() ?? "";
		const subheatNetworkName = entry.subheatNetworkName?.toString() ?? "";

		return {
			displayProduct: true,
			productId,
			id: entry.ID?.toString() ?? entry.id?.toString() ?? "",
			technologyType: "HeatNetworks",
			communityHeatNetworkName,
			subheatNetworkName,
		} satisfies DisplayProduct;
	});
}
