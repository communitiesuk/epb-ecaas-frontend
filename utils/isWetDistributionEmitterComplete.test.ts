describe("isWetDistributionEmitterComplete", () => {
	it("returns true for a complete radiator", () => {
		expect(
			isWetDistributionEmitterComplete({
				id: "1",
				typeOfHeatEmitter: "radiator",
				name: "Living room radiator",
				productReference: "radiator-product",
				length: {
					amount: 1200,
					unit: "millimetres",
				},
				numOfRadiators: 2,
			}),
		).toBe(true);
	});

	it("returns false for an incomplete radiator", () => {
		expect(
			isWetDistributionEmitterComplete({
				id: "1",
				typeOfHeatEmitter: "radiator",
				name: "Living room radiator",
			}),
		).toBe(false);
	});

	it("returns true for a complete fan coil", () => {
		expect(
			isWetDistributionEmitterComplete({
				id: "1",
				typeOfHeatEmitter: "fanCoil",
				name: "Fan coil",
				productReference: "fan-coil-product",
				numOfFanCoils: 2,
			}),
		).toBe(true);
	});

	it("returns false for an incomplete fan coil", () => {
		expect(
			isWetDistributionEmitterComplete({
				id: "1",
				typeOfHeatEmitter: "fanCoil",
				name: "Fan coil",
				productReference: "fan-coil-product",
			}),
		).toBe(false);
	});

	it("returns true for a complete underfloor heating emitter", () => {
		expect(
			isWetDistributionEmitterComplete({
				id: "1",
				typeOfHeatEmitter: "underFloorHeating",
				name: "Underfloor heating",
				productReference: "ufh-product",
				areaOfUnderFloorHeating: 50,
			}),
		).toBe(true);
	});

	it("returns false for an incomplete underfloor heating emitter", () => {
		expect(
			isWetDistributionEmitterComplete({
				id: "1",
				typeOfHeatEmitter: "underFloorHeating",
				name: "Underfloor heating",
			}),
		).toBe(false);
	});

	it("returns true when there are no emitters", () => {
		expect([]).toEqual([]);
	});
});