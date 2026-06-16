
describe("thermal bridging events", () => {
	const nuxtApp = useNuxtApp();
	const store = useEcaasStore();

	const groundFloor: Partial<GroundFloorData> = {
		id: "0d5b322a-8bd7-4f45-8027-ebe9f2056e70",
		name: "Ground 1",
		perimeter: 20,
	};

	const thermalBridge: LinearThermalBridgeData = {
		name: "Linear 1",
		typeOfThermalBridge: "E5",
		linearThermalTransmittance: 1,
		length: 20,
		associatedItemId: groundFloor.id!,
	};

	beforeEach(() => {
		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceGroundFloor: {
						data: [{
							data: groundFloor,
						}],
					},
				},
				dwellingSpaceThermalBridging: {
					dwellingSpaceLinearThermalBridges: {
						data: [{
							data: thermalBridge,
							complete: true,
						}],
						complete: true,
					},
				},
			},
		});
	});

	afterEach(() => {
		store.$reset();
	});

	it("app:floor:removed sets linear thermal bridging to incomplete when removed floor is associated with a thermal bridge", () => {
		nuxtApp.callHook("app:floor:removed", groundFloor.id!);

		setTimeout(() => {
			const { dwellingSpaceLinearThermalBridges } = store.dwellingFabric.dwellingSpaceThermalBridging;

			expect(dwellingSpaceLinearThermalBridges.complete).toBe(false);
			expect(dwellingSpaceLinearThermalBridges.data[0]?.complete).toBe(false);
		}, 100);
	});

	it("app:floor:updated sets linear thermal bridging to incomplete when new junction validation fails", () => {
		const updatedFloor: Partial<GroundFloorData> = {
			...groundFloor,
			perimeter: 10,
		};

		store.$patch({
			dwellingFabric: {
				dwellingSpaceFloors: {
					dwellingSpaceGroundFloor: {
						data: [{
							data: updatedFloor,
						}],
					},
				},
			},
		});

		nuxtApp.callHook("app:floor:updated", groundFloor as GroundFloorData);

		setTimeout(() => {
			const { dwellingSpaceLinearThermalBridges } = store.dwellingFabric.dwellingSpaceThermalBridging;

			expect(dwellingSpaceLinearThermalBridges.complete).toBe(false);
			expect(dwellingSpaceLinearThermalBridges.data[0]?.complete).toBe(false);
		}, 100);
	});
});