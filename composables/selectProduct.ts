import { heatPumpProductTypesMap, type BoilerProduct, type DisplayProduct, type HeatPumpProduct, type HeatPumpProductTypes, type HybridHeatPumpProduct, type Product, type TechnologyGroup } from "~/pcdb/pcdb.types";
import { v4 as uuidv4 } from "uuid";

async function getProduct(id: string) {
	const { data } = await useFetch(`/api/products/${id}`);
	return data.value;
}

export function useSelectHeatSourceProduct(products: DisplayProduct[], heatSourceProductType: (HeatSourceProductType | TechnologyGroup)) {
	const store = useEcaasStore();

	const selectProduct = (
		heatSourceData: HeatSourceData | DomesticHotWaterHeatSourceData | undefined,
		product: DisplayProduct | Product,
		addBoilerProduct?: (newProduct: BoilerProduct) => string,
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
					getProduct(heatNetwork.id).then((item) => {
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
				getProduct(heatPumpProduct.boilerProductID!).then(boiler => {
					const boilerData = boiler as BoilerProduct;
					const boilerId = addBoilerProduct?.(boilerData);

					heatSourceData.packageProducts ??= [];
					heatSourceData.packageProducts.push(boilerId!);
				});
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

			selectProduct(heatSourceData, product, (boilerData) => {
				const heatSourceBoiler = createBoiler(boilerData, product.id);

				state.spaceHeating.heatSource.data.push({
					data: heatSourceBoiler,
					complete: true,
				});

				return heatSourceBoiler.id;
			});
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

			selectProduct(heatSourceData, product, (boilerData) => {
				const heatSourceBoiler: DomesticHotWaterHeatSourceData = {
					...createBoiler(boilerData, product.id),
					coldWaterSource: heatSourceData!.coldWaterSource,
					isExistingHeatSource: false,
					heatSourceId: "NEW_HEAT_SOURCE",
				};

				state.domesticHotWater.heatSources.data.push({
					data: heatSourceBoiler,
					complete: true,
				});

				return heatSourceBoiler.id;
			});
		});
	};

	return {
		selectHeatSourceProduct,
		selectHotWaterHeatSourceProduct,
	};
}