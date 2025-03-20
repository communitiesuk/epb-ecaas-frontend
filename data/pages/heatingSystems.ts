import { PageType, type Page } from "./pages.types";

const heatingSystemsPages: Array<Page> = [
	{
		id: 'heatingSystems',
		title: 'Heating systems',
		url: '/heating-systems',
		type: PageType.Section,
		parentId: 'taskList'
	},
	{
		id: 'energySupply',
		title: 'Energy supply',
		url: '/heating-systems/energy-supply',
		type: PageType.Task,
		parentId: 'heatingSystems'
	},
	{
		id: 'heatGeneration',
		title: 'Heat generation',
		url: '/heating-systems/heat-generation',
		type: PageType.Task,
		parentId: 'heatingSystems'
	},
	{
		id: 'heatPump',
		title: 'Heat pump',
		url: '/heating-systems/heat-generation/heat-pump',
		type: PageType.Task,
		parentId: 'heatGeneration'
	},
	{
		id: 'boiler',
		title: 'Boiler',
		url: '/heating-systems/heat-generation/boiler',
		type: PageType.Task,
		parentId: 'heatGeneration'
	},
	{
		id: 'heatBattery',
		title: 'Heat battery',
		url: '/heating-systems/heat-generation/heat-battery',
		type: PageType.Task,
		parentId: 'heatGeneration'
	},
	{
		id: 'heatNetwork',
		title: 'Heat network',
		url: '/heating-systems/heat-generation/heat-network',
		type: PageType.Task,
		parentId: 'heatGeneration'
	},
	{
		id: 'heatEmitting',
		title: 'Heat emitting',
		url: '/heating-systems/heat-emitting',
		type: PageType.TaskGroup,
		parentId: 'heatingSystems'
	},
	{
		id: 'wetDistribution',
		title: 'Wet distribution',
		url: '/heating-systems/heat-emitting/wet-distribution/:distribution',
		type: PageType.Task,
		parentId: 'heatEmitting'
	},
	{
		id: 'instantElectricHeater',
		title: 'Instant electric heater',
		url: '/heating-systems/heat-emitting/instant-electric-heater/:heater',
		type: PageType.Task,
		parentId: 'heatEmitting'
	},
	{
		id: 'electricStorageHeater',
		title: 'Electric storage heater',
		url: '/heating-systems/heat-emitting/electric-storage-heater/:heater',
		type: PageType.Task,
		parentId: 'heatEmitting'
	},
	{
		id: 'warmAirHeatPump',
		title: 'Warm air heat pump',
		url: '/heating-systems/heat-emitting/warm-air-heat-pump/:pump',
		type: PageType.Task,
		parentId: 'heatEmitting'
	},
	{
		id: 'heatingSystemsSummary',
		title: 'Summary',
		url: '/heating-systems/summary',
		type: PageType.Summary,
		parentId: 'heatingSystems'
	},
];

export default heatingSystemsPages;