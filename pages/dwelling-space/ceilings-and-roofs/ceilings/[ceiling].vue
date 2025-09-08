<script setup lang="ts">
import { getUrl, zeroPitchOptions } from "#imports";

const title = "Ceiling";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const ceilingData = useItemToEdit("ceiling", store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings.data);
const model: Ref<CeilingData | undefined> = ref(ceilingData?.data);

const typeOfCeilingOptions = adjacentSpaceTypeOptions("Ceiling");

const saveForm = (fields: CeilingData) => {
	store.$patch((state) => {
		const { dwellingSpaceCeilings } = state.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
		const index = getStoreIndex(dwellingSpaceCeilings.data);

		const commonFields = {
			name: fields.name,
			surfaceArea: fields.surfaceArea,
			kappaValue: fields.kappaValue,
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
				complete: true
			};
		} else if (fields.type === "heatedSpace") {
			ceiling = {
				data: {
					...commonFields,
					type: fields.type,
				},
				complete: true
			};
		} else {
			throw new Error("Invalid ceiling type");
		}

		dwellingSpaceCeilings.data[index] = ceiling;
		dwellingSpaceCeilings.complete = false;
	});

	navigateTo("/dwelling-space/ceilings-and-roofs");
};

autoSaveElementForm({
	model,
	storeData: store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings,
	defaultName: "Ceiling",
	onPatchCreate: (state, newData) => state.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings.data.push(newData),
	onPatchUpdate: (state, newData, index) => {
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
				validation="required"
			/>
			<FieldsPitch
				:pitch-option="model?.pitchOption"
				:options="zeroPitchOptions()"
			/>
			<FormKit
				id="surfaceArea"
				type="govInputWithSuffix"
				suffix-text="m²"
				label="Net surface area of element"
				help="Enter the net area of the building element. The area of all windows or doors should be subtracted before entry."
				name="surfaceArea"
				validation="required | number | min:0 | max:10000"
			/>
			<FieldsUValue
				v-if="model.type !== 'heatedSpace'"
				id="uValue"
				name="uValue"
			/>
			<FieldsArealHeatCapacity id="kappaValue" name="kappaValue"/>
			<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass"/>
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
		>
			<GovDetails summary-text="Help with this input">
				<p class="govuk-hint">
					For example values please refer to the technical paper S11P-028. The maximum value in this paper is 2.5 (m²·K)/W for when the facing wall is not exposed.
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