import type { Page } from "./pages.types";

const pvAndBatteriesPages = [
	{
		id: "pvAndBatteries",
		title: "PV and electric batteries",
		url: "/pv-and-batteries",
		type: "section",
		parentId: "taskList",
	},
	{
		id: "pvs",
		title: "PVs",
		url: "/pv-and-batteries/pvs/create",
		type: "task",
		parentId: "pvAndBatteries",
	},
	{
		id: "pvEdit",
		title: "PV",
		url: "/pv-and-batteries/pvs/:pv",
		type: "task",
		parentId: "pvAndBatteries",
	},
	{
		id: "electricBattery",
		title: "Electric battery",
		url: "/pv-and-batteries/electric-battery",
		type: "task",
		parentId: "pvAndBatteries",
	},
	{
		id: "diverters",
		title: "Diverters",
		url: "/pv-and-batteries/diverters",
		type: "task",
		parentId: "pvAndBatteries",
	},
	{
		id: "pvStorageSummary",
		title: "Summary",
		url: "/pv-and-batteries/summary",
		type: "task",
		parentId: "pvAndBatteries",
	},
] as const satisfies Array<Page>;

export default pvAndBatteriesPages;
