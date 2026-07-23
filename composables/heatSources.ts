import { v4 as uuidv4 } from "uuid";
import { isHotWaterHeatSource, isNewHeatSource } from "~/utils/heatSources";

export function useHeatSources() {
	const store = useEcaasStore();

	function hasChangedFields(
		heatSource: HeatSourceData | NewDomesticHotWaterHeatSourceData | undefined,
		existingData: HeatSourceData | NewDomesticHotWaterHeatSourceData,
		fields: string[],
	) {
		if (heatSource) {
			const existingDataKeys = Object.keys(existingData) as (keyof typeof existingData)[];

			for (const key of existingDataKeys) {
				if (existingData[key] !== heatSource[key] && fields.includes(key)) {
					return true;
				}
			}
		}

		return false;
	}

	function clearAssociatedCylinders(
		state: EcaasState,
		heatSource: HeatSourceData | NewDomesticHotWaterHeatSourceData | undefined,
		existingData: HeatSourceData | DomesticHotWaterHeatSourceData,
	) {
		const isHotWaterSource = isHotWaterHeatSource(existingData);

		if (!existingData || (isHotWaterSource && existingData.isExistingHeatSource) || !heatSource) {
			return;
		}
		
		if (hasChangedFields(heatSource, existingData, ["typeOfHeatSource", "waterCylinderConfiguration"])) {

			// Clear associated water cylinders
			if (!isHotWaterSource) {
				const existingHotWaterHeatSource = state.domesticHotWater.heatSources.data.find(x => x.data.heatSourceId === heatSource.id);

				if (existingHotWaterHeatSource) {
					const hotWaterHeatSourceIndex = state.domesticHotWater.heatSources.data.indexOf(existingHotWaterHeatSource);
					state.domesticHotWater.heatSources.data.splice(hotWaterHeatSourceIndex, 1);
				}
			}

			if (existingData.typeOfHeatSource === "heatPump" && existingData.packagedWithWaterCylinder) {
				const { packageProductIds } = existingData;

				if (existingData.waterCylinderConfiguration === "hotWaterCylinder") {
					const existingHotWaterCylinder = state.domesticHotWater.waterStorage.data.find(x => packageProductIds?.includes(x.data.id!));

					if (existingHotWaterCylinder) {
						const existingHotWaterCylinderIndex = state.domesticHotWater.waterStorage.data.indexOf(existingHotWaterCylinder);
						state.domesticHotWater.waterStorage.data.splice(existingHotWaterCylinderIndex, 1);
					}
				} else if (existingData.waterCylinderConfiguration === "preheatedWaterCylinder") {
					const existingPreheatedWaterCylinder = state.domesticHotWater.preheatedWaterStorage.data.find(x => packageProductIds?.includes(x.data.id!));

					if (existingPreheatedWaterCylinder) {
						const existingHotWaterCylinderIndex = state.domesticHotWater.preheatedWaterStorage.data.indexOf(existingPreheatedWaterCylinder);
						state.domesticHotWater.preheatedWaterStorage.data.splice(existingHotWaterCylinderIndex, 1);
					}
				}
			}
		}
	}

	function createWaterCylinder(
		source: "spaceHeating" | "domesticHotWater",
		state: EcaasState,
		heatSource: HeatSourceData | NewDomesticHotWaterHeatSourceData | undefined,
		existingData: HeatSourceData | DomesticHotWaterHeatSourceData,
		newData: HeatSourceData | DomesticHotWaterHeatSourceData,
	) {
		clearAssociatedCylinders(state, heatSource, existingData);
		
		const changedFields = isNewHeatSource(existingData) ?
			hasChangedFields(heatSource, existingData, ["typeOfHeatSource", "waterCylinderConfiguration"]) :
			false;
		
		if (heatSource?.typeOfHeatSource === "heatPump" &&
			heatSource.packagedWithWaterCylinder &&
			isNewHeatSource(newData) &&
			changedFields
		) {
			if (heatSource.waterCylinderConfiguration === "hotWaterCylinder") {
				if (source === "spaceHeating") {
					const hotWaterHeatPump: Partial<DomesticHotWaterHeatSourceData> = {
						id: uuidv4(),
						isExistingHeatSource: true,
						createdAutomatically: true,
						heatSourceId: heatSource.id,
					};

					state.domesticHotWater.heatSources.data.push({
						data: hotWaterHeatPump as DomesticHotWaterHeatSourceData,
					});
				}

				// Create hot water cylinder
				const hotWaterCylinder: Partial<WaterStorageData> = {
					id: uuidv4(),
					typeOfWaterStorage: "hotWaterCylinder",
					name: "Hot water cylinder",
					...(heatSource.tankVolumeDeclared !== undefined ? {
						storageCylinderVolume: unitValue(heatSource.tankVolumeDeclared, "litres"),
					} : {}),
					dailyEnergyLoss: heatSource.dailyLossesDeclared,
					areaOfHeatExchanger: heatSource.heatExchangerSurfaceAreaDeclared,
					packagedProductReference: heatSource.productReference,
				};

				state.domesticHotWater.waterStorage.data.push({
					data: hotWaterCylinder as WaterStorageData,
				});

				if (newData.typeOfHeatSource === "heatPump") {
					newData.packageProductIds ??= [];
					newData.packageProductIds?.push(hotWaterCylinder.id!);
				}
			} else if (heatSource.waterCylinderConfiguration === "preheatedWaterCylinder") {

				if (source === "spaceHeating") {
					const preheatedWaterHeatPump: Partial<DomesticHotWaterHeatSourceData> = {
						id: uuidv4(),
						isExistingHeatSource: true,
						createdAutomatically: true,
						heatSourceId: heatSource.id,
					};

					state.domesticHotWater.heatSources.data.push({
						data: preheatedWaterHeatPump as DomesticHotWaterHeatSourceData,
					});
				}
				
				// Create pre-heated water cylinder
				const preheatedWaterCylinder: Partial<PreheatedWaterStorageData> = {
					id: uuidv4(),
					typeOfWaterStorage: "hotWaterCylinder",
					name: "Preheated water cylinder",
					...(heatSource.tankVolumeDeclared !== undefined ? {
						storageCylinderVolume: unitValue(heatSource.tankVolumeDeclared, "litres"),
					} : {}),
					dailyEnergyLoss: heatSource.dailyLossesDeclared,
					packagedProductReference: heatSource.productReference,
				};

				state.domesticHotWater.preheatedWaterStorage.data.push({
					data: preheatedWaterCylinder as PreheatedWaterStorageData,
				});

				if (newData.typeOfHeatSource === "heatPump") {
					newData.packageProductIds ??= [];
					newData.packageProductIds?.push(preheatedWaterCylinder.id!);
				}
			}
		}
	}

	function canHaveColdWaterSource(heatSource: DomesticHotWaterHeatSourceData): boolean {
		if (!heatSource.isExistingHeatSource) {
			const typeOfHeatSource = heatSource.typeOfHeatSource;

			return (
				typeOfHeatSource === "boiler" ||
				typeOfHeatSource === "heatBattery" ||
				typeOfHeatSource === "heatInterfaceUnit" ||
				typeOfHeatSource === "pointOfUse"
			);
		}

		const actualHeatSource = store.spaceHeating.heatSource.data.find(x => x.data.id === heatSource.heatSourceId)?.data;
		const typeOfHeatSource = actualHeatSource?.typeOfHeatSource;

		return (
			typeOfHeatSource === "boiler" ||
			typeOfHeatSource === "heatBattery" ||
			typeOfHeatSource === "heatInterfaceUnit"
		);
	}

	return {
		createWaterCylinder,
		canHaveColdWaterSource,
	};
}