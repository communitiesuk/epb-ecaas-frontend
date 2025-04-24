export const checkMvhrHasDuctwork = () => {
	const store = useEcaasStore();

	let mvhrArray = store.infiltrationAndVentilation.mechanicalVentilation.data.filter(x => x.typeOfMechanicalVentilationOptions === 'mvhr');

	const ductworkArray = store.infiltrationAndVentilation.ductwork.data.map(x => x.mvhrUnit);
	const uniqueDuctworkArray = [...new Set(ductworkArray)];

	for(let i = 0; i < uniqueDuctworkArray.length; i++){
		mvhrArray = mvhrArray.filter(x => x.id !== uniqueDuctworkArray[i]);
	}

	return mvhrArray.length == 0;
};