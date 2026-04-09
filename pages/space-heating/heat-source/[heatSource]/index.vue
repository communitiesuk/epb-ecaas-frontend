<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { getUrl, type HeatSourceData } from "#imports";
import { heatSourceTypesWithDisplay } from "~/utils/display";
import type { Product } from "~/pcdb/pcdb.types";
import { hasPackagedProduct } from "~/utils/packagedProduct";
import PackagedProductInset from "~/components/PackagedProductInset.vue";

const title = "Heat source";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const heatSourceStoreData = store.spaceHeating.heatSource.data;
const index = getStoreIndex(heatSourceStoreData);
const heatSourceData = useItemToEdit("heatSource", heatSourceStoreData);
const model = ref(heatSourceData?.data as HeatSourceData);
const id = heatSourceData?.data.id ?? uuidv4();
export type HeatPumpModelType = Extract<HeatSourceData, { typeOfHeatSource: "heatPump" }>;
export type BoilerModelType = Extract<HeatSourceData, { typeOfHeatSource: "boiler" }>;
export type HeatNetworkModelType = Extract<HeatSourceData, { typeOfHeatSource: "heatNetwork" }>;
export type HeatBatteryModelType = Extract<HeatSourceData, { typeOfHeatSource: "heatBattery" }>;

const packagedProduct = ref<Product | undefined>();

if (hasPackagedProduct(model.value)) {
	const packagedProductData = await useProductData(model.value.packagedProductReference!);
	packagedProduct.value = packagedProductData ?? undefined;
}

const saveForm = () => {
	store.$patch((state) => {
		const { heatSource } = state.spaceHeating;
		const heatSourceItem = heatSource.data[index];

		if (!heatSourceItem) {
			throw new Error("No heat source found to save");
		}
		
		heatSource.data[index]!.complete = true;
		heatSource.complete = false;
	});

	navigateTo("/space-heating");
};

const { handleInvalidSubmit, errorMessages } = useErrorSummary();

watch(
	() => model.value,
	(newData, initialData) => {
		if (!newData?.typeOfHeatSource) return;

		if (
			initialData?.typeOfHeatSource &&
			initialData.typeOfHeatSource !== newData.typeOfHeatSource
		) {
			errorMessages.value = [];
			model.value = { typeOfHeatSource: newData.typeOfHeatSource, id: initialData.id } as HeatSourceData;
		}
		
		if (model.value && !model.value.name) {
			model.value.name = getHeatSourceDefaultName(model.value);
		}
	},
);

autoSaveElementForm<HeatSourceData>({
	model,
	storeData: store.spaceHeating.heatSource,
	defaultName: "Heat source",
	onPatch: (state, newData, index) => {
		newData.data.id ??= id;
		state.spaceHeating.heatSource.data[index] = newData;
		state.spaceHeating.heatSource.complete = false;
	},
});


function updateHeatSource(type: string) {
	watch(() => model.value[`${type}` as keyof HeatSourceData], (newHeatSourceSubtype, initialHeatSourceSubtype) => {
		if (newHeatSourceSubtype !== initialHeatSourceSubtype) {
			if ("productReference" in model.value) {
				model.value.productReference = "";
			}
			const defaultName = getHeatSourceDefaultName(model.value);
			model.value.name = defaultName;
			store.spaceHeating.heatSource.data[index]!.data.name = defaultName;
		}
	},
	);
}

const boilers = heatSourceStoreData
	.filter(x => x.data.typeOfHeatSource === "boiler")
	.map(x => [x.data.id, x.data.name] as [string, string]);
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
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="heatSourceErrorSummary" />
		<FormKit
			id="typeOfHeatSource"
			type="govRadios"
			label="Type of heat source"
			:options="heatSourceTypesWithDisplay"
			name="typeOfHeatSource"
			validation="required"
			:disabled="hasPackagedProduct(model)"
		/>
		<HeatPumpSection
			v-if="model?.typeOfHeatSource === 'heatPump'"
			:model="(model as HeatPumpModelType)"
			:index="index"
			:boilers="boilers"
			add-boiler-page-id="heatSourceCreate"
			page="space heating"
			@update-heat-pump-model="updateHeatSource"
		/>
		<BoilerSection
			v-if="model?.typeOfHeatSource === 'boiler'"
			:model="(model as BoilerModelType)"
			:index="index"
			page="space heating"
			@update-boiler-model="updateHeatSource" />
		<!-- <HeatNetworkSection
			v-if="model?.typeOfHeatSource === 'heatNetwork'"
			:model="(model as HeatNetworkModelType)"
			:index="index"
			section="spaceHeating"
			@update-heat-network-model="updateHeatSource" /> -->
		<HeatBatterySection
			v-if="model?.typeOfHeatSource === 'heatBattery'"
			:model="(model as HeatBatteryModelType)"
			:index="index"
			page="space heating"
			@update-heat-battery-model="updateHeatSource" />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('spaceHeating')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>