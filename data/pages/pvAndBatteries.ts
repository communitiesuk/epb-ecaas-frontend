import { PageType } from "./pages.types";
import type { Page } from "./pages.types";

const pvAndBatteriesPages = [
	{
		id: "pvAndBatteries",
		title: "PV and electric batteries",
		url: "/pv-and-batteries",
		type: PageType.Section,
		parentId: "taskList",
	},
	{
		id: "pvSystems",
		title: "PV System",
		url: "/pv-and-batteries/pv-systems/create",
		type: PageType.Task,
		parentId: "pvAndBatteries",
	},
	{
		id: "pvSystemEdit",
		title: "PV System",
		url: "/pv-and-batteries/pv-systems/:system",
		type: PageType.Task,
		parentId: "pvAndBatteries",
	},
	{
		id: "electricBattery",
		title: "Electric battery",
		url: "/pv-and-batteries/electric-battery",
		type: PageType.Task,
		parentId: "pvAndBatteries",
	},
	{
		id: "diverters",
		title: "Diverters",
		url: "/pv-and-batteries/diverters",
		type: PageType.Task,
		parentId: "pvAndBatteries",
	},
	{
		id: "pvStorageSummary",
		title: "Summary",
		url: "/pv-and-batteries/summary",
		type: PageType.Summary,
		parentId: "pvAndBatteries",
	},
] as const satisfies Array<Page>;

export default pvAndBatteriesPages;
