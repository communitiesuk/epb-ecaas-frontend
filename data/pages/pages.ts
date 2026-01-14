import type { Page } from "./pages.types";
import domesticHotWaterPages from "./domesticHotWater";
import dwellingDetailsPages from "./dwellingDetails";
import spaceHeatingPages from "./spaceHeating";
import infiltrationAndVentilationPages from "./infiltrationAndVentilation";
import dwellingFabricPages from "./dwellingFabric";
import pvAndBatteriesPages from "./pvAndBatteries";
import coolingPages from "./cooling";
import spaceHeatingNewPages from "./spaceHeatingNew";

const pagesData = [
	{
		id: "taskList",
		title: "Overview",
		url: "/",
		type: "root",
	},
	...dwellingDetailsPages,
	...dwellingFabricPages,
	...infiltrationAndVentilationPages,
	...spaceHeatingPages,
	...spaceHeatingNewPages,
	// ...restOfDwellingPages,
	...domesticHotWaterPages,
	...pvAndBatteriesPages,
	...coolingPages,
	{
		id: "outputs",
		title: "Outputs",
		url: "/outputs",
		type: "outputs",
		parentId: "taskList",
	},
] as const satisfies Array<Page>;

// above uses as const so we can export static PageId string union type here
export type PageId = (typeof pagesData)[number]["id"];

// now re-assign so we can export as Array<Page>
const pagesDataAsArray: Array<Page> = pagesData;

export function page(pageId: PageId): Page {
	return pagesDataAsArray.find(p => pageId === p.id)!;
}

export default pagesDataAsArray;