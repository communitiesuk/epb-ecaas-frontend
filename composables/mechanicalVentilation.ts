import { duplicateFormEntry } from "~/utils/duplicateFormEntry";

export function useMechanicalVentilation() {
	const store = useEcaasStore();

	const removeMechanicalVents = (packageProductIds: string[]) => {
		store.$patch(state => {
			const mechanicalVentilationData = state.infiltrationAndVentilation.mechanicalVentilation.data;
			const packageProductIndex = mechanicalVentilationData.findIndex(x => packageProductIds.includes(x.data.id!));

			if (packageProductIndex >= 0) {
				mechanicalVentilationData.splice(packageProductIndex, 1);
			}
		});
	};

	const duplicateMechanicalVent = (
		state: EcaasState,
		packageProductIds: string[],
	) => {
		const mechanicalVentilationData = state.infiltrationAndVentilation.mechanicalVentilation.data;
		const packageItem = mechanicalVentilationData.find(x => packageProductIds.includes(x.data.id!));

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