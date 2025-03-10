export enum PageType {
	Section,
	Task,
	TaskGroup,
	Summary,
};

export interface Page {
	id: string;
	title: string;
	url: string;
	type?: PageType;
	parentId?: string;
}

const pagesData: Array<Page> = [
	{
		id: 'taskList',
		title: 'Task list',
		url: '/',
	},
	{
		id: 'dwellingDetails',
		title: 'Dwelling details',
		url: '/dwelling-details',
		type: PageType.Section,
		parentId: 'taskList'
	},
	{
		id: 'generalSpecifications',
		title: 'General specifications',
		url: '/dwelling-details/general-specifications',
		type: PageType.Task,
		parentId: 'dwellingDetails'
	},
	{
		id: 'externalFactors',
		title: 'External factors',
		url: '/dwelling-details/external-factors',
		type: PageType.Task,
		parentId: 'dwellingDetails'
	},
	{
		id: 'shading',
		title: 'Shading',
		url: '/dwelling-details/shading',
		type: PageType.Task,
		parentId: 'dwellingDetails'
	},
	{
		id: 'appliances',
		title: 'Appliances',
		url: '/dwelling-details/appliances',
		type: PageType.Task,
		parentId: 'dwellingDetails'
	},
	{
		id: 'shadingCreate',
		title: 'Create',
		url: '/dwelling-details/shading/create',
		type: PageType.Task,
		parentId: 'shading'
	},
	{
		id: 'shadingEdit',
		title: 'Edit',
		url: '/dwelling-details/shading/:shading',
		type: PageType.Task,
		parentId: 'shading'
	},
	{
		id: 'dwellingDetailsSummary',
		title: 'Summary',
		url: '/dwelling-details/summary',
		type: PageType.Summary,
		parentId: 'dwellingDetails'
	},
	{
		id: 'infiltrationAndVentilation',
		title: 'Infiltration and ventilation',
		url: '/infiltration-and-ventilation',
		type: PageType.Section,
		parentId: 'taskList'
	},{
		id: 'mechanicalVentilation',
		title: 'Mechanical ventilation',
		url: '/infiltration-and-ventilation/mechanical-ventilation',
		type: PageType.Task,
		parentId: 'infiltrationAndVentilation'
	},
	{
		id: 'mechanicalVentilationCreate',
		title: 'Create',
		url: '/infiltration-and-ventilation/mechanical-ventilation/create',
		type: PageType.Task,
		parentId: 'mechanicalVentilation'
	},
	{
		id: 'mechanicalVentilationEdit',
		title: 'Edit',
		url: '/infiltration-and-ventilation/mechanical-ventilation/:mechanical',
		type: PageType.Task,
		parentId: 'mechanicalVentilation'
	},
	{
		id: 'vents',
		title: 'Vents',
		url: '/infiltration-and-ventilation/vents',
		type: PageType.Task,
		parentId: 'infiltrationAndVentilation'
	},
	{
		id: 'ventilation',
		title: 'Ventilation',
		url: '/infiltration-and-ventilation/ventilation',
		type: PageType.Task,
		parentId: 'infiltrationAndVentilation'
	},
	{
		id: 'airPermeablity',
		title: 'Air Permeablity',
		url: '/infiltration-and-ventilation/air-permeability',
		type: PageType.Task,
		parentId: 'infiltrationAndVentilation'
	},
	{
		id: 'combustionAppliances',
		title: 'Combustion appliances',
		url: '/infiltration-and-ventilation/combustion-appliances',
		type: PageType.TaskGroup,
		parentId: 'infiltrationAndVentilation'
	},
	{
		id: 'combustionAppliancesOpenFireplace',
		title: 'Open fireplace',
		url: '/infiltration-and-ventilation/combustion-appliances/open-fireplace/:combustion-appliance',
		type: PageType.Task,
		parentId: 'combustionAppliances'
	},
	{
		id: 'combustionAppliancesClosedFireplaceWithFan',
		title: 'Closed fireplace with fan',
		url: '/infiltration-and-ventilation/combustion-appliances/closed-fireplace-with-fan/:combustion-appliance',
		type: PageType.Task,
		parentId: 'combustionAppliances'
	},
	{
		id: 'combustionAppliancesOpenGasFlueBalancer',
		title: 'Open gas flue balancer',
		url: '/infiltration-and-ventilation/combustion-appliances/open-gas-flue-balancer/:combustion-appliance',
		type: PageType.Task,
		parentId: 'combustionAppliances'
	},
	{
		id: 'combustionAppliancesOpenGasKitchenStove',
		title: 'Open gas kitchen stove',
		url: '/infiltration-and-ventilation/combustion-appliances/open-gas-kitchen-stove/:combustion-appliance',
		type: PageType.Task,
		parentId: 'combustionAppliances'
	},
	{
		id: 'combustionAppliancesOpenGasFire',
		title: 'Open gas fire',
		url: '/infiltration-and-ventilation/combustion-appliances/open-gas-fire/:combustion-appliance',
		type: PageType.Task,
		parentId: 'combustionAppliances'
	},
	{
		id: 'combustionAppliancesClosedFire',
		title: 'Closed fire',
		url: '/infiltration-and-ventilation/combustion-appliances/closed-fire/:combustion-appliance',
		type: PageType.Task,
		parentId: 'combustionAppliances'
	},
	{
		id: 'infiltrationAndVentilationSummary',
		title: 'Summary',
		url: '/infiltration-and-ventilation/summary',
		type: PageType.Summary,
		parentId: 'infiltrationAndVentilation'
	},
	{
		id: 'livingSpaceFabric',
		title: 'Living space fabric',
		url: '/living-space',
		type: PageType.Section,
		parentId: 'taskList'
	},
	{
		id: 'livingSpaceZoneParameters',
		title: 'Zone parameters',
		url: '/living-space/zone-parameters',
		type: PageType.Task,
		parentId: 'livingSpaceFabric'
	},
	{
		id: 'livingSpaceFloors',
		title: 'Floors',
		url: '/living-space/floors',
		type: PageType.TaskGroup,
		parentId: 'livingSpaceFabric'
	},
	{
		id: 'livingSpaceGroundFloor',
		title: 'Ground floor',
		url: '/living-space/floors/ground/:floor',
		type: PageType.Task,
		parentId: 'livingSpaceFloors'
	},
	{
		id: 'livingSpaceInternalFloor',
		title: 'Internal floor',
		url: '/living-space/floors/internal/:floor',
		type: PageType.Task,
		parentId: 'livingSpaceFloors'
	},
	{
		id: 'livingSpaceExposedFloor',
		title: 'Exposed floor',
		url: '/living-space/floors/exposed/:floor',
		type: PageType.Task,
		parentId: 'livingSpaceFloors'
	},
	{
		id: 'livingSpaceWalls',
		title: 'Walls',
		url: '/living-space/walls',
		type: PageType.TaskGroup,
		parentId: 'livingSpaceFabric'
	},
	{
		id: 'livingSpaceExternalWall',
		title: 'External wall',
		url: '/living-space/walls/external/:wall',
		type: PageType.Task,
		parentId: 'livingSpaceWalls'
	},
	{
		id: 'livingSpaceInternalWall',
		title: 'Internal wall',
		url: '/living-space/walls/internal/:wall',
		type: PageType.Task,
		parentId: 'livingSpaceWalls'
	},
	{
		id: 'livingSpaceWallToUnheatedSpace',
		title: 'Wall to unheated space',
		url: '/living-space/walls/wall-to-unheated-space/:wall',
		type: PageType.Task,
		parentId: 'livingSpaceWalls'
	},
	{
		id: 'livingSpacePartyWall',
		title: 'Party wall',
		url: '/living-space/walls/party/:wall',
		type: PageType.Task,
		parentId: 'livingSpaceWalls'
	},
	{
		id: 'livingSpaceCeilingsAndRoofs',
		title: 'Ceilings and roofs',
		url: '/living-space/ceilings-and-roofs',
		type: PageType.TaskGroup,
		parentId: 'livingSpaceFabric'
	},
	{
		id: 'livingSpaceCeilings',
		title: 'Ceiling',
		url: '/living-space/ceilings-and-roofs/ceilings/:ceiling',
		type: PageType.Task,
		parentId: 'livingSpaceCeilingsAndRoofs'
	},
	{
		id: 'livingSpaceRoofs',
		title: 'Roof',
		url: '/living-space/ceilings-and-roofs/roofs/:roof',
		type: PageType.Task,
		parentId: 'livingSpaceCeilingsAndRoofs'
	},
	{
		id: 'livingSpaceDoors',
		title: 'Doors',
		url: '/living-space/doors',
		type: PageType.TaskGroup,
		parentId: 'livingSpaceFabric'
	},
	{
		id: 'livingSpaceExternalUnglazedDoor',
		title: 'External unglazed door',
		url: '/living-space/doors/external-unglazed/:door',
		type: PageType.Task,
		parentId: 'livingSpaceDoors'
	},
	{
		id: 'livingSpaceExternalGlazedDoor',
		title: 'External glazed door',
		url: '/living-space/doors/external-glazed/:door',
		type: PageType.Task,
		parentId: 'livingSpaceDoors'
	},
	{
		id: 'livingSpaceInternalDoor',
		title: 'Internal door',
		url: '/living-space/doors/internal/:door',
		type: PageType.Task,
		parentId: 'livingSpaceDoors'
	},
	{
		id: 'livingSpaceWindows',
		title: 'Windows',
		url: '/living-space/windows',
		type: PageType.Task,
		parentId: 'livingSpaceFabric'
	},
	{
		id: 'livingSpaceWindow',
		title: 'Window',
		url: '/living-space/windows/:window',
		type: PageType.Task,
		parentId: 'livingSpaceWindows'
	},
	{
		id: 'livingSpaceThermalBridging',
		title: 'Thermal bridging',
		url: '/living-space/thermal-bridging',
		type: PageType.TaskGroup,
		parentId: 'livingSpaceFabric'
	},
	{
		id: 'livingSpaceLinearThermalBridges',
		title: 'Linear thermal bridges',
		url: '/living-space/thermal-bridging/linear/:bridging',
		type: PageType.Task,
		parentId: 'livingSpaceThermalBridging'
	},
	{
		id: 'livingSpacePointThermalBridges',
		title: 'Point thermal bridges',
		url: '/living-space/thermal-bridging/point/:bridging',
		type: PageType.Task,
		parentId: 'livingSpaceThermalBridging'
	},
	{
		id: 'livingSpaceSummary',
		title: 'Summary',
		url: '/living-space/summary',
		type: PageType.Summary,
		parentId: 'livingSpaceFabric'
	},
	{
		id: 'restOfDwelling',
		title: 'Rest of dwelling fabric',
		url: '/rest-of-dwelling',
		type: PageType.Section,
		parentId: 'taskList'
	},
	{
		id: 'restOfDwellingZoneParameters',
		title: 'Zone parameters',
		url: '/rest-of-dwelling/zone-parameters',
		type: PageType.Task,
		parentId: 'restOfDwelling'
	},
	{
		id: 'restOfDwellingFloors',
		title: 'Floors',
		url: '/rest-of-dwelling/floors',
		type: PageType.Task,
		parentId: 'restOfDwelling'
	},
	{
		id: 'restOfDwellingWalls',
		title: 'Walls',
		url: '/rest-of-dwelling/walls',
		type: PageType.Task,
		parentId: 'restOfDwelling'
	},
	{
		id: 'restOfDwellingWindowsAndDoors',
		title: 'Windows and doors',
		url: '/rest-of-dwelling/windows-and-doors',
		type: PageType.Task,
		parentId: 'restOfDwelling'
	},
	{
		id: 'restOfDwellingRoofAndCeiling',
		title: 'Roof and ceiling',
		url: '/rest-of-dwelling/roof-and-ceiling',
		type: PageType.Task,
		parentId: 'restOfDwelling'
	},
	{
		id: 'restOfDwellingThermalBridges',
		title: 'Thermal bridges',
		url: '/rest-of-dwelling/thermal-bridges',
		type: PageType.Task,
		parentId: 'restOfDwelling'
	},
	{
		id: 'restOfDwellingSummary',
		title: 'Summary',
		url: '/rest-of-dwelling/summary',
		type: PageType.Summary,
		parentId: 'restOfDwelling'
	},
	{
		id: 'heatingSystems',
		title: 'Heating systems',
		url: '/heating-systems',
		type: PageType.Section,
		parentId: 'taskList'
	},
	{
		id: 'heatSource',
		title: 'Heat source',
		url: '/heating-systems/heat-source',
		type: PageType.Task,
		parentId: 'heatingSystems'
	},
	{
		id: 'spaceHeating',
		title: 'Space heating',
		url: '/heating-systems/space-heating',
		type: PageType.Task,
		parentId: 'heatingSystems'
	},
	{
		id: 'waterHeating',
		title: 'Water heating',
		url: '/heating-systems/water-heating',
		type: PageType.Task,
		parentId: 'heatingSystems'
	},
	{
		id: 'heatSourceSummary',
		title: 'Summary',
		url: '/heating-systems/summary',
		type: PageType.Summary,
		parentId: 'heatingSystems'
	},
	{
		id: 'hotWaterOutlets',
		title: 'Hot water outlets',
		url: '/hot-water-outlets',
		type: PageType.Section,
		parentId: 'taskList'
	},
	{
		id: 'wasteWaterRecoverySystems',
		title: 'Waste water recovery systems',
		url: '/hot-water-outlets/waste-water-recovery-systems',
		type: PageType.Task,
		parentId: 'hotWaterOutlets'
	},
	{
		id: 'hotWaterOutletsHotWaterOutlets',
		title: 'Hot water outlets',
		url: '/hot-water-outlets/hot-water-outlets',
		type: PageType.Task,
		parentId: 'hotWaterOutlets'
	},
	{
		id: 'hotWaterDistribution',
		title: 'Hot water distribution',
		url: '/hot-water-outlets/hot-water-distribution',
		type: PageType.Task,
		parentId: 'hotWaterOutlets'
	},
	{
		id: 'hotWaterDistributionCreate',
		title: 'Create',
		url: '/hot-water-outlets/hot-water-distribution/create',
		type: PageType.Task,
		parentId: 'hotWaterDistribution'
	},
	{
		id: 'hotWaterDistributionEdit',
		title: 'Edit',
		url: '/hot-water-outlets/hot-water-distribution/:distribution',
		type: PageType.Task,
		parentId: 'hotWaterDistribution'
	},
	{
		id: 'hotWaterOutletsSummary',
		title: 'Summary',
		url: '/hot-water-outlets/summary',
		type: PageType.Summary,
		parentId: 'hotWaterOutlets'
	},
	{
		id: 'pvStorage',
		title: 'PV and energy storage',
		url: '/pv-storage',
		type: PageType.Section,
		parentId: 'taskList'
	},
	{
		id: 'solarPvArray',
		title: 'Solar PV array',
		url: '/pv-storage/solar-pv-array',
		type: PageType.Task,
		parentId: 'pvStorage'
	},
	{
		id: 'electricBattery',
		title: 'Electric battery',
		url: '/pv-storage/electric-battery',
		type: PageType.Task,
		parentId: 'pvStorage'
	},
	{
		id: 'pvDiverter',
		title: 'PV diverter',
		url: '/pv-storage/pv-diverter',
		type: PageType.Task,
		parentId: 'pvStorage'
	},
	{
		id: 'pvStorageSummary',
		title: 'Summary',
		url: '/pv-storage/summary',
		type: PageType.Summary,
		parentId: 'pvStorage'
	},
	{
		id: 'cooling',
		title: 'Cooling',
		url: '/cooling',
		type: PageType.Section,
		parentId: 'taskList'
	},
	{
		id: 'airConditioning',
		title: 'Air conditioning',
		url: '/cooling/air-conditioning',
		type: PageType.Task,
		parentId: 'cooling'
	},
	{
		id: 'coolingSummary',
		title: 'Summary',
		url: '/cooling/summary',
		type: PageType.Summary,
		parentId: 'cooling'
	}
];

export default pagesData;