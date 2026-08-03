export const checkDuctworkRequirementsMet = () => {
	const store = useEcaasStore();

	const ventilationRequiringDuctwork = store.infiltrationAndVentilation.mechanicalVentilation.data.filter(
		x =>
			x.data?.typeOfMechanicalVentilationOptions === "MVHR" ||
			x.data?.typeOfMechanicalVentilationOptions === "Centralised MV",
	);

	const ductworkUnits = store.infiltrationAndVentilation.ductwork.data.map(
		x => x.data.mvhrUnit,
	);

	return ventilationRequiringDuctwork.every(
		x => ductworkUnits.includes(x.data.id),
	);
};