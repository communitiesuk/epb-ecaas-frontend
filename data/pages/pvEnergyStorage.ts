import { PageType, type Page } from "./pages.types";

const pvEnergyStoragePages: Array<Page> = [
	{
		id: 'pvStorage',
		title: 'PV and energy storage',
		url: '/pv-storage',
		type: PageType.Section,
		parentId: 'taskList'
	},
	{
		id: 'solarPvArray',
		title: 'Solar PV array',
		url: '/pv-storage/solar-pv-array',
		type: PageType.Task,
		parentId: 'pvStorage'
	},
	{
		id: 'electricBattery',
		title: 'Electric battery',
		url: '/pv-storage/electric-battery',
		type: PageType.Task,
		parentId: 'pvStorage'
	},
	{
		id: 'pvDiverter',
		title: 'PV diverter',
		url: '/pv-storage/pv-diverter',
		type: PageType.Task,
		parentId: 'pvStorage'
	},
	{
		id: 'pvStorageSummary',
		title: 'Summary',
		url: '/pv-storage/summary',
		type: PageType.Summary,
		parentId: 'pvStorage'
	}
];

export default pvEnergyStoragePages;