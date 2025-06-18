import { VentType } from "~/schema/api-schema.types";
import { PageType, type Page } from "./pages.types";
import { isEmpty } from "ts-extras";

function noMhvrPresent():boolean {
	const store = useEcaasStore();

	return isEmpty(store.infiltrationAndVentilation.mechanicalVentilation.data.filter(x => x.typeOfMechanicalVentilationOptions === VentType.MVHR));
}

const infiltrationAndVentilationPages: Array<Page> = [
	{
		id: 'infiltrationAndVentilation',
		title: 'Infiltration and ventilation',
		url: '/infiltration-and-ventilation',
		type: PageType.Section,
		parentId: 'taskList'
	},
	{
		id: 'mechanicalVentilation',
		title: 'Mechanical ventilation',
		url: '/infiltration-and-ventilation/mechanical-ventilation',
		type: PageType.Task,
		parentId: 'infiltrationAndVentilation'
	},
	{
		id: 'mechanicalVentilationCreate',
		title: 'Create',
		url: '/infiltration-and-ventilation/mechanical-ventilation/create',
		type: PageType.Task,
		parentId: 'mechanicalVentilation'
	},
	{
		id: 'mechanicalVentilationEdit',
		title: 'Edit',
		url: '/infiltration-and-ventilation/mechanical-ventilation/:mechanical',
		type: PageType.Task,
		parentId: 'mechanicalVentilation'
	},
	{
		id: 'ductwork',
		title: 'MVHR ductwork',
		url: '/infiltration-and-ventilation/ductwork',
		type: PageType.Task,
		parentId: 'infiltrationAndVentilation',
		excludeFromNavigation: noMhvrPresent
	},
	{
		id: 'ductworkCreate',
		title: 'Create',
		url: '/infiltration-and-ventilation/ductwork/create',
		type: PageType.Task,
		parentId: 'ductwork'
	},
	{
		id: 'ductworkEdit',
		title: 'Edit',
		url: '/infiltration-and-ventilation/ductwork/:ductwork',
		type: PageType.Task,
		parentId: 'ductwork'
	},
	{
		id: 'vents',
		title: 'Vents',
		url: '/infiltration-and-ventilation/vents',
		type: PageType.Task,
		parentId: 'infiltrationAndVentilation'
	},
	{
		id: 'vent',
		title: 'Vent',
		url: '/infiltration-and-ventilation/vents/:vent',
		type: PageType.Task,
		parentId: 'vents'
	},
	{
		id: 'ventCreate',
		title: 'Vent',
		url: '/infiltration-and-ventilation/vents/create',
		type: PageType.Task,
		parentId: 'vents'
	},
	{
		id: 'naturalVentilation',
		title: 'Natural ventilation',
		url: '/infiltration-and-ventilation/natural-ventilation',
		type: PageType.Task,
		parentId: 'infiltrationAndVentilation'
	},
	{
		id: 'airPermeability',
		title: 'Air permeability',
		url: '/infiltration-and-ventilation/air-permeability',
		type: PageType.Task,
		parentId: 'infiltrationAndVentilation'
	},
	// {
	// 	id: 'combustionAppliances',
	// 	title: 'Combustion appliances',
	// 	url: '/infiltration-and-ventilation/combustion-appliances',
	// 	type: PageType.TaskGroup,
	// 	parentId: 'infiltrationAndVentilation'
	// },
	{
		id: 'openFireplace',
		title: 'Open fireplace',
		url: '/infiltration-and-ventilation/combustion-appliances/open-fireplace/:combustion',
		type: PageType.Task,
		parentId: 'combustionAppliances'
	},
	{
		id: 'closedFireplaceWithFan',
		title: 'Closed fireplace with fan',
		url: '/infiltration-and-ventilation/combustion-appliances/closed-fireplace-with-fan/:combustion',
		type: PageType.Task,
		parentId: 'combustionAppliances'
	},
	{
		id: 'openGasFlueBalancer',
		title: 'Open gas flue balancer',
		url: '/infiltration-and-ventilation/combustion-appliances/open-gas-flue-balancer/:combustion',
		type: PageType.Task,
		parentId: 'combustionAppliances'
	},
	{
		id: 'openGasKitchenStove',
		title: 'Open gas kitchen stove',
		url: '/infiltration-and-ventilation/combustion-appliances/open-gas-kitchen-stove/:combustion',
		type: PageType.Task,
		parentId: 'combustionAppliances'
	},
	{
		id: 'openGasFire',
		title: 'Open gas fire',
		url: '/infiltration-and-ventilation/combustion-appliances/open-gas-fire/:combustion',
		type: PageType.Task,
		parentId: 'combustionAppliances'
	},
	{
		id: 'closedFire',
		title: 'Closed fire',
		url: '/infiltration-and-ventilation/combustion-appliances/closed-fire/:combustion',
		type: PageType.Task,
		parentId: 'combustionAppliances'
	},
	{
		id: 'infiltrationAndVentilationSummary',
		title: 'Summary',
		url: '/infiltration-and-ventilation/summary',
		type: PageType.Summary,
		parentId: 'infiltrationAndVentilation'
	}
];

export default infiltrationAndVentilationPages;