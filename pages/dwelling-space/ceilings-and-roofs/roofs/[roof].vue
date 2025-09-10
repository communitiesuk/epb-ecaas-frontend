<script setup lang="ts">
import { getUrl, zeroPitchOptions } from "#imports";

const title = "Roof";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const roofData = useItemToEdit("roof", store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs?.data);
const model: Ref<RoofData | undefined> = ref(roofData?.data);

const roofTypeOptions: Record<Exclude<RoofType, "unheatedPitched">, string> = {
	flat: "Flat roof",
	pitchedInsulatedAtRoof: "Pitched roof insulated at roof or rafter",
	pitchedInsulatedAtCeiling: "Pitched roof insulated at ceiling or joist"
};

const saveForm = (fields: RoofData) => {
	store.$patch((state) => {
		const { dwellingSpaceRoofs } = state.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
		const index = getStoreIndex(dwellingSpaceRoofs.data);

		dwellingSpaceRoofs.data[index] = {
			data: {
				name: fields.name,
				typeOfRoof: fields.typeOfRoof,
				pitchOption: fields.pitchOption,
				pitch: fields.pitchOption === "0" ? 0 : fields.pitch,
				orientation: fields.orientation,
				length: fields.length,
				width: fields.width,
				elevationalHeightOfElement: fields.elevationalHeightOfElement,
				surfaceArea: fields.surfaceArea,
				solarAbsorptionCoefficient: fields.solarAbsorptionCoefficient,
				uValue: fields.uValue,
				kappaValue: fields.kappaValue,
				massDistributionClass: fields.massDistributionClass
			},
			complete: true
		};
		dwellingSpaceRoofs.complete = false;
	});

	navigateTo("/dwelling-space/ceilings-and-roofs");
};

autoSaveElementForm({
	model,
	storeData: store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs,
	defaultName: "Roof",
	onPatchCreate: (state, newData) => {
		state.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs.data.push(newData);
		state.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs.complete = false;
	},
	onPatchUpdate: (state, newData, index) => {
		state.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs.data[index] = newData;
		state.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs.complete = false;
	},
});

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
		@submit-invalid="handleInvalidSubmit"
	>
		<GovErrorSummary :error-list="errorMessages" test-id="roofErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="typeOfRoof"
			type="govRadios"
			:options="roofTypeOptions"
			label="Type of roof"
			name="typeOfRoof"
			validation="required"
		/>
		<GovInset v-if="model?.typeOfRoof === 'pitchedInsulatedAtRoof' || model?.typeOfRoof === 'pitchedInsulatedAtCeiling'">
			If the pitched roof has multiple orientations (for example, a gable or hip roof), each orientation must be added as a separate roof element.
		</GovInset>
		<FieldsPitch
			v-if="model?.typeOfRoof === 'flat'"
			label="Pitch of roof"
			help="Enter the tilt angle of the external surface of the roof. 0° means the external surface is facing up like ceilings, and 180° means the external surface is facing down like floors."
			:pitch-option="model?.pitchOption"
			:options="zeroPitchOptions()"
		/>

		<template v-if="model?.typeOfRoof === 'pitchedInsulatedAtRoof' || model?.typeOfRoof === 'pitchedInsulatedAtCeiling'">
			<FieldsPitch
				label="Pitch of roof"
				help="Enter the tilt angle of the external surface of the roof. 0° means the external surface is facing up like ceilings, and 180° means the external surface is facing down like floors."
			/>
			<FieldsOrientation label="Orientation of roof" />
			<div v-if="!!model?.orientation" class="govuk-error-summary">
				<div role="alert" class="govuk-hint govuk-!-margin-bottom-0">
					If the pitched roof has multiple orientations (e.g., a gable or hip roof), each orientation must be modelled as a separate roof element.
				</div>
			</div>
		</template>

		<FormKit
			id="length"
			type="govInputWithSuffix"
			label="Length of roof"
			help="Enter the length of the building element"
			name="length"
			validation="required | number | min:0.001 | max:50"
			suffix-text="m"
		/>
		<FormKit
			id="width"
			type="govInputWithSuffix"
			label="Width of roof"
			help="Enter the width of the building element"
			name="width"
			validation="required | number | min:0.001 | max:50"
			suffix-text="m"
		/>
		<FieldsElevationalHeight
			field="elevationalHeightOfElement"
			label="Elevational height of roof at its base"
		/>
		<FormKit
			id="surfaceArea"
			type="govInputWithSuffix"
			label="Net surface area of ceiling"
			help="Enter the net area of the building element. The area of all windows or doors should be subtracted before entry."
			name="surfaceArea"
			validation="required | number | min:0.01 | max:10000"
			suffix-text="m²"
		/>
		<FieldsSolarAbsorptionCoefficient
			id="solarAbsorptionCoefficient"
			name="solarAbsorptionCoefficient"
			label="Solar absorption coefficient of roof"
		/>

		<template v-if="model?.typeOfRoof === 'flat' || model?.typeOfRoof === 'pitchedInsulatedAtRoof'">
			<FieldsUValue
				label="U-value of roof"
				help="This is the steady thermal transmittance of the roof and ceiling"
			/>
			<FieldsArealHeatCapacity
				id="kappaValue"
				name="kappaValue"
				help="This is the sum of the heat capacities of all the construction layers in the roof and ceiling; also known as effective areal heat capacity or kappa value"
			/>
			<FieldsMassDistributionClass help="This is the distribution of mass in the roof and ceiling" />
		</template>

		<template v-if="model?.typeOfRoof === 'pitchedInsulatedAtCeiling'">
			<FieldsUValue
				label="U-value of roof"
				help="This is the steady thermal transmittance of the entire roof, including the unheated loft space"
			/>
			<FieldsArealHeatCapacity
				id="kappaValue"
				name="kappaValue"
				help="This is the sum of the heat capacities of all the construction layers in the roof, loft space and ceiling; also known as effective areal heat capacity or kappa value"
			/>
			<FieldsMassDistributionClass help="This is the distribution of mass in the roof, loft space and ceiling" />
		</template>
		
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('dwellingSpaceCeilingsAndRoofs')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>