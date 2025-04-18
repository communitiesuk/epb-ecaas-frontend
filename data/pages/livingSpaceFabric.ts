import { PageType, type Page } from "./pages.types";

const livingSpaceFabricPages: Array<Page> = [
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
		id: 'livingSpaceGroundFloorCreate',
		title: 'Ground floor',
		url: '/living-space/floors/ground/create',
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
		id: 'livingSpaceInternalFloorCreate',
		title: 'Internal floor',
		url: '/living-space/floors/internal/create',
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
		id: 'livingSpaceExposedFloorCreate',
		title: 'Exposed floor',
		url: '/living-space/floors/exposed/create',
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
		id: 'livingSpaceExternalWallCreate',
		title: 'External wall',
		url: '/living-space/walls/external/create',
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
		id: 'livingSpaceInternalWallCreate',
		title: 'Internal wall',
		url: '/living-space/walls/internal/create',
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
		id: 'livingSpaceWallToUnheatedSpaceCreate',
		title: 'Wall to unheated space',
		url: '/living-space/walls/wall-to-unheated-space/create',
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
		id: 'livingSpacePartyWallCreate',
		title: 'Party wall',
		url: '/living-space/walls/party/create',
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
		id: 'livingSpaceCeilingsCreate',
		title: 'Ceiling',
		url: '/living-space/ceilings-and-roofs/ceilings/create',
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
		id: 'livingSpaceRoofsCreate',
		title: 'Roof',
		url: '/living-space/ceilings-and-roofs/roofs/create',
		type: PageType.Task,
		parentId: 'livingSpaceCeilingsAndRoofs'
	},
	{
		id: 'livingSpaceUnheatedPitchedRoofs',
		title: 'Unheated pitched roof',
		url: '/living-space/ceilings-and-roofs/unheated-pitched-roofs/:roof',
		type: PageType.Task,
		parentId: 'livingSpaceCeilingsAndRoofs'
	},
	{
		id: 'livingSpaceUnheatedPitchedRoofsCreate',
		title: 'Unheated pitched roof',
		url: '/living-space/ceilings-and-roofs/unheated-pitched-roofs/create',
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
		id: 'livingSpaceExternalUnglazedDoorCreate',
		title: 'External unglazed door',
		url: '/living-space/doors/external-unglazed/create',
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
		id: 'livingSpaceExternalGlazedDoorCreate',
		title: 'External glazed door',
		url: '/living-space/doors/external-glazed/create',
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
		id: 'livingSpaceInternalDoorCreate',
		title: 'Internal door',
		url: '/living-space/doors/internal/create',
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
		id: 'livingSpaceWindowCreate',
		title: 'Create',
		url: '/living-space/windows/create',
		type: PageType.Task,
		parentId: 'livingSpaceWindows'
	},
	{
		id: 'livingSpaceWindowEdit',
		title: 'Edit',
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
		id: 'livingSpaceLinearThermalBridgesCreate',
		title: 'Linear thermal bridges',
		url: '/living-space/thermal-bridging/linear/create',
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
		id: 'livingSpacePointThermalBridgesCreate',
		title: 'Point thermal bridges',
		url: '/living-space/thermal-bridging/point/create',
		type: PageType.Task,
		parentId: 'livingSpaceThermalBridging'
	},
	{
		id: 'livingSpaceSummary',
		title: 'Summary',
		url: '/living-space/summary',
		type: PageType.Summary,
		parentId: 'livingSpaceFabric'
	}
];

export default livingSpaceFabricPages;