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
		title: 'General Specifications',
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
		id: 'infiltrationAndVentilation',
		title: 'Infiltration and ventilation',
		url: '/infiltration-and-ventilation',
		parentId: 'overview'
	},
	{
		id: 'livingSpaceFabric',
		title: 'Living space fabric',
		url: '/living-space-fabric',
		parentId: 'overview'
	},
	{
		id: 'restOfDwellingFabric',
		title: 'Rest of dwelling fabric',
		url: '/rest-of-dwelling-fabric',
		parentId: 'overview'
	},
	{
		id: 'heatingSystems',
		title: 'Heating systems',
		url: '/heating-systems',
		parentId: 'overview'
	},
	{
		id: 'hotWaterOutlets',
		title: 'Hot water outlets',
		url: '/hot-water-outlets',
		parentId: 'overview'
	},
	{
		id: 'pvAndEnergyStorage',
		title: 'PV and energy storage',
		url: '/pv-and-energy-storage',
		parentId: 'overview'
	},
	{
		id: 'cooling',
		title: 'Cooling',
		url: '/cooling',
		parentId: 'overview'
	}
]

export default pagesData;