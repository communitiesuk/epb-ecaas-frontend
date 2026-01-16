import type { Page } from "./pages.types";

const spaceHeatingNewPages = [
	{
		id: "spaceHeatingNew",
		title: "Space heating NEW",
		url: "/space-heating-new",
		type: "section",
		parentId: "taskList",
	},
	{
		id: "heatSource",
		title: "Heat source",
		url: "/space-heating-new/heat-source/:heatSource",
		type: "task",
		parentId: "spaceHeatingNew",
	},
	{
		id: "heatSourceCreate",
		title: "Heat source",
		url: "/space-heating-new/heat-source/create",
		type: "task",
		parentId: "spaceHeatingNew",
	},
	{
		id: "heatSourceProduct",
		title: "Select a heat pump",
		url: "/space-heating-new/heat-source/:heatSource/:products",
		type: "task",
		parentId: "spaceHeatingNew",
	},
	{
		id: "heatEmitters",
		title: "Heat emitter",
		url: "/space-heating-new/heat-source/:heatEmitter",
		type: "task",
		parentId: "spaceHeatingNew",
	},
	{
		id: "heatEmittersCreate",
		title: "Heat emitter",
		url: "/space-heating-new/heat-emitters/create",
		type: "task",
		parentId: "spaceHeatingNew",
	},
	{
		id: "heatingControls",
		title: "Heating controls",
		url: "/space-heating-new/heating-controls",
		type: "task",
		parentId: "spaceHeatingNew",
	},
	{
		id: "spaceHeatingNewSummary",
		title: "Summary",
		url: "/space-heating-new/summary",
		type: "summary",
		parentId: "spaceHeatingNew",
	},
] as const satisfies Array<Page>;

export default spaceHeatingNewPages;