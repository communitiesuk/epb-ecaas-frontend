import { PageType } from "./pages.types";
import type { Page } from "./pages.types";

const spaceHeatingNewPages = [
	{
		id: "spaceHeatingNew",
		title: "Space heating NEW",
		url: "/space-heating-new",
		type: PageType.Section,
		parentId: "taskList",
	},
	{
		id: "heatSource",
		title: "Heat source",
		url: "/space-heating-new/heat-source/:heatSource",
		type: PageType.Task,
		parentId: "spaceHeatingNew",
	},
	{
		id: "heatSourceCreate",
		title: "Heat source",
		url: "/space-heating-new/heat-source/create",
		type: PageType.Task,
		parentId: "spaceHeatingNew",
	},
	{
		id: "heatSourceProduct",
		title: "Select a heat pump",
		url: "/space-heating-new/heat-source/:heatSource/:products",
		type: PageType.Task,
		parentId: "spaceHeatingNew",
	},
	{
		id: "spaceHeatingNewSummary",
		title: "Summary",
		url: "/space-heating-new/summary",
		type: PageType.Summary,
		parentId: "spaceHeatingNew",
	},
] as const satisfies Array<Page>;

export default spaceHeatingNewPages;