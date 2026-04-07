import { heatPumpProductTypesMap, type BoilerProduct, type DisplayProduct, type HeatPumpProduct, type HeatPumpProductTypes, type HybridHeatPumpProduct, type Product, type TechnologyGroup, type TechnologyType } from "~/pcdb/pcdb.types";
import { v4 as uuidv4 } from "uuid";
import type { SchemaMechVentType } from "~/schema/aliases";
import { useProductData } from "./productData";

export function useSelectHeatSourceProduct(products: DisplayProduct[], heatSourceProductType: (HeatSourceProductType | TechnologyGroup)) {
	const store = useEcaasStore();

	const selectProduct = (
		state: EcaasState,
		heatSourceData: HeatSourceData | DomesticHotWaterHeatSourceData | undefined,
		product: DisplayProduct | Product,
		addBoilerProduct: (newProduct: BoilerProduct) => string,
		removeBoilerProduct: (id: string) => void,
	) => {
		if (!heatSourceData || ("isExistingHeatSource" in heatSourceData && heatSourceData.isExistingHeatSource)) {
			return;
		}

		if (heatSourceData.typeOfHeatSource === "heatNetwork") {
			if (heatSourceData.usesHeatInterfaceUnits && heatSourceProductType === "heatInterfaceUnit") {
				heatSourceData.heatInterfaceUnitProductReference = product.id;
				return;
			}

			if (!heatSourceData.isHeatNetworkInPcdb) return;

			const heatNetwork = products.find(x => x.id === product.id);

			if (heatNetwork) {
				if ("fifthGHeatNetwork" in product) {
					heatSourceData.isFifthGeneration = product.fifthGHeatNetwork === 1;
				} else {
					useProductData(heatNetwork.id).then((item) => {
						heatSourceData.isFifthGeneration = !!(item && "fifthGHeatNetwork" in item && item.fifthGHeatNetwork === 1);
					});
				}
			}
		}
		
		if (heatSourceData.typeOfHeatSource === "boiler") {
			const boilerProduct = product as (DisplayProduct | BoilerProduct);
			heatSourceData.needsSpecifiedLocation = boilerProduct.boilerLocation === "unknown";
			delete heatSourceData.specifiedLocation;
		}

		if (heatSourceData.typeOfHeatSource === "heatPump") {
			const heatPumpProduct = product as (DisplayProduct | HeatPumpProduct | HybridHeatPumpProduct);
			heatSourceData.typeOfHeatPump = heatPumpProductTypesMap[heatPumpProduct.technologyType as HeatPumpProductTypes];

			if (heatPumpProduct.technologyType === "HybridHeatPump") {
				if (heatSourceData.packageProductId) {
					removeBoilerProduct?.(heatSourceData.packageProductId);
				}

				useProductData(heatPumpProduct.boilerProductID!).then(boiler => {
					const boilerData = boiler as BoilerProduct;
					const boilerId = addBoilerProduct?.(boilerData);

					heatSourceData.packageProductId = boilerId;
				});
			}

			if (heatPumpProduct.technologyType === "ExhaustAirMevHeatPump" ||
				heatPumpProduct.technologyType === "ExhaustAirMixedHeatPump" ||
				heatPumpProduct.technologyType === "ExhaustAirMvhrHeatPump"
			) {
				const mechanicalVentilationData = state.infiltrationAndVentilation.mechanicalVentilation.data;

				if (heatSourceData.packageProductId) {
					const ventToRemove = mechanicalVentilationData.findIndex(x => x.data.id === heatSourceData.id);
					mechanicalVentilationData.splice(ventToRemove, 1);
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

				heatSourceData.packageProductId = mechanicalVentilation.id!;
			}
		}

		(heatSourceData as PcdbProduct).productReference = product.id;
	};

	const createBoiler = (boilerData: BoilerProduct, packagedProductReference: string): HeatSourceData => ({
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
					data: heatSourceBoiler,
					complete: true,
				});

				return heatSourceBoiler.id;
			};

			const removeBoilerProduct = (id: string) => {
				const boilerToRemove = state.spaceHeating.heatSource.data.findIndex(x => x.data.id === id);

				if (boilerToRemove) {
					state.spaceHeating.heatSource.data.splice(boilerToRemove, 1);
				}
			};

			selectProduct(
				state,
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
				const heatSourceBoiler: DomesticHotWaterHeatSourceData = {
					...createBoiler(boilerData, product.id),
					coldWaterSource: heatSourceData!.coldWaterSource,
					isExistingHeatSource: false,
					heatSourceId: "NEW_HEAT_SOURCE",
				};

				state.domesticHotWater.heatSources.data.splice(heatSourceIndex + 1, 0, {
					data: heatSourceBoiler,
					complete: true,
				});

				return heatSourceBoiler.id;
			};

			const removeBoilerProduct = (id: string) => {
				const boilerToRemove = state.domesticHotWater.heatSources.data.findIndex(x => x.data.id === id);

				if (boilerToRemove) {
					state.domesticHotWater.heatSources.data.splice(boilerToRemove, 1);
				}
			};

			selectProduct(
				state,
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