import { PageType  } from "./pages.types";
import type {Page} from "./pages.types";

const restOfDwellingPages = [
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
	}
] as const satisfies Array<Page>;

export default restOfDwellingPages;