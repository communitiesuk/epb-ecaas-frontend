<script setup lang="ts">
import { NuxtLink } from "#components";
import { getUrl, uniqueName } from "#imports";
const title = "Floor of heated basement";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const floorOfHeatedBasementData = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorOfHeatedBasement?.data;
const index = getStoreIndex(floorOfHeatedBasementData);
const floorData = useItemToEdit("floor", floorOfHeatedBasementData);
const model = ref(floorData?.data);

const saveForm = (fields: FloorOfHeatedBasementData) => {	
	store.$patch((state) => {
		const { dwellingSpaceFloorOfHeatedBasement } = state.dwellingFabric.dwellingSpaceFloors;

		const floor: FloorOfHeatedBasementData = {
			name: fields.name,
			surfaceArea: fields.surfaceArea,
			uValue: fields.uValue,
			thermalResistance: fields.thermalResistance,
			arealHeatCapacity: fields.arealHeatCapacity,
			massDistributionClass: fields.massDistributionClass,
			depthOfBasementFloor: fields.depthOfBasementFloor,
			perimeter: fields.perimeter,
			psiOfWallJunction: fields.psiOfWallJunction,
			thicknessOfWalls: fields.thicknessOfWalls,
		};
		
		dwellingSpaceFloorOfHeatedBasement.data[index] = { data: floor, complete: true };
		dwellingSpaceFloorOfHeatedBasement.complete = false;
	}); 
	navigateTo("/dwelling-fabric/floors");
};

autoSaveElementForm<FloorOfHeatedBasementData>({
	model,
	storeData: store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorOfHeatedBasement,
	defaultName: "Floor of heated basement",
	onPatch: (state, newData, index) => {
		state.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorOfHeatedBasement.data[index] = newData;
		state.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorOfHeatedBasement.complete = false;
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
		<GovErrorSummary :error-list="errorMessages" test-id="floorOfHeatedBasementErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			:validation-rules="{ uniqueName: uniqueName(floorOfHeatedBasementData, { index }) }"
			validation="required | uniqueName"
			:validation-messages="{
				uniqueName: 'An element with this name already exists. Please enter a unique name.'
			}"
		/>
		<FormKit
			id="surfaceArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Surface area"
			help="Enter the surface area of the floor"
			name="surfaceArea"
			validation="required | number | min:1"
			data-field="Zone.BuildingElement.*.area"
		/>
		<FieldsUValue id="uValue" name="uValue" />
		<FormKit
			id="thermalResistance"
			type="govInputWithSuffix"
			suffix-text="(m²·K)/W"
			label="Thermal resistance"
			help="Enter the thermal resistance of the floor"
			name="thermalResistance"
			validation="required | number | min:0.00001 | max:50"
		/>
		<FieldsArealHeatCapacity id="arealHeatCapacity" name="arealHeatCapacity"/>
		<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass"/>
		<FormKit
			id="depthOfBasementFloor"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Depth of basement floor below ground"
			help="Enter the depth of the basement floor below ground level"
			name="depthOfBasementFloor"
			validation="required | number"
		/>
		<FormKit
			id="perimeter"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Perimeter"
			help="Enter the length of the exposed perimeter of the floor"
			name="perimeter"
			validation="required | number | min:0 | max:1000"
		/>
		<FormKit
			id="psiOfWallJunction"
			type="govInputWithSuffix"
			suffix-text="W/(m·K)"
			label="Psi of wall junction"
			help="This is the linear thermal transmittance of the junction between the floor and the walls"
			name="psiOfWallJunction"
			validation="required | number | min:0 | max:2"
		/>
		<FormKit
			id="thicknessOfWalls"
			type="govInputWithSuffix"
			suffix-text="mm"
			label="Thickness of walls"
			name="thicknessOfWalls"
			validation="required | number"
		><div class="govuk-hint">
			<p>Enter the width or physical depth of the ground floor <NuxtLink :to="getUrl('dwellingSpaceWalls')">walls</NuxtLink> that are in contact with or directly relevant to the ground floor. Typically between 30mm to 80mm.</p>
		</div>
		</FormKit>
		<div class="govuk-button-group govuk-!-margin-top-6">
			<GovLLMWarning />
			<div class="govuk-button-group">
				<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
				<GovButton :href="getUrl('dwellingSpaceFloors')" test-id="saveProgress" secondary>Save progress</GovButton>
			</div>
		</div>
	</FormKit>
</template>