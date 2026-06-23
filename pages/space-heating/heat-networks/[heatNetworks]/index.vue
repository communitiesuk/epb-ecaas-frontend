<script setup lang="ts">
import type { HeatNetworkData } from "~/stores/ecaasStore.schema";
import { getUrl } from "~/utils/page";
import { v4 as uuidv4 } from "uuid";
import { uniqueName } from "#imports";

const title = "Heat network";
const store = useEcaasStore();
const route = useRoute();
const { autoSaveElementForm, getStoreIndex } = useForm();


const heatNetworkStoreData = store.spaceHeating.heatNetworks?.data;
const index = getStoreIndex(heatNetworkStoreData);
const heatNetworkData = heatNetworkStoreData[index] as EcaasForm<HeatNetworkData>;
const model = ref(heatNetworkData?.data);
const id = heatNetworkData?.data.id ?? uuidv4();

const heatNetworkTypes = {
	sleevedDistrictHeatNetwork: "Sleeved district heat network",
	unsleevedDistrictHeatNetwork: "Unsleeved district heat network",
	communalHeatNetwork: "Communal heat network", 
};

const saveForm = (fields: HeatNetworkData) => {
	store.$patch((state) => {
		const { heatNetworks } = state.spaceHeating;

		heatNetworks.data[index] = {
			data: {
				id,
				name: fields.name,
				typeOfHeatNetwork: fields.typeOfHeatNetwork,
				productReference: fields.productReference,
				subHeatNetworkName: fields.subHeatNetworkName,
			},
			complete: true,
		};
		heatNetworks.complete = false;
	});

	navigateTo("/space-heating");
};

const { handleInvalidSubmit, errorMessages } = useErrorSummary();


autoSaveElementForm<HeatNetworkData>({
	model,
	storeData: store.spaceHeating.heatNetworks,
	defaultName: "Heat network",
	onPatch: (state, newData, index) => {
		newData.data.id ??= id;
		state.spaceHeating.heatNetworks.data[index] = newData;
		state.spaceHeating.heatNetworks.complete = false;
	},
});

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
		@submit-invalid="handleInvalidSubmit"
	>
		<GovErrorSummary :error-list="errorMessages" test-id="heatNetworksErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			:validation-rules="{ uniqueName: uniqueName(heatNetworkStoreData, { index }) }"
			validation="required | uniqueName"
			:validation-messages="{
				uniqueName: 'An element with this name in domestic hot water or space heating already exists. Please enter a unique name.'
			}" />
		<FieldsSelectPcdbProduct
			id="selectHeatNetwork"
			name="productReference"
			label="Select a heat network"
			help="Select a heat network product from the PCDB using the button below"
			:selected-product-reference="model.productReference"
			:selected-sub-heat-network-name="model.subHeatNetworkName"
			selected-product-type="heatNetwork"
			:page-index="index"
			:page-url="route.fullPath"
		/>
		<FormKit
			id="typeOfHeatNetwork"
			type="govRadios"
			label="Type of heat network"
			:options="heatNetworkTypes"
			name="typeOfHeatNetwork"
			validation="required"
		/>
		<GovInset>
			<p>
				If you have a heat interface unit (HIU) or booster heat pump as well as the heat network, enter it separately.
			</p>

		</GovInset>
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('spaceHeating')" test-id="saveProgress" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template> 