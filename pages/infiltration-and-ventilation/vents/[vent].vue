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
			pressureDifference: fields.pressureDifference,
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
			<GovDetails summary-text="Help with this input">
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header">Vent type</th>
							<th scope="col" class="govuk-table__header">Effective area (cm2)</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Small trickle vent</td>
							<td class="govuk-table__cell">50 - 100</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Standard window trickle vent</td>
							<td class="govuk-table__cell">200 - 500</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Wall-mounted air brick</td>
							<td class="govuk-table__cell">100 - 300</td>
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
			<GovDetails summary-text="Help with this input">
				<p>Typical ranges - 1.2 - 1.8m</p>
			</GovDetails>
		</FormKit>
		<FormKit
			id="pressureDifference"
			type="govInputWithSuffix"
			label="Pressure difference"
			help="The difference in pressure between inside and outside the building, which drives airflow"
			name="pressureDifference"
			validation="required | number"
			suffix-text="Pa">
			<GovDetails summary-text="Help with this input">
				<p>
					1 - 2 Pa for natural ventilation<br>
					5 - 10 Pa for mechanical systems
				</p>
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