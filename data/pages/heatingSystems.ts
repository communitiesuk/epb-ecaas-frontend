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
		id: 'heatEmitting',
		title: 'Heat emitting',
		url: '/heating-systems/heat-emitting',
		type: PageType.Task,
		parentId: 'heatingSystems'
	},
	{
		id: 'heatingSystemsSummary',
		title: 'Summary',
		url: '/heating-systems/summary',
		type: PageType.Summary,
		parentId: 'heatingSystems'
	}
];

export default heatingSystemsPages;