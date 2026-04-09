<script setup lang="ts">
import { getUrl, uniqueName } from "#imports";
import { v4 as uuidv4 } from "uuid";
import { zodTypeAsFormKitValidation } from "~/utils/zodToFormKitValidation";
import { groundSurfaceAreaZod, groundTotalAreaZod, thicknessOfWallsZod } from "~/stores/ecaasStore.schema";

const title = "Floor of heated basement";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const floorOfHeatedBasementData = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorOfHeatedBasement?.data;
const index = getStoreIndex(floorOfHeatedBasementData);
const floorData = useItemToEdit("floor", floorOfHeatedBasementData);
const floorId = floorData?.data.id ?? uuidv4();
const model = ref(floorData?.data);

const saveForm = (fields: FloorOfHeatedBasementData) => {	
	store.$patch((state) => {
		const { dwellingSpaceFloorOfHeatedBasement } = state.dwellingFabric.dwellingSpaceFloors;

		const floor: FloorOfHeatedBasementData = {
			id: floorId,
			name: fields.name,
			netSurfaceArea: fields.netSurfaceArea,
			totalArea: fields.totalArea,
			uValue: fields.uValue,
			thermalResistance: fields.thermalResistance,
			arealHeatCapacity: fields.arealHeatCapacity,
			massDistributionClass: fields.massDistributionClass,
			depthOfBasementFloor: fields.depthOfBasementFloor,
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
		// Ensure autosave assigns an id so other elements can reference this floor
		newData.data.id ??= floorId;
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
			id="netSurfaceArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Net surface area"
			help="Enter the net area of the building element, subtracting any doors or windows"
			name="netSurfaceArea"
			:validation="zodTypeAsFormKitValidation(groundSurfaceAreaZod)"
			data-field="Zone.BuildingElement.*.area"
		/>
		<FormKit
			id="totalArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Total area"
			help="Enter the total area of the ground floor across the dwelling.  If the ground floor is made up of multiple floor types, this is the total area of all of the ground floor elements apart from basement walls."
			name="totalArea"
			:validation="zodTypeAsFormKitValidation(groundTotalAreaZod)"
			data-field="Zone.BuildingElement.*.total_area"
		/>
		<FieldsUValue
			id="uValue"
			name="uValue"
			help="Enter the U-value of the construction of the floor at the bottom of the lowest heated level of the dwelling, including the thermal resistance of the ground"	
		/>
		<FormKit
			id="thermalResistance"
			type="govInputWithSuffix"
			suffix-text="(m²·K)/W"
			label="Thermal resistance"
			help="Enter the thermal resistance of all layers in the floor construction, not including the effects of the ground"
			name="thermalResistance"
			validation="required | number | min:0.00001 | max:50"
		><GovDetails summary-text="Help with this input">
			<p>Thermal resistance is a property indicating a materials' opposition to heat flow. It is calculated as the thickness of the material divided by its thermal conductivity. Higher thermal resistance reduces heat transfer.
			</p>
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
			id="depthOfBasementFloor"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Depth of basement floor"
			help="Measure the depth from the outside ground level to the upper surface of the basement floor. If the ground is uneven, enter the average depth."
			name="depthOfBasementFloor"
			validation="required | number"
		/>
		<FormKit
			id="psiOfWallJunction"
			type="govInputWithSuffix"
			suffix-text="W/(m·K)"
			label="Psi value of E22 junction"
			help="This is the linear thermal transmittance of the junction between the floor and the walls, if there are multiple values enter an average weighted by length"
			name="psiOfWallJunction"
			validation="required | number | min:0 | max:2"
		/>
		<FormKit
			id="thicknessOfWalls"
			type="govInputWithSuffix"
			suffix-text="mm"
			label="Thickness of walls"
			name="thicknessOfWalls"
			:validation="zodTypeAsFormKitValidation(thicknessOfWallsZod)"
			help="Enter the physical thickness of the ground floor wall. Typically more than 300mm. If the thickness varies, enter a weighted average."
		/>
		<div class="govuk-button-group govuk-!-margin-top-6">
			<div class="govuk-button-group">
				<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
				<GovButton :href="getUrl('dwellingSpaceFloors')" test-id="saveProgress" secondary>Save progress</GovButton>
			</div>
		</div>
	</FormKit>
</template>