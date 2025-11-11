<script setup lang="ts">
import { getUrl, uniqueName } from "#imports";

const title = "Vent";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const ventStoreData = store.infiltrationAndVentilation.vents.data;
const index = getStoreIndex(ventStoreData);
const ventData = useItemToEdit("vent", ventStoreData);
const model = ref(ventData?.data);

const saveForm = (fields: VentData) => {
	store.$patch((state) => {
		const { vents } = state.infiltrationAndVentilation;

		vents.data[index] = {
			data: {
				name: fields.name,
				typeOfVent: fields.typeOfVent,
				effectiveVentilationArea: fields.effectiveVentilationArea,
				openingRatio: 1,
				midHeightOfZone: fields.midHeightOfZone,
				orientation: fields.orientation,
				pitch: fields.pitch,
			},
			complete: true,
		};

		vents.complete = false;
	});
	
	navigateTo("/infiltration-and-ventilation/vents");
};

autoSaveElementForm<VentData>({
	model,
	storeData: store.infiltrationAndVentilation.vents,
	defaultName: "Vent",
	onPatch: (state, newData, index) => {
		state.infiltrationAndVentilation.vents.data[index] = newData;
		state.infiltrationAndVentilation.vents.complete = false;
	},
});

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<VentsInfo />
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="ventErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			:validation-rules="{ uniqueName: uniqueName(ventStoreData, { index }) }"
			validation="required | uniqueName"
			:validation-messages="{
				uniqueName: 'An element with this name already exists. Please enter a unique name.'
			}"
		/>
		<FormKit
			id="typeOfVent"
			type="govRadios"
			:options="{
				trickle: 'Trickle',
				airBrick: 'Air brick'
			}"
			label="Type of vent"
			name="typeOfVent"
			validation="required"
		/>
		<FormKit
			id="effectiveVentilationArea"
			type="govInputWithSuffix"
			label="Effective ventilation area"
			help="Enter the actual area through which air can flow, accounting for obstructions like grilles or mesh"
			name="effectiveVentilationArea"
			validation="required | number | min:1 | max:999999"
			suffix-text="cm²"
			data-field="InfiltrationVentilation.Vents.area_cm2">
			<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header">Vent type</th>
							<th scope="col" class="govuk-table__header">Description</th>
							<th scope="col" class="govuk-table__header govuk-!-width-one-third">Typical effective area</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Standard window trickle vent</td>
							<td class="govuk-table__cell">
								This is a common range for modern trickle vents designed to contribute to background ventilation in habitable rooms. Multiple vents per room might be needed.
							</td>
							<td class="govuk-table__cell">40 - 80 cm²</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Wall-mounted air brick</td>
							<td class="govuk-table__cell">
								Air bricks are generally larger and provide more airflow. The effective area depends significantly on the grill design and free area. Smaller air bricks might be around 50 to 100 cm², while larger ones can reach 200 cm² or more. Some manufacturers might quote the free area, which would be a higher number.
							</td>
							<td class="govuk-table__cell">50 - 200 cm²</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<FormKit
			id="midHeightOfZone"
			type="govInputWithSuffix"
			label="Mid height of zone"
			help="Enter the mid height of the zone that the vent serves. Typically between 1.2m and 1.8m."
			name="midHeightOfZone"
			validation="required | number | min:1 | max:60"
			suffix-text="m"
			data-field="InfiltrationVentilation.Vents.mid_height_air_flow_path"
		/>
		<FieldsOrientation help="Enter the orientation of the vent's outside face, measured from true north"/>
		<FieldsPitch data-field="InfiltrationVentilation.Vents.*.pitch" />
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('vents')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>