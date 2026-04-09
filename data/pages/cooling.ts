import type { Page } from "./pages.types";

const coolingPages = [
	{
		id: "cooling",
		title: "Cooling",
		url: "/cooling",
		type: "section",
		parentId: "taskList",
	},
	{
		id: "airConditioning",
		title: "Air conditioning system",
		url: "/cooling/air-conditioning/:airConditioning",
		type: "task",
		parentId: "cooling",
	},
	{
		id: "airConditioningCreate",
		title: "Air conditioning system",
		url: "/cooling/air-conditioning/create",
		type: "task",
		parentId: "cooling",
	},
	{
		id: "coolingSystemsSummary",
		title: "Summary",
		url: "/cooling/summary",
		type: "summary",
		parentId: "cooling",
	},
] as const satisfies Array<Page>;

export default coolingPages;