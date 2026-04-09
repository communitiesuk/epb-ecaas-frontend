import { duplicateFormEntry } from "~/utils/duplicateFormEntry";
import { useMechanicalVentilation } from "./mechanicalVentilation";

export function useDomesticHotWater() {
	const store = useEcaasStore();
	const { removeMechanicalVents } = useMechanicalVentilation();

	type DomesticHotWaterType = keyof typeof store.domesticHotWater;
	type DomesticHotWaterData = EcaasForm<DomesticHotWaterHeatSourceData> & EcaasForm<WaterStorageData> & EcaasForm<HotWaterOutletsData> & EcaasForm<PipeworkData>;

	const { waterStorage, hotWaterOutlets, pipework, heatSources: dhwHeatSources } = store.domesticHotWater; 
	const { heatSource } = store.spaceHeating;

	const removeHybridHeatPumpBoilers = (packageProductId: string) => {
		store.$patch(state => {
			const packageProductIndex = state.domesticHotWater.heatSources.data
				.findIndex(x => "id" in x.data && x.data.id === packageProductId);

			if (packageProductIndex >= 0) {
				state.domesticHotWater.heatSources.data.splice(packageProductIndex, 1);
			}
		});
	};

	const removeEntry = (domesticHotWaterType: DomesticHotWaterType, index: number) => {
		const items = store.domesticHotWater[domesticHotWaterType]?.data;
		const item = items[index];

		if (items) {
			let heatSourceId: string | undefined;
		
			if (items[index]?.data && "typeOfHeatSource" in items[index].data) {
				heatSourceId = store.domesticHotWater.heatSources.data[index]?.data.id;
			}

			let waterStorageId: string | undefined;
			if (items[index]?.data && "typeOfWaterStorage" in items[index].data) {
				waterStorageId = store.domesticHotWater.waterStorage.data[index]?.data.id;
			}

			items.splice(index, 1);

			store.$patch((state) => {
				state.domesticHotWater[domesticHotWaterType].data = items.length ? items : [];
				state.domesticHotWater[domesticHotWaterType].complete = false;
			});

			if (heatSourceId) {
				store.removeTaggedAssociations()([waterStorage, hotWaterOutlets], heatSourceId, "dhwHeatSourceId"); 
				store.removeTaggedAssociations()([heatSource, dhwHeatSources], heatSourceId, "boosterHeatPumpId"); 
			}

			if (waterStorageId) {
				store.removeTaggedAssociations()([pipework], waterStorageId, "waterStorage"); 
			}

			if (domesticHotWaterType === "heatSources" && item && isPackagedProduct(item.data)) {
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

	const duplicateEntry = <T extends DomesticHotWaterData>(domesticHotWaterType: DomesticHotWaterType, index: number) => {
		const data = store.domesticHotWater[domesticHotWaterType]?.data;
		const item = data?.[index] as DomesticHotWaterData;
		let name: string;

		if (item) {
			const duplicates = data.filter(f => {
				if (isEcaasForm(f) && isEcaasForm(item)) {
					if (domesticHotWaterType === "heatSources" && (item.data as DomesticHotWaterHeatSourceData).isExistingHeatSource) {
						// I have no idea what to do here
						// Either prevent duplication of existing heat sources
						// Or allow it and create a new entry in space heating too?
						// Or create a new heat source in domestic hot water?
						return false;
					}
					name = (item.data as { name: string }).name;
					return (f.data as { name: string }).name.match(duplicateNamePattern(name));
				}
				return false;
			});

			store.$patch((state) => {
				const newItem = duplicateFormEntry(item, duplicates.length) as T;

				state.domesticHotWater[domesticHotWaterType].data.push(newItem);
				state.domesticHotWater[domesticHotWaterType].complete = false;
			});
		}
	};

	return {
		removeEntry,
		duplicateEntry,
	};
};