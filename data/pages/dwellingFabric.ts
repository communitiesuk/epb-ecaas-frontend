import { PageType  } from "./pages.types";
import type {Page} from "./pages.types";

const dwellingFabricPages = [
	{
		id: 'dwellingFabric',
		title: 'Dwelling fabric',
		url: '/dwelling-space',
		type: PageType.Section,
		parentId: 'taskList'
	},
	{
		id: 'dwellingSpaceZoneParameters',
		title: 'Zone parameters',
		url: '/dwelling-space/zone-parameters',
		type: PageType.Task,
		parentId: 'dwellingFabric'
	},
	{
		id: 'dwellingSpaceLighting',
		title: 'Lighting',
		url: '/dwelling-space/lighting',
		type: PageType.Task,
		parentId: 'dwellingFabric'
	},
	{
		id: 'dwellingSpaceFloors',
		title: 'Floors',
		url: '/dwelling-space/floors',
		type: PageType.TaskGroup,
		parentId: 'dwellingFabric'
	},
	{
		id: 'dwellingSpaceGroundFloor',
		title: 'Ground floor',
		url: '/dwelling-space/floors/ground/:floor',
		type: PageType.Task,
		parentId: 'dwellingSpaceFloors'
	},
	{
		id: 'dwellingSpaceGroundFloorCreate',
		title: 'Ground floor',
		url: '/dwelling-space/floors/ground/create',
		type: PageType.Task,
		parentId: 'dwellingSpaceFloors'
	},
	{
		id: 'dwellingSpaceInternalFloor',
		title: 'Internal floor',
		url: '/dwelling-space/floors/internal/:floor',
		type: PageType.Task,
		parentId: 'dwellingSpaceFloors'
	},
	{
		id: 'dwellingSpaceInternalFloorCreate',
		title: 'Internal floor',
		url: '/dwelling-space/floors/internal/create',
		type: PageType.Task,
		parentId: 'dwellingSpaceFloors'
	},
	{
		id: 'dwellingSpaceExposedFloor',
		title: 'Exposed floor',
		url: '/dwelling-space/floors/exposed/:floor',
		type: PageType.Task,
		parentId: 'dwellingSpaceFloors'
	},
	{
		id: 'dwellingSpaceExposedFloorCreate',
		title: 'Exposed floor',
		url: '/dwelling-space/floors/exposed/create',
		type: PageType.Task,
		parentId: 'dwellingSpaceFloors'
	},
	{
		id: 'dwellingSpaceWalls',
		title: 'Walls',
		url: '/dwelling-space/walls',
		type: PageType.TaskGroup,
		parentId: 'dwellingFabric'
	},
	{
		id: 'dwellingSpaceExternalWall',
		title: 'External wall',
		url: '/dwelling-space/walls/external/:wall',
		type: PageType.Task,
		parentId: 'dwellingSpaceWalls'
	},
	{
		id: 'dwellingSpaceExternalWallCreate',
		title: 'External wall',
		url: '/dwelling-space/walls/external/create',
		type: PageType.Task,
		parentId: 'dwellingSpaceWalls'
	},
	{
		id: 'dwellingSpaceInternalWall',
		title: 'Internal wall',
		url: '/dwelling-space/walls/internal/:wall',
		type: PageType.Task,
		parentId: 'dwellingSpaceWalls'
	},
	{
		id: 'dwellingSpaceInternalWallCreate',
		title: 'Internal wall',
		url: '/dwelling-space/walls/internal/create',
		type: PageType.Task,
		parentId: 'dwellingSpaceWalls'
	},
	{
		id: 'dwellingSpaceWallToUnheatedSpace',
		title: 'Wall to unheated space',
		url: '/dwelling-space/walls/wall-to-unheated-space/:wall',
		type: PageType.Task,
		parentId: 'dwellingSpaceWalls'
	},
	{
		id: 'dwellingSpaceWallToUnheatedSpaceCreate',
		title: 'Wall to unheated space',
		url: '/dwelling-space/walls/wall-to-unheated-space/create',
		type: PageType.Task,
		parentId: 'dwellingSpaceWalls'
	},
	{
		id: 'dwellingSpacePartyWall',
		title: 'Party wall',
		url: '/dwelling-space/walls/party/:wall',
		type: PageType.Task,
		parentId: 'dwellingSpaceWalls'
	},
	{
		id: 'dwellingSpacePartyWallCreate',
		title: 'Party wall',
		url: '/dwelling-space/walls/party/create',
		type: PageType.Task,
		parentId: 'dwellingSpaceWalls'
	},
	{
		id: 'dwellingSpaceCeilingsAndRoofs',
		title: 'Ceilings and roofs',
		url: '/dwelling-space/ceilings-and-roofs',
		type: PageType.TaskGroup,
		parentId: 'dwellingFabric'
	},
	{
		id: 'dwellingSpaceCeilings',
		title: 'Ceiling',
		url: '/dwelling-space/ceilings-and-roofs/ceilings/:ceiling',
		type: PageType.Task,
		parentId: 'dwellingSpaceCeilingsAndRoofs'
	},
	{
		id: 'dwellingSpaceCeilingsCreate',
		title: 'Ceiling',
		url: '/dwelling-space/ceilings-and-roofs/ceilings/create',
		type: PageType.Task,
		parentId: 'dwellingSpaceCeilingsAndRoofs'
	},
	{
		id: 'dwellingSpaceRoofs',
		title: 'Roof',
		url: '/dwelling-space/ceilings-and-roofs/roofs/:roof',
		type: PageType.Task,
		parentId: 'dwellingSpaceCeilingsAndRoofs'
	},
	{
		id: 'dwellingSpaceRoofsCreate',
		title: 'Roof',
		url: '/dwelling-space/ceilings-and-roofs/roofs/create',
		type: PageType.Task,
		parentId: 'dwellingSpaceCeilingsAndRoofs'
	},
	{
		id: 'dwellingSpaceDoors',
		title: 'Doors',
		url: '/dwelling-space/doors',
		type: PageType.TaskGroup,
		parentId: 'dwellingFabric'
	},
	{
		id: 'dwellingSpaceExternalUnglazedDoor',
		title: 'External unglazed door',
		url: '/dwelling-space/doors/external-unglazed/:door',
		type: PageType.Task,
		parentId: 'dwellingSpaceDoors'
	},
	{
		id: 'dwellingSpaceExternalUnglazedDoorCreate',
		title: 'External unglazed door',
		url: '/dwelling-space/doors/external-unglazed/create',
		type: PageType.Task,
		parentId: 'dwellingSpaceDoors'
	},
	{
		id: 'dwellingSpaceExternalGlazedDoor',
		title: 'External glazed door',
		url: '/dwelling-space/doors/external-glazed/:door',
		type: PageType.Task,
		parentId: 'dwellingSpaceDoors'
	},
	{
		id: 'dwellingSpaceExternalGlazedDoorCreate',
		title: 'External glazed door',
		url: '/dwelling-space/doors/external-glazed/create',
		type: PageType.Task,
		parentId: 'dwellingSpaceDoors'
	},
	{
		id: 'dwellingSpaceInternalDoor',
		title: 'Internal door',
		url: '/dwelling-space/doors/internal/:door',
		type: PageType.Task,
		parentId: 'dwellingSpaceDoors'
	},
	{
		id: 'dwellingSpaceInternalDoorCreate',
		title: 'Internal door',
		url: '/dwelling-space/doors/internal/create',
		type: PageType.Task,
		parentId: 'dwellingSpaceDoors'
	},
	{
		id: 'dwellingSpaceWindows',
		title: 'Windows',
		url: '/dwelling-space/windows',
		type: PageType.Task,
		parentId: 'dwellingFabric'
	},
	{
		id: 'dwellingSpaceWindowCreate',
		title: 'Create',
		url: '/dwelling-space/windows/create',
		type: PageType.Task,
		parentId: 'dwellingSpaceWindows'
	},
	{
		id: 'dwellingSpaceWindowEdit',
		title: 'Edit',
		url: '/dwelling-space/windows/:window',
		type: PageType.Task,
		parentId: 'dwellingSpaceWindows'
	},
	{
		id: 'dwellingSpaceThermalBridging',
		title: 'Thermal bridging',
		url: '/dwelling-space/thermal-bridging',
		type: PageType.TaskGroup,
		parentId: 'dwellingFabric'
	},
	{
		id: 'dwellingSpaceLinearThermalBridges',
		title: 'Linear thermal bridges',
		url: '/dwelling-space/thermal-bridging/linear/:bridging',
		type: PageType.Task,
		parentId: 'dwellingSpaceThermalBridging'
	},
	{
		id: 'dwellingSpaceLinearThermalBridgesCreate',
		title: 'Linear thermal bridges',
		url: '/dwelling-space/thermal-bridging/linear/create',
		type: PageType.Task,
		parentId: 'dwellingSpaceThermalBridging'
	},
	{
		id: 'dwellingSpacePointThermalBridges',
		title: 'Point thermal bridges',
		url: '/dwelling-space/thermal-bridging/point/:bridging',
		type: PageType.Task,
		parentId: 'dwellingSpaceThermalBridging'
	},
	{
		id: 'dwellingSpacePointThermalBridgesCreate',
		title: 'Point thermal bridges',
		url: '/dwelling-space/thermal-bridging/point/create',
		type: PageType.Task,
		parentId: 'dwellingSpaceThermalBridging'
	},
	{
		id: 'dwellingSpaceSummary',
		title: 'Summary',
		url: '/dwelling-space/summary',
		type: PageType.Summary,
		parentId: 'dwellingFabric'
	}
] as const satisfies Array<Page>;

export default dwellingFabricPages;