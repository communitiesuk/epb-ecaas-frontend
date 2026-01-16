<script setup lang="ts">
import type { SchemaDuctShape, SchemaDuctType } from "~/schema/aliases";
import type { DuctworkData, EcaasForm } from "#imports";
import { getUrl } from "#imports";

const title = "MVHR ductwork";
const store = useEcaasStore();
const { getStoreIndex, autoSaveElementForm } = useForm();

const ductwork = useItemToEdit(
	"ductwork",
	store.infiltrationAndVentilation.ductwork.data,
);

const model = ref(ductwork?.data);
store.infiltrationAndVentilation.ductwork.complete = false;

const ductworkCrossSectionalShapeOptions: Record<SchemaDuctShape, SnakeToSentenceCase<SchemaDuctShape>> = {
	circular: "Circular",
	rectangular: "Rectangular",
};
const ductTypeOptions: Record<SchemaDuctType, SnakeToSentenceCase<SchemaDuctType>> = {
	supply: "Supply",
	extract: "Extract",
	intake: "Intake",
	exhaust: "Exhaust",
};

const saveForm = (fields: DuctworkData) => {
	store.$patch((state) => {
		const { ductwork } = state.infiltrationAndVentilation;
		const index = getStoreIndex(ductwork.data as EcaasForm<DuctworkData>[]);

		const ductworkItem: DuctworkData = {
			name: fields.name,
			mvhrUnit: fields.mvhrUnit,
			ductType: fields.ductType,
			insulationThickness: fields.insulationThickness,
			lengthOfDuctwork: fields.lengthOfDuctwork,
			thermalInsulationConductivityOfDuctwork: fields.thermalInsulationConductivityOfDuctwork,
			surfaceReflectivity: fields.surfaceReflectivity,
			ductworkCrossSectionalShape: fields.ductworkCrossSectionalShape,
			internalDiameterOfDuctwork: fields.internalDiameterOfDuctwork,
			externalDiameterOfDuctwork: fields.externalDiameterOfDuctwork,
		};

		ductwork.data[index] = {
			data: ductworkItem,
			complete: true,
		};

		ductwork.complete = false;
	});

	navigateTo("/infiltration-and-ventilation/ductwork");
};

autoSaveElementForm<DuctworkData>({
	model,
	storeData: store.infiltrationAndVentilation.ductwork,
	defaultName: "Ductwork",
	onPatch: (state, newData, index) => {
		state.infiltrationAndVentilation.ductwork.data[index] = newData;
		state.infiltrationAndVentilation.ductwork.complete = false;
	},
});

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<p class="govuk-body">
		<a href="/guidance/ductwork-lengths" target="_blank" class="govuk-link">
			Guidance on ductwork lengths (opens in another window)
		</a>
	</p>
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
			id="mvhrUnit"
			type="govRadios"
			:options="new
				Map(store.infiltrationAndVentilation.mechanicalVentilation.data.filter(x => x.data.typeOfMechanicalVentilationOptions === 'MVHR').map((x)=> [x.data.id!, x.data.name]))"
			label="MVHR unit" 
			name="mvhrUnit" 
			help="Select the MVHR unit that this ductwork is attached to"
			validation="required" />

		<FormKit
			id="ductType"
			type="govRadios"
			:options="ductTypeOptions"
			label="Duct type"
			name="ductType"
			validation="required"
			data-field="InfiltrationVentilation.MechanicalVentilation.duct_type">
			<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
				<table class="govuk-table ductwork-table">
					<thead class="govuk-table__head">
						<tr>
							<th scope="col" class="govuk-table__header">Duct type</th>
							<th scope="col" class="govuk-table__header">Description</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Supply</th>
							<td class="govuk-table__cell">Supply ducts distribute conditioned air (heated or cooled) into a space.</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Extract</th>
							<td class="govuk-table__cell">Extract ducts remove stale air from a space.</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Intake</th>
							<td class="govuk-table__cell">Intake ducts bring fresh, outside air into a system.</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Exhaust</th>
							<td class="govuk-table__cell">Exhaust ducts expel air from a system to the outside.</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<FormKit
			id="ductworkCrossSectionalShape"
			type="govRadios"
			:options="ductworkCrossSectionalShapeOptions"
			label="Ductwork cross sectional shape"
			name="ductworkCrossSectionalShape"
			validation="required"
			data-field="InfiltrationVentilation.MechanicalVentilation.cross_section_shape	"
		/>
		<FormKit
			id="internalDiameterOfDuctwork"
			type="govInputWithSuffix"
			suffix-text="mm"
			label="Internal diameter of ductwork"
			name="internalDiameterOfDuctwork"
			validation="required | number | min:0 | max:1000"
			data-field="InfiltrationVentilation.MechanicalVentilation.internal_diameter_mm">
			<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header">Explanation</th>
							<th scope="col" class="govuk-table__header">Typical range</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Inner size of the duct, determining actual airflow capacity</td>
							<td class="govuk-table__cell">
								100 - 150mm<br>
								(varies based on system needs)
							</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<FormKit
			id="externalDiameterOfDuctwork"
			type="govInputWithSuffix"
			suffix-text="mm"
			label="External diameter of ductwork"
			name="externalDiameterOfDuctwork"
			validation="required | number | min:0 | max:1000"
			data-field="InfiltrationVentilation.MechanicalVentilation.external_diameter_mm">
			<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header">Explanation</th>
							<th scope="col" class="govuk-table__header">Typical range</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Outer size of the duct, affecting airflow and space requirements</td>
							<td class="govuk-table__cell">
								125 - 160<br>
								(standard domestic systems)
							</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<FormKit
			id="lengthOfDuctwork"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Length of ductwork"
			help="Enter the length of the piece of ductwork for this sub-object. Typically between 10m and 30m."
			name="lengthOfDuctwork"
			validation="required | number | min:0"
			data-field="InfiltrationVentilation.MechanicalVentilation.length"/>

		<FormKit
			id="insulationThickness"
			type="govInputWithSuffix"
			suffix-text="mm"
			label="Insulation thickness"
			help="Enter the thickness of the duct insulation. Typically between 25mm and 50mm."
			name="insulationThickness"
			validation="required | number | min:0 | max:100"
			data-field="InfiltrationVentilation.MechanicalVentilation.insulation_thickness_mm"/>
			
		<FormKit
			id="thermalInsulationConductivityOfDuctwork"
			type="govInputWithSuffix"
			suffix-text="W/m·K"
			label="Thermal conductivity of ductwork insulation"
			help="Enter the thermal conductivity of the insulation. Typical values are between 0.03 and 0.04."
			name="thermalInsulationConductivityOfDuctwork"
			validation="required | number | min:0"
			data-field="InfiltrationVentilation.MechanicalVentilation.insulation_thermal_conductivity"/>
		
		<FormKit
			id="surfaceReflectivity"
			type="govBoolean"
			true-label="Reflective"
			false-label="Not reflective"
			label="Surface reflectivity"
			help="Select whether the surface is reflective"
			name="surfaceReflectivity"
			validation="required"
			data-field="InfiltrationVentilation.MechanicalVentilation.reflective"
		/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('ductwork')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>

<style lang="scss" scoped>
.ductwork-table .govuk-table__header {
	min-width: 100px;
}
</style>