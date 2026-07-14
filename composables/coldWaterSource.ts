import { typeOfColdWaterSource } from "~/stores/ecaasStore.schema";

export function useColdWaterSource() {
	const store = useEcaasStore();
	type ColdWaterSourceKey = keyof typeof typeOfColdWaterSource;

	const { wwhrs, preheatedWaterStorage, waterStorage } = store.domesticHotWater;

	const getColdWaterSource = (form: { id?: string; coldWaterSource?: string; }) => {
		if (form.coldWaterSource) {
			const linkedColdWaterSource = [...wwhrs.data, ...preheatedWaterStorage.data, ...waterStorage.data]
				.find(x => x.data.id === form.coldWaterSource);

			if (linkedColdWaterSource) {
				return getColdWaterSource(linkedColdWaterSource.data);
			}

			if (form.coldWaterSource in typeOfColdWaterSource) {
				return typeOfColdWaterSource[form.coldWaterSource as ColdWaterSourceKey];
			}
		}

		return undefined;
	};

	const getColdWaterSourceDisplay = (form: { id?: string; coldWaterSource?: string; }) => {
		if (form.coldWaterSource) {
			const associatedItems = useAssociatedItems(["wwhrs", "preheatedWaterStorage", "waterStorage"]);
			const linkedColdWaterSource = associatedItems.find(x => x[0] === form.coldWaterSource);

			if (linkedColdWaterSource) {
				return linkedColdWaterSource[1];
			}

			if (form.coldWaterSource in typeOfColdWaterSource) {
				return typeOfColdWaterSource[form.coldWaterSource as ColdWaterSourceKey];
			}
		}

		return undefined;
	};

	return {
		getColdWaterSource,
		getColdWaterSourceDisplay,
	};
}