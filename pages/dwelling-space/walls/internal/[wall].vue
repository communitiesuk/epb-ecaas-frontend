<script setup lang="ts">
import { pitchOptions } from '#imports';

const title = "Internal wall";
const store = useEcaasStore();
const { saveToList } = useForm();

const wallData = useItemToEdit('wall', store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceInternalWall?.data);
const model: Ref<InternalWallData> = ref(wallData!);

const saveForm = (fields: InternalWallData) => {
	store.$patch((state) => {
		const {dwellingSpaceWalls} = state.dwellingFabric;

		const wall: InternalWallData = {
			name: fields.name,
			surfaceAreaOfElement: fields.surfaceAreaOfElement,
			kappaValue: fields.kappaValue,
			massDistributionClass: fields.massDistributionClass,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === '90' ? 90 : fields.pitch
		};

		if (!dwellingSpaceWalls.dwellingSpaceInternalWall) {
			dwellingSpaceWalls.dwellingSpaceInternalWall = { data: [] };
		}
		dwellingSpaceWalls.dwellingSpaceInternalWall.complete = false;
		saveToList(wall, dwellingSpaceWalls.dwellingSpaceInternalWall);
	});

	navigateTo("/dwelling-space/walls");
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
			:options="pitchOptions()"
		/>
		<FormKit
			id="surfaceAreaOfElement"
			type="govInputWithSuffix"
			label="Net surface area of element"
			help="Net area of the opaque building element (i.e. area of all windows / doors should be subtracted before entry). If the element is not square or rectangular the area might not be equal to width x height, hence the need to ask for area in addition to width and height."
			name="surfaceAreaOfElement"
			validation="required | number | min:0 | max:10000"
			suffix-text="m2"
		/>
		<FieldsArealHeatCapacity id="kappaValue" name="kappaValue"/>
		<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass"/>
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>