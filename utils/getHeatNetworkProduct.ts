import type { DisplayProduct } from "~/pcdb/pcdb.types";

export const getHeatNetworkProduct = async (heatNetwork: DisplayProduct) => {
	const { data } = await useFetch(`/api/products/${heatNetwork.id}/details`, {
		query: {
			technologyType: "HeatNetworks",
		},
	});
	return data.value;
};
