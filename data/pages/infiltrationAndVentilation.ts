import { PageType, type Page } from "./pages.types";

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
		id: 'ventilation',
		title: 'Ventilation',
		url: '/infiltration-and-ventilation/ventilation',
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
	{
		id: 'combustionAppliances',
		title: 'Combustion appliances',
		url: '/infiltration-and-ventilation/combustion-appliances',
		type: PageType.TaskGroup,
		parentId: 'infiltrationAndVentilation'
	},
	{
		id: 'combustionAppliancesOpenFireplace',
		title: 'Open fireplace',
		url: '/infiltration-and-ventilation/combustion-appliances/open-fireplace/:combustion',
		type: PageType.Task,
		parentId: 'combustionAppliances'
	},
	{
		id: 'combustionAppliancesClosedFireplaceWithFan',
		title: 'Closed fireplace with fan',
		url: '/infiltration-and-ventilation/combustion-appliances/closed-fireplace-with-fan/:combustion',
		type: PageType.Task,
		parentId: 'combustionAppliances'
	},
	{
		id: 'combustionAppliancesOpenGasFlueBalancer',
		title: 'Open gas flue balancer',
		url: '/infiltration-and-ventilation/combustion-appliances/open-gas-flue-balancer/:combustion',
		type: PageType.Task,
		parentId: 'combustionAppliances'
	},
	{
		id: 'combustionAppliancesOpenGasKitchenStove',
		title: 'Open gas kitchen stove',
		url: '/infiltration-and-ventilation/combustion-appliances/open-gas-kitchen-stove/:combustion',
		type: PageType.Task,
		parentId: 'combustionAppliances'
	},
	{
		id: 'combustionAppliancesOpenGasFire',
		title: 'Open gas fire',
		url: '/infiltration-and-ventilation/combustion-appliances/open-gas-fire/:combustion',
		type: PageType.Task,
		parentId: 'combustionAppliances'
	},
	{
		id: 'combustionAppliancesClosedFire',
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