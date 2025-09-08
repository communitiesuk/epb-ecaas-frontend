import { PageType  } from "./pages.types";
import type { Page } from "./pages.types";

const dwellingDetailsPages = [
	{
		id: 'dwellingDetails',
		title: 'Dwelling details',
		url: '/dwelling-details',
		type: PageType.Section,
		parentId: 'taskList'
	},
	{
		id: 'generalSpecifications',
		title: 'General details',
		url: '/dwelling-details/general-details',
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
		id: 'calculatingDistantShading',
		title: 'Calculating distant shading',
		url: '/dwelling-details/shading/calculating-distant-shading',
		type: PageType.Content,
		parentId: 'shading'
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
		id: 'dwellingDetailsSummary',
		title: 'Summary',
		url: '/dwelling-details/summary',
		type: PageType.Summary,
		parentId: 'dwellingDetails'
	}
] as const satisfies Array<Page>;

export default dwellingDetailsPages;