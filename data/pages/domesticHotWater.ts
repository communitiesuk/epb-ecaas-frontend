import { PageType  } from "./pages.types";
import type {Page} from "./pages.types";

const domesticHotWaterPages = [
	{
		id: 'domesticHotWater',
		title: 'Domestic hot water',
		url: '/domestic-hot-water',
		type: PageType.Section,
		parentId: 'taskList'
	},
	{
		id: 'waterHeating',
		title: 'Water heating',
		url: '/domestic-hot-water/water-heating',
		type: PageType.TaskGroup,
		parentId: 'domesticHotWater'
	},
	{
		id: 'hotWaterCylinder',
		title: 'Hot water cylinder',
		url: '/domestic-hot-water/water-heating/hot-water-cylinder/:hotWaterCylinder',
		type: PageType.Task,
		parentId: 'waterHeating'
	},
	{
		id: 'hotWaterCylinderCreate',
		title: 'Hot water cylinder',
		url: '/domestic-hot-water/water-heating/hot-water-cylinder/create',
		type: PageType.Task,
		parentId: 'waterHeating'
	},
	{
		id: 'immersionHeater',
		title: 'Immersion heater',
		url: '/domestic-hot-water/water-heating/immersion-heater/:immersionHeater',
		type: PageType.Task,
		parentId: 'waterHeating'
	},
	{
		id: 'immersionHeaterCreate',
		title: 'Immersion heater',
		url: '/domestic-hot-water/water-heating/immersion-heater/create',
		type: PageType.Task,
		parentId: 'waterHeating'
	},
	{
		id: 'solarThermal',
		title: 'Solar thermal',
		url: '/domestic-hot-water/water-heating/solar-thermal/:solarThermal',
		type: PageType.Task,
		parentId: 'waterHeating'
	},
	{
		id: 'solarThermalCreate',
		title: 'Solar thermal',
		url: '/domestic-hot-water/water-heating/solar-thermal/create',
		type: PageType.Task,
		parentId: 'waterHeating'
	},
	{
		id: 'pointOfUse',
		title: 'Point of use',
		url: '/domestic-hot-water/water-heating/point-of-use/:pointOfUse',
		type: PageType.Task,
		parentId: 'waterHeating'
	},
	{
		id: 'pointOfUseCreate',
		title: 'Point of use',
		url: '/domestic-hot-water/water-heating/point-of-use/create',
		type: PageType.Task,
		parentId: 'waterHeating'
	},
	{
		id: 'hotWaterheatPump',
		title: 'Heat pump',
		url: '/domestic-hot-water/water-heating/heat-pump/:hotWaterHeatPump',
		type: PageType.Task,
		parentId: 'waterHeating'
	},
	{
		id: 'hotWaterheatPumpCreate',
		title: 'Heat pump',
		url: '/domestic-hot-water/water-heating/heat-pump/create',
		type: PageType.Task,
		parentId: 'waterHeating'
	},
	{
		id: 'combiBoiler',
		title: 'Combi boiler',
		url: '/domestic-hot-water/water-heating/combi-boiler/:combiBoiler',
		type: PageType.Task,
		parentId: 'waterHeating'
	},
	{
		id: 'combiBoilerCreate',
		title: 'Combi boiler',
		url: '/domestic-hot-water/water-heating/combi-boiler/create',
		type: PageType.Task,
		parentId: 'waterHeating'
	},
	{
		id: 'hotWaterHeatBattery',
		title: 'Heat battery',
		url: '/domestic-hot-water/water-heating/heat-battery/:hotWaterHeatBattery',
		type: PageType.Task,
		parentId: 'waterHeating'
	},
	{
		id: 'hotWaterHeatBatteryCreate',
		title: 'Heat battery',
		url: '/domestic-hot-water/water-heating/heat-battery/create',
		type: PageType.Task,
		parentId: 'waterHeating'
	},
	{
		id: 'smartHotWaterTank',
		title: 'Smart hot water tank',
		url: '/domestic-hot-water/water-heating/smart-hot-water-tank/:smartHotWaterTank',
		type: PageType.Task,
		parentId: 'waterHeating'
	},
	{
		id: 'smartHotWaterTankCreate',
		title: 'Smart hot water tank',
		url: '/domestic-hot-water/water-heating/smart-hot-water-tank/create',
		type: PageType.Task,
		parentId: 'waterHeating'
	},
	{
		id: 'hotWaterHeatInterfaceUnit',
		title: 'Heat interface unit',
		url: '/domestic-hot-water/water-heating/heat-interface-unit/:hotWaterHeatInterfaceUnit',
		type: PageType.Task,
		parentId: 'waterHeating'
	},
	{
		id: 'hotWaterHeatInterfaceUnitCreate',
		title: 'Heat interface unit',
		url: '/domestic-hot-water/water-heating/heat-interface-unit/create',
		type: PageType.Task,
		parentId: 'waterHeating'
	},
	{
		id: 'hotWaterOutlets',
		title: 'Hot water outlets',
		url: '/domestic-hot-water/hot-water-outlets',
		type: PageType.TaskGroup,
		parentId: 'domesticHotWater'
	},
	{
		id: 'mixedShower',
		title: 'Mixed shower',
		url: '/domestic-hot-water/hot-water-outlets/mixed-shower/:shower',
		type: PageType.Task,
		parentId: 'hotWaterOutlets'
	},
	{
		id: 'mixedShowerCreate',
		title: 'Mixed shower',
		url: '/domestic-hot-water/hot-water-outlets/mixed-shower/create',
		type: PageType.Task,
		parentId: 'hotWaterOutlets'
	},
	{
		id: 'electricShower',
		title: 'Electric shower',
		url: '/domestic-hot-water/hot-water-outlets/electric-shower/:shower',
		type: PageType.Task,
		parentId: 'hotWaterOutlets'
	},
	{
		id: 'electricShowerCreate',
		title: 'Electric shower',
		url: '/domestic-hot-water/hot-water-outlets/electric-shower/create',
		type: PageType.Task,
		parentId: 'hotWaterOutlets'
	},
	{
		id: 'bath',
		title: 'Bath',
		url: '/domestic-hot-water/hot-water-outlets/bath/:bath',
		type: PageType.Task,
		parentId: 'hotWaterOutlets'
	},
	{
		id: 'bathCreate',
		title: 'Bath',
		url: '/domestic-hot-water/hot-water-outlets/bath/create',
		type: PageType.Task,
		parentId: 'hotWaterOutlets'
	},
	{
		id: 'otherOutlets',
		title: 'Other outlet',
		url: '/domestic-hot-water/hot-water-outlets/other/:outlet',
		type: PageType.Task,
		parentId: 'hotWaterOutlets'
	},
	{
		id: 'otherOutletsCreate',
		title: 'Other outlet',
		url: '/domestic-hot-water/hot-water-outlets/other/create',
		type: PageType.Task,
		parentId: 'hotWaterOutlets'
	},
	{
		id: 'pipework',
		title: 'Pipework',
		url: '/domestic-hot-water/pipework',
		type: PageType.TaskGroup,
		parentId: 'domesticHotWater'
	},
	{
		id: 'primaryPipework',
		title: 'Primary pipework',
		url: '/domestic-hot-water/pipework/primary/:pipe',
		type: PageType.Task,
		parentId: 'pipework'
	},
	{
		id: 'primaryPipeworkCreate',
		title: 'Primary pipework',
		url: '/domestic-hot-water/pipework/primary/create',
		type: PageType.Task,
		parentId: 'pipework'
	},
	{
		id: 'secondaryPipework',
		title: 'Secondary pipework',
		url: '/domestic-hot-water/pipework/secondary/:pipe',
		type: PageType.Task,
		parentId: 'pipework'
	},
	{
		id: 'secondaryPipeworkCreate',
		title: 'Secondary pipework',
		url: '/domestic-hot-water/pipework/secondary/create',
		type: PageType.Task,
		parentId: 'pipework'
	},
	{
		id: 'wwhrsItem',
		title: 'WWHRS',
		url: '/domestic-hot-water/wwhrs/:wwhrs',
		type: PageType.Task,
		parentId: 'wwhrs'
	},
	{
		id: 'wwhrsCreate',
		title: 'WWHRS',
		url: '/domestic-hot-water/wwhrs/create',
		type: PageType.Task,
		parentId: 'wwhrs'
	},
	{
		id: 'domesticHotWaterSummary',
		title: 'Summary',
		url: '/domestic-hot-water/summary',
		type: PageType.Summary,
		parentId: 'domesticHotWater'
	}
] as const satisfies Array<Page>;

export default domesticHotWaterPages;