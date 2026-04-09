import type { Page } from "./pages.types";

const restOfDwellingPages = [
	{
		id: "restOfDwelling",
		title: "Rest of dwelling fabric",
		url: "/rest-of-dwelling",
		type: "section",
		parentId: "taskList",
	},
	{
		id: "restOfDwellingZoneParameters",
		title: "Zone parameters",
		url: "/rest-of-dwelling/zone-parameters",
		type: "task",
		parentId: "restOfDwelling",
	},
	{
		id: "restOfDwellingFloors",
		title: "Floors",
		url: "/rest-of-dwelling/floors",
		type: "task",
		parentId: "restOfDwelling",
	},
	{
		id: "restOfDwellingWalls",
		title: "Walls",
		url: "/rest-of-dwelling/walls",
		type: "task",
		parentId: "restOfDwelling",
	},
	{
		id: "restOfDwellingWindowsAndDoors",
		title: "Windows and doors",
		url: "/rest-of-dwelling/windows-and-doors",
		type: "task",
		parentId: "restOfDwelling",
	},
	{
		id: "restOfDwellingRoofAndCeiling",
		title: "Roof and ceiling",
		url: "/rest-of-dwelling/roof-and-ceiling",
		type: "task",
		parentId: "restOfDwelling",
	},
	{
		id: "restOfDwellingThermalBridges",
		title: "Thermal bridges",
		url: "/rest-of-dwelling/thermal-bridges",
		type: "task",
		parentId: "restOfDwelling",
	},
	{
		id: "restOfDwellingSummary",
		title: "Summary",
		url: "/rest-of-dwelling/summary",
		type: "summary",
		parentId: "restOfDwelling",
	},
] as const satisfies Array<Page>;

export default restOfDwellingPages;