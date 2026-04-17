import { describe, expect, it } from "vitest";
import { generateHeatNetworkSubNetworkDisplayProductCombinations } from "./subheatnetwork-combination-display";

describe("generateHeatNetworkSubNetworkDisplayProductCombinations", () => {
	it("returns one display product row per testData entry", () => {
		const item = {
			productID: "net-1",
			communityHeatNetworkName: "Alpha Network",
			testData: [
				{ ID: "td-1", subheatNetworkName: "Sub A" },
				{ ID: "td-2", subheatNetworkName: "Sub B" },
			],
		};

		const result = generateHeatNetworkSubNetworkDisplayProductCombinations(item);

		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({
			displayProduct: true,
			id: "td-1",
			productId: "net-1",
			technologyType: "HeatNetworks",
			communityHeatNetworkName: "Alpha Network",
			subheatNetworkName: "Sub A",
		});
		expect(result[1]).toEqual({
			displayProduct: true,
			id: "td-2",
			productId: "net-1",
			technologyType: "HeatNetworks",
			communityHeatNetworkName: "Alpha Network",
			subheatNetworkName: "Sub B",
		});
	});
	it("returns an empty array when testData is absent", () => {
		const item = {
			productID: "net-1",
			communityHeatNetworkName: "Alpha Network",
		};

		const result = generateHeatNetworkSubNetworkDisplayProductCombinations(item);

		expect(result).toEqual([]);
	});

	it("returns an empty array when testData is an empty array", () => {
		const item = {
			productID: "net-1",
			communityHeatNetworkName: "Alpha Network",
			testData: [],
		};

		const result = generateHeatNetworkSubNetworkDisplayProductCombinations(item);

		expect(result).toEqual([]);
	});
});
