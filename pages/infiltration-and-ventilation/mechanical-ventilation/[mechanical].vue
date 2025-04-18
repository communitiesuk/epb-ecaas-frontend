<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';

const title = "Mechanical ventilation";
const mvhrTitle = "MVHR only inputs";
const store = useEcaasStore();
const { saveToList } = useForm();

const mechanicalVentilation = useItemToEdit('mechanical', store.infiltrationAndVentilation.mechanicalVentilation.data);
const model: Ref<MechanicalVentilationData> = ref(mechanicalVentilation!);

const saveForm = (fields: MechanicalVentilationData) => {
	store.$patch((state) => {
		const { mechanicalVentilation } = state.infiltrationAndVentilation;

		const mechanicalVentilationItem: MechanicalVentilationData = {
			id: uuidv4(),
			name: fields.name,
			typeOfMechanicalVentilationOptions: fields.typeOfMechanicalVentilationOptions,
			controlForSupplyAirflow: fields.controlForSupplyAirflow,
			supplyAirTemperatureControl: fields.supplyAirTemperatureControl,
			airFlowRate: fields.airFlowRate,
			mvhrLocation: fields.mvhrLocation,
			mvhrEfficiency: fields.mvhrEfficiency,
		};

		saveToList(mechanicalVentilationItem, mechanicalVentilation);
		mechanicalVentilation.complete = true;
	});

	navigateTo("/infiltration-and-ventilation/mechanical-ventilation");
};

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit"
	>
		<GovErrorSummary :error-list="errorMessages" test-id="mechanicalVentilationErrorSummary" />
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required" />
		<FormKit
			id="typeOfMechanicalVentilationOptions"
			type="govRadios"
			:options="{
				mvhr: 'MVHR',
				intermittent: 'Intermittent MEV',
				centralisedContinuous: 'Centralised continuous MEV',
				decentralisedContinuous: 'Decentralised continuous MEV',
			}"
			label="Type of mechanical ventilation"
			name="typeOfMechanicalVentilationOptions"
			validation="required"
		/>
		<FormKit
			id="controlForSupplyAirflow"
			type="govRadios"
			:options="{
				oda: 'Outdoor air',
				load: 'Load'
			}"
			label="Control for the supply airflow"
			name="controlForSupplyAirflow"
			validation="required"
		/>
		<FormKit
			id="supplyAirTemperatureControl" 
			type="govRadios"
			:options="{
				noControl: 'No control',
				constant: 'Constant',
				odaComp: 'Outdoor air compensation',
				loadComp: 'Load compensation'
			}"
			label="Supply air temperature control"
			name="supplyAirTemperatureControl"
			validation="required"
		/>
		<FormKit
			id="airFlowRate"
			type="govInputWithSuffix"
			suffix-text="m3/h"
			label="Air flow rate"
			help="The required design air flow rate to be supplied to or extracted from the ventilation zone by the system"
			name="airFlowRate" validation="required | number | min:0"
		/>
		<template v-if="model.typeOfMechanicalVentilationOptions === 'mvhr'">
			<h2 class="govuk-heading-l custom-govuk__heading__padding">
				{{ mvhrTitle }}
			</h2>
			<GovDetails summary-text="Help with these inputs">
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header">Parameter</th>
							<th scope="col" class="govuk-table__header">Explanation</th>
							<th scope="col" class="govuk-table__header">Typical range</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">MVHR efficiency</td>
							<td class="govuk-table__cell">How much heat the system recoers from outgoing air</td>
							<td class="govuk-table__cell">
								0.85 - 0.95<br>
								(high performance systems recover around 0.90)
							</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Thermal insulation conductivity of ductwork</td>
							<td class="govuk-table__cell">How well the insulation reduces heat transfer</td>
							<td class="govuk-table__cell">
								0.030 - 0.040<br>
								(common materials: mineral wool, phenolic foam)
							</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Insulation thickness</td>
							<td class="govuk-table__cell">Thickness of duct insulation to minimise heat loss and prevent condensation</td>
							<td class="govuk-table__cell">25-50mm</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">External diameter of ductwork</td>
							<td class="govuk-table__cell">Outer size of the duct, affecting airflow and space requirements</td>
							<td class="govuk-table__cell">
								125 - 160<br>
								(standard domestic systems)
							</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Internal diameter of ductwork</td>
							<td class="govuk-table__cell">Inner size of the duct, determining actual airflow capacity</td>
							<td class="govuk-table__cell">
								100 - 150mm<br>
								(varies based on system needs)
							</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Length of ductwork</td>
							<td class="govuk-table__cell">Total duct length required, based on building size and layout</td>
							<td class="govuk-table__cell">10 - 30 metres</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
			<FormKit
				id="mvhrLocation"
				type="govRadios"
				:options="{
					inside: 'Inside',
					outside: 'Outside'
				}"
				label="MVHR location"
				help="Whether the MVHR unit is located inside or outside the thermal envelope"
				name="mvhrLocation"
				validation="required"
			/>
			<FormKit
				id="mvhrEfficiency"
				type="govInputFloat"
				label="MVHR efficiency"
				help="Heat recovery efficiency (0 to 1) allowing for in-use factor"
				name="mvhrEfficiency"
				validation="required | min:0 | max:1"
			/>
		</template>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>

<style scoped lang="scss">
@use "sass:map";

.custom-govuk__heading__padding {
	padding-top: 2em;
}
</style>