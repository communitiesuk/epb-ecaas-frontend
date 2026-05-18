import { patchLegacySubHeatNetworkNames } from "./heatNetworkMigration";

const mocks = vi.hoisted(() => ({
	$fetch: vi.fn(),
}));

vi.stubGlobal("$fetch", mocks.$fetch);

describe("patchLegacySubHeatNetworkNames", () => {
	beforeEach(() => {
		mocks.$fetch.mockReset();
	});

	test("fetches and stores subHeatNetworkName when legacy subHeatNetworkId exists", async () => {
		const state = {
			spaceHeating: {
				heatSource: {
					data: [{
						data: {
							id: "hn-1",
							typeOfHeatSource: "heatNetwork",
							productReference: "HEAT_NETWORK-LARGE",
							subHeatNetworkId: "td-2",
						},
						complete: true,
					}],
				},
			},
		};

		mocks.$fetch.mockResolvedValue({
			communityHeatNetworkName: "Network Alpha",
			testData: { ID: "td-2", subheatNetworkName: "Sub 2" },
		});

		await patchLegacySubHeatNetworkNames(state);

		const migratedHeatNetwork = (((state as Record<string, unknown>).spaceHeating as { heatSource: { data: { data: Record<string, unknown> }[] } }).heatSource.data[0]?.data) ?? {};

		expect(mocks.$fetch).toHaveBeenCalledTimes(1);
		expect(mocks.$fetch).toHaveBeenCalledWith("/api/products/HEAT_NETWORK-LARGE?testDataId=td-2");
		expect(migratedHeatNetwork).toEqual(
			expect.objectContaining({
				subHeatNetworkName: "Sub 2",
			}),
		);
		expect("subHeatNetworkId" in migratedHeatNetwork).toBe(false);
	});

	test("does not fetch when legacy subHeatNetworkId is not present", async () => {
		const state = {
			spaceHeating: {
				heatSource: {
					data: [{
						data: {
							id: "hn-1",
							typeOfHeatSource: "heatNetwork",
							productReference: "HEAT_NETWORK-LARGE",
							subHeatNetworkName: "Existing Subnetwork",
							typeOfHeatNetwork: "communalHeatNetwork",
							name: "Community Heat Network",
						},
						complete: true,
					}],
				},
			},
		};
		await patchLegacySubHeatNetworkNames(state);

		const migratedHeatNetwork = (((state).spaceHeating as { heatSource: { data: { data: Record<string, unknown> }[] } }).heatSource.data[0]?.data) ?? {};

		expect(mocks.$fetch).not.toHaveBeenCalled();
		expect(migratedHeatNetwork).toEqual(
			expect.objectContaining({
				subHeatNetworkName: "Existing Subnetwork",
			}),
		);
	});
});
