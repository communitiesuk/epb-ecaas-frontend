import { PageType, type Page } from "./pages.types";
import domesticHotWaterPages from "./domesticHotWater";
import dwellingDetailsPages from "./dwellingDetails";
import heatingSystemsPages from "./heatingSystems";
import infiltrationAndVentilationPages from "./infiltrationAndVentilation";
import dwellingFabricPages from "./dwellingFabric";
import pvAndBatteriesPages from "./pvAndBatteries";

const pagesData: Array<Page> = [
	{
		id: 'taskList',
		title: 'Task list',
		url: '/',
		type: PageType.Root,
	},
	...dwellingDetailsPages,
	...infiltrationAndVentilationPages,
	...heatingSystemsPages,
	...dwellingFabricPages,
	// ...restOfDwellingPages,
	...domesticHotWaterPages,
	...pvAndBatteriesPages,
];

export default pagesData;