<script setup lang="ts">
import { standardPitchOptions } from '#imports';

const title = "External wall";
const store = useEcaasStore();
const { saveToList } = useForm();

const wallData = useItemToEdit('wall', store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceExternalWall?.data);
const model: Ref<ExternalWallData> = ref(wallData!);

const saveForm = (fields: ExternalWallData) => {
	store.$patch((state) => {
		const {dwellingSpaceWalls} = state.dwellingFabric;

		const wall: ExternalWallData = {
			name: fields.name,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === '90' ? 90 : fields.pitch,
			orientation: fields.orientation,
			height: fields.height,
			length: fields.length,
			elevationalHeight: fields.elevationalHeight,
			surfaceArea: fields.surfaceArea,
			solarAbsorption: fields.solarAbsorption,
			uValue: fields.uValue,
			kappaValue: fields.kappaValue,
			massDistributionClass: fields.massDistributionClass
		};

		if (!dwellingSpaceWalls.dwellingSpaceExternalWall) {
			dwellingSpaceWalls.dwellingSpaceExternalWall = { data: [] };
		}
		dwellingSpaceWalls.dwellingSpaceExternalWall.complete = false;
		saveToList(wall, dwellingSpaceWalls.dwellingSpaceExternalWall);
	});

	navigateTo("/dwelling-space/walls");
};

const {handleInvalidSubmit, errorMessages} = useErrorSummary();
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
		<GovErrorSummary :error-list="errorMessages" test-id="externalWallErrorSummary"/>
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
			id="orientation"
			type="govInputWithSuffix"
			suffix-text="°"
			label="Orientation"
			name="orientation"
			validation="required | number | min:0 | max:360">
			<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
				<img src="/img/orientation-measurement.png" alt="Orientation measurement">
				<p class="govuk-hint">To define an object's orientation, measure the angle of its outside face clockwise from true North, accurate to the nearest degree.</p>
				<p class="govuk-hint">If a wall has multiple orientations (i.e a hexagonal wall) each different orientation needs to be modelled separately</p>
			</GovDetails>
		</FormKit>
		
		<FormKit
			id="height"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Height"
			help="Enter the height of the building element"
			name="height"
			validation="required | number | min:0.001 | max:50"
		/>
		<FormKit
			id="length"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Length"
			help="Enter the length of the building element"
			name="length"
			validation="required | number | min:0.001 | max:50"
		/>
		<FieldsElevationalHeight />
		<FormKit
			id="surfaceArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Net surface area"
			help="Enter the net area of the building element. The area of all windows or doors should be subtracted before entry."
			name="surfaceArea"
			validation="required | number | min:0.01 | max:10000"
		/>
		<FieldsSolarAbsorptionCoefficient id="solarAbsorption" name="solarAbsorption"/>
		<FieldsUValue id="uValue" name="uValue" />
		<FieldsArealHeatCapacity id="kappaValue" name="kappaValue"/>
		<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass"/>
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>