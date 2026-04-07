import { duplicateFormEntry } from "~/utils/duplicateFormEntry";

export function useMechanicalVentilation() {
	const store = useEcaasStore();

	const removeMechanicalVents = (packageProductId: string) => {
		store.$patch(state => {
			const mechanicalVentilationData = state.infiltrationAndVentilation.mechanicalVentilation.data;
			const packageProductIndex = mechanicalVentilationData.findIndex(x => x.data.id === packageProductId);

			if (packageProductIndex >= 0) {
				mechanicalVentilationData.splice(packageProductIndex, 1);
			}
		});
	};

	const duplicateMechanicalVent = (
		state: EcaasState,
		packageProductId: string,
	) => {
		const mechanicalVentilationData = state.infiltrationAndVentilation.mechanicalVentilation.data;
		const packageItem = mechanicalVentilationData.find(x => x.data.id === packageProductId);

		if (!packageItem) {
			return;
		}

		const packagedDuplicates = mechanicalVentilationData.filter(x => x && x.data.name.match(duplicateNamePattern(packageItem.data.name)));

		const newPackagedItem = duplicateFormEntry(packageItem, packagedDuplicates.length, false) as EcaasForm<MechanicalVentilationData>;

		mechanicalVentilationData.push(newPackagedItem);
		state.infiltrationAndVentilation.mechanicalVentilation.complete = false;

		return newPackagedItem;
	};

	return {
		removeMechanicalVents,
		duplicateMechanicalVent,
	};
}