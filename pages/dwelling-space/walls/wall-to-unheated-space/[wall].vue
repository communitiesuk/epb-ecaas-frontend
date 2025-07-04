<script setup lang="ts">
import { pitchOptions } from '#imports';

const title = "Wall to unheated space";
const store = useEcaasStore();
const { saveToList } = useForm();

const wallData = useItemToEdit('wall', store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceWallToUnheatedSpace?.data);
const model: Ref<WallsToUnheatedSpaceData> = ref(wallData!);

const saveForm = (fields: WallsToUnheatedSpaceData) => {
	store.$patch((state) => {
		const {dwellingSpaceWalls} = state.dwellingFabric;

		const wall: WallsToUnheatedSpaceData = {
			name: fields.name,
			surfaceAreaOfElement: fields.surfaceAreaOfElement,
			uValue: fields.uValue,
			arealHeatCapacity: fields.arealHeatCapacity,
			massDistributionClass: fields.massDistributionClass,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === '90' ? 90 : fields.pitch,
			thermalResistanceOfAdjacentUnheatedSpace: fields.thermalResistanceOfAdjacentUnheatedSpace
		};

		if (!dwellingSpaceWalls.dwellingSpaceWallToUnheatedSpace) {
			dwellingSpaceWalls.dwellingSpaceWallToUnheatedSpace = { data: [] };
		}
		dwellingSpaceWalls.dwellingSpaceWallToUnheatedSpace.complete = false;
		saveToList(wall, dwellingSpaceWalls.dwellingSpaceWallToUnheatedSpace);
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
			:pitch-option="model.pitchOption"
			:options="pitchOptions()"
		/>
		<FormKit
			id="surfaceAreaOfElement"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Net surface area of element"
			help="Net area of the opaque building element (i.e. area of all windows / doors should be subtracted before entry). If the element is not square or rectangular the area might not be equal to width x height, hence the need to ask for area in addition to width and height."
			name="surfaceAreaOfElement"
			validation="required | number | min:0 | max:10000"
		/>
		<FormKit
			id="uValue"
			type="govInputWithSuffix"
			suffix-text="W/(m²·K)"
			label="U-value"
			help="Steady-state thermal transmittance of the building element"
			name="uValue"
			validation="required | number | min:0.01 | max:10"
		/>
		<FieldsArealHeatCapacity id="arealHeatCapacity" name="arealHeatCapacity"/>
		<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass"/>
		<FormKit
			id="thermalResistanceOfAdjacentUnheatedSpace"
			type="govInputWithSuffix"
			suffix-text="(m²·K)/W"
			label="Thermal resistance of adjacent unheated space"
			help="The effective thermal resistance of the unheated space. For example values, please refer to technical paper S11P-028. Max value in the paper is: Facing wall not exposed, 2.5 (m²·K)/W"
			name="thermalResistanceOfAdjacentUnheatedSpace"
			validation="required | number | min:0 | max:3"
		>
			<p class="govuk-body">
				<a href="/guidance/unheated-space-guidance" target="_blank" class="govuk-link">
					Guidance on thermal resistance of unheated spaces (opens in another window)
				</a>
			</p>
		</FormKit>

		<FormKit
			type="govButton"
			label="Save and continue"
		/>

	</FormKit>

</template>