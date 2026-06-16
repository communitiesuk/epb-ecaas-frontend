export default defineNuxtPlugin(() => {
	const nuxtApp = useNuxtApp();
	const store = useEcaasStore();

	nuxtApp.hook("app:floor:removed", (id: string) => {
		store.$patch(state => {
			const { dwellingSpaceLinearThermalBridges } = state.dwellingFabric.dwellingSpaceThermalBridging;

			dwellingSpaceLinearThermalBridges.data.forEach(x => {
				const bridge = x.data as LinearThermalBridgeData;

				if ((bridge.typeOfThermalBridge === "E5" ||
					bridge.typeOfThermalBridge === "E6" ||
					bridge.typeOfThermalBridge === "E22"
				) && bridge.associatedItemId === id) {
					x.complete = false;
					dwellingSpaceLinearThermalBridges.complete = false;
				}
			});
		});
	});

	nuxtApp.hook("app:floor:updated", () => {
		store.$patch(state => {
			const { errors } = useJunctionValidation();

			if (errors.length) {
				state.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges.complete = false;
			}
		});
	});
});