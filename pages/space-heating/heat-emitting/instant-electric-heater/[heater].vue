<script setup lang="ts">
import { getUrl, uniqueName } from "#imports";
import type { SchemaConvectiveType } from "~/schema/aliases";
const title = "Instant electric heater";
const store = useEcaasStore();

const { autoSaveElementForm, getStoreIndex } = useForm();

const storeData = store.spaceHeating.heatEmitting.instantElectricHeater.data;
const index = getStoreIndex(storeData);
const instantElectricHeaterData = useItemToEdit("heater", storeData);
const model = ref(instantElectricHeaterData?.data);

const convectiveTypeOptions = {
	"Air heating (convectors, fan coils etc.)": "Air heating (convectors, fan coils etc.)",
	"Free heating surface (radiators, radiant panels etc.)": "Free heating surface (radiators, radiant panels etc.)",
	"Floor heating, low temperature radiant tube heaters, luminous heaters, wood stoves": "Floor heating, low temperature radiant tube heaters, luminous heaters, wood stoves",
	"Wall heating, radiant ceiling panels, accumulation stoves": "Wall heating, radiant ceiling panels, accumulation stoves",
	"Ceiling heating, radiant ceiling electric heating": "Ceiling heating, radiant ceiling electric heating",
} as const satisfies Record<SchemaConvectiveType, SchemaConvectiveType>;

const saveForm = (fields: InstantElectricStorageData) => {
	store.$patch((state) => {
		const { instantElectricHeater } = state.spaceHeating.heatEmitting;

		const instantElectricHeaterItem: EcaasForm<InstantElectricStorageData> = {
			data: {
				name: fields.name,
				ratedPower: fields.ratedPower,
				convectiveType: fields.convectiveType,
			},
			complete: true,
		};

		instantElectricHeater.data[index] = instantElectricHeaterItem;
		instantElectricHeater.complete = false;
	});

	navigateTo("/spaceHeating/heat-emitting");
};

autoSaveElementForm<InstantElectricStorageData>({
	model,
	storeData: store.spaceHeating.heatEmitting.instantElectricHeater,
	defaultName: "Instant electric heater",
	onPatch: (state, newData, index) => {
		state.spaceHeating.heatEmitting.instantElectricHeater.data[index] = newData;
		state.spaceHeating.heatEmitting.instantElectricHeater.complete = false;
	},
});

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
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
		<GovErrorSummary :error-list="errorMessages" test-id="instantElectricHeaterErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this instant electric heater so that it can be identified later"
			name="name"
			:validation-rules="{ uniqueName: uniqueName(storeData, { index }) }"
			validation="required | uniqueName"
			:validation-messages="{
				uniqueName: 'An element with this name already exists. Please enter a unique name.'
			}"
		/>
		<FormKit
			id="ratedPower"
			type="govInputWithSuffix"
			label="Rated power"
			help="Enter the maximum power consumption of the heater"
			name="ratedPower"
			validation="required | number | min:0 | max:70"
			suffix-text="kW"
			data-field="SpaceHeatSystem.*.rated_power"
		/>
		<FormKit
			id="convectiveType"
			type="govRadios"
			label="Convection type for heating"
			:options="convectiveTypeOptions"
			name="convectiveType"
			validation="required"
			data-field="SpaceHeatSystem.*.convective_type">
			<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header">Heating type</th>
							<th scope="col" class="govuk-table__header">Convection fraction</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<td class="govuk-table__cell"><b>Air heating</b><br>Convectors, fan coils</td>
							<td class="govuk-table__cell">0.95</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell"><b>Free heating surface</b><br>Radiators, radiant panels</td>
							<td class="govuk-table__cell">0.70</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell"><b>Floor heating</b><br>Low temperature radiant tube heaters, luminous heaters, wood stoves</td>
							<td class="govuk-table__cell">0.50</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell"><b>Wall heating</b><br>Radiant ceiling panels, accumulation stoves</td>
							<td class="govuk-table__cell">0.35</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell"><b>Ceiling heating</b><br>Radiant ceiling electric heating</td>
							<td class="govuk-table__cell">0.20</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('heatEmitting')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>