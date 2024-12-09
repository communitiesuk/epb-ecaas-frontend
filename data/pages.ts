export interface Page {
	id: string,
	title: string,
	url: string,
	parentId?: string
}

const pagesData: Array<Page> = [
	{
		id: 'overview',
		title: 'Overview',
		url: '/',
	},
	{
		id: 'dwellingDetails',
		title: 'Dwelling details',
		url: '/dwelling-details',
		parentId: 'overview'
	},
	{
		id: 'generalSpecifications',
		title: 'General specifications',
		url: '/dwelling-details/general-specifications',
		parentId: 'dwellingDetails'
	},
	{
		id: 'appliancesAndElectricity',
		title: 'Appliances and electricity',
		url: '/dwelling-details/appliances-and-electricity',
		parentId: 'dwellingDetails'
	},
	{
		id: 'hotWaterDistribution',
		title: 'Hot water distribution',
		url: '/dwelling-details/hot-water-distribution',
		parentId: 'dwellingDetails'
	},
	{
		id: 'shading',
		title: 'Shading',
		url: '/dwelling-details/shading',
		parentId: 'dwellingDetails'
	},
	{
		id: 'dwellingDetailsSummary',
		title: 'Summary',
		url: '/dwelling-details/summary',
		parentId: 'dwellingDetails'
	},
	{
		id: 'infiltrationAndVentilation',
		title: 'Infiltration and ventilation',
		url: '/infiltration-and-ventilation',
		parentId: 'overview'
	},{
		id: 'infiltration',
		title: 'Infiltration',
		url: '/infiltration-and-ventilation/infiltration',
		parentId: 'infiltrationAndVentilation'
	},
	{
		id: 'chimneysAndFlues',
		title: 'Chimneys and flues',
		url: '/infiltration-and-ventilation/chimneys-and-flues',
		parentId: 'infiltrationAndVentilation'
	},
	{
		id: 'ventilation',
		title: 'Ventilation',
		url: '/infiltration-and-ventilation/ventilation',
		parentId: 'infiltrationAndVentilation'
	},
	{
		id: 'infiltrationAndVentilationSummary',
		title: 'Summary',
		url: '/infiltration-and-ventilation/summary',
		parentId: 'infiltrationAndVentilation'
	},
	{
		id: 'livingSpace',
		title: 'Living Space',
		url: '/living-space',
		parentId: 'overview'
	},
	{
		id: 'livingSpaceZoneParameters',
		title: 'Zone parameters',
		url: '/living-space/zone-parameters',
		parentId: 'livingSpace'
	},
	{
		id: 'livingSpaceFloors',
		title: 'Floors',
		url: '/living-space/floors',
		parentId: 'livingSpace'
	},
	{
		id: 'livingSpaceWalls',
		title: 'Walls',
		url: '/living-space/walls',
		parentId: 'livingSpace'
	},
	{
		id: 'livingSpaceWindowsAndDoors',
		title: 'Windows and doors',
		url: '/living-space/windows-and-doors',
		parentId: 'livingSpace'
	},
	{
		id: 'livingSpaceRoofAndCeiling',
		title: 'Roof and ceiling',
		url: '/living-space/roof-and-ceiling',
		parentId: 'livingSpace'
	},
	{
		id: 'livingSpaceThermalBridges',
		title: 'Thermal Bridges',
		url: '/living-space/thermal-bridges',
		parentId: 'livingSpace'
	},
	{
		id: 'livingSpaceSummary',
		title: 'Summary',
		url: '/living-space/summary',
		parentId: 'livingSpace'
	},
	{
		id: 'restOfDwelling',
		title: 'Rest of Dwelling',
		url: '/rest-of-dwelling',
		parentId: 'overview'
	},
	{
		id: 'restOfDwellingZoneParameters',
		title: 'Zone parameters',
		url: '/rest-of-dwelling/zone-parameters',
		parentId: 'restOfDwelling'
	},
	{
		id: 'restOfDwellingFloors',
		title: 'Floors',
		url: '/rest-of-dwelling/floors',
		parentId: 'restOfDwelling'
	},
	{
		id: 'restOfDwellingWalls',
		title: 'Walls',
		url: '/rest-of-dwelling/walls',
		parentId: 'restOfDwelling'
	},
	{
		id: 'restOfDwellingWindowsAndDoors',
		title: 'Windows and doors',
		url: '/rest-of-dwelling/windows-and-doors',
		parentId: 'restOfDwelling'
	},
	{
		id: 'restOfDwellingRoofAndCeiling',
		title: 'Roof and ceiling',
		url: '/rest-of-dwelling/roof-and-ceiling',
		parentId: 'restOfDwelling'
	},
	{
		id: 'restOfDwellingThermalBridges',
		title: 'Thermal bridges',
		url: '/rest-of-dwelling/thermal-bridges',
		parentId: 'restOfDwelling'
	},
	{
		id: 'restOfDwellingSummary',
		title: 'Summary',
		url: '/rest-of-dwelling/summary',
		parentId: 'restOfDwelling'
	},
	{
		id: 'heatingSystems',
		title: 'Heating systems',
		url: '/heating-systems',
		parentId: 'overview'
	},
	{
		id: 'heatSource',
		title: 'Heat source',
		url: '/heating-systems/heat-source',
		parentId: 'heatingSystems'
	},
	{
		id: 'spaceHeating',
		title: 'Space heating',
		url: '/heating-systems/space-heating',
		parentId: 'heatingSystems'
	},
	{
		id: 'waterHeating',
		title: 'Water heating',
		url: '/heating-systems/water-heating',
		parentId: 'heatingSystems'
	},
	{
		id: 'heatSourceSummary',
		title: 'Summary',
		url: '/heating-systems/summary',
		parentId: 'heatingSystems'
	},
	{
		id: 'hotWaterOutlets',
		title: 'Hot water outlets',
		url: '/hot-water-outlets',
		parentId: 'overview'
	},
	{
		id: 'wasteWaterRecoverySystems',
		title: 'Waste water recovery systems',
		url: '/hot-water-outlets/waste-water-recovery-systems',
		parentId: 'hotWaterOutlets'
	},
	{
		id: 'hotWaterOutletsHotWaterOutlets',
		title: 'Hot water outlets',
		url: '/hot-water-outlets/hot-water-outlets',
		parentId: 'hotWaterOutlets'
	},
	{
		id: 'hotWaterOutletsSummary',
		title: 'Summary',
		url: '/hot-water-outlets/summary',
		parentId: 'hotWaterOutlets'
	},
	{
		id: 'pvStorage',
		title: 'PV storage',
		url: '/pv-storage',
		parentId: 'overview'
	},
	{
		id: 'solarPvArray',
		title: 'Solar PV array',
		url: '/pv-storage/solar-pv-array',
		parentId: 'pvStorage'
	},
	{
		id: 'electricBattery',
		title: 'Electric battery',
		url: '/pv-storage/electric-battery',
		parentId: 'pvStorage'
	},
	{
		id: 'pvDiverter',
		title: 'PV diverter',
		url: '/pv-storage/pv-diverter',
		parentId: 'pvStorage'
	},
	{
		id: 'pvStorageSummary',
		title: 'Summary',
		url: '/pv-storage/summary',
		parentId: 'pvStorage'
	},
	{
		id: 'cooling',
		title: 'Cooling',
		url: '/cooling',
		parentId: 'overview'
	},
	{
		id: 'airConditioning',
		title: 'Air conditioning',
		url: '/cooling/air-conditioning',
		parentId: 'cooling'
	},
	{
		id: 'coolingSummary',
		title: 'Summary',
		url: '/cooling/summary',
		parentId: 'cooling'
	}
]

export default pagesData;