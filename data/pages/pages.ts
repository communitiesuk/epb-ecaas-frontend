import { PageType  } from "./pages.types";
import type {Page} from "./pages.types";
import domesticHotWaterPages from "./domesticHotWater";
import dwellingDetailsPages from "./dwellingDetails";
import heatingSystemsPages from "./heatingSystems";
import infiltrationAndVentilationPages from "./infiltrationAndVentilation";
import dwellingFabricPages from "./dwellingFabric";
import pvAndBatteriesPages from "./pvAndBatteries";

const pagesData = [
	{
		id: 'taskList',
		title: 'Task list',
		url: '/',
		type: PageType.Root,
	},
	...dwellingDetailsPages,
	...dwellingFabricPages,
	...infiltrationAndVentilationPages,
	...heatingSystemsPages,
	// ...restOfDwellingPages,
	...domesticHotWaterPages,
	...pvAndBatteriesPages,
	{
		id: 'outputs',
		title: 'Outputs',
		url: '/outputs',
		type: PageType.Outputs,
		parentId: 'taskList'
	}
] as const satisfies Array<Page>;

// above uses as const so we can export static PageId string union type here
export type PageId = (typeof pagesData)[number]['id'];

// now re-assign so we can export as Array<Page>
const pagesDataAsArray: Array<Page> = pagesData;

export default pagesDataAsArray;