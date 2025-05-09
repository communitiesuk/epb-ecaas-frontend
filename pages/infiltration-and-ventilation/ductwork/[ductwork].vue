<script setup lang="ts">
const title = "MVHR ductwork";
const store = useEcaasStore();
const { saveToList } = useForm();

const ductwork = useItemToEdit(
	"ductwork",
	store.infiltrationAndVentilation.ductwork.data
);

const model: Ref<DuctworkData> = ref(ductwork!);
store.infiltrationAndVentilation.ductwork.complete = false;
const saveForm = (fields: DuctworkData) => {
	store.$patch((state) => {
		const { ductwork } = state.infiltrationAndVentilation;

		const ductworkItem: DuctworkData = {
			name: fields.name,
			mvhrUnit: fields.mvhrUnit,
			ductworkCrossSectionalShape: fields.ductworkCrossSectionalShape,
			ductType: fields.ductType,
			internalDiameterOfDuctwork: fields.internalDiameterOfDuctwork,
			externalDiameterOfDuctwork: fields.externalDiameterOfDuctwork,
			insulationThickness: fields.insulationThickness,
			lengthOfDuctwork: fields.lengthOfDuctwork,
			thermalInsulationConductivityOfDuctwork:
        fields.thermalInsulationConductivityOfDuctwork,
			surfaceReflectivity: fields.surfaceReflectivity,
		};

		saveToList(ductworkItem, ductwork);
	});
	navigateTo("/infiltration-and-ventilation/ductwork");
};

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
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
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit"
	>
		<GovErrorSummary
			:error-list="errorMessages"
			test-id="ductworkErrorSummary"
		/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>

		<FormKit
			id="mvhrUnit" type="govRadios" :options="new
				Map(store.infiltrationAndVentilation.mechanicalVentilation.data.filter(x => x.typeOfMechanicalVentilationOptions === 'mvhr').map((x)=> [x.id, x.name]))"
			label="MVHR unit" 
			name="mvhrUnit" 
			help="Select a MVHR unit that
    has been added previously which this ductwork is attached to"
			validation="required" />

		<FormKit
			id="ductworkCrossSectionalShape"
			type="govRadios"
			:options="{
				circular: 'Circular',
				rectangular: 'Rectangular',
			}"
			label="Ductwork cross sectional shape"
			name="ductworkCrossSectionalShape"
			validation="required"
		/>
		<FormKit
			id="ductType"
			type="govRadios"
			:options="{
				supply: 'Supply',
				extract: 'Extract',
				intake: 'Intake',
				exhaust: 'Exhaust',
			}"
			label="Duct type"
			name="ductType"
			validation="required"
		/>
		<FormKit
			id="internalDiameterOfDuctwork"
			type="govInputWithSuffix"
			suffix-text="mm"
			label="Internal diameter of ductwork"
			name="internalDiameterOfDuctwork"
			validation="required | number | min:0 | max:1000"
		/>
		<FormKit
			id="externalDiameterOfDuctwork"
			type="govInputWithSuffix"
			suffix-text="mm"
			label="External diameter of ductwork"
			name="externalDiameterOfDuctwork"
			validation="required | number | min:0 | max:1000"
		/>
		<FormKit
			id="insulationThickness"
			type="govInputWithSuffix"
			suffix-text="mm"
			label="Insulation thickness"
			help="The thickness of the duct insulation"
			name="insulationThickness"
			validation="required | number | min:0 | max:100"
		/>
		<FormKit
			id="lengthOfDuctwork"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Length of ductwork"
			help="Length of the piece of ductwork specified in this sub-object"
			name="lengthOfDuctwork"
			validation="required | number | min:0"
		/>
		<FormKit
			id="thermalInsulationConductivityOfDuctwork"
			type="govInputWithSuffix"
			suffix-text="W/m.K"
			label="Thermal insulation conductivity of ductwork"
			help="The thermal conductivity of the insulation"
			name="thermalInsulationConductivityOfDuctwork"
			validation="required | number | min:0"
		/>
		<FormKit
			id="surfaceReflectivity"
			type="govRadios"
			:options="{
				reflective: 'Reflective',
				notReflective: 'Not reflective',
			}"
			label="Surface reflectivity"
			help="Whether the surface is reflective or not"
			name="surfaceReflectivity"
			validation="required"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
