export enum PageType {
	Section,
	Task,
	Summary
};

export interface Page {
	id: string;
	title: string;
	url: string;
	type?: PageType;
	parentId?: string;
}

const pagesData: Array<Page> = [
	{
		id: 'taskList',
		title: 'Task list',
		url: '/',
	},
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
		id: 'appliances',
		title: 'Appliances',
		url: '/dwelling-details/appliances',
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
		id: 'dwellingDetailsSummary',
		title: 'Summary',
		url: '/dwelling-details/summary',
		type: PageType.Summary,
		parentId: 'dwellingDetails'
	},
	{
		id: 'infiltrationAndVentilation',
		title: 'Infiltration and ventilation',
		url: '/infiltration-and-ventilation',
		type: PageType.Section,
		parentId: 'taskList'
	},{
		id: 'infiltration',
		title: 'Infiltration',
		url: '/infiltration-and-ventilation/infiltration',
		type: PageType.Task,
		parentId: 'infiltrationAndVentilation'
	},
	{
		id: 'chimneysAndFlues',
		title: 'Chimneys and flues',
		url: '/infiltration-and-ventilation/chimneys-and-flues',
		type: PageType.Task,
		parentId: 'infiltrationAndVentilation'
	},
	{
		id: 'ventilation',
		title: 'Ventilation',
		url: '/infiltration-and-ventilation/ventilation',
		type: PageType.Task,
		parentId: 'infiltrationAndVentilation'
	},
	{
		id: 'infiltrationAndVentilationSummary',
		title: 'Summary',
		url: '/infiltration-and-ventilation/summary',
		type: PageType.Summary,
		parentId: 'infiltrationAndVentilation'
	},
	{
		id: 'livingSpace',
		title: 'Living Space Fabric',
		url: '/living-space',
		type: PageType.Section,
		parentId: 'taskList'
	},
	{
		id: 'livingSpaceZoneParameters',
		title: 'Zone parameters',
		url: '/living-space/zone-parameters',
		type: PageType.Task,
		parentId: 'livingSpace'
	},
	{
		id: 'livingSpaceFloors',
		title: 'Floors',
		url: '/living-space/floors',
		type: PageType.Task,
		parentId: 'livingSpace'
	},
	{
		id: 'livingSpaceWalls',
		title: 'Walls',
		url: '/living-space/walls',
		type: PageType.Task,
		parentId: 'livingSpace'
	},
	{
		id: 'livingSpaceWindowsAndDoors',
		title: 'Windows and doors',
		url: '/living-space/windows-and-doors',
		type: PageType.Task,
		parentId: 'livingSpace'
	},
	{
		id: 'livingSpaceRoofAndCeiling',
		title: 'Roof and ceiling',
		url: '/living-space/roof-and-ceiling',
		type: PageType.Task,
		parentId: 'livingSpace'
	},
	{
		id: 'livingSpaceThermalBridges',
		title: 'Thermal Bridges',
		url: '/living-space/thermal-bridges',
		type: PageType.Task,
		parentId: 'livingSpace'
	},
	{
		id: 'livingSpaceSummary',
		title: 'Summary',
		url: '/living-space/summary',
		type: PageType.Summary,
		parentId: 'livingSpace'
	},
	{
		id: 'restOfDwelling',
		title: 'Rest of dwelling fabric',
		url: '/rest-of-dwelling',
		type: PageType.Section,
		parentId: 'taskList'
	},
	{
		id: 'restOfDwellingZoneParameters',
		title: 'Zone parameters',
		url: '/rest-of-dwelling/zone-parameters',
		type: PageType.Task,
		parentId: 'restOfDwelling'
	},
	{
		id: 'restOfDwellingFloors',
		title: 'Floors',
		url: '/rest-of-dwelling/floors',
		type: PageType.Task,
		parentId: 'restOfDwelling'
	},
	{
		id: 'restOfDwellingWalls',
		title: 'Walls',
		url: '/rest-of-dwelling/walls',
		type: PageType.Task,
		parentId: 'restOfDwelling'
	},
	{
		id: 'restOfDwellingWindowsAndDoors',
		title: 'Windows and doors',
		url: '/rest-of-dwelling/windows-and-doors',
		type: PageType.Task,
		parentId: 'restOfDwelling'
	},
	{
		id: 'restOfDwellingRoofAndCeiling',
		title: 'Roof and ceiling',
		url: '/rest-of-dwelling/roof-and-ceiling',
		type: PageType.Task,
		parentId: 'restOfDwelling'
	},
	{
		id: 'restOfDwellingThermalBridges',
		title: 'Thermal bridges',
		url: '/rest-of-dwelling/thermal-bridges',
		type: PageType.Task,
		parentId: 'restOfDwelling'
	},
	{
		id: 'restOfDwellingSummary',
		title: 'Summary',
		url: '/rest-of-dwelling/summary',
		type: PageType.Summary,
		parentId: 'restOfDwelling'
	},
	{
		id: 'heatingSystems',
		title: 'Heating systems',
		url: '/heating-systems',
		type: PageType.Section,
		parentId: 'taskList'
	},
	{
		id: 'heatSource',
		title: 'Heat source',
		url: '/heating-systems/heat-source',
		type: PageType.Task,
		parentId: 'heatingSystems'
	},
	{
		id: 'spaceHeating',
		title: 'Space heating',
		url: '/heating-systems/space-heating',
		type: PageType.Task,
		parentId: 'heatingSystems'
	},
	{
		id: 'waterHeating',
		title: 'Water heating',
		url: '/heating-systems/water-heating',
		type: PageType.Task,
		parentId: 'heatingSystems'
	},
	{
		id: 'heatSourceSummary',
		title: 'Summary',
		url: '/heating-systems/summary',
		type: PageType.Summary,
		parentId: 'heatingSystems'
	},
	{
		id: 'hotWaterOutlets',
		title: 'Hot water outlets',
		url: '/hot-water-outlets',
		type: PageType.Section,
		parentId: 'taskList'
	},
	{
		id: 'wasteWaterRecoverySystems',
		title: 'Waste water recovery systems',
		url: '/hot-water-outlets/waste-water-recovery-systems',
		type: PageType.Task,
		parentId: 'hotWaterOutlets'
	},
	{
		id: 'hotWaterOutletsHotWaterOutlets',
		title: 'Hot water outlets',
		url: '/hot-water-outlets/hot-water-outlets',
		type: PageType.Task,
		parentId: 'hotWaterOutlets'
	},
	{
		id: 'hotWaterDistribution',
		title: 'Hot water distribution',
		url: '/hot-water-outlets/hot-water-distribution',
		type: PageType.Task,
		parentId: 'hotWaterOutlets'
	},
	{
		id: 'hotWaterDistributionCreate',
		title: 'Create',
		url: '/hot-water-outlets/hot-water-distribution/create',
		type: PageType.Task,
		parentId: 'hotWaterDistribution'
	},
	{
		id: 'hotWaterDistributionEdit',
		title: 'Edit',
		url: '/hot-water-outlets/hot-water-distribution/:distribution',
		type: PageType.Task,
		parentId: 'hotWaterDistribution'
	},
	{
		id: 'hotWaterOutletsSummary',
		title: 'Summary',
		url: '/hot-water-outlets/summary',
		type: PageType.Summary,
		parentId: 'hotWaterOutlets'
	},
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
	},
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
		url: '/cooling/air-conditioning',
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

export default pagesData;