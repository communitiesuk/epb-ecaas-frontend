<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { getUrl, hasPackagedProduct, type DomesticHotWaterHeatSourceData, type EcaasForm, type HeatSourceData } from "#imports";
import { coldWaterSourceOptions, DHWHeatSourceTypesWithDisplay } from "~/utils/display";
import type { Product, AnyPcdbProduct } from "~/pcdb/pcdb.types";
import { celsius } from "~/utils/units/temperature";
import { greaterThanZero } from "~/utils/validation";
import type { NewDomesticHotWaterHeatSourceData } from "~/stores/ecaasStore.schema";
import { useHeatSources } from "~/composables/heatSources";

const title = "Heat source";
const store = useEcaasStore();
const { heatSources: dhwHeatSources } = store.domesticHotWater;

const { getStoreIndex, handleAutoSaveElementForm } = useForm();
const { createWaterCylinder } = useHeatSources();
const { mounted } = useMounted();
const { handleInvalidSubmit, errorMessages } = useErrorSummary();

const hotWaterHeatSourceStoreData = store.domesticHotWater.heatSources.data;
const index = getStoreIndex(hotWaterHeatSourceStoreData);
const hotWaterHeatSourceData = useItemToEdit("heatSource", hotWaterHeatSourceStoreData);
const model = ref(hotWaterHeatSourceData?.data as DomesticHotWaterHeatSourceData);
const id = hotWaterHeatSourceData?.data.id ?? uuidv4();

export type HeatPumpModelType = Extract<DomesticHotWaterHeatSourceData, { typeOfHeatSource: "heatPump" }>;
export type BoilerModelType = Extract<DomesticHotWaterHeatSourceData, { typeOfHeatSource: "boiler" }>;
export type HeatNetworkModelType = Extract<DomesticHotWaterHeatSourceData, { typeOfHeatSource: "heatNetwork" }>;
export type HeatBatteryModelType = Extract<DomesticHotWaterHeatSourceData, { typeOfHeatSource: "heatBattery" }>;
export type HeatInterfaceUnitModelType = Extract<DomesticHotWaterHeatSourceData, { typeOfHeatSource: "heatInterfaceUnit" }>;
export type SolarThermalModelType = Extract<DomesticHotWaterHeatSourceData, { typeOfHeatSource: "solarThermalSystem" }>;
export type ImmersionHeaterModelType = Extract<DomesticHotWaterHeatSourceData, { typeOfHeatSource: "immersionHeater" }>;
export type PointOfUseModelType = Extract<DomesticHotWaterHeatSourceData, { typeOfHeatSource: "pointOfUse" }>;

const productBrandName = ref<string | undefined>();
const packagedProduct = ref<Product | undefined>();

const preheatedWaterStorage = useAssociatedItems(["preheatedWaterStorage"]);
const preheatedWaterStorageMap = ref(new Map(preheatedWaterStorage));

const coldWaterSourceOptionsMap = computed(() => {
	const coldWaterSourcesMap = new Map(Object.entries(coldWaterSourceOptions));
	
	return ref(new Map([...preheatedWaterStorageMap.value, ...coldWaterSourcesMap]));
});

if (hasPackagedProduct(model.value)) {
	const packagedProductData = await useProductData(model.value.packagedProductReference!);
	packagedProduct.value = packagedProductData ?? undefined;
}

function removePackagedProducts(packageProductIds: string[]) {
	store.$patch((state) => {
		const heatSources = state.domesticHotWater.heatSources.data.filter((x) => {
			return !("packagedProductReference" in x.data) || !packageProductIds.includes((x.data.id));
		});
		store.$patch({
			domesticHotWater: {
				heatSources: {
					data: heatSources,
				},
			},
		});
	});
}

const saveForm = () => {
	store.$patch((state) => {
		state.domesticHotWater.heatSources.data[index]!.complete = true;
		state.domesticHotWater.heatSources.complete = false;
	});

	navigateTo(getUrl("domesticHotWater"));
};

watch(
	() => model.value,
	(newData, initialData) => {
		if (!newData.heatSourceId) return;

		if (initialData.heatSourceId !== newData.heatSourceId) {
			errorMessages.value = [];

			model.value = { 
				coldWaterSource: initialData.coldWaterSource,
				isExistingHeatSource: newData.heatSourceId === "NEW_HEAT_SOURCE" ? false : true,
				heatSourceId: newData.heatSourceId,
				id: initialData.id,
			} as DomesticHotWaterHeatSourceData;
		}

		if (initialData.isExistingHeatSource === false && newData.isExistingHeatSource === false && initialData.typeOfHeatSource !== newData.typeOfHeatSource) {
			if (initialData.typeOfHeatSource === "heatPump") {
				removePackagedProducts(initialData.packageProductIds ?? []);
			}

			errorMessages.value = [];

			model.value = { 
				coldWaterSource: initialData.coldWaterSource,
				isExistingHeatSource: false,
				heatSourceId: "NEW_HEAT_SOURCE" ,
				id: initialData.id,
				typeOfHeatSource: newData.typeOfHeatSource,
			} as DomesticHotWaterHeatSourceData;
		}

		if (model.value.isExistingHeatSource === false && model.value.typeOfHeatSource && model.value && !model.value.name) {
			model.value.name = getHeatSourceDefaultName(model.value);
		}
	},
);

function getActualHeatSource(dhwHeatSource: DomesticHotWaterHeatSourceData): HeatSourceData | NewDomesticHotWaterHeatSourceData | undefined {
	if (dhwHeatSource.isExistingHeatSource) {
		return store.spaceHeating.heatSource.data.find(x => x.data.id === dhwHeatSource.heatSourceId)?.data as HeatSourceData;
	}

	return dhwHeatSource;
}

export interface AutoSaveElementFormOptionsNoName<T extends DomesticHotWaterHeatSourceData> {
	model: Ref<T | undefined>;
	storeData: EcaasFormList<T>;
	onPatch: (state: EcaasState, newData: EcaasForm<T>, index: number, prevData?: EcaasForm<T>) => void;
}

const autoSaveElementFormNoName = ({
	model,
	storeData,
	onPatch,
}: AutoSaveElementFormOptionsNoName<DomesticHotWaterHeatSourceData>) => {
	watch(model, async (newData: DomesticHotWaterHeatSourceData | undefined, initialData: DomesticHotWaterHeatSourceData | undefined) => {
		if (newData?.isExistingHeatSource === undefined) {
			return;
		}

		if (newData.isExistingHeatSource === false 
			&& (newData as { typeOfHeatSource?: string }).typeOfHeatSource === undefined) {
			return;
		}

		const defaultName = "typeOfHeatSource" in newData ? getHeatSourceDefaultName(newData) : "Heat source";

		handleAutoSaveElementForm(newData, initialData, storeData, defaultName, onPatch);
	});
};

autoSaveElementFormNoName({
	model,
	storeData: store.domesticHotWater.heatSources,
	onPatch: (state, newData, index, prevData) => {
		const existingData = prevData?.data as DomesticHotWaterHeatSourceData;
		newData.data.id ??= id;

		const heatSource = getActualHeatSource(newData.data);

		if (isPackagedProduct(newData.data) && newData.data.coldWaterSource) {
			const packageProductIds = newData.data.packageProductIds;
			const packageProductIndex = state.domesticHotWater.heatSources.data.findIndex(x => packageProductIds?.includes(x.data.id));

			if (packageProductIndex >= 0) {
				state.domesticHotWater.heatSources.data[packageProductIndex]!.data.coldWaterSource = newData.data.coldWaterSource;
			}
		}

		createWaterCylinder("domesticHotWater", state, heatSource, existingData, newData.data);
		preheatedWaterStorageMap.value = new Map(useAssociatedItems(["preheatedWaterStorage"]));

		state.domesticHotWater.heatSources.data[index] = newData;
		state.domesticHotWater.heatSources.complete = false;
	},
});

function updateHeatSource(type: string) {
	watch(() => model.value[`${type}` as keyof DomesticHotWaterHeatSourceData],
		(newHeatSourceSubtype, initialHeatSourceSubtype) => {

			if (model.value.isExistingHeatSource === false && newHeatSourceSubtype !== initialHeatSourceSubtype) {
				if ("productReference" in model.value && type !== "typeOfHeatNetwork") {
					model.value.productReference = "";
				}

				const defaultName = getHeatSourceDefaultName(model.value);
				model.value.name = defaultName;

				(store.domesticHotWater.heatSources.data[index]!.data as { name: string }).name = defaultName;
			}
		},
	);
}

function getHeatSourceOptions() {
	const usedHeatSourceIds = store.domesticHotWater.heatSources.data
		.map(x => x.data?.heatSourceId)
		.filter(id => id && id !== "NEW_HEAT_SOURCE");

	const currentHeatSourceId = store.domesticHotWater.heatSources.data[index]?.data.heatSourceId;
	const radioOptions = new Map();

	store.spaceHeating.heatSource.data
		.filter(x => x.data.id !== undefined)
		.forEach(x => {
			const id = x.data.id as string;
			const isUsed = usedHeatSourceIds.includes(id);
			const isEditingThisOne = id === currentHeatSourceId;

			radioOptions.set(
				id, 
				isUsed && !isEditingThisOne 
					? {
						label: x.data.name + " (already used for water heating)",
						disabled: true, 
					} : {
						label: x.data.name,
						typeOfHeatSource: x.data.typeOfHeatSource,
						disabled: false,
					},
			);
		});

	radioOptions.set("NEW_HEAT_SOURCE", "Add a new water heating source");

	return radioOptions;
}

const existingHeatSourceType = computed(() => {
	const selectedType = radioOptions.get(model?.value.heatSourceId).typeOfHeatSource || "";
	const formattedType = displayCamelToSentenceCase(selectedType).toLowerCase();

	return { selectedType, formattedType };
});

function hasHeatNetworkHeatSource() {
	return !!store.spaceHeating.heatNetworks.data.length;
}

function isCommunalHeatNetworkWithoutBoosterHeatPump() {
	const heatNetworks = store.spaceHeating.heatNetworks.data;
	if (heatNetworks.length != 0)
		return store.spaceHeating.heatNetworks.data.some(
			x => x.data.typeOfHeatNetwork === "communalHeatNetwork" && !x.data.boosterHeatPump,
		);
}

function isCommunalHeatNetworkWithBoosterHeatPump() {
	const heatNetworks = store.spaceHeating.heatNetworks.data;
	if (heatNetworks.length != 0)
		return store.spaceHeating.heatNetworks.data.some(
			x => x.data.typeOfHeatNetwork === "communalHeatNetwork" && x.data.boosterHeatPump,
		);
}

function isDistrictHeatNetwork() {
	const heatNetworks = store.spaceHeating.heatNetworks.data;
	if (heatNetworks.length != 0)
		return store.spaceHeating.heatNetworks.data.some(
			x => x.data.typeOfHeatNetwork === "sleevedDistrictHeatNetwork" || x.data.typeOfHeatNetwork === "unsleevedDistrictHeatNetwork",
		);
}

function getHeatSourceTypeHelpText() {
	if (isCommunalHeatNetworkWithoutBoosterHeatPump()) {
		return "As a traditional communal heat network has been added, the heat source must be a HIU";
	}

	if (isCommunalHeatNetworkWithBoosterHeatPump()) {
		return "As a 5th generation (ambient loop) communal heat network has been added, the heat source must be a booster heat pump";
	}

	if (isDistrictHeatNetwork())
		return "As a district heat network has been added, the heat source must be a HIU";
}

function hasHeatPumpOrHIUHeatSource() {
	return dhwHeatSources.data.some((x, itemIndex) => {
		if (itemIndex === index) {
			return false;
		}
		const typeOfHeatSource = getDhwHeatSourceType(x);
		return typeOfHeatSource === "heatPump" || typeOfHeatSource === "heatInterfaceUnit";
	});
}

function getDhwHeatSourceType(heatSourceForm: EcaasForm<DomesticHotWaterHeatSourceData>): Extract<DomesticHotWaterHeatSourceData, { typeOfHeatSource: string }>["typeOfHeatSource"] | undefined {
	if (heatSourceForm.data.isExistingHeatSource) {
		return store.spaceHeating.heatSource.data.find(
			x => x.data.id === heatSourceForm.data.heatSourceId,
		)?.data.typeOfHeatSource;
	}

	return heatSourceForm.data.typeOfHeatSource;
}

function filterHeatSourceOptions(): Record<string, string> {
	const { heatPump, heatInterfaceUnit } = DHWHeatSourceTypesWithDisplay;
	const { heatNetwork } = heatNetworkProductTypeDisplay;

	if (isCommunalHeatNetworkWithoutBoosterHeatPump() || isDistrictHeatNetwork()) {
		return {
			heatInterfaceUnit,
		};
	}

	if (isCommunalHeatNetworkWithBoosterHeatPump()) {
		return {
			heatPump: "Booster heat pump",
		};
	}
	
	if (hasHeatNetworkHeatSource()) {
		return {
			heatPump,
			heatInterfaceUnit,
		};
	}

	if (hasHeatPumpOrHIUHeatSource()) {
		return {
			heatNetwork: heatNetwork(false),
		};
	}
	
	return DHWHeatSourceTypesWithDisplay;
}

const isLinkedToHeatSourceWithCylinder = (): boolean => {
	if (model.value === undefined || !model.value.isExistingHeatSource) {
		return false;
	}

	const spaceHeatingHeatSource = store.spaceHeating.heatSource.data.find(
		(heatSource) => heatSource.data.id === model.value.heatSourceId);

	const waterStorageIds = store.domesticHotWater.waterStorage.data.map(waterStorage => waterStorage.data.id);

	return isPackagedProduct(spaceHeatingHeatSource?.data) && spaceHeatingHeatSource.data.packageProductIds!.some(id => waterStorageIds.includes(id));
};

function handleProductLoaded(product: AnyPcdbProduct) {
	if (hasModelDetails(product)) {
		productBrandName.value = product.brandName;
	}
}

const hasWaterStorage = computed(() => {
	return store.domesticHotWater.waterStorage.data.length > 0;
});

const heatSourceOptions = computed(() => {
	const heatSourceOptions = filterHeatSourceOptions();

	const result: Record<string, { label: string; disabled?: boolean, hint?: string }> = {};

	for (const [key, label] of Object.entries(heatSourceOptions)) {
		const isPointOfUseDisabled = key === "pointOfUse" && hasWaterStorage.value;
		result[key] = {
			label,
			disabled: key === "pointOfUse" && hasWaterStorage.value,
			hint: isPointOfUseDisabled
				? "Point of use can only be selected when there is no water storage"
				: undefined,
		};
	}
	return result;
});

const radioOptions = getHeatSourceOptions();
const allBoilers = useAssociatedItems(["boiler"]);
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<PackagedProductInset
		v-if="hasPackagedProduct(model) && packagedProduct"
		:model="model"
		:packaged-product="packagedProduct"
		type="boiler"
	/>
	<GovInset 
		v-if="isLinkedToHeatSourceWithCylinder()"
		test-id="spaceHeatingHeatSourceWithCylinderInset"
	>
		<p>A heat pump with a hot water cylinder has been selected as a heat source for space heating. As it is linked to a hot water cylinder, this heat pump has been automatically selected as the heat source for hot water. If this is incorrect, please select another heat pump product which is not attached to a hot water cylinder.</p>
	</GovInset>
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="heatSourceErrorSummary" />
		<FormKit 
			v-if="mounted"
			id="heatSourceId"
			type="govRadios"
			label="Use a previously added heat source"
			:options="radioOptions"
			name="heatSourceId"
			validation="required"
			:disabled="hasPackagedProduct(model) || (model.isExistingHeatSource && model.createdAutomatically)"
		>
			<div class="govuk-hint">
				<p>
					To view and edit these options go to
					<NuxtLink :to="getUrl('spaceHeating')">
						Space heating
					</NuxtLink>
				</p>
			</div>
		</FormKit>
		<template v-if="mounted">
			<FormKit
				v-if="model.isExistingHeatSource === false"
				id="typeOfHeatSource"
				type="govRadios"
				label="Type of heat source"
				:options="heatSourceOptions"
				name="typeOfHeatSource"
				validation="required"
				:disabled="hasPackagedProduct(model)"
				:help="getHeatSourceTypeHelpText()"
			/>
			<HeatPumpSection
				v-if="model.isExistingHeatSource === false
					&& model.typeOfHeatSource === 'heatPump'"
				:model="(model as HeatPumpModelType)"
				:index="index"
				:boilers="allBoilers"
				add-boiler-page-id="heatSourcesCreate"
				page="domestic hot water"
				@update-heat-pump-model="updateHeatSource"
				@product-loaded="handleProductLoaded"
			/>
			<BoilerSection
				v-if="model.isExistingHeatSource === false
					&& model.typeOfHeatSource === 'boiler'"
				:model="(model as BoilerModelType)"
				:index="index"
				page="domestic hot water"
				@update-boiler-model="updateHeatSource"
				@product-loaded="handleProductLoaded"
			/>
			<HeatBatterySection
				v-if="model.isExistingHeatSource === false
					&& model.typeOfHeatSource === 'heatBattery'"
				:model="(model as HeatBatteryModelType)"
				:index="index"
				page="domestic hot water"
				@update-heat-battery-model="updateHeatSource"
				@product-loaded="handleProductLoaded"
			/>
			<HeatInterfaceUnitSection
				v-if="model.isExistingHeatSource === false
					&& model.typeOfHeatSource === 'heatInterfaceUnit'"
				:model="(model as HeatInterfaceUnitModelType)"
				:index="index"
				page="domestic hot water"
				@update-heat-interface-unit-model="updateHeatSource"
				@product-loaded="handleProductLoaded"
			/>
			<SolarThermalSystemSection
				v-if="model.isExistingHeatSource === false
					&& model.typeOfHeatSource === 'solarThermalSystem'"
				:model="(model as SolarThermalModelType)" 
				:index="index" />
			<ImmersionHeaterSection
				v-if="model.isExistingHeatSource === false
					&& model.typeOfHeatSource === 'immersionHeater'"
				:model="(model as ImmersionHeaterModelType)" 
				:index="index" />
			<PointOfUseSection
				v-if="model.isExistingHeatSource === false
					&& model.typeOfHeatSource === 'pointOfUse'"
				:model="(model as PointOfUseModelType)" 
				:index="index" />
			<FormKit
				v-if="model.isExistingHeatSource && ['boiler', 'heatPump', 'heatBattery'].includes(existingHeatSourceType.selectedType)"
				id="maxFlowTemp"
				:key="model.heatSourceId"
				name="maxFlowTemp"
				label="Maximum flow temperature"
				:help="`Enter the highest flow temperature that the ${existingHeatSourceType.formattedType} is allowed to operate at for domestic hot water`"
				type="govInputWithUnit"
				:unit="celsius"
				:validation-rules="{ exclusiveRangeFromMin: greaterThanZero }"
				validation="required | exclusiveRangeFromMin:0"
				:validation-messages="{
					exclusiveRangeFromMin: `Maximum flow temperature must be greater than 0.`,
				}"
				:data-field="'HotWaterSource.*.HeatSource.*.temp_flow_limit_upper'"
			/>
			<FormKit
				id="coldWaterSource"
				type="govRadios"
				label="Cold water source"
				:options="coldWaterSourceOptionsMap"
				name="coldWaterSource"
				validation="required"
				:disabled="hasPackagedProduct(model)"
			/>
		</template>
		<HemDefaultProductWarning :brand-names="[productBrandName]" />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('domesticHotWater')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>