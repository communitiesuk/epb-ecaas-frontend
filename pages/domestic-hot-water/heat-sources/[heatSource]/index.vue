<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { getUrl, hasPackagedProduct, type DomesticHotWaterHeatSourceData } from "#imports";
import { coldWaterSourceOptions, DHWHeatSourceTypesWithDisplay } from "../../../../utils/display";
import type { Product } from "~/pcdb/pcdb.types";

const title = "Heat source";
const store = useEcaasStore();
const { getStoreIndex } = useForm();
const route = useRoute();

const hotWaterHeatSourceStoreData = store.domesticHotWater.heatSources.data;
const index = getStoreIndex(hotWaterHeatSourceStoreData);
const hotWaterHeatSourceData = useItemToEdit("heatSource", hotWaterHeatSourceStoreData);
const model = ref(hotWaterHeatSourceData?.data as DomesticHotWaterHeatSourceData);
const id = hotWaterHeatSourceData?.data.id ?? uuidv4();

export type HeatPumpModelType = Extract<DomesticHotWaterHeatSourceData, { typeOfHeatSource: "heatPump" }>;
export type BoilerModelType = Extract<DomesticHotWaterHeatSourceData, { typeOfHeatSource: "boiler" }>;
export type HeatNetworkModelType = Extract<DomesticHotWaterHeatSourceData, { typeOfHeatSource: "heatNetwork" }>;
export type HeatBatteryModelType = Extract<DomesticHotWaterHeatSourceData, { typeOfHeatSource: "heatBattery" }>;
export type SolarThermalModelType = Extract<DomesticHotWaterHeatSourceData, { typeOfHeatSource: "solarThermalSystem" }>;
export type ImmersionHeaterModelType = Extract<DomesticHotWaterHeatSourceData, { typeOfHeatSource: "immersionHeater" }>;
export type PointOfUseModelType = Extract<DomesticHotWaterHeatSourceData, { typeOfHeatSource: "pointOfUse" }>;

const { handleInvalidSubmit, errorMessages } = useErrorSummary();

const packagedProduct = ref<Product | undefined>();

if (hasPackagedProduct(model.value)) {
	const productReferences = await useProductReference(hotWaterHeatSourceStoreData, product => product);
	packagedProduct.value = productReferences[model.value.packagedProductReference!];
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

		if (
			initialData.heatSourceId !== newData.heatSourceId
		) {
			errorMessages.value = [];
			model.value = { 
				coldWaterSource: initialData.coldWaterSource,
				isExistingHeatSource: newData.heatSourceId === "NEW_HEAT_SOURCE" ? false : true,
				heatSourceId: newData.heatSourceId,
				id: initialData.id,
			} as DomesticHotWaterHeatSourceData;
		}
		if (model.value.isExistingHeatSource === false && model.value.typeOfHeatSource && model.value && !model.value.name) {
			model.value.name = getHeatSourceDefaultName(model.value);
		}
	},
);

export interface AutoSaveElementFormOptionsNoName<T> {
	model: Ref<Partial<T> | undefined>;
	storeData: EcaasFormList<T>;
	onPatch: (state: EcaasState, newData: EcaasForm<T>, index: number) => void;
}

const autoSaveElementFormNoName = <T extends DomesticHotWaterHeatSourceData>({
	model,
	storeData,
	onPatch,
}: AutoSaveElementFormOptionsNoName<T>) => {
	watch(model, async (newData: Partial<T> | undefined, initialData: Partial<T> | undefined) => {
		const routeParam = route.params[Object.keys(route.params)[0]!];
		if (initialData === undefined || newData === undefined || routeParam === undefined) {
			return;
		}

		if (newData.isExistingHeatSource === undefined) {
			return;
		}

		if (newData.isExistingHeatSource === false 
			&& (newData as { typeOfHeatSource?: string }).typeOfHeatSource === undefined) {
			return;
		}
		
		if (!hasChangedFields(newData, initialData)) {
			return;
		}
			
		const index = getStoreIndex(storeData.data as EcaasForm<T>[]);
		if (routeParam === "create") {
			// we're about to save, so set the route parameter to the new index
			// we only expect this to trigger on the first change 
			// (after that, routeParam is no longer "create")
			route.params[Object.keys(route.params)[0]!] = index.toString();

			// change the url to reflect this
			const editItemPath = route.fullPath.replace("create", index.toString());
			history.replaceState({}, "", editItemPath);
		}

		store.$patch((state) => {
			const dataToPatch: Partial<T> = { ...newData };

			const elementData: EcaasForm<T> = {
				data: dataToPatch as T,
			};

			if (isPackagedProduct(newData) && newData.coldWaterSource) {
				const packageProductIndex = state.domesticHotWater.heatSources.data.findIndex(x => x.data.id === newData.packageProductId);

				if (packageProductIndex >= 0) {
					state.domesticHotWater.heatSources.data[packageProductIndex]!.data.coldWaterSource = newData.coldWaterSource;
				}
			}

			onPatch(state, elementData, index);
		});
	});
};

autoSaveElementFormNoName<DomesticHotWaterHeatSourceData>({
	model,
	storeData: store.domesticHotWater.heatSources,
	onPatch: (state, newData, index) => {
		newData.data.id ??= id;
		state.domesticHotWater.heatSources.data[index] = newData;
		state.domesticHotWater.heatSources.complete = false;
	},
});

function updateHeatSource(type: string) {

	watch(() => model.value[`${type}` as keyof DomesticHotWaterHeatSourceData],
		(newHeatSourceSubtype, initialHeatSourceSubtype) => {

			if (model.value.isExistingHeatSource === false && newHeatSourceSubtype !== initialHeatSourceSubtype) {
				if ("productReference" in model.value) {
					model.value.productReference = "";
				}
				const defaultName = getHeatSourceDefaultName(model.value);
				model.value.name = defaultName;
				(store.domesticHotWater.heatSources.data[index]!.data as { name: string }).name = defaultName;
			}
		},
	);
}

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
					disabled: false,
				},
		);
	});

radioOptions.set("NEW_HEAT_SOURCE", "Add a new water heating source");

const domesticHotWaterBoilers = hotWaterHeatSourceStoreData
	.filter(x => !x.data.isExistingHeatSource && x.data.typeOfHeatSource === "boiler")
	.map(x => {
		const dhwBoiler = (x.data as BoilerModelType);
		return [dhwBoiler.id, dhwBoiler.name] as [string, string];
	});

const spaceHeatingBoilers = hotWaterHeatSourceStoreData
	.filter(x => x.data.isExistingHeatSource)
	.map(x => {
		const heatSource = store.spaceHeating.heatSource.data
			.find(hs => hs.data.id === x.data.heatSourceId);
		
		if (heatSource?.data.typeOfHeatSource === "boiler") {
			return [heatSource.data.id, heatSource.data.name] as [string, string];
		}

		return null;
	})
	.filter(x => x !== null);

const allBoilers = [...domesticHotWaterBoilers, ...spaceHeatingBoilers];
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
	/>
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="heatSourceErrorSummary" />
		<FormKit
			id="coldWaterSource"
			type="govRadios"
			label="Cold water source"
			:options="coldWaterSourceOptions"
			name="coldWaterSource"
			validation="required"
			:disabled="hasPackagedProduct(model)"
		/>
		<FormKit 
			id="heatSourceId"
			type="govRadios"
			label="Use a previously added heat source"
			:options="new Map(radioOptions)"
			name="heatSourceId"
			validation="required"
			:disabled="hasPackagedProduct(model)"
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
		<FormKit
			v-if="model.isExistingHeatSource === false"
			id="typeOfHeatSource"
			type="govRadios"
			label="Type of heat source"
			:options="DHWHeatSourceTypesWithDisplay"
			name="typeOfHeatSource"
			validation="required"
			:disabled="hasPackagedProduct(model)"
		/>		
		<HeatPumpSection
			v-if="model.isExistingHeatSource === false
				&& model.typeOfHeatSource === 'heatPump'"
			:model="(model as HeatPumpModelType)"
			:index="index"
			:boilers="allBoilers"
			add-boiler-page-id="heatSourcesCreate"
			page="domestic-hot-water"
			@update-heat-pump-model="updateHeatSource" />
		<BoilerSection
			v-if="model.isExistingHeatSource === false
				&& model.typeOfHeatSource === 'boiler'"
			:model="(model as BoilerModelType)"
			:index="index"
			@update-boiler-model="updateHeatSource" />
		<HeatNetworkSection
			v-if="model.isExistingHeatSource === false
				&& model.typeOfHeatSource === 'heatNetwork'"
			:model="(model as HeatNetworkModelType)"
			:index="index"
			section="domesticHotWater"
			@update-heat-network-model="updateHeatSource" />
		<HeatBatterySection
			v-if="model.isExistingHeatSource === false
				&& model.typeOfHeatSource === 'heatBattery'"
			:model="(model as HeatBatteryModelType)"
			:index="index"
			page="domestic hot water"
			@update-heat-battery-model="updateHeatSource" />
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
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('domesticHotWater')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>