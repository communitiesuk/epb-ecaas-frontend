import type { ResolvedState } from "../mapping/fhsInputMapper";
import type { SchemaHeatNetworkType } from "~/schema/aliases";


function getAssociatedHeatNetwork(
	state: ResolvedState,
	associatedHeatNetworkId: string | undefined,
) {
	if (!associatedHeatNetworkId) {
		throw new Error("Expected associated heat network id");
	}

	const heatNetwork = state.spaceHeating.heatNetworks?.find(
		network => network.id === associatedHeatNetworkId,
	);

	if (!heatNetwork) {
		throw new Error(
			`Expected associated heat network ${associatedHeatNetworkId} to exist`,
		);
	}

	return heatNetwork;
}

export function getHeatNetworkFields(
	state: ResolvedState,
	associatedHeatNetworkId: string | undefined,
) {
	const network = getAssociatedHeatNetwork(state, associatedHeatNetworkId);

	const heatNetworkTypeMap = {
		communalHeatNetwork: "communal",
		sleevedDistrictHeatNetwork: "sleeved DHN",
		unsleevedDistrictHeatNetwork: "unsleeved DHN",
	} as const satisfies Record<HeatNetworkData["typeOfHeatNetwork"], SchemaHeatNetworkType>;

	if (!network.productReference) {
		throw new Error(
			"Expected associated heat network to have a product reference",
		);
	}

	if (!network.subHeatNetworkName) {
		throw new Error(
			"Expected associated heat network to have a sub heat network name",
		);
	}

	return {
		is_heat_network: true as const,
		heat_network_type: heatNetworkTypeMap[network.typeOfHeatNetwork],
		heat_network_reference: network.productReference,
		sub_heat_network_name: network.subHeatNetworkName,
	};
}