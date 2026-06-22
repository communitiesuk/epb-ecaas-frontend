<script setup lang="ts">
import type { WwhrsData } from "~/stores/ecaasStore.schema";
import { getUrl } from "~/utils/page";
import { v4 as uuidv4 } from "uuid";
import { coldWaterSourceOptions } from "#imports";
import type { AnyPcdbProduct } from "~/pcdb/pcdb.types";

const title = "Waste water heat recovery systems";
const store = useEcaasStore();
const route = useRoute();
const { autoSaveElementForm, getStoreIndex } = useForm();

const { mounted } = useMounted();

const wwhrsStoreData = store.domesticHotWater.wwhrs.data;
const index = getStoreIndex(wwhrsStoreData);
const wwhrsData = wwhrsStoreData[index] as EcaasForm<WwhrsData>;
const model = ref(wwhrsData?.data);
const id = wwhrsData?.data.id ?? uuidv4();

const productBrandName = ref<string | undefined>();

const saveForm = (fields: WwhrsData) => {
	store.$patch((state) => {
		const { wwhrs } = state.domesticHotWater;

		const wwhrsItem: EcaasForm<WwhrsData> = {
			data: {
				id,
				name: fields.name,
				coldWaterSource: fields.coldWaterSource,
				productReference: fields.productReference,
			},
			complete: true,
		};

		wwhrs.data[index] = wwhrsItem;
		wwhrs.complete = false;
	});
	navigateTo(getUrl("domesticHotWater"));
};
			
const { handleInvalidSubmit, errorMessages } = useErrorSummary();

autoSaveElementForm<WwhrsData>({
	model,
	storeData: store.domesticHotWater.wwhrs,
	defaultName: "WWHRS",
	onPatch: (state, newData, index) => {
		newData.data.id ??= id;
		state.domesticHotWater.wwhrs.data[index] = newData;
		state.domesticHotWater.wwhrs.complete = false;
	},
});

function handleProductLoaded(product: AnyPcdbProduct) {
	if (hasModelDetails(product)) {
		productBrandName.value = product.brandName;
	}
}
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="wwhrsErrorSummary"/>
		<template v-if="mounted">
			<FormKit
				id="name"
				type="govInputText"
				label="Name"
				help="Provide a name for this element so that it can be identified later"
				name="name"
				validation="required"
			/>
			<FormKit
				id="coldWaterSource"
				type="govRadios"
				label="Cold water source"
				:options="coldWaterSourceOptions"
				name="coldWaterSource"
				validation="required"
			/>
			<FormKit
				id="productReference"
				type="govPcdbProduct"
				label="Select a waste water heat recovery system"
				name="productReference"
				validation="required"
				help="Select the waste water heat recovery system from the PCDB using the button below."
				:selected-product-reference="model.productReference"
				selected-product-type="wwhrs"
				:page-url="route.fullPath"
				:page-index="index"
				:on-product-loaded="handleProductLoaded"
			/>
			<HemDefaultProductWarning :brand-names="[productBrandName]" />
			<div class="govuk-button-group">
				<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
				<GovButton :href="getUrl('domesticHotWater')" secondary>Save progress</GovButton>
			</div>
		</template>
	</FormKit>
</template>