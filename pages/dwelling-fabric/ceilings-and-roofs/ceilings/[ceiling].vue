<script setup lang="ts">
import type { CeilingData } from "#imports";
import { v4 as uuidv4 } from "uuid";
import { getUrl, zeroPitchOptions, uniqueName } from "#imports";

const title = "Ceiling";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const index = getStoreIndex(store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings.data);
const ceilingData = useItemToEdit("ceiling", store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings.data);
const ceilingId = ceilingData?.data.id ?? uuidv4();
const model = ref(ceilingData?.data);

const typeOfCeilingOptions = adjacentSpaceTypeOptions("Ceiling");

const saveForm = (fields: CeilingData) => {
	store.$patch((state) => {
		const { dwellingSpaceCeilings } = state.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
		const index = getStoreIndex(dwellingSpaceCeilings.data);
		const currentId = ceilingData?.data.id;

		const commonFields = {
			id: currentId || uuidv4(),
			name: fields.name,
			surfaceArea: fields.surfaceArea,
			arealHeatCapacity: fields.arealHeatCapacity,
			massDistributionClass: fields.massDistributionClass,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === "0" ? 0 : fields.pitch,
		};

		let ceiling: EcaasForm<CeilingData>;

		if (fields.type === "unheatedSpace") {
			ceiling = {
				data: {
					...commonFields,
					type: fields.type,
					uValue: fields.uValue,
					thermalResistanceOfAdjacentUnheatedSpace: fields.thermalResistanceOfAdjacentUnheatedSpace,
				},
				complete: true,
			};
		} else if (fields.type === "heatedSpace") {
			ceiling = {
				data: {
					...commonFields,
					type: fields.type,
					uValue: fields.uValue,
				},
				complete: true,
			};
		} else {
			throw new Error("Invalid ceiling type");
		}

		dwellingSpaceCeilings.data[index] = ceiling;
		dwellingSpaceCeilings.complete = false;
	});

	navigateTo("/dwelling-fabric/ceilings-and-roofs");
};

autoSaveElementForm<CeilingData>({
	model,
	storeData: store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings,
	defaultName: "Ceiling",
	onPatch: (state, newData, index) => {
		newData.data.id ??= ceilingId;
		const { pitchOption, pitch } = newData.data;
		newData.data.pitch = pitchOption === "0" ? 0 : pitch;
		state.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings.data[index] = newData;
		state.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings.complete = false;
	},
});

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
		<GovErrorSummary :error-list="errorMessages" test-id="ceilingErrorSummary"/>

		<FormKit
			id="type"
			type="govRadios"
			:options="typeOfCeilingOptions"
			label="Type of ceiling"
			help="This affects what inputs are necessary"
			name="type"
			validation="required"
		/>
		<template v-if="!!model?.type">
			<FormKit
				id="name"
				type="govInputText"
				label="Name"
				help="Provide a name for this element so that it can be identified later"
				name="name"
				:validation-rules="{ uniqueName: uniqueName(store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings.data, { index }) }"
				validation="required | uniqueName"
				:validation-messages="{
					uniqueName: 'An element with this name already exists. Please enter a unique name.'
				}"
			/>
			<FieldsPitch
				:pitch-option="model?.pitchOption"
				:options="zeroPitchOptions()"
				data-field="Zone.BuildingElement.*.pitch"
			/>
			<template v-if="model.type === 'heatedSpace'">
				<FormKit
					id="surfaceArea"
					type="govInputWithSuffix"
					suffix-text="m²"
					label="Net surface area of element"
					help="Enter the net area of the building element. The area of all large openings should be subtracted before entry, but not doors."
					name="surfaceArea"
					validation="required | number | min:0 | max:10000"
					data-field="Zone.BuildingElement.*.area"
				/>
				<FieldsUValue
					help="Enter the U-value of half the construction build up. The other half should be input as an internal floor."
				/>
				<FieldsArealHeatCapacity
					id="arealHeatCapacity"
					name="arealHeatCapacity"
					help="This is the sum of the heat capacities of half the thickness of the ceiling build up. The other half of the floor/ceiling build up should be entered as an internal floor."
				/>
				<FieldsMassDistributionClass
					id="massDistributionClass"
					name="massDistributionClass"
					help="This is the mass distribution class of half the construction build up. The other half should be input as an internal floor."
				/>
			</template>
			<template v-else>
				<FormKit
					id="surfaceArea"
					type="govInputWithSuffix"
					suffix-text="m²"
					label="Net surface area of element"
					help="Enter the net area of the building element, subtracting any doors or windows"
					name="surfaceArea"
					validation="required | number | min:0 | max:10000"
					data-field="Zone.BuildingElement.*.area"
				/>
				<FieldsUValue
					help="Enter the U-value of the full ceiling build up"
				/>
				<FieldsArealHeatCapacity
					id="arealHeatCapacity"
					name="arealHeatCapacity"
					help="This is the sum of the heat capacities of the full ceiling build up"
				/>
				<FieldsMassDistributionClass
					id="massDistributionClass"
					name="massDistributionClass"
					help="This is the distribution of mass in the full ceiling build up"
				/>
			</template>
		</template>
		<FormKit
			v-if="model?.type === 'unheatedSpace'"
			id="thermalResistanceOfAdjacentUnheatedSpace"
			type="govInputWithSuffix"
			suffix-text="(m²·K)/W"
			label="Thermal resistance of adjacent unheated space"
			help="Enter the effective thermal resistance of the unheated space"
			name="thermalResistanceOfAdjacentUnheatedSpace"
			validation="required | number | min:0 | max:3"
			data-field="Zone.BuildingElement.*.thermal_resistance_unconditioned_space"
		>
			<GovDetails summary-text="Help with this input">
				<p class="govuk-hint">
					The thermal resistance of unheated space is a measure of the degree of shelter that the unheated space provides to the building element. It is calculated as the thickness of the material divided by its thermal conductivity. A higher thermal resistance reduces heat transfer. The U-value is the inverse of the total thermal resistance of a building element.
				</p>
				<p class="govuk-hint"> See the technical paper HEM-TP-05, in which Annex A includes a general way to calculate this and also some suggested default values for common scenarios.
				</p>
				<p class="govuk-hint">
					The maximum thermal resistance of an unheated space is 2.5 (m²·K)/W. This is when the facing wall is not exposed.
				</p>
				<p class="govuk-body">
					<a href="/guidance/unheated-space-guidance" target="_blank" class="govuk-link">
						Guidance on thermal resistance of unheated spaces (opens in another window)
					</a>
				</p>
			</GovDetails>
		</FormKit>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('dwellingSpaceCeilingsAndRoofs')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>