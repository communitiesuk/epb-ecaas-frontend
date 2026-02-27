export function isFlatRoofItem(id: string) {
	const store = useEcaasStore();
	const roof = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs.data.find(x => x.data.id === id);
	return roof?.data.typeOfRoof === "flat";
}