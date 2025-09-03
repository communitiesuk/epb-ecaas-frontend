<script setup lang="ts">
import { standardPitchOptions } from '#imports';

const title = "Party wall";
const store = useEcaasStore();
const { saveToList } = useForm();

const wallData = useItemToEdit('wall', store.dwellingFabric.dwellingSpaceWalls.dwellingSpacePartyWall?.data);
const model: Ref<PartyWallData> = ref(wallData!);

const saveForm = (fields: PartyWallData) => {
	store.$patch((state) => {
		const {dwellingSpaceWalls} = state.dwellingFabric;

		const wall: PartyWallData = {
			name: fields.name,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === '90' ? 90 : fields.pitch,
			surfaceArea: fields.surfaceArea,
			uValue: fields.uValue,
			kappaValue: fields.kappaValue,
			massDistributionClass: fields.massDistributionClass,
		};

		if (!dwellingSpaceWalls.dwellingSpacePartyWall) {
			dwellingSpaceWalls.dwellingSpacePartyWall = { data: [] };
		}
		dwellingSpaceWalls.dwellingSpacePartyWall.complete = false;
		saveToList(wall, dwellingSpaceWalls.dwellingSpacePartyWall);
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
		<GovErrorSummary :error-list="errorMessages" test-id="partyWallErrorSummary"/>
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
			id="surfaceArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Net surface area of element"
			help="Enter the net area of the building element. The area of all windows or doors should be subtracted before entry."
			name="surfaceArea"
			validation="required | number | min:0.01 | max:10000"
		/>
		<FormKit
			id="uValue"
			type="govInputWithSuffix"
			suffix-text="W/(m²·K)"
			label="U-value"
			help="This is the steady thermal transmittance of the materials that make up the building element"
			name="uValue"
			validation="required | number | min:0.01 | max:10">
			<GovDetails summary-text="Help with this input">
				<p class="govuk-hint">
					For the U-value of party walls, put the actual U-value of the materials of the wall. This helps determine the behaviour of the wall releasing heat back into the room.
				</p>
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