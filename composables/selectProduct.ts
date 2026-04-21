import { heatPumpProductTypesMap, isDisplayProduct, type BoilerProduct, type DisplayProduct, type HeatPumpProduct, type HeatPumpProductTypes, type HybridHeatPumpProduct, type Product, type TechnologyGroup, type TechnologyType } from "~/pcdb/pcdb.types";
import { v4 as uuidv4 } from "uuid";
import type { SchemaMechVentType } from "~/schema/aliases";
import { useProductData } from "./productData";
import { EcaasError } from "~/errors.types";

type HeatSourceSection = "spaceHeating" | "domesticHotWater";

export function useSelectHeatSourceProduct(_products: DisplayProduct[], _heatSourceProductType: (HeatSourceProductType | TechnologyGroup)) {
	const store = useEcaasStore();

	const createHotWaterCyliner = (state: EcaasState, source: HeatSourceSection, heatPumpDetails: HeatPumpProduct, heatSourceData: HeatSourceData | DomesticHotWaterHeatSourceData) => {
		let heatSourceId = heatSourceData.id;
		
		if (source === "spaceHeating") {
			const hotWaterHeatPump: Partial<DomesticHotWaterHeatSourceData> = {
				id: uuidv4(),
				isExistingHeatSource: true,
				createdAutomatically: true,
				heatSourceId: heatSourceData.id,
			};

			heatSourceId = hotWaterHeatPump.id!;

			state.domesticHotWater.heatSources.data.push({
				data: hotWaterHeatPump as DomesticHotWaterHeatSourceData,
			});
		}

		const hotWaterCylinder: Partial<WaterStorageData> = {
			id: uuidv4(),
			typeOfWaterStorage: "hotWaterCylinder",
			name: "Hot water cylinder",
			...(heatPumpDetails.tankVolumeDeclared !== undefined ? {
				storageCylinderVolume: unitValue(heatPumpDetails.tankVolumeDeclared, "litres"),
			} : {}),
			dailyEnergyLoss: heatPumpDetails.dailyLossesDeclared,
			dhwHeatSourceId: heatSourceId,
			areaOfHeatExchanger: heatPumpDetails.heatExchangerSurfaceAreaDeclared,
			packagedProductReference: heatPumpDetails.id,
		};

		state.domesticHotWater.waterStorage.data.push({
			data: hotWaterCylinder as WaterStorageData,
		});

		if ("packageProductIds" in heatSourceData && Array.isArray(heatSourceData.packageProductIds)) {
			heatSourceData.packageProductIds.push(hotWaterCylinder.id!);
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
		if (!heatSourceData || ("isExistingHeatSource" in heatSourceData && heatSourceData.isExistingHeatSource)) {
			return;
		}

		// if (heatSourceData.typeOfHeatSource === "heatNetwork") {
		// 	if (heatSourceData.usesHeatInterfaceUnits && heatSourceProductType === "heatInterfaceUnit") {
		// 		heatSourceData.heatInterfaceUnitProductReference = product.id;
		// 		return;
		// 	}

		// 	if (!heatSourceData.isHeatNetworkInPcdb) return;

		// 	const heatNetwork = products.find(x => x.id === product.id);

		// 	if (heatNetwork) {
		// 		if ("fifthGHeatNetwork" in product) {
		// 			heatSourceData.hasBoosterHeatPump = product.fifthGHeatNetwork === 1;
		// 		} else {
		// 			useProductData(heatNetwork.id).then((item) => {
		// 				heatSourceData.hasBoosterHeatPump = !!(item && "fifthGHeatNetwork" in item && item.fifthGHeatNetwork === 1);
		// 			});
		// 		}
		// 	}
		// }
		
		if (heatSourceData.typeOfHeatSource === "boiler") {
			const boilerProduct = product as (DisplayProduct | BoilerProduct);
			heatSourceData.needsSpecifiedLocation = boilerProduct.boilerLocation === "unknown";
			delete heatSourceData.specifiedLocation;
		}

		if (heatSourceData.typeOfHeatSource === "heatPump") {
			const heatPumpProduct = product as (DisplayProduct | HeatPumpProduct | HybridHeatPumpProduct);

			heatSourceData.typeOfHeatPump = heatPumpProductTypesMap[heatPumpProduct.technologyType as HeatPumpProductTypes];
			heatSourceData.packageProductIds ??= [];

			if (heatPumpProduct.technologyType === "HybridHeatPump") {
				if (heatSourceData.packageProductIds?.length) {
					const boilerId = heatSourceData.packageProductIds[0]!;
					removeBoilerProduct?.(boilerId);
				}

				useProductData(heatPumpProduct.boilerProductID!).then(boiler => {
					const boilerData = boiler as BoilerProduct;
					const boilerId = addBoilerProduct?.(boilerData);

					heatSourceData.packageProductIds = [boilerId];
				});
			}

			if (heatPumpProduct.technologyType === "ExhaustAirMevHeatPump" ||
				heatPumpProduct.technologyType === "ExhaustAirMixedHeatPump" ||
				heatPumpProduct.technologyType === "ExhaustAirMvhrHeatPump"
			) {
				const mechanicalVentilationData = state.infiltrationAndVentilation.mechanicalVentilation.data;

				if (heatSourceData.packageProductIds?.length) {
					const ventToRemove = mechanicalVentilationData.find(x => heatSourceData.packageProductIds?.includes(x.data.id!));
					const ventIndex = ventToRemove ? mechanicalVentilationData.indexOf(ventToRemove) : undefined;

					if (ventToRemove && ventIndex && ventIndex >= 0) {
						mechanicalVentilationData.splice(ventIndex, 1);

						const packageProductIdIndex = heatSourceData.packageProductIds.indexOf(ventToRemove.data.id!);
						heatSourceData.packageProductIds.splice(packageProductIdIndex, 1);
					}
				}

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

			// Heat pump is packaged with hot water cylinder
			if (heatPumpProduct.technologyType !== "HybridHeatPump" && heatPumpProduct.vesselType === "Integral") {
				const waterStorage = state.domesticHotWater.waterStorage.data;
				const dhwHeatSources = state.domesticHotWater.heatSources.data;

				// Throw error if water storage or domestic hot water heat sources contain any entries
				if (waterStorage.length || (source === "spaceHeating" && dhwHeatSources.length)) {
					throw new EcaasError("DHW_HEAT_SOURCE_CONFLICT");
				}

				if (heatSourceData.packageProductIds?.length) {
					const cylinderToRemove = waterStorage.find(x => heatSourceData.packageProductIds?.includes(x.data.id!));
					const cylinderIndex = cylinderToRemove ? waterStorage.indexOf(cylinderToRemove) : undefined;

					if (cylinderToRemove && cylinderIndex && cylinderIndex >= 0) {
						waterStorage.splice(cylinderIndex, 1);

						const packageProductIdIndex = heatSourceData.packageProductIds.indexOf(cylinderToRemove.data.id!);
						heatSourceData.packageProductIds.splice(packageProductIdIndex, 1);
					}
				}

				if (isDisplayProduct(heatPumpProduct)) {
					useProductData(heatPumpProduct.id).then(details => {
						createHotWaterCyliner(state, source, details as HeatPumpProduct, heatSourceData);
					});
				} else {
					createHotWaterCyliner(state, source, heatPumpProduct, heatSourceData);
				}
			}
		}

		if (heatSourceData.typeOfHeatSource === "heatNetwork" && isDisplayProduct(product) && product.technologyType === "HeatNetworks") {
			heatSourceData.productReference = product.productId ?? product.id;
			heatSourceData.subHeatNetworkId = product.subHeatNetworkId ?? product.id;
			return;
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
				const boilerToRemove = state.spaceHeating.heatSource.data.findIndex(x => x.data.id === id);

				if (boilerToRemove) {
					state.spaceHeating.heatSource.data.splice(boilerToRemove, 1);
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
				const boilerToRemove = state.domesticHotWater.heatSources.data.findIndex(x => x.data.id === id);

				if (boilerToRemove) {
					state.domesticHotWater.heatSources.data.splice(boilerToRemove, 1);
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