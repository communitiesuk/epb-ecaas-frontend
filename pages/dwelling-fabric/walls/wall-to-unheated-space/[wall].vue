<script setup lang="ts">
import { standardPitchOptions, getUrl } from "#imports";
import { v4 as uuidv4 } from "uuid";

const title = "Wall to unheated space";
const store = useEcaasStore();
const { getStoreIndex, autoSaveElementForm } = useForm();

const wallData = useItemToEdit("wall", store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceWallToUnheatedSpace?.data);
const wallId = wallData?.data.id ?? uuidv4();
const model: Ref<WallsToUnheatedSpaceData | undefined> = ref(wallData?.data);

const saveForm = (fields: WallsToUnheatedSpaceData) => {
	store.$patch((state) => {
		const { dwellingSpaceWalls } = state.dwellingFabric;
		const index = getStoreIndex(dwellingSpaceWalls.dwellingSpaceWallToUnheatedSpace.data);
		const currentId = wallData?.data.id;

		dwellingSpaceWalls.dwellingSpaceWallToUnheatedSpace.data[index] = {
			data: {
				id: currentId || uuidv4(),
				name: fields.name,
				grossSurfaceArea: fields.grossSurfaceArea,
				uValue: fields.uValue,
				arealHeatCapacity: fields.arealHeatCapacity,
				massDistributionClass: fields.massDistributionClass,
				pitchOption: fields.pitchOption,
				pitch: fields.pitchOption === "90" ? 90 : fields.pitch,
				thermalResistanceOfAdjacentUnheatedSpace: fields.thermalResistanceOfAdjacentUnheatedSpace,
			},
			complete: true,
		};

		dwellingSpaceWalls.dwellingSpaceWallToUnheatedSpace.complete = false;
	});

	navigateTo("/dwelling-fabric/walls");
};

autoSaveElementForm({
	model,
	storeData: store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceWallToUnheatedSpace,
	defaultName: "Wall to unheated space",
	onPatch: (state, newData, index) => {
		newData.data.id ??= wallId;
		const { pitchOption, pitch } = newData.data;
		newData.data.pitch = pitchOption === "90" ? 90 : pitch;
		state.dwellingFabric.dwellingSpaceWalls.dwellingSpaceWallToUnheatedSpace.data[index] = newData;
		state.dwellingFabric.dwellingSpaceWalls.dwellingSpaceWallToUnheatedSpace.complete = false;
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
		<GovErrorSummary :error-list="errorMessages" test-id="wallToUnheatedSpaceErrorSummary"/>
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
			:options="standardPitchOptions()"
			data-field="Zone.BuildingElement.*.pitch"
		/>
		<FormKit
			id="grossSurfaceArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Gross surface area"
			help="Enter the gross area of the building element. If the element is not square or rectangular the area might not be equal to width multiplied by height, hence the need to ask for area in addition to width and height."
			name="grossSurfaceArea"
			validation="required | number | min:0 | max:10000"
		/>
		<FieldsUValue id="uValue" name="uValue" />
		<FieldsArealHeatCapacity id="arealHeatCapacity" name="arealHeatCapacity"/>
		<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass"/>
		<FormKit
			id="thermalResistanceOfAdjacentUnheatedSpace"
			type="govInputWithSuffix"
			suffix-text="(m²·K)/W"
			label="Thermal resistance of adjacent unheated space"
			help="Enter the effective thermal resistance of the unheated space"
			name="thermalResistanceOfAdjacentUnheatedSpace"
			validation="required | number | min:0 | max:3"
		>
			<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
				<p>For example values please refer to the technical paper S11P-028. The maximum value in this paper is 2.5 (m²·K)/W for when the facing wall is not exposed.</p>
				<p class="govuk-body">
					<a href="/guidance/unheated-space-guidance" target="_blank" class="govuk-link">
						Guidance on thermal resistance of unheated spaces (opens in another window)
					</a>
				</p>
			</GovDetails>
		</FormKit>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('dwellingSpaceWalls')" secondary>Save progress</GovButton>
		</div>
	</FormKit>

</template>