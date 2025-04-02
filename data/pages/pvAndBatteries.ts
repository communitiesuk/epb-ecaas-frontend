import { PageType, type Page } from "./pages.types";

const pvAndBatteriesPages: Array<Page> = [
	{
		id: 'pvAndBatteries',
		title: 'PV and electric batteries',
		url: '/pv-and-batteries',
		type: PageType.Section,
		parentId: 'taskList'
	},
	{
		id: 'pvSystem',
		title: 'PV System',
		url: '/pv-and-batteries/pv-system/create',
		type: PageType.Task,
		parentId: 'pvAndBatteries'
	},
	{
		id: 'pvSystemEdit',
		title: 'PV System',
		url: '/pv-and-batteries/pv-system/:system',
		type: PageType.Task,
		parentId: 'pvAndBatteries'
	},
	{
		id: 'electricBattery',
		title: 'Electric battery',
		url: '/pv-and-batteries/electric-battery/create',
		type: PageType.Task,
		parentId: 'pvAndBatteries'
	},
	{
		id: 'electricBatteryEdit',
		title: 'Electric battery',
		url: '/pv-and-batteries/electric-battery/:battery',
		type: PageType.Task,
		parentId: 'pvAndBatteries'
	},
	{
		id: 'pvDiverter',
		title: 'PV diverter',
		url: '/pv-and-batteries/pv-diverter/create',
		type: PageType.Task,
		parentId: 'pvAndBatteries'
	},
	{
		id: 'pvDiverterEdit',
		title: 'PV diverter',
		url: '/pv-and-batteries/pv-diverter/:diverter',
		type: PageType.Task,
		parentId: 'pvAndBatteries'
	},
	{
		id: 'pvStorageSummary',
		title: 'Summary',
		url: '/pv-and-batteries/summary',
		type: PageType.Summary,
		parentId: 'pvAndBatteries'
	}
];

export default pvAndBatteriesPages;