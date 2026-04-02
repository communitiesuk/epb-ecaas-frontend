<script setup lang="ts">
import { getUrl, uniqueName, type FloorAboveUnheatedBasementData } from "#imports";
import { zodTypeAsFormKitValidation } from "#imports";
import { groundSurfaceAreaZod, groundTotalAreaZod, groundPerimeterZod, thicknessOfWallsZod } from "~/stores/ecaasStore.schema";

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
			totalArea: fields.totalArea,
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
			help="Enter the net area of the building element, subtracting any doors or windows"
			name="surfaceArea"
			:validation="zodTypeAsFormKitValidation(groundSurfaceAreaZod)"
			data-field="Zone.BuildingElement.*.area"
		/>
		<FormKit
			id="totalArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Total area"
			help="Enter the total area of the ground floor across the dwelling.  If the ground floor is made up of multiple floor types, this is the total area of all of the ground floor elements."
			name="totalArea"
			:validation="zodTypeAsFormKitValidation(groundTotalAreaZod)"
			data-field="Zone.BuildingElement.*.total_area"
		/>
		<FieldsUValue
			id="uValue"
			name="uValue"
			help="Enter the U-value of the construction of the floor at the bottom of the lowest heated level of the dwelling, including the thermal resistance of the ground and the basement void"
		/>
		<FormKit
			id="thermalResistance"
			type="govInputWithSuffix"
			suffix-text="(m²·K)/W"
			label="Thermal resistance"
			help="Enter the thermal resistance of all layers in the floor construction, not including the effects of the ground or the void"
			name="thermalResistance"
			validation="required | number | min:0.00001 | max:50">
			<GovDetails summary-text="Help with this input">
				<p class="govuk-hint">Thermal resistance is a property indicating a materials' opposition to heat flow. It is calculated as the thickness of the material divided by its thermal conductivity. Higher thermal resistance reduces heat transfer. The U-Value is the inverse of the total thermal resistance of a building element.</p>
			</GovDetails>
		</FormKit>
		<FieldsArealHeatCapacity
			id="arealHeatCapacity"
			name="arealHeatCapacity"
			help="This is the sum of the heat capacities of the full thickness of the floor build-up"
		/>
		<FieldsMassDistributionClass
			id="massDistributionClass"
			name="massDistributionClass"
			help="This is the distribution of mass in the full thickness of the floor build up"
		/>
		<FormKit
			id="perimeter"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Perimeter"
			help="Enter the length of the exposed perimeter of the floor. This should include the perimeter to unconditioned spaces like garages, but not the perimeter to conditioned spaces such as adjacent heated dwellings."
			name="perimeter"
			:validation="zodTypeAsFormKitValidation(groundPerimeterZod)">
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
			help="Enter the width or physical depth of the ground floor walls that are in contact with or directly relevant to the ground floor. Typically between 300mm to 800mm."
			name="thicknessOfWalls"
			:validation="zodTypeAsFormKitValidation(thicknessOfWallsZod)">
			<GovDetails summary-text="Help with this input">
				<p class="govuk-hint">This is usually measured from the inside surface to the outside surface. If the thickness varies, enter a weighted average.</p>
			</GovDetails>
		</FormKit>
		<FormKit
			id="depthOfBasementFloor"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Depth of the basement floor"
			help="Measure the depth from the outside ground level to the upper surface of the basement floor. If the ground is uneven, enter the average depth."
			name="depthOfBasementFloor"
			validation="required | number"
		/>
		<FormKit
			id="heightOfBasementWalls"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Height of the basement walls"
			help="Enter the height of the basement walls above ground, measured from the ground to the upper surface of the floor of the conditioned space"
			name="heightOfBasementWalls"
			validation="required | number"
		/>
		<FormKit
			id="thermalResistanceOfBasementWalls"
			type="govInputWithSuffix"
			suffix-text="(m²·K)/W"
			label="Thermal resistance of basement walls"
			help="Enter the thermal resistance or R-value of the basement walls below ground, not including surface resistances"
			name="thermalResistanceOfBasementWalls"
			validation="required | number">
			<GovDetails summary-text="Help with this input">
				<p class="govuk-hint">Thermal resistance is a property indicating a materials' opposition to heat flow. It is calculated as the thickness of the material divided by its thermal conductivity. Higher thermal resistance reduces heat transfer. The U-Value is the inverse of the total thermal resistance of a building element.</p>
			</GovDetails>
		</FormKit>
		<FormKit
			id="thermalTransmittanceOfBasementWalls"
			type="govInputWithSuffix"
			suffix-text="(m²·K)/W"
			label="Thermal transmittance of the basement walls"
			help="Enter the thermal resistance or U-value of the basement walls above ground, but below the heated space"
			name="thermalTransmittanceOfBasementWalls"
			validation="required | number"
		/>
		<FormKit
			id="thermalTransmittanceOfFoundations"
			type="govInputWithSuffix"
			suffix-text="W/(m²·K)"
			label="Thermal transmittance of the foundations"
			help="Enter the U-value of the ground floor construction, including surface resistances. This is the floor at the bottom of the lowest heated level of the dwelling."
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