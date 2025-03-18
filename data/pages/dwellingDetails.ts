import { PageType, type Page } from "../pages.types";

const dwellingDetailsPages: Array<Page> = [
	{
		id: 'dwellingDetails',
		title: 'Dwelling details',
		url: '/dwelling-details',
		type: PageType.Section,
		parentId: 'taskList'
	},
	{
		id: 'generalSpecifications',
		title: 'General specifications',
		url: '/dwelling-details/general-specifications',
		type: PageType.Task,
		parentId: 'dwellingDetails'
	},
	{
		id: 'externalFactors',
		title: 'External factors',
		url: '/dwelling-details/external-factors',
		type: PageType.Task,
		parentId: 'dwellingDetails'
	},
	{
		id: 'shading',
		title: 'Shading',
		url: '/dwelling-details/shading',
		type: PageType.Task,
		parentId: 'dwellingDetails'
	},
	{
		id: 'shadingCreate',
		title: 'Create',
		url: '/dwelling-details/shading/create',
		type: PageType.Task,
		parentId: 'shading'
	},
	{
		id: 'shadingEdit',
		title: 'Edit',
		url: '/dwelling-details/shading/:shading',
		type: PageType.Task,
		parentId: 'shading'
	},
	{
		id: 'appliances',
		title: 'Appliances',
		url: '/dwelling-details/appliances',
		type: PageType.Task,
		parentId: 'dwellingDetails'
	},
	{
		id: 'dwellingDetailsSummary',
		title: 'Summary',
		url: '/dwelling-details/summary',
		type: PageType.Summary,
		parentId: 'dwellingDetails'
	}
];

export default dwellingDetailsPages;