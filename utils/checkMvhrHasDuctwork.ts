import { VentType } from "~/schema/api-schema.types";

export const checkMvhrHasDuctwork = () => {
	const store = useEcaasStore();

	let mvhrArray = store.infiltrationAndVentilation.mechanicalVentilation.data.filter(x => x.data.typeOfMechanicalVentilationOptions === VentType.MVHR);

	const ductworkArray = store.infiltrationAndVentilation.ductwork.data.map(x => x.data.mvhrUnit);
	const uniqueDuctworkArray = [...new Set(ductworkArray)];

	for(let i = 0; i < uniqueDuctworkArray.length; i++){
		mvhrArray = mvhrArray.filter(x => x.data.id !== uniqueDuctworkArray[i]);
	}

	return mvhrArray.length == 0;
};