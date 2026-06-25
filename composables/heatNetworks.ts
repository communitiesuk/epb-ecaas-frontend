import { useEcaasStore } from "#imports";

export function useHeatNetworks() {
	const store = useEcaasStore();
    
	const heatNetworkOptions = computed(() => {
		const heatNetworks = store.spaceHeating.heatNetworks.data.filter(networks => {
			return (networks.data as HeatNetworkData);
		});

		return Object.fromEntries(heatNetworks.map(network => {
			return [
				network.data.id,
				{
					label: network.data.name,
					value: network.data.id,
				},
			];
		}));
	});
	const hasHeatNetworkOptions = computed(() => Object.keys(heatNetworkOptions.value).length > 0);
	const defaultAssociatedHeatNetworkId = computed(() => {
		const optionIds = Object.keys(heatNetworkOptions.value);
		return optionIds.length === 1 ? optionIds[0] : undefined;
	});

	return { heatNetworkOptions, hasHeatNetworkOptions, defaultAssociatedHeatNetworkId };
}