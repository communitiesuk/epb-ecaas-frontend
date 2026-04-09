import type { Page } from "./pages.types";

const dwellingDetailsPages = [
	{
		id: "dwellingDetails",
		title: "Dwelling details",
		url: "/dwelling-details",
		type: "section",
		parentId: "taskList",
	},
	{
		id: "generalSpecifications",
		title: "General details",
		url: "/dwelling-details/general-details",
		type: "task",
		parentId: "dwellingDetails",
	},
	{
		id: "externalFactors",
		title: "External factors",
		url: "/dwelling-details/external-factors",
		type: "task",
		parentId: "dwellingDetails",
	},
	{
		id: "shading",
		title: "Shading",
		url: "/dwelling-details/shading",
		type: "task",
		parentId: "dwellingDetails",
	},
	{
		id: "calculatingDistantShading",
		title: "Calculating distant shading",
		url: "/dwelling-details/shading/calculating-distant-shading",
		type: "content",
		parentId: "shading",
	},
	{
		id: "shadingCreate",
		title: "Create",
		url: "/dwelling-details/shading/create",
		type: "task",
		parentId: "shading",
	},
	{
		id: "shadingEdit",
		title: "Edit",
		url: "/dwelling-details/shading/:shading",
		type: "task",
		parentId: "shading",
	},
	{
		id: "appliances",
		title: "Appliances",
		url: "/dwelling-details/appliances",
		type: "task",
		parentId: "dwellingDetails",
	},
	{
		id: "dwellingDetailsSummary",
		title: "Summary",
		url: "/dwelling-details/summary",
		type: "summary",
		parentId: "dwellingDetails",
	},
] as const satisfies Array<Page>;

export default dwellingDetailsPages;