describe("getHeatNetworkFields", () => {

	const communalHeatNetwork: HeatNetworkData = {
		id: "communal_id",
		name: "Communal Heat Network",
		typeOfHeatNetwork: "communalHeatNetwork",
		subHeatNetworkName: "Sub Communal Heat Network",
		productReference: "9999",
	};

	const sleevedDistrictHeatNetwork: HeatNetworkData = {
		id: "sleeved_id",
		name: "Sleeved District Heat Network",
		typeOfHeatNetwork: "sleevedDistrictHeatNetwork",
		subHeatNetworkName: "Sub Sleeved District Heat Network",
		productReference: "1111",
	};

	const unsleevedDistrictHeatNetwork: HeatNetworkData = {
		id: "unsleeved_id",
		name: "Unsleeved District Heat Network",
		typeOfHeatNetwork: "unsleevedDistrictHeatNetwork",
		subHeatNetworkName: "Sub Unsleeved District Heat Network",
		productReference: "2222",
	};

	const store = useEcaasStore();

	test("maps communal heat network with no booster flag fields correctly", () => {
		store.$patch({
			spaceHeating: {
				heatNetworks: {
					data: [
						{
							data: communalHeatNetwork,
							complete: true,
						},
					],
					complete: true,
				},
			},
		});

		const resolvedState = resolveState(store.$state);

		const actual = getHeatNetworkFields(
			resolvedState,
			"communal_id",
		);

		expect(actual).toEqual({
			is_heat_network: true,
			heat_network_type: "communal",
			heat_network_reference: "9999",
			sub_heat_network_name: "Sub Communal Heat Network",
		});
	});


	test("maps sleeved district heat network fields correctly", () => {
		store.$patch({
			spaceHeating: {
				heatNetworks: {
					data: [
						{
							data: sleevedDistrictHeatNetwork,
							complete: true,
						},
					],
					complete: true,
				},
			},
		});

		const resolvedState = resolveState(store.$state);

		expect(
			getHeatNetworkFields(resolvedState, "sleeved_id"),
		).toEqual({
			is_heat_network: true,
			heat_network_type: "sleeved DHN",
			heat_network_reference: "1111",
			sub_heat_network_name: "Sub Sleeved District Heat Network",
		});
	});


	test("maps unsleeved district heat network fields correctly", () => {
		store.$patch({
			spaceHeating: {
				heatNetworks: {
					data: [
						{
							data: unsleevedDistrictHeatNetwork,
							complete: true,
						},
					],
					complete: true,
				},
			},
		});

		const resolvedState = resolveState(store.$state);

		expect(
			getHeatNetworkFields(resolvedState, "unsleeved_id"),
		).toEqual({
			is_heat_network: true,
			heat_network_type: "unsleeved DHN",
			heat_network_reference: "2222",
			sub_heat_network_name: "Sub Unsleeved District Heat Network",
		});
	});


	test("throws if no associated heat network id exists", () => {
		const resolvedState = resolveState(store.$state);

		expect(() =>
			getHeatNetworkFields(resolvedState, undefined),
		).toThrow(
			"Expected associated heat network id",
		);
	});


	test("throws if associated heat network cannot be found", () => {
		const resolvedState = resolveState(store.$state);

		expect(() =>
			getHeatNetworkFields(resolvedState, "missingNetwork"),
		).toThrow(
			"Expected associated heat network missingNetwork to exist",
		);
	});

});

