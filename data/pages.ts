import type { Page } from "./pages.types";
import coolingPages from "./pages/cooling";
import domesticHotWaterPages from "./pages/domesticHotWater";
import dwellingDetailsPages from "./pages/dwellingDetails";
import heatingSystemsPages from "./pages/heatingSystems";
import infiltrationAndVentilationPages from "./pages/infiltrationAndVentilation";
import livingSpaceFabricPages from "./pages/livingSpaceFabric";
import pvEnergyStoragePages from "./pages/pvEnergyStorage";
import restOfDwellingPages from "./pages/restOfDwelling";

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
	...pvEnergyStoragePages,
	...coolingPages
];

export default pagesData;