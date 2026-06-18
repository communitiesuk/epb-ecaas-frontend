<script setup lang="ts">
import { uniqueName, getUrl, type HeatNetworkData } from "#imports"; 

const title = "Heat network";
const store = useEcaasStore();
const route = useRoute();

const { autoSaveElementForm, getStoreIndex } = useForm();
const { handleInvalidSubmit, errorMessages } = useErrorSummary();

const heatNetworkStoreData = store.spaceHeating.heatNetworks?.data;
const index = getStoreIndex(heatNetworkStoreData);
const heatNetworkData = useItemToEdit("heatNetworks", heatNetworkStoreData);
const model = ref(heatNetworkData?.data as HeatNetworkData);

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
				id: fields.id,
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

autoSaveElementForm<HeatNetworkData>({
	model,
	storeData: store.spaceHeating.heatNetworks,
	defaultName: "Heat network",
	onPatch: (state, newData, index) => {
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
			label="Select a product"
			help="Select a heat network product from the PCDB using the button below"
			:selected-product-reference="model.productReference"
			:selected-sub-heat-network-name="model.subHeatNetworkName"
			:selected-product-type="model.typeOfHeatNetwork"
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