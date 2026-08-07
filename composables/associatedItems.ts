
type AssociatedItemType = "wall" | "roof" | "window" | "externalGlazedDoor" | "groundFloor" | "floorAboveUnheatedBasement" | "heatedBasementFloor" | "wwhrs" | "preheatedWaterStorage" | "waterStorage" | "boiler" | "none";

export const mapOption = (label: string) => (element: EcaasForm<{ id?: string; name: string; }>) =>
	[element.data.id, `${element.data.name} (${label})`] as [string, string];

export function useAssociatedItems(itemTypes: Array<AssociatedItemType>): [string, string][] {
	const store = useEcaasStore();

	const { dwellingSpaceExternalWall } = store.dwellingFabric.dwellingSpaceWalls;
	const { dwellingSpaceRoofs } = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
	const { dwellingSpaceWindows } = store.dwellingFabric;
	const { dwellingSpaceExternalGlazedDoor } = store.dwellingFabric.dwellingSpaceDoors;
	const { dwellingSpaceGroundFloor, dwellingSpaceFloorAboveUnheatedBasement, dwellingSpaceFloorOfHeatedBasement } = store.dwellingFabric.dwellingSpaceFloors;
	const { wwhrs, preheatedWaterStorage, waterStorage, heatSources: hotWaterHeatSources } = store.domesticHotWater;
	const { heatSource: spaceHeaterHeatSources } = store.spaceHeating;

	const getBoilers = () => {
		const domesticHotWaterBoilers = hotWaterHeatSources.data
			.filter(x => !x.data.isExistingHeatSource && x.data.typeOfHeatSource === "boiler")
			.map(x => mapOption("Boiler")(x as EcaasForm<{ id?: string; name: string; }>));

		const spaceHeatingBoilers = hotWaterHeatSources.data
			.filter(x => x.data.isExistingHeatSource)
			.map(x => {
				const heatSource = spaceHeaterHeatSources.data
					.find(hs => hs.data.id === x.data.heatSourceId);
				
				if (heatSource?.data.typeOfHeatSource === "boiler") {
					return mapOption("Boiler")(heatSource);
				}

				return null;
			})
			.filter(x => x !== null);

		return [...domesticHotWaterBoilers, ...spaceHeatingBoilers];
	};

	const options = [
		(itemTypes.includes("wall") ? dwellingSpaceExternalWall.data.map(mapOption("Wall")) : []),
		(itemTypes.includes("roof") ? dwellingSpaceRoofs.data.map(mapOption("Roof")) : []),
		(itemTypes.includes("window") ? dwellingSpaceWindows.data.map(mapOption("Window")) : []),
		(itemTypes.includes("externalGlazedDoor") ? dwellingSpaceExternalGlazedDoor.data.map(mapOption("External glazed door")) : []),
		(itemTypes.includes("groundFloor") ? dwellingSpaceGroundFloor.data.map(mapOption("Ground floor")) : []),
		(itemTypes.includes("floorAboveUnheatedBasement") ? dwellingSpaceFloorAboveUnheatedBasement.data.map(mapOption("Floor above unheated basement")) : []),
		(itemTypes.includes("heatedBasementFloor") ? dwellingSpaceFloorOfHeatedBasement.data.map(mapOption("Heated basement floor")) : []),
		(itemTypes.includes("wwhrs") ? wwhrs.data.map(mapOption("WWHRS")) : []),
		(itemTypes.includes("preheatedWaterStorage") ? preheatedWaterStorage.data.map(mapOption("Pre-heated water cylinder")) : []),
		(itemTypes.includes("waterStorage") ? waterStorage.data.map(mapOption("Hot water cylinder")) : []),
		(itemTypes.includes("boiler") ? getBoilers() : []),
	]
		.flat()
		.filter(x => x[0] !== undefined)
		.concat(itemTypes.includes("none") ? [["none", "None of the above"]] : []);

	return options;
}