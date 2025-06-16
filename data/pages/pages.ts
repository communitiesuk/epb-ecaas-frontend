import type { Page } from "./pages.types";
import coolingPages from "./cooling";
import domesticHotWaterPages from "./domesticHotWater";
import dwellingDetailsPages from "./dwellingDetails";
import heatingSystemsPages from "./heatingSystems";
import infiltrationAndVentilationPages from "./infiltrationAndVentilation";
import livingSpaceFabricPages from "./livingSpaceFabric";
import restOfDwellingPages from "./restOfDwelling";
import pvAndBatteriesPages from "./pvAndBatteries";

const pagesData: Array<Page> = [
	{
		id: 'taskList',
		title: 'Task list',
		url: '/',
	},
	...dwellingDetailsPages,
	...infiltrationAndVentilationPages,
	...livingSpaceFabricPages,
	...restOfDwellingPages,
	...heatingSystemsPages,
	...domesticHotWaterPages,
	...pvAndBatteriesPages,
	...coolingPages
];

export default pagesData;