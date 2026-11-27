<script setup lang="ts">
import { coldWaterSourceOptions, hasPackagedProduct, waterStorageTypes } from "#imports";
import { v4 as uuidv4 } from "uuid";
import { mapOption } from "~/composables/associatedItems";
import type { AnyPcdbProduct, Product } from "~/pcdb/pcdb.types";
import type { PreheatedWaterStorageData } from "~/stores/ecaasStore.schema";
import { getUrl } from "~/utils/page";
import { metresSquare } from "~/utils/units/area";
import { litre, type Volume } from "~/utils/units/volume";

const title = "Preheated water cylinder";
const store = useEcaasStore();
const route = useRoute();
const { autoSaveForm } = useForm();
const { getActualHeatSource } = useHeatSources();
const index = 0;
const { mounted } = useMounted();

const preheatedStoreData = store.domesticHotWater.preheatedWaterStorage.data;
const preheatedData = preheatedStoreData[0] as EcaasForm<PreheatedWaterStorageData>;
const preheatedType = preheatedData?.data.typeOfWaterStorage ?? "hotWaterCylinder";
const model = ref<PreheatedWaterStorageData>({
	...preheatedData?.data,
	typeOfWaterStorage: preheatedType,
	name: preheatedData?.data.name ?? waterStorageTypes[preheatedType],
} as PreheatedWaterStorageData);
const id = preheatedData?.data.id ?? uuidv4();

const productBrandName = ref<string | undefined>();
const packagedProduct = ref<Product | undefined>();

if (hasPackagedProduct(model.value)) {
	const packagedProductData = await useProductData(model.value.packagedProductReference!);
	packagedProduct.value = packagedProductData ?? undefined;
}

const saveForm = (fields: PreheatedWaterStorageData) => {
	store.$patch((state) => {
		const { preheatedWaterStorage } = state.domesticHotWater;

		const commonFields = {
			name: fields.name,
			id,
			heaterPosition: fields.heaterPosition,
			heatSourceId: fields.heatSourceId,
			coldWaterSource: fields.coldWaterSource,
		};

		let waterStorageItem: EcaasForm<PreheatedWaterStorageData>;

		if (fields.typeOfWaterStorage === "hotWaterCylinder") {
			waterStorageItem = {
				data: {
					...commonFields,
					typeOfWaterStorage: fields.typeOfWaterStorage,
					storageCylinderVolume: fields.storageCylinderVolume,
					dailyEnergyLoss: fields.dailyEnergyLoss,
					areaOfHeatExchangerInPcdb: fields.areaOfHeatExchangerInPcdb ?? false,
					...(fields.areaOfHeatExchanger ? { areaOfHeatExchanger: fields.areaOfHeatExchanger } : {}),
					thermostatPosition: fields.thermostatPosition,
					packagedProductReference: fields.packagedProductReference,
				},
				complete: true,
			};
		} else {
			waterStorageItem = {
				data: {
					...commonFields,
					typeOfWaterStorage: fields.typeOfWaterStorage,
					productReference: fields.productReference,
				},
				complete: true,
			};
		}

		preheatedWaterStorage.data[index] = waterStorageItem;
		preheatedWaterStorage.complete = false;
	});
	navigateTo(getUrl("domesticHotWater"));
};
			
const { handleInvalidSubmit, errorMessages } = useErrorSummary();

const isProductSelected = () => model.value.typeOfWaterStorage === "smartHotWaterTank"
	&& Boolean(model.value.productReference);

watch(
	() => model.value.typeOfWaterStorage,
	(newType, oldType) => {
		if (newType !== oldType) {
			errorMessages.value = [];
			model.value = {
				typeOfWaterStorage: newType,
				id,
				name: waterStorageTypes[newType],
			} as PreheatedWaterStorageData;
		}
	},
);

function handleProductLoaded(product: AnyPcdbProduct) {
	if (hasModelDetails(product)) {
		productBrandName.value = product.brandName;
	}
}

const withinMinAndMaxVolume = (node: FormKitNode, min: number, max: number) => {
	const value = node.value as Volume;
	return value.amount >= min && value.amount <= max;
};

function heatSourceIsHeatPump() {
	const selectedHeatSource = store.domesticHotWater.heatSources.data
		.find(x => x.data.id === model.value.heatSourceId)?.data;
	return selectedHeatSource && getActualHeatSource(selectedHeatSource)?.typeOfHeatSource === "heatPump";
}

autoSaveForm<PreheatedWaterStorageData>(model, (state, newData) => {
	newData.data.id ??= id;
	newData.data.name ??= waterStorageTypes[newData.data.typeOfWaterStorage];
	state.domesticHotWater.preheatedWaterStorage.data = [newData];
});

const wwhrs = store.domesticHotWater.wwhrs.data
	.filter(x => x.data.wwhrsType === "System A" || x.data.wwhrsType === "System C")
	.map(mapOption("WWHRS"));


const coldWaterSourcesMap = new Map(Object.entries(coldWaterSourceOptions));
const wwhrsMap = new Map(wwhrs);
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
		type="preheated water cylinder"
	/>
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="waterStorageErrorSummary"/>
		<template v-if="mounted">
			<FormKit
				id="typeOfWaterStorage"
				name="typeOfWaterStorage"
				type="govRadios"
				:options="waterStorageTypes"
				label="Type of preheated water storage"
				validation="required"
				:disabled="hasPackagedProduct(model)"
			/>
			<FormKit
				v-if="model.typeOfWaterStorage !== undefined"
				id="name"
				type="govInputText"
				label="Name"
				help="Provide a name for this element so that it can be identified later"
				name="name"
				validation="required"
			/>
			<FormKit
				v-if="model.typeOfWaterStorage === 'smartHotWaterTank'"
				id="selectSmartHotWaterTank"
				type="govPcdbProduct"
				label="Select a smart hot water tank"
				name="productReference"
				:validation-rules="{ isProductSelected }"
				validation="required | isProductSelected"
				help="Select the smart hot water tank from the PCDB using the button below"
				:selected-product-reference="model.productReference"
				:selected-product-type="model.typeOfWaterStorage"
				:page-url="`${route.path}/${index}`"
				:page-index="index"
				:on-product-loaded="handleProductLoaded"
			/>
			<FormKit
				v-if="model.typeOfWaterStorage === 'hotWaterCylinder'"
				id="storageCylinderVolume"
				name="storageCylinderVolume"
				label="Storage cylinder volume"
				help="Enter the total internal capacity of the tank"
				type="govInputWithUnit"
				:unit="litre"
				:validation-rules="{ withinMinAndMaxVolume }"
				validation="required | withinMinAndMaxVolume:1,1000"
				:validation-messages="{
					withinMinAndMaxVolume: `Storage cylinder volume must be at least 0 and no more than 200,000 ${litre.name}.`,
				}"
				data-field="PreHeatedWaterSource['preheated tank'].volume"
				:disabled="hasPackagedProduct(model)"
			/>
			<FormKit
				v-if="model.typeOfWaterStorage === 'hotWaterCylinder'"
				id="dailyEnergyLoss"
				type="govInputWithSuffix"
				label="Daily standing loss"
				help="Enter the estimated energy lost from the tank per day"
				name="dailyEnergyLoss"
				validation="required | number | min:0 | max:200"
				suffix-text="kWh/day"
				data-field="PreHeatedWaterSource['preheated tank'].daily_losses"
				:disabled="hasPackagedProduct(model)"
			/>
			<FormKit type="hidden" name="areaOfHeatExchangerInPcdb" />
			<FormKit
				v-if="model.typeOfWaterStorage === 'hotWaterCylinder' && heatSourceIsHeatPump() && !model.areaOfHeatExchangerInPcdb"
				id="areaOfHeatExchanger"
				type="govInputWithUnit"
				:unit="metresSquare"
				label="Area of heat exchanger installed"
				name="areaOfHeatExchanger"
				validation="required"
				data-field="PreHeatedWaterSource['preheated tank'].heat_exchanger_surface_area"
			/>
			<FieldsHotWaterHeatSources
				v-if="model.typeOfWaterStorage !== undefined"
				id="heatSourceId"
				name="heatSourceId"
				label="Heat source"
				help="Select the relevant heat source that has been added previously"
				validation="required"
				:exclude-types="['combiBoiler', 'pointOfUse']"
			/>
			<FormKit
				v-if="model.typeOfWaterStorage !== undefined"
				id="heaterPosition"
				type="govInputFloat"
				label="Heater position in the cylinder"
				name="heaterPosition"
				validation="required | number | min:0 | max:1"
				help="Enter a number between 0 and 1, rounded to one decimal place. 0 is at the bottom, 1 is at the top."
			/>
			<FormKit
				v-if="model.typeOfWaterStorage === 'hotWaterCylinder'"
				id="thermostatPosition"
				type="govInputFloat"
				label="Thermostat position in the cylinder"
				name="thermostatPosition"
				validation="required | number | min:0 | max:1"
				help="Enter a number between 0 and 1, rounded to the nearest 1 decimal place"
			/>
			<FormKit
				v-if="model.typeOfWaterStorage !== undefined"
				id="coldWaterSource"
				type="govRadios"
				label="Cold water source"
				:options="new Map([ ...wwhrsMap, ...coldWaterSourcesMap])"
				name="coldWaterSource"
				validation="required"
			/>
			<HemDefaultProductWarning :brand-names="[productBrandName]" />
			<div class="govuk-button-group">
				<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
				<GovButton :href="getUrl('domesticHotWater')" secondary>Save progress</GovButton>
			</div>
		</template>
	</FormKit>
</template>