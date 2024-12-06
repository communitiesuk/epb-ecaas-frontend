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
		id: 'livingSpace',
		title: 'Living Space',
		url: '/living-space',
		parentId: 'overview'
	},
	{
		id: 'restOfDwelling',
		title: 'Rest of Dwelling',
		url: '/rest-of-dwelling',
		parentId: 'overview'
	}
]

export default pagesData;