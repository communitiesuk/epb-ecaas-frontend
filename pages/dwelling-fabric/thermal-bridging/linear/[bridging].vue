<script setup lang="ts">
import { getUrl, uniqueName } from "#imports";
import type { SchemaThermalBridgeJunctionType } from "~/schema/aliases";

const title = "Linear thermal bridges";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const linearThermalBridgeStoreData = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges.data;
const index = getStoreIndex(linearThermalBridgeStoreData);
const thermalBridgeData = useItemToEdit("bridging", linearThermalBridgeStoreData);
const model = ref(thermalBridgeData?.data);

const defaultName = "Linear thermal bridge";

type StartsWith<T extends string, Prefix extends string> = T extends `${Prefix}${string}` ? T : never;

const junctionTypeOptions = [{
	E1: "E1: Steel lintel with perforated steel base plate",
	E2: "E2: Other lintels (including other steel lintels)",
	E3: "E3: Sill",
	E4: "E4: Jamb",
	E5: "E5: Ground floor (normal)",
	E6: "E6: Intermediate floor within a dwelling",
	E7: "E7: Party floor between dwellings (in blocks of flats)",
	E8: "E8: Balcony within a dwelling, wall insulation continuous",
	E9: "E9: Balcony between dwellings, wall insulation continuous",
	E10: "E10: Eaves (insulation at ceiling level)",
	E11: "E11: Eaves (insulation at rafter level)",
	E12: "E12: Gable (insulation at ceiling level)",
	E13: "E13: Gable (insulation at rafter level)",
	E14: "E14: Flat roof",
	E15: "E15: Flat roof with parapet",
	E16: "E16: Corner (normal)",
	E17: "E17: Corner (inverted - internal area greater than external area)",
	E18: "E18: Party wall between dwellings",
	E19: "E19: Ground floor (inverted)",
	E20: "E20: Exposed floor (normal)",
	E21: "E21: Exposed floor (inverted)",
	E22: "E22: Basement floor",
	E23: "E23: Balcony within or between dwellings, balcony support penetrates wall insulation",
	E24: "E24: Eaves (insulation at ceiling level - inverted)",
	E25: "E25: Staggered party wall between dwellings",
},{
	P1: "P1: Party wall - Ground floor",
	P2: "P2: Party wall - Intermediate floor within a dwelling",
	P3: "P3: Party wall - Intermediate floor between dwellings (in blocks of flats)",
	P4: "P4: Party wall - Roof (insulation at ceiling level)",
	P5: "P5: Party wall - Roof (insulation at rafter level)",
	P6: "P6: Party wall - Ground floor (inverted)",
	P7: "P7: Party Wall - Exposed floor (normal)",
	P8: "P8: Party Wall - Exposed floor (inverted)",
},{
	R1: "R1: Head of roof window",
	R2: "R2: Sill of roof window",
	R3: "R3: Jamb of roof window",
	R4: "R4: Ridge (vaulted ceiling)",
	R5: "R5: Ridge (inverted)",
	R6: "R6: Flat ceiling",
	R7: "R7: Flat ceiling (inverted)",
	R8: "R8: Roof to wall (rafter)",
	R9: "R9: Roof to wall (flat ceiling)",
	R10: "R10: All other roof or room-in-roof junctions",
	R11: "R11: Upstands or kerbs of rooflights",
}] as const satisfies [
	Record<StartsWith<SchemaThermalBridgeJunctionType, "E">, `${SchemaThermalBridgeJunctionType}: ${string}`>,
	Record<StartsWith<SchemaThermalBridgeJunctionType, "P">, `${SchemaThermalBridgeJunctionType}: ${string}`>,
	Record<StartsWith<SchemaThermalBridgeJunctionType, "R">, `${SchemaThermalBridgeJunctionType}: ${string}`>,
];

const saveForm = (fields: LinearThermalBridgeData) => {
	store.$patch((state) => {
		const { dwellingSpaceLinearThermalBridges } = state.dwellingFabric.dwellingSpaceThermalBridging;

		dwellingSpaceLinearThermalBridges.data[index] = {
			data: {
				typeOfThermalBridge: fields.typeOfThermalBridge,
				name: fields.name,
				linearThermalTransmittance: fields.linearThermalTransmittance,
				length: fields.length,
			},
			complete: true,
		};
		dwellingSpaceLinearThermalBridges.complete = false;
	});

	navigateTo("/dwelling-fabric/thermal-bridging");
};

autoSaveElementForm<LinearThermalBridgeData>({
	model,
	storeData: store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges,
	defaultName: "",
	onPatch: (state, newData, index) => {
		if (!newData.data.name) {
			newData.data.name = getDefaultName(newData.data.typeOfThermalBridge) ?? defaultName;

			model.value = {
				...model.value,
				name: newData.data.name,
			};
		}

		state.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges.data[index] = newData;
		state.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges.complete = false;
	},
});

const getDefaultName = (typeOfThermalBridge: SchemaThermalBridgeJunctionType): string | undefined => {
	const options = junctionTypeOptions.find(o => Object.hasOwn(o, typeOfThermalBridge as PropertyKey)) as Record<string, string>;

	if (options) {
		return options[typeOfThermalBridge as string];
	}
};

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
		<GovErrorSummary :error-list="errorMessages" test-id="linearBridgeErrorSummary"/>
		<FormKit
			id="typeOfThermalBridge"
			type="govDropdown"
			label="Type of thermal bridge"
			help="Select the junction type from SAP 10.2 Table R2"
			name="typeOfThermalBridge"
			validation="required"
			:options="junctionTypeOptions"
			data-field="Zone.ThermalBridging.*.junction_type"
		/>
		<template v-if="model?.typeOfThermalBridge">
			<FormKit
				id="name"
				type="govInputText"
				label="Name"
				help="Provide a name for this element so that it can be identified later"
				name="name"
				:validation-rules="{ uniqueName: uniqueName(linearThermalBridgeStoreData, { index }) }"
				validation="required | uniqueName"
				:validation-messages="{
					uniqueName: 'An element with this name already exists. Please enter a unique name.'
				}"
			/>
			<FormKit
				id="linearThermalTransmittance"
				type="govInputWithSuffix"
				label="Linear thermal transmittance"
				help="Enter the linear thermal transmittance of the thermal bridge"
				name="linearThermalTransmittance"
				validation="required | number | min:0 | max:2"
				suffix-text="W/(m·K)"
				data-field="Zone.ThermalBridging.*.linear_thermal_transmittance"
			/>
			<FormKit
				id="length"
				type="govInputWithSuffix"
				label="Length of thermal bridge"
				name="length"
				validation="required | number | min:0 | max:10000"
				suffix-text="m"
				data-field="Zone.ThermalBridging.*.length"
			/>
		</template>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('dwellingSpaceThermalBridging')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>