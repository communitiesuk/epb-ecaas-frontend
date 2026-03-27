
export function useAssociatedItems(itemTypes: Array<"wall" | "roof" | "window">): [string, string][] {
	const store = useEcaasStore();

	const { dwellingSpaceExternalWall } = store.dwellingFabric.dwellingSpaceWalls;
	const { dwellingSpaceRoofs } = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
	const { dwellingSpaceWindows } = store.dwellingFabric;

	const options = [
		(itemTypes.includes("wall") ? dwellingSpaceExternalWall.data.map(x => [x.data.id, x.data.name] as [string, string]) : []),
		(itemTypes.includes("roof") ? dwellingSpaceRoofs.data.map(x => [x.data.id, x.data.name] as [string, string]) : []),
		(itemTypes.includes("window") ? dwellingSpaceWindows.data.map(x => [x.data.id, x.data.name] as [string, string]) : []),
	]
		.flat()
		.filter(x => x[0] !== undefined)
		.concat([["none", "None of the above"]]);

	return options;
}