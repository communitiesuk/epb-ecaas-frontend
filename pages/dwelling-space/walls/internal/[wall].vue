<script setup lang="ts">
import { standardPitchOptions } from "#imports";

const title = "Internal wall";
const store = useEcaasStore();
const { saveToList } = useForm();

const wallData = useItemToEdit("wall", store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceInternalWall?.data);
const model: Ref<InternalWallData> = ref(wallData!);

const saveForm = (fields: InternalWallData) => {
	store.$patch((state) => {
		const { dwellingSpaceWalls } = state.dwellingFabric;

		const wall: InternalWallData = {
			name: fields.name,
			surfaceAreaOfElement: fields.surfaceAreaOfElement,
			kappaValue: fields.kappaValue,
			massDistributionClass: fields.massDistributionClass,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === "90" ? 90 : fields.pitch
		};

		if (!dwellingSpaceWalls.dwellingSpaceInternalWall) {
			dwellingSpaceWalls.dwellingSpaceInternalWall = { data: [] };
		}
		dwellingSpaceWalls.dwellingSpaceInternalWall.complete = false;
		saveToList(wall, dwellingSpaceWalls.dwellingSpaceInternalWall);
	});

	navigateTo("/dwelling-space/walls");
};

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
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
		<GovErrorSummary :error-list="errorMessages" test-id="internalWallErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FieldsPitch
			:pitch-option="model.pitchOption"
			:options="standardPitchOptions()"
		/>
		<FormKit
			id="surfaceAreaOfElement"
			type="govInputWithSuffix"
			label="Net surface area of element"
			help="Net area of the opaque building element. The area of all windows or doors should be subtracted before entry."
			name="surfaceAreaOfElement"
			validation="required | number | min:0 | max:10000"
			suffix-text="m²">
			<GovDetails summary-text="Help with this input">
				<p class="govuk-hint">The net surface area should only be for one side of the wall, not both.</p>
			</GovDetails>
		</FormKit>
		<FieldsArealHeatCapacity id="kappaValue" name="kappaValue"/>
		<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass"/>
		<GovLLMWarning />
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>