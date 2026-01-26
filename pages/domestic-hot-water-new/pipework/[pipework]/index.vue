<script setup lang="ts">
import { getUrl, uniqueName } from "#imports";
import type { SchemaWaterPipeContentsType, SchemaWaterPipeworkLocation } from "~/schema/aliases";
const { autoSaveElementForm, getStoreIndex } = useForm();

const title = "Primary pipework for hot water";
const store = useEcaasStore();

const index = getStoreIndex(store.domesticHotWaterNew.pipework.data);
const pipeworkData = useItemToEdit("pipework", store.domesticHotWaterNew.pipework.data);
const model = ref(pipeworkData?.data);

const pipeContentsOptions: Record<Exclude<SchemaWaterPipeContentsType, "air">, string> = {
	water: "Water",
	glycol25: "Glycol 25",
};

const locationOptions: Record<SchemaWaterPipeworkLocation, "Heated space" | "Unheated space"> = {
	internal: "Heated space",
	external: "Unheated space",
};

const saveForm = (fields: PipeworkData) => {
	store.$patch((state) => {
		const { pipework } = state.domesticHotWaterNew;

		pipework.data[index] = {
			data: {
				name: fields.name,
				internalDiameter: fields.internalDiameter,
				externalDiameter: fields.externalDiameter,
				length: fields.length,
				insulationThickness: fields.insulationThickness,
				thermalConductivity: fields.thermalConductivity,
				surfaceReflectivity: fields.surfaceReflectivity,
				pipeContents: fields.pipeContents,
				location: fields.location,
			},
			complete: true,
		};
		pipework.complete = false;
	});

	navigateTo("/domestic-hot-water-new");
};


autoSaveElementForm<PipeworkData>({
	model,
	storeData: store.domesticHotWaterNew.pipework,
	defaultName: "Primary pipework",
	onPatch: (state, newData, index) => {
		state.domesticHotWaterNew.pipework.data[index] = newData;
		state.domesticHotWaterNew.pipework.complete = false;
	},
});

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>

	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<LinksPipeworkGuidance />
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="pipeworkErrorSummary" />
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			:validation-rules="{ uniqueName: uniqueName(store.domesticHotWaterNew.pipework.data, { index }) }"
			validation="required:trim | length:1,50 | uniqueName"
			:validation-messages="{
				uniqueName: 'An element with this name already exists. Please enter a unique name.'
			}" />
		<FormKit
			id="location"
			type="govRadios"
			:options="locationOptions"
			label="Location"
			help="If the pipework goes through an unheated and heated space, make a separate pipework entry for each part"
			name="location"
			validation="required"
			data-field="HotWaterSource['hw cylinder'].pipework.*.location" />
		<FormKit
			id="pipeContents"
			type="govRadios"
			:options="pipeContentsOptions"
			label="Pipe contents"
			help="Specify what is distributed through the pipe"
			name="pipeContents"
			validation="required"
			data-field="HotWaterSource['hw cylinder'].pipework.*.pipe_contents" />
		<FormKit
			id="internalDiameter"
			type="govInputWithSuffix"
			label="Internal diameter of pipework"
			help="Enter the nominal internal width of the pipe. Typically between 13 and 25mm."
			name="internalDiameter"
			validation="required | number"
			suffix-text="mm"
			data-field="HotWaterSource['hw cylinder'].pipework.*.internal_diameter_mm" />
		<FormKit
			id="externalDiameter"
			type="govInputWithSuffix"
			label="External diameter of pipework"
			help="Enter the nominal external width of the pipe. Typically between 15 and 28mm."
			name="externalDiameter"
			validation="required | number"
			suffix-text="mm"
			data-field="HotWaterSource['hw cylinder'].pipework.*.external_diameter_mm" />
		<FormKit
			id="length"
			type="govInputWithSuffix"
			label="Length"
			help="Enter the length of the pipework between the cylinder and the heat source. Typically 5-20m for a small apartment and 20-50m for a larger house"
			name="length"
			validation="required | number | min:0 | max:200"
			suffix-text="m"
			data-field="HotWaterSource['hw cylinder'].pipework.*.length" />
		<FormKit
			id="insulationThickness"
			type="govInputWithSuffix"
			label="Insulation thickness"
			help="Enter the thickness of insulation around the pipe. Typically 13-25mm or 32mm plus for high performance or external pipework"
			name="insulationThickness"
			validation="required | number"
			suffix-text="mm"
			data-field="HotWaterSource['hw cylinder'].pipework.*.insulation_thickness_mm" />
		<FormKit
			id="thermalConductivity"
			type="govInputWithSuffix"
			label="Thermal conductivity of the insulation"
			help="Enter the conductivity of the insulation around the pipe"
			name="thermalConductivity"
			validation="required | number"
			suffix-text="W/(m·K)"
			data-field="HotWaterSource['hw cylinder'].pipework.*.insulation_thermal_conductivity">
			<GovDetails
				class="summary-text"
				:summary-text="`Help with this input`"
				classes="govuk-!-margin-bottom-4"
				possibly-llm-placeholder>
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th class="govuk-table__header">Insulation type</th>
							<th class="govuk-table__header">Typical thermal conductivity</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Mineral wool / fiberglass</td>
							<td class="govuk-table__cell">0.035 - 0.045 W/(m·K)</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Polyethylene foam</td>
							<td class="govuk-table__cell">0.035 - 0.0.40 W/(m·K)</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Elastomeric foam (for example Armaflex)</td>
							<td class="govuk-table__cell">0.033 - 0.040 W/(m·K)</td>
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
			help="Specify whether the coating is reflective"
			name="surfaceReflectivity"
			validation="required"
			data-field="HotWaterSource['hw cylinder'].pipework.*.surface_reflectivity" />
	
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('pipework')" test-id="saveProgress" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>

<style scoped lang="scss">
.summary-text {
	white-space: pre-wrap;
}

.h2 {
	padding-top: 40px;
}
</style>
