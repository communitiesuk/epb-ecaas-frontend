<script setup lang="ts">
import { getUrl, uniqueName, type FloorAboveUnheatedBasementData } from "#imports";
const title = "Floor above an unheated basement";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const floorAboveUnheatedBasementData = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorAboveUnheatedBasement?.data;
const index = getStoreIndex(floorAboveUnheatedBasementData);
const floorData = useItemToEdit("floor", floorAboveUnheatedBasementData);
const model = ref(floorData?.data);

const saveForm = (fields: FloorAboveUnheatedBasementData) => {	
	store.$patch((state) => {
		const { dwellingSpaceFloorAboveUnheatedBasement } = state.dwellingFabric.dwellingSpaceFloors;

		const floor: FloorAboveUnheatedBasementData = {
			name: fields.name,
			surfaceArea: fields.surfaceArea,
			uValue: fields.uValue,
			thermalResistance: fields.thermalResistance,
			arealHeatCapacity: fields.arealHeatCapacity,
			massDistributionClass: fields.massDistributionClass,
			perimeter: fields.perimeter,
			psiOfWallJunction: fields.psiOfWallJunction,
			thicknessOfWalls: fields.thicknessOfWalls,
			depthOfBasementFloor: fields.depthOfBasementFloor,
			heightOfBasementWalls: fields.heightOfBasementWalls,
			thermalResistanceOfBasementWalls: fields.thermalResistanceOfBasementWalls,
			thermalTransmittanceOfBasementWalls: fields.thermalTransmittanceOfBasementWalls,
			thermalTransmittanceOfFoundations: fields.thermalTransmittanceOfFoundations,
		};
		
		dwellingSpaceFloorAboveUnheatedBasement.data[index] = { data: floor, complete: true };
		dwellingSpaceFloorAboveUnheatedBasement.complete = false;
	}); 
	navigateTo("/dwelling-fabric/floors");
};

autoSaveElementForm<FloorAboveUnheatedBasementData>({
	model,
	storeData: store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorAboveUnheatedBasement,
	defaultName: "Floor of an unheated basement",
	onPatch: (state, newData, index) => {
		state.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorAboveUnheatedBasement.data[index] = newData;
		state.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorAboveUnheatedBasement.complete = false;
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
		<GovErrorSummary :error-list="errorMessages" test-id="floorAboveUnheatedBasementErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			:validation-rules="{ uniqueName: uniqueName(floorAboveUnheatedBasementData, { index }) }"
			validation="required | uniqueName"
			:validation-messages="{
				uniqueName: 'An element with this name already exists. Please enter a unique name.'
			}"
		/>
		<FormKit
			id="surfaceArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Net surface area"
			help="Enter the net surface area of the entire building element in the dwelling"
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
			help="Enter the thermal resistance of all layers in the floor construction"
			name="thermalResistance"
			validation="required | number | min:0.00001 | max:50">
			<GovDetails summary-text="Help with this input">
				<p class="govuk-hint">Thermal resistance is a property indicating a materials' opposition to heat flow. It is calculated as the thickness of the material divided by its thermal conductivity. Higher thermal resistance reduces heat transfer. The U-Value is the inverse of the total thermal resistance of a building element.</p>
			</GovDetails>
		</FormKit>
		<FieldsArealHeatCapacity id="arealHeatCapacity" name="arealHeatCapacity"/>
		<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass"/>
		<FormKit
			id="perimeter"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Perimeter"
			help="Enter the length of the exposed perimeter of the floor."
			name="perimeter"
			validation="required | number | min:0 | max:1000">
			<GovDetails summary-text="Help with this input">
				<p class="govuk-hint">The exposed perimeter of the floor is where heat loss may occur, usually at the base of the external walls where they meet the ground floor.</p>
			</GovDetails>
		</FormKit>
		<FormKit
			id="psiOfWallJunction"
			type="govInputWithSuffix"
			suffix-text="W/(m·K)"
			label="PSI value of E6 junction"
			help="This is the linear thermal transmittance of the junction between the floor and the walls"
			name="psiOfWallJunction"
			validation="required | number | min:0 | max:2"
		/>
		<FormKit
			id="thicknessOfWalls"
			type="govInputWithSuffix"
			suffix-text="mm"
			label="Thickness of walls at the edge of the floor"
			help="Enter the width or physical depth of the ground floor walls that are in contact with or directly relevant to the ground floor. Typically between 30mm to 80mm."
			name="thicknessOfWalls"
			validation="required | number">
			<GovDetails summary-text="Help with this input">
				<p class="govuk-hint">This is usually measured from the inside surface to the outside surface.</p>
			</GovDetails>
		</FormKit>
		<FormKit
			id="depthOfBasementFloor"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Depth of the basement floor"
			help="Enter the depth of the basement floor below ground level"
			name="depthOfBasementFloor"
			validation="required | number"
		/>
		<FormKit
			id="heightOfBasementWalls"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Height of the basement walls"
			name="heightOfBasementWalls"
			validation="required | number"
		/>
		<FormKit
			id="thermalResistanceOfBasementWalls"
			type="govInputWithSuffix"
			suffix-text="(m²·K)/W"
			label="Thermal resistance of basement walls"
			help="Enter the thermal resistance or R-value of the basement walls"
			name="thermalResistanceOfBasementWalls"
			validation="required | number | min:0.00001 | max:50">
			<GovDetails summary-text="Help with this input">
				<p class="govuk-hint">Thermal resistance is a property indicating a materials' opposition to heat flow. It is calculated as the thickness of the material divided by its thermal conductivity. Higher thermal resistance reduces heat transfer. The U-Value is the inverse of the total thermal resistance of a building element.</p>
			</GovDetails>
		</FormKit>
		<FormKit
			id="thermalTransmittanceOfBasementWalls"
			type="govInputWithSuffix"
			suffix-text="(m²·K)/W"
			label="Thermal transmittance of the basement walls"
			help="Enter the thermal transmittance or R-value of the walls where they join the floor"
			name="thermalTransmittanceOfBasementWalls"
			validation="required | number"
		/>
		<FormKit
			id="thermalTransmittanceOfFoundations"
			type="govInputWithSuffix"
			suffix-text="W/(m²·K)"
			label="Thermal transmittance of the foundations"
			help="Enter the thermal transmittance or R-value of the foundation underneath the basement floor"
			name="thermalTransmittanceOfFoundations"
			validation="required | number"
		/>
		<div class="govuk-button-group govuk-!-margin-top-6">
			<GovLLMWarning />
			<div class="govuk-button-group">
				<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
				<GovButton :href="getUrl('dwellingSpaceFloors')" test-id="saveProgress" secondary>Save progress</GovButton>
			</div>
		</div>
	</FormKit>
</template>