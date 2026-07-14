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
const defaultName = "Heat network";

const heatNetworkTypes = {
	sleevedDistrictHeatNetwork: "Sleeved district heat network",
	unsleevedDistrictHeatNetwork: "Unsleeved district heat network",
	communalHeatNetwork: "Communal heat network", 
};

function handleChooseProduct() {
	if (!model.value.id) {
		store.$patch((state) => {
			const { heatNetworks } = state.spaceHeating;

			heatNetworks.data[index] = {
				data: {
					id,
					name: model.value.name || defaultName,
					typeOfHeatNetwork: model.value.typeOfHeatNetwork,
					productReference: model.value.productReference,
					subHeatNetworkName: model.value.subHeatNetworkName,
				},
			};

			heatNetworks.complete = false;
		});
	}
}

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
	defaultName,
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
			help="Select the heat network and sub network from the PCDB using the button below"
			:selected-product-reference="model.productReference"
			:selected-sub-heat-network-name="model.subHeatNetworkName"
			selected-product-type="heatNetwork"
			:page-index="index"
			:page-url="route.fullPath"
			@choose-product="handleChooseProduct"
		/>
		<FormKit
			id="typeOfHeatNetwork"
			type="govRadios"
			label="Type of heat network"
			:options="heatNetworkTypes"
			name="typeOfHeatNetwork"
			validation="required">
			<GovDetails summary-text="Help with this input" classes="govuk-details__margin-bottom">
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header govuk-!-width-one-third">Type of heat network</th>
							<th scope="col" class="govuk-table__header">Description</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header">Communal</th>
							<td class="govuk-table__cell">A communal heat network supplies heat to multiple consumers within a single building (for example, a block of flats). The central heat source is usually a large boiler or heat pump and is housed on-site, typically in a basement or on the roof. Communal heat networks are also known as community heating.</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header">Sleeved district</th>
							<td class="govuk-table__cell">
								<p class="govuk-body">
									A district heat network operates on a much larger scale, supplying heat and hot water to multiple buildings across a wider area, such as a housing development, neighbourhood, or entire city centre.
								</p>

								<p class="govuk-body govuk-!-margin-bottom-0">
									A sleeved network segments the system to track the exact source of heat. This allows a specific building connected to the network to be supplied directly by a new, low-carbon technology (such as a local heat pump). The building is then credited with that lower carbon factor rather than taking the network's system-wide average.
								</p>
							</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header">Unsleeved district</th>
							<td class="govuk-table__cell">
								<p class="govuk-body">
									A district heat network operates on a much larger scale, supplying heat and hot water to multiple buildings across a wider area, such as a housing development, neighbourhood, or entire city centre.
								</p>

								<p class="govuk-body govuk-!-margin-bottom-0">
									In a traditional unsleeved network, the carbon intensity of the heat is calculated as an average across the entire system, regardless of where the heat was initially generated. Every property connected to the network is assigned this same average carbon footprint.
								</p>
							</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
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