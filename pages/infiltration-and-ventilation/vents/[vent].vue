<script setup lang="ts">
const title = "Vent";
const store = useEcaasStore();
const { saveToList } = useForm();

const ventData = useItemToEdit('vent', store.infiltrationAndVentilation.vents.data);
const model: Ref<VentData> = ref(ventData!);

const saveForm = (fields: VentData) => {
	store.$patch((state) => {
		const {vents} = state.infiltrationAndVentilation;

		const vent: VentData = {
			name: fields.name,
			typeOfVent: fields.typeOfVent,
			effectiveVentilationArea: fields.effectiveVentilationArea,
			openingRatio: 1,
			midHeightOfZone: fields.midHeightOfZone,
			orientation: fields.orientation,
			pitch: fields.pitch
		};

		saveToList(vent, vents);
	});
	store.infiltrationAndVentilation.vents.complete = false;
	navigateTo("/infiltration-and-ventilation/vents");
};

const {handleInvalidSubmit, errorMessages} = useErrorSummary();
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
			validation="required"
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
			help="The actual area through which air can flow, accounting for obstructions like grilles or mesh"
			name="effectiveVentilationArea"
			validation="required | number | min:1 | max:999999"
			suffix-text="cm2">
			<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header">Vent type</th>
							<th scope="col" class="govuk-table__header govuk-!-width-one-third">Effective area (cm²)</th>
							<th scope="col" class="govuk-table__header">Description</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Standard window trickle vent</td>
							<td class="govuk-table__cell">40 - 80</td>
							<td class="govuk-table__cell">
								This is a common range for modern trickle vents designed to contribute to background ventilation in habitable rooms. Multiple vents per room might be needed.
							</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Wall-mounted air brick</td>
							<td class="govuk-table__cell">50 - 200</td>
							<td class="govuk-table__cell">
								Air bricks are generally larger and provide more airflow. The effective area depends significantly on the grill design and free area. Smaller air bricks might be around 50 to 100 cm², while larger ones can reach 200 cm² or more. Some manufacturers might quote the free area, which would be a higher number.
							</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<FormKit
			id="midHeightOfZone"
			type="govInputWithSuffix"
			label="Mid height of zone"
			help="Mid height of the zone that the vent serves"
			name="midHeightOfZone"
			validation="required | number | min:1 | max:60"
			suffix-text="m">
			<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
				<p>Typical ranges - 1.2 - 1.8m</p>
			</GovDetails>
		</FormKit>
		<FieldsOrientation />
		<FieldsPitch />
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>