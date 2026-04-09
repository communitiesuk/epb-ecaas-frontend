import { v4 as uuidv4 } from "uuid";
import { duplicateFormEntry } from "~/utils/duplicateFormEntry";
import { useMechanicalVentilation } from "./mechanicalVentilation";

export function useSpaceHeating() {
	const store = useEcaasStore();
	const { removeMechanicalVents, duplicateMechanicalVent } = useMechanicalVentilation();

	type SpaceHeatingType = keyof typeof store.spaceHeating;
	type SpaceHeatingData = EcaasForm<HeatSourceData> & EcaasForm<HeatEmittingData> & EcaasForm<HeatingControlData>;

	const { heatSources: dhwHeatSources, waterStorage, hotWaterOutlets } = store.domesticHotWater;
	const { heatEmitters, heatSource } = store.spaceHeating;

	const resetRankingsForHeatingSystems = (state: EcaasState) => {
		state.spaceHeating.heatEmitters.data.forEach((heatEmitter) => {
			const data = heatEmitter.data as { heatingRank?: number; };
			data.heatingRank = undefined;
		});
	};

	const markHeatingControlsAsInProgress = (state: EcaasState) => {
		state.spaceHeating.heatingControls.complete = false;
		state.spaceHeating.heatingControls.data.forEach((heatingControl) => {
			heatingControl.complete = false;
		});
	};

	const removeHybridHeatPumpBoilers = (packageProductId: string) => {
		store.$patch(state => {
			const packageProductIndex = state.spaceHeating.heatSource.data
				.findIndex(x => "id" in x.data && x.data.id === packageProductId);

			if (packageProductIndex >= 0) {
				state.spaceHeating.heatSource.data.splice(packageProductIndex, 1);
			}
		});
	};

	const removeEntry = (spaceHeatingType: SpaceHeatingType, index: number) => {
		const items = store.spaceHeating[spaceHeatingType]?.data;
		const item = items[index] as SpaceHeatingData;

		if (items) {
			let heatSourceId;

			if (items[index]?.data && "typeOfHeatSource" in items[index].data) {
				heatSourceId = store.spaceHeating.heatSource.data[index]?.data.id;
			}

			items.splice(index, 1);

			store.$patch((state) => {
				state.spaceHeating[spaceHeatingType].data = items.length ? items : [];
				state.spaceHeating[spaceHeatingType].complete = false;

				if (spaceHeatingType === "heatingControls" || spaceHeatingType === "heatEmitters") {
					resetRankingsForHeatingSystems(state);
					markHeatingControlsAsInProgress(state);
				}
			});

			if (heatSourceId) {
				store.removeTaggedAssociations()([heatEmitters], heatSourceId, "heatSource"); 
				store.removeTaggedAssociations()([heatSource, dhwHeatSources], heatSourceId, "boosterHeatPumpId"); 
				
				const dhwHeatSourceIdToRemove = dhwHeatSources.data
					.filter(({ data: x }) => x.heatSourceId === heatSourceId)
					.map(x => x.data.id)[0];

				//remove dhw heat sources that reference deleted space heating heat source
				const dhwHeatSourcesToKeep = dhwHeatSources.data.filter(({ data: x }) => x.heatSourceId !== heatSourceId); 
				store.$patch(state => {
					state.domesticHotWater.heatSources.data = dhwHeatSourcesToKeep;
					if (dhwHeatSourcesToKeep.length === 0) {
						state.domesticHotWater.heatSources.complete = false;
					}
				});

				//remove reference to deleted dhw heat source
				store.removeTaggedAssociations()([waterStorage, hotWaterOutlets], dhwHeatSourceIdToRemove, "dhwHeatSourceId"); 
			}

			if (isPackagedProduct(item.data)) {
				const { packageProductId } = item.data;

				if (item.data.typeOfHeatPump === "hybridHeatPump") {
					removeHybridHeatPumpBoilers(packageProductId!);
					return;
				}

				if (item.data.typeOfHeatPump === "exhaustAirMev" ||
					item.data.typeOfHeatPump === "exhaustAirMixed" ||
					item.data.typeOfHeatPump === "exhaustAirMvhr"
				) {
					removeMechanicalVents(packageProductId!);
					return;
				}
			}
		}
	};

	const duplicateEntry = <T extends SpaceHeatingData>(spaceHeatingType: SpaceHeatingType, index: number) => {
		const { data } = store.spaceHeating[spaceHeatingType];
		const item = data?.[index] as SpaceHeatingData;

		const duplicateHybridHeatPump = (state: EcaasState, packageProductId: string, duplicates: number) => {
			const packageItem = (data as SpaceHeatingData[]).find(x => "id" in x.data && x.data.id === packageProductId);
	
			if (!packageItem) {
				return;
			}

			const packagedDuplicates = data.filter(x => x && x.data.name.match(duplicateNamePattern(packageItem.data.name)));

			const newPackagedItem = duplicateFormEntry(packageItem, packagedDuplicates.length) as T;

			const newItem = {
				complete: item.complete,
				data: {
					...item.data,
					name: `${item.data.name} (${duplicates})`,
					id: uuidv4(),
					packageProductId: newPackagedItem.data.id,
				},
			} as T;

			state.spaceHeating[spaceHeatingType].data.push(newItem);
			state.spaceHeating[spaceHeatingType].data.push(newPackagedItem);
			state.spaceHeating[spaceHeatingType].complete = false;
		};

		const duplicateMechanicalVentData = (state: EcaasState, packageProductId: string, duplicates: number) => {
			const newPackagedItem = duplicateMechanicalVent(state, packageProductId);

			const newItem = {
				complete: item.complete,
				data: {
					...item.data,
					name: `${item.data.name} (${duplicates})`,
					id: uuidv4(),
					packageProductId: newPackagedItem!.data.id,
				},
			} as T;

			state.spaceHeating[spaceHeatingType].data.push(newItem);
			state.spaceHeating[spaceHeatingType].complete = false;
		};
	
		if (item) {
			const duplicates = data.filter(x => x && x.data.name.match(duplicateNamePattern(item.data.name)));
	
			store.$patch((state) => {
				if (!isPackagedProduct(item.data)) {
					const newItem = duplicateFormEntry(item, duplicates.length) as T;
	
					state.spaceHeating[spaceHeatingType].data.push(newItem);
					state.spaceHeating[spaceHeatingType].complete = false;

					if (spaceHeatingType === "heatEmitters") {
						resetRankingsForHeatingSystems(state);
						markHeatingControlsAsInProgress(state);
					}
				} else {
					const { packageProductId } = item.data;
	
					if (item.data.typeOfHeatPump === "hybridHeatPump") {
						duplicateHybridHeatPump(state, packageProductId!, duplicates.length);
					}
	
					if (item.data.typeOfHeatPump === "exhaustAirMev" ||
						item.data.typeOfHeatPump === "exhaustAirMixed" ||
						item.data.typeOfHeatPump === "exhaustAirMvhr"
					) {
						duplicateMechanicalVentData(state, packageProductId!, duplicates.length);
					}
				}
			});
		}
	};

	return {
		removeEntry,
		duplicateEntry,
	};
}