import { PageType, type Page } from "../pages.types";

const domesticHotWaterPages: Array<Page> = [
	{
		id: 'domesticHotWater',
		title: 'Domestic hot water',
		url: '/domestic-hot-water',
		type: PageType.Section,
		parentId: 'taskList'
	},
	{
		id: 'waterHeating',
		title: 'Water heating',
		url: '/domestic-hot-water/water-heating',
		type: PageType.Task,
		parentId: 'domesticHotWater'
	},
	{
		id: 'hotWaterOutlets',
		title: 'Hot water outlets',
		url: '/domestic-hot-water/hot-water-outlets',
		type: PageType.TaskGroup,
		parentId: 'domesticHotWater'
	},
	{
		id: 'mixedShower',
		title: 'Mixed shower',
		url: '/domestic-hot-water/hot-water-outlets/mixed-shower/:shower',
		type: PageType.Task,
		parentId: 'hotWaterOutlets'
	},
	{
		id: 'electricShower',
		title: 'Electric shower',
		url: '/domestic-hot-water/hot-water-outlets/electric-shower/:shower',
		type: PageType.Task,
		parentId: 'hotWaterOutlets'
	},
	{
		id: 'bath',
		title: 'Bath',
		url: '/domestic-hot-water/hot-water-outlets/bath/:bath',
		type: PageType.Task,
		parentId: 'hotWaterOutlets'
	},
	{
		id: 'otherOutlets',
		title: 'Other outlet',
		url: '/domestic-hot-water/hot-water-outlets/other/:outlet',
		type: PageType.Task,
		parentId: 'hotWaterOutlets'
	},
	{
		id: 'pipework',
		title: 'Pipework',
		url: '/domestic-hot-water/pipework',
		type: PageType.Task,
		parentId: 'domesticHotWater'
	},
	{
		id: 'pipe',
		title: 'Pipework',
		url: '/domestic-hot-water/pipework/:pipe',
		type: PageType.Task,
		parentId: 'pipework'
	},
	{
		id: 'wwhrs',
		title: 'WWHRS',
		url: '/domestic-hot-water/wwhrs',
		type: PageType.Task,
		parentId: 'domesticHotWater'
	},
	{
		id: 'domesticHotWaterSummary',
		title: 'Summary',
		url: '/domestic-hot-water/summary',
		type: PageType.Summary,
		parentId: 'domesticHotWater'
	}
];

export default domesticHotWaterPages;