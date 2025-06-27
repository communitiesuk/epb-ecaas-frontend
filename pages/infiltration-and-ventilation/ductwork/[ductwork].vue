<script setup lang="ts">
import { DuctShape, type DuctType } from '~/schema/api-schema.types';
import { VentType } from '~/schema/api-schema.types';

const title = "MVHR ductwork";
const store = useEcaasStore();
const { saveToList } = useForm();

const ductwork = useItemToEdit(
	"ductwork",
	store.infiltrationAndVentilation.ductwork.data
);

const model: Ref<DuctworkData> = ref(ductwork!);
store.infiltrationAndVentilation.ductwork.complete = false;

const ductworkCrossSectionalShapeOptions: Record<DuctShape, SnakeToSentenceCase<DuctShape>> = {
	circular: "Circular",
	rectangular: "Rectangular",
};
const ductTypeOptions: Record<DuctType, SnakeToSentenceCase<DuctType>> = {
	supply: "Supply",
	extract: "Extract",
	intake: "Intake",
	exhaust: "Exhaust",
};

const saveForm = (fields: DuctworkData) => {
	store.$patch((state) => {
		const { ductwork } = state.infiltrationAndVentilation;

		const commonFields = {
			name: fields.name,
			mvhrUnit: fields.mvhrUnit,
			ductType: fields.ductType,
			insulationThickness: fields.insulationThickness,
			lengthOfDuctwork: fields.lengthOfDuctwork,
			thermalInsulationConductivityOfDuctwork:
        fields.thermalInsulationConductivityOfDuctwork,
			surfaceReflectivity: fields.surfaceReflectivity,
		};

		let ductworkItem: DuctworkData;

		switch (fields.ductworkCrossSectionalShape) {
			case DuctShape.circular:
				ductworkItem = {
					...commonFields,
					ductworkCrossSectionalShape: fields.ductworkCrossSectionalShape,
					internalDiameterOfDuctwork: fields.internalDiameterOfDuctwork,
					externalDiameterOfDuctwork: fields.externalDiameterOfDuctwork,
				};
				break;
			case DuctShape.rectangular:
				ductworkItem = {
					...commonFields,
					ductworkCrossSectionalShape: fields.ductworkCrossSectionalShape,
					ductPerimeter: fields.ductPerimeter,
				};
				break;
			default:
				throw new Error("Missed a duct shape case");
		}

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
			id="mvhrUnit" type="govRadios" :options="new
				Map(store.infiltrationAndVentilation.mechanicalVentilation.data.filter(x => x.typeOfMechanicalVentilationOptions === VentType.MVHR).map((x)=> [x.id, x.name]))"
			label="MVHR unit" 
			name="mvhrUnit" 
			help="Select a MVHR unit that has been added previously which this ductwork is attached to"
			validation="required" />

		<FormKit
			id="ductType"
			type="govRadios"
			:options="ductTypeOptions"
			label="Duct type"
			name="ductType"
			validation="required"
		/>
		<FormKit
			id="ductworkCrossSectionalShape"
			type="govRadios"
			:options="ductworkCrossSectionalShapeOptions"
			label="Ductwork cross sectional shape"
			name="ductworkCrossSectionalShape"
			validation="required"
		/>
		<template v-if="model.ductworkCrossSectionalShape === DuctShape.circular">
			<FormKit
				id="internalDiameterOfDuctwork"
				type="govInputWithSuffix"
				suffix-text="mm"
				label="Internal diameter of ductwork"
				name="internalDiameterOfDuctwork"
				validation="required | number | min:0 | max:1000">
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
				validation="required | number | min:0 | max:1000">
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
		</template>

		<FormKit
			v-if="model.ductworkCrossSectionalShape === DuctShape.rectangular"
			id="ductPerimeter"
			type="govInputWithSuffix"
			suffix-text="mm"
			label="Perimeter of ductwork"
			name="ductPerimeter"
			validation="required | number | min:0 | max:1000"
		/>
		
		<FormKit
			id="insulationThickness"
			type="govInputWithSuffix"
			suffix-text="mm"
			label="Insulation thickness"
			help="The thickness of the duct insulation"
			name="insulationThickness"
			validation="required | number | min:0 | max:100">
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
							<td class="govuk-table__cell">Thickness of duct insulation to minimise heat loss and prevent condensation</td>
							<td class="govuk-table__cell">25-50mm</td>
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
			help="Length of the piece of ductwork specified in this sub-object"
			name="lengthOfDuctwork"
			validation="required | number | min:0">
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
							<td class="govuk-table__cell">Total duct length required, based on building size and layout</td>
							<td class="govuk-table__cell">10 - 30 metres</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<FormKit
			id="thermalInsulationConductivityOfDuctwork"
			type="govInputWithSuffix"
			suffix-text="W/m·K"
			label="Thermal insulation conductivity of ductwork"
			help="The thermal conductivity of the insulation"
			name="thermalInsulationConductivityOfDuctwork"
			validation="required | number | min:0">
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
							<td class="govuk-table__cell">How well the insulation reduces heat transfer</td>
							<td class="govuk-table__cell">
								0.030 - 0.040<br>
								(common materials: mineral wool, phenolic foam)
							</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<FormKit
			id="surfaceReflectivity"
			type="govBoolean"
			true-label="Reflective"
			false-label="Not reflective"
			label="Surface reflectivity"
			help="Whether the surface is reflective or not"
			name="surfaceReflectivity"
			validation="required"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
