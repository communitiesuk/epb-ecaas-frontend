import { PageType  } from "./pages.types";
import type {Page} from "./pages.types";

const coolingPages: Array<Page> = [
	{
		id: 'cooling',
		title: 'Cooling',
		url: '/cooling',
		type: PageType.Section,
		parentId: 'taskList'
	},
	{
		id: 'airConditioning',
		title: 'Air conditioning',
		url: '/cooling/air-conditioning/create',
		type: PageType.Task,
		parentId: 'cooling'
	},
	{
		id: 'airConditioningEdit',
		title: 'Air conditioning',
		url: '/cooling/air-conditioning/:airConditioning',
		type: PageType.Task,
		parentId: 'cooling'
	},
	{
		id: 'coolingSummary',
		title: 'Summary',
		url: '/cooling/summary',
		type: PageType.Summary,
		parentId: 'cooling'
	}
];

export default coolingPages;