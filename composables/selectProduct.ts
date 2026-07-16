import { heatPumpProductTypesMap, isDisplayProduct, type BoilerProduct, type DisplayProduct, type HeatPumpProduct, type HeatPumpProductTypes, type HybridHeatPumpProduct, type Product, type TechnologyGroup, type TechnologyType } from "~/pcdb/pcdb.types";
import { v4 as uuidv4 } from "uuid";
import type { SchemaMechVentType } from "~/schema/aliases";
import { useProductData } from "./productData";
import { EcaasError } from "~/errors.types";
import { isHotWaterHeatSource } from "~/utils/heatSources";

type HeatSourceSection = "spaceHeating" | "domesticHotWater";

export function useSelectHeatSourceProduct(_products: DisplayProduct[], _heatSourceProductType: (HeatSourceProductType | TechnologyGroup)) {
	const store = useEcaasStore();

	const createHotWaterCylinder = (source: HeatSourceSection, heatPumpDetails: HeatPumpProduct, heatSourceData: HeatSourceData | DomesticHotWaterHeatSourceData) => {
		if (source === "spaceHeating") {
			const spaceHeatingHeatSource = heatSourceData as HeatSourceData;
			
			if (spaceHeatingHeatSource.typeOfHeatSource === "heatPump") {
				spaceHeatingHeatSource.tankVolumeDeclared = heatPumpDetails.tankVolumeDeclared;
				spaceHeatingHeatSource.dailyLossesDeclared = heatPumpDetails.dailyLossesDeclared;
				spaceHeatingHeatSource.heatExchangerSurfaceAreaDeclared = heatPumpDetails.heatExchangerSurfaceAreaDeclared;
			}
		} else {
			const hotWaterHeatSource = heatSourceData as DomesticHotWaterHeatSourceData;

			if (!hotWaterHeatSource.isExistingHeatSource && hotWaterHeatSource.typeOfHeatSource === "heatPump") {
				hotWaterHeatSource.tankVolumeDeclared = heatPumpDetails.tankVolumeDeclared;
				hotWaterHeatSource.dailyLossesDeclared = heatPumpDetails.dailyLossesDeclared;
				hotWaterHeatSource.heatExchangerSurfaceAreaDeclared = heatPumpDetails.heatExchangerSurfaceAreaDeclared;
			}
		}
	};

	const selectProduct = (
		state: EcaasState,
		source: HeatSourceSection,
		heatSourceData: HeatSourceData | DomesticHotWaterHeatSourceData | undefined,
		product: DisplayProduct | Product,
		addBoilerProduct: (newProduct: BoilerProduct) => string,
		removeBoilerProduct: (id: string) => void,
	) => {
		if (!heatSourceData || (isHotWaterHeatSource(heatSourceData) && heatSourceData.isExistingHeatSource)) {
			return;
		}

		if (heatSourceData.typeOfHeatSource === "boiler") {
			const boilerProduct = product as (DisplayProduct | BoilerProduct);
			heatSourceData.needsSpecifiedLocation = boilerProduct.boilerLocation === "unknown";
			delete heatSourceData.specifiedLocation;
		}

		if (heatSourceData.typeOfHeatSource === "heatPump") {
			const heatPumpProduct = product as (DisplayProduct | HeatPumpProduct | HybridHeatPumpProduct);

			heatSourceData.typeOfHeatPump = heatPumpProductTypesMap[heatPumpProduct.technologyType as HeatPumpProductTypes];
			heatSourceData.packageProductIds ??= [];

			if (heatSourceData.packageProductIds.length) {
				const mechVentData = state.infiltrationAndVentilation.mechanicalVentilation.data;
				const waterStorageData = state.domesticHotWater.waterStorage.data;

				for (const packagedId of [...heatSourceData.packageProductIds]) {
					removeBoilerProduct(packagedId);

					const ventIdx = mechVentData.findIndex(x => x.data.id === packagedId);

					if (ventIdx >= 0) {
						mechVentData.splice(ventIdx, 1);
					}

					const storageIdx = waterStorageData.findIndex(x => x.data.id === packagedId);

					if (storageIdx >= 0) {
						const heatSourceForWaterStorageInDHW = state.domesticHotWater.heatSources.data.findIndex(x => x.data.heatSourceId === heatSourceData.id);
						waterStorageData.splice(storageIdx, 1);
						if (heatSourceForWaterStorageInDHW >= 0) {
							state.domesticHotWater.heatSources.data.splice(heatSourceForWaterStorageInDHW, 1);
						}

					}
				}
				heatSourceData.packageProductIds = [];
			}

			if (heatPumpProduct.technologyType === "HybridHeatPump") {
				useProductData(heatPumpProduct.boilerProductID!).then(boiler => {
					const boilerData = boiler as BoilerProduct;
					const boilerId = addBoilerProduct?.(boilerData);

					heatSourceData.packageProductIds?.push(boilerId);
				});
			}

			if (heatPumpProduct.technologyType === "ExhaustAirMevHeatPump" ||
				heatPumpProduct.technologyType === "ExhaustAirMixedHeatPump" ||
				heatPumpProduct.technologyType === "ExhaustAirMvhrHeatPump"
			) {
				const mechanicalVentilationData = state.infiltrationAndVentilation.mechanicalVentilation.data;

				const heatPumpMechVentTypeMap: Partial<Record<TechnologyType, SchemaMechVentType | undefined>> = {
					"ExhaustAirMevHeatPump": "Centralised continuous MEV",
					"ExhaustAirMvhrHeatPump": "MVHR",
				};

				const heatPumpType = heatPumpProductTypesMap[heatPumpProduct.technologyType];
				const mechanicalVentilation: Partial<MechanicalVentilationData> = {
					id: uuidv4(),
					name: `${heatPumpTypes[heatPumpType]} HP`,
					productReference: heatPumpProduct.id,
					typeOfMechanicalVentilationOptions: heatPumpMechVentTypeMap[heatPumpProduct.technologyType],
					packagedProductReference: heatPumpProduct.id,
				};

				mechanicalVentilationData.push({
					data: mechanicalVentilation as MechanicalVentilationData,
				});

				heatSourceData.packageProductIds?.push(mechanicalVentilation.id!);
			}
			const waterStorage = state.domesticHotWater.waterStorage.data;
			const dhwHeatSources = state.domesticHotWater.heatSources.data;

			if (waterStorage.length || (source === "spaceHeating" && dhwHeatSources.length)) {
				throw new EcaasError("DHW_HEAT_SOURCE_CONFLICT");
			}

			if (heatPumpProduct.technologyType !== "HybridHeatPump") {

				const createCylinderIfHasVessel = (details: HeatPumpProduct) => {
					if (!details.vesselType) return;

					createHotWaterCylinder(source, details, heatSourceData);
					heatSourceData.packagedWithWaterCylinder = true;
				};

				if (isDisplayProduct(heatPumpProduct)) {
					// Necessary because vessel type is not available unless we useProductData
					useProductData(heatPumpProduct.id).then(details => {
						createCylinderIfHasVessel(details as HeatPumpProduct);
					});
				} else {
					createCylinderIfHasVessel(heatPumpProduct);
				}
			}
		}

		(heatSourceData as PcdbProduct).productReference = product.id;
	};

	const createBoiler = (boilerData: BoilerProduct, packagedProductReference: string): Partial<HeatSourceData> => ({
		id: uuidv4(),
		name: boilerData.technologyType === "CombiBoiler" ? boilerTypes.combiBoiler : boilerTypes.regularBoiler,
		productReference: boilerData.id,
		typeOfHeatSource: "boiler",
		typeOfBoiler: boilerData.technologyType === "CombiBoiler" ? "combiBoiler" : "regularBoiler",
		needsSpecifiedLocation: boilerData.boilerLocation === "unknown",
		...(boilerData.boilerLocation && boilerData.boilerLocation !== "unknown" ? {
			specifiedLocation: boilerData.boilerLocation,
		} : {}),
		packagedProductReference,
	});

	const selectHeatSourceProduct = async (
		product: DisplayProduct,
		getHeatSources: (storeState: EcaasState) => EcaasForm<HeatSourceData>[] | undefined,
		heatSourceIndex: number,
	) => {
		store.$patch((state) => {
			const heatSources = getHeatSources(state);
			const heatSourceData = heatSources?.[heatSourceIndex]?.data;

			const addBoilerProduct = (boilerData: BoilerProduct) => {
				const heatSourceBoiler = createBoiler(boilerData, product.id);

				state.spaceHeating.heatSource.data.splice(heatSourceIndex + 1, 0, {
					data: heatSourceBoiler as HeatSourceData,
				});

				return heatSourceBoiler.id!;
			};

			const removeBoilerProduct = (id: string) => {
				const boilerToRemoveIdx = state.spaceHeating.heatSource.data.findIndex(x => x.data.id === id);

				if (boilerToRemoveIdx >= 0) {
					state.spaceHeating.heatSource.data.splice(boilerToRemoveIdx, 1);
				}
			};

			selectProduct(
				state,
				"spaceHeating",
				heatSourceData,
				product,
				addBoilerProduct,
				removeBoilerProduct,
			);
		});
	};

	const selectHotWaterHeatSourceProduct = async (
		product: DisplayProduct,
		getHeatSources: (storeState: EcaasState) => EcaasForm<DomesticHotWaterHeatSourceData>[] | undefined,
		heatSourceIndex: number,
	) => {
		store.$patch((state) => {
			const heatSources = getHeatSources(state);
			const heatSourceData = heatSources?.[heatSourceIndex]?.data;

			const addBoilerProduct = (boilerData: BoilerProduct) => {
				const heatSourceBoiler: Partial<DomesticHotWaterHeatSourceData> = {
					...createBoiler(boilerData, product.id),
					coldWaterSource: heatSourceData!.coldWaterSource,
					isExistingHeatSource: false,
					heatSourceId: "NEW_HEAT_SOURCE",
				};

				state.domesticHotWater.heatSources.data.splice(heatSourceIndex + 1, 0, {
					data: heatSourceBoiler as DomesticHotWaterHeatSourceData,
				});

				return heatSourceBoiler.id!;
			};

			const removeBoilerProduct = (id: string) => {
				const boilerToRemoveIdx = state.domesticHotWater.heatSources.data.findIndex(x => x.data.id === id);

				if (boilerToRemoveIdx !== -1) {
					state.domesticHotWater.heatSources.data.splice(boilerToRemoveIdx, 1);
				}
			};

			selectProduct(
				state,
				"domesticHotWater",
				heatSourceData,
				product,
				addBoilerProduct,
				removeBoilerProduct,
			);
		});
	};

	return {
		selectHeatSourceProduct,
		selectHotWaterHeatSourceProduct,
	};
}