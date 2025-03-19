import { PageType, type Page } from "./pages.types";

const domesticHotWaterPages: Array<Page> = [
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
		id: 'storageTank',
		title: 'Storage tank',
		url: '/domestic-hot-water/water-heating/storage-tank/:storageTank',
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
		id: 'solarThermal',
		title: 'Solar thermal',
		url: '/domestic-hot-water/water-heating/solar-thermal/:solarThermal',
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
		id: 'heatPump',
		title: 'Heat pump',
		url: '/domestic-hot-water/water-heating/heat-pump/:heatPump',
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
		id: 'heatBattery',
		title: 'Heat battery',
		url: '/domestic-hot-water/water-heating/heat-battery/:heatBattery',
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
		id: 'heatInterfaceUnit',
		title: 'Heat interface unit',
		url: '/domestic-hot-water/water-heating/heat-interface-unit/:heatInterfaceUnit',
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
		id: 'electricShower',
		title: 'Electric shower',
		url: '/domestic-hot-water/hot-water-outlets/electric-shower/:shower',
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
		id: 'otherOutlets',
		title: 'Other outlet',
		url: '/domestic-hot-water/hot-water-outlets/other/:outlet',
		type: PageType.Task,
		parentId: 'hotWaterOutlets'
	},
	{
		id: 'pipework',
		title: 'Pipework',
		url: '/domestic-hot-water/pipework',
		type: PageType.Task,
		parentId: 'domesticHotWater'
	},
	{
		id: 'pipe',
		title: 'Pipework',
		url: '/domestic-hot-water/pipework/:pipe',
		type: PageType.Task,
		parentId: 'pipework'
	},
	{
		id: 'wwhrs',
		title: 'WWHRS',
		url: '/domestic-hot-water/wwhrs',
		type: PageType.Task,
		parentId: 'domesticHotWater'
	},
	{
		id: 'domesticHotWaterSummary',
		title: 'Summary',
		url: '/domestic-hot-water/summary',
		type: PageType.Summary,
		parentId: 'domesticHotWater'
	}
];

export default domesticHotWaterPages;