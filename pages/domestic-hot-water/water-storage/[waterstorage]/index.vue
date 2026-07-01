<script setup lang="ts">
import { litre, type Volume } from "~/utils/units/volume";
import type { WaterStorageData } from "~/stores/ecaasStore.schema";
import { getUrl } from "~/utils/page";
import { v4 as uuidv4 } from "uuid";
import { coldWaterSourceOptions, hasPackagedProduct, waterStorageTypes } from "#imports";
import type { Product, AnyPcdbProduct } from "~/pcdb/pcdb.types";
import { mapOption } from "~/composables/associatedItems";

const title = "Water storage";
const store = useEcaasStore();
const route = useRoute();
const { autoSaveElementForm, getStoreIndex } = useForm();

const { mounted } = useMounted();

const waterStorageStoreData = store.domesticHotWater.waterStorage.data;
const index = getStoreIndex(waterStorageStoreData);
const waterStorageData = waterStorageStoreData[index] as EcaasForm<WaterStorageData>;
const model = ref(waterStorageData?.data);
const id = waterStorageData?.data.id ?? uuidv4();

const productBrandName = ref<string | undefined>();
const packagedProduct = ref<Product | undefined>();

if (hasPackagedProduct(model.value)) {
	const packagedProductData = await useProductData(model.value.packagedProductReference!);
	packagedProduct.value = packagedProductData ?? undefined;
}

const saveForm = (fields: WaterStorageData) => {
	store.$patch((state) => {
		const { waterStorage } = state.domesticHotWater;

		const commonFields = {
			name: fields.name,
			id,
			heaterPosition: fields.heaterPosition,
		};

		let waterStorageItem: EcaasForm<WaterStorageData>;

		if (fields.typeOfWaterStorage === "hotWaterCylinder") {
			waterStorageItem = {
				data: {
					...commonFields,
					typeOfWaterStorage: fields.typeOfWaterStorage,
					storageCylinderVolume: fields.storageCylinderVolume,
					dailyEnergyLoss: fields.dailyEnergyLoss,
					areaOfHeatExchanger: fields.areaOfHeatExchanger,
					thermostatPosition: fields.thermostatPosition,
					coldWaterSource: fields.coldWaterSource,
				},
				complete: true,
			};
		} else if (fields.typeOfWaterStorage === "smartHotWaterTank") {
			waterStorageItem = {
				data: {
					...commonFields,
					typeOfWaterStorage: fields.typeOfWaterStorage,
					productReference: fields.productReference,
					coldWaterSource: fields.coldWaterSource,
				},
				complete: true,
			};
		} else {
			throw new Error("Invalid water storage type");
		}

		waterStorage.data[index] = waterStorageItem;
		waterStorage.complete = false;
	});
	navigateTo(getUrl("domesticHotWater"));
};
			
const { handleInvalidSubmit, errorMessages } = useErrorSummary();

const withinMinAndMaxVolume = (node: FormKitNode, min: number, max: number) => {
	const value = node.value as Volume;
	return value.amount >= min && value.amount <= max;
};

autoSaveElementForm<WaterStorageData>({
	model,
	storeData: store.domesticHotWater.waterStorage,
	defaultName: "Water storage",
	onPatch: (state, newData, index) => {
		newData.data.id ??= id;
		state.domesticHotWater.waterStorage.data[index] = newData;
		state.domesticHotWater.waterStorage.complete = false;
	},
});

const isProductSelected = () => {
	if (waterStorageData.data.typeOfWaterStorage !== "smartHotWaterTank") {
		return false;
	}
	return waterStorageData?.data.productReference ? true : false;
};

watch(
	() => model.value?.typeOfWaterStorage,
	(newType, oldType) => {
		if (newType && oldType !== newType) {
			errorMessages.value = [];
			const preservedId = model.value?.id;
			const defaultName = waterStorageTypes[newType];

			const newValue = { 
				typeOfWaterStorage: newType, 
				id: preservedId,
				...(defaultName && { name: defaultName }),
			} as WaterStorageData;

			model.value = newValue;
		}
	},
);

function handleProductLoaded(product: AnyPcdbProduct) {
	if (hasModelDetails(product)) {
		productBrandName.value = product.brandName;
	}
}


// there can only be one heat source, 2 if one is a heatnetwork so check that either is a heat pump
function heatSourceIsHeatPump() {
	const heatSources = store.domesticHotWater.heatSources.data.map((e) => {
		if (e.data.isExistingHeatSource) {
			return store.spaceHeating.heatSource.data
				.find((x) => x.data.id === e.data.heatSourceId)?.data.typeOfHeatSource;
		} else {
			return e.data.typeOfHeatSource;
		}
	});	
	return heatSources.length === 1 || (heatSources.length === 2 && heatSources.includes("heatPump"));
}

const wwhrs = store.domesticHotWater.wwhrs.data
	.filter(x => x.data.wwhrsType === "System A" || x.data.wwhrsType === "System C")
	.map(mapOption("WWHRS"));

const preheatedWaterStorage = useAssociatedItems(["preheatedWaterStorage"]);

const coldWaterSourcesMap = new Map(Object.entries(coldWaterSourceOptions));
const wwhrsMap = new Map(wwhrs);
const preheatedWaterStorageMap = new Map(preheatedWaterStorage);
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
		type="hot water cylinder"
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
				label="Type of hot water cylinder"
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
				help="Select the smart hot water tank from the PCDB using the button below."
				:selected-product-reference="model.productReference"
				:selected-product-type="model.typeOfWaterStorage"
				:page-url="route.fullPath"
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
				data-field="HotWaterSource['hw cylinder'].volume"
				:disabled="hasPackagedProduct(model)"
			/>
			<FormKit
				v-if="model.typeOfWaterStorage === 'hotWaterCylinder'"
				id="dailyEnergyLoss"
				type="govInputWithSuffix"
				label="Daily energy loss"
				help="Enter the estimated energy lost from the tank per day"
				name="dailyEnergyLoss"
				validation="required | number | min:0 | max:200"
				suffix-text="kWh/day"
				data-field="HotWaterSource['hw cylinder'].daily_losses"
				:disabled="hasPackagedProduct(model)"
			/>
			<FormKit
				v-if="model.typeOfWaterStorage === 'hotWaterCylinder' && heatSourceIsHeatPump()"
				id="areaOfHeatExchanger"
				type="govInputWithSuffix"
				label="Area of heat exchanger installed"
				suffix-text="m²"
				name="areaOfHeatExchanger"
				validation="number"
				:disabled="hasPackagedProduct(model)"
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
				:options="new Map([...preheatedWaterStorageMap, ...wwhrsMap, ...coldWaterSourcesMap])"
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