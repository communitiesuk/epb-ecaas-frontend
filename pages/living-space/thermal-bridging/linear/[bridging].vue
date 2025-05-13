<script setup lang="ts">
import type { FormKitOptionsProp } from '@formkit/inputs';

const title = "Linear thermal bridges";
const store = useEcaasStore();
const { saveToList } = useForm();

const thermalBridgeData = useItemToEdit('bridging', store.livingSpaceFabric.livingSpaceThermalBridging.livingSpaceLinearThermalBridges.data);
const model: Ref<LinearThermalBridgeData> = ref(thermalBridgeData!);

const options: FormKitOptionsProp[] = [{
	e1: 'E1: Steel lintel with perforated steel base plate',
	e2: 'E2: Other lintels (including other steel lintels)',
	e3: 'E3: Sill',
	e4: 'E4: Jamb',
	e5: 'E5: Ground floor (normal)',
	e6: 'E6: Intermediate floor within a dwelling',
	e7: 'E7: Party floor between dwellings (in blocks of flats)',
	e8: 'E8: Balcony within a dwelling, wall insulation continuous',
	e9: 'E9: Balcony between dwellings, wall insulation continuous',
	e10: 'E10: Eaves (insulation at ceiling level)',
	e11: 'E11: Eaves (insulation at rafter level)',
	e12: 'E12: Gable (insulation at ceiling level)',
	e13: 'E13: Gable (insulation at rafter level)',
	e14: 'E14: Flat roof',
	e15: 'E15: Flat roof with parapet',
	e16: 'E16: Corner (normal)',
	e17: 'E17: Corner (inverted - internal area greater than external area)',
	e18: 'E18: Party wall between dwellings',
	e19: 'E19: Ground floor (inverted)',
	e20: 'E20: Exposed floor (normal)',
	e21: 'E21: Exposed floor (inverted)',
	e22: 'E22: Basement floor',
	e23: 'E23: Balcony within or between dwellings, balcony support penetrates wall insulation',
	e24: 'E24: Eaves (insulation at ceiling level - inverted)',
	e25: 'E25: Staggered party wall between dwellings'
},{
	p1: 'P1: Party wall - Ground floor',
	p2: 'P2: Party wall - Intermediate floor within a dwelling',
	p3: 'P3: Party wall - Intermediate floor between dwellings (in blocks of flats)',
	p4: 'P4: Party wall - Roof (insulation at ceiling level)',
	p5: 'P5: Party wall - Roof (insulation at rafter level)',
	p6: 'P6: Party wall - Ground floor (inverted)',
	p7: 'P7: Party Wall - Exposed floor (normal)',
	p8: 'P8: Party Wall - Exposed floor (inverted)',
},{
	r1: 'R1: Head of roof window',
	r2: 'R2: Sill of roof window',
	r3: 'R3: Jamb of roof window',
	r4: 'R4: Ridge (vaulted ceiling)',
	r5: 'R5: Ridge (inverted)',
	r6: 'R6: Flat ceiling',
	r7: 'R7: Flat ceiling (inverted)',
	r8: 'R8: Roof to wall (rafter)',
	r9: 'R9: Roof to wall (flat ceiling)',
	r10: 'R10: All other roof or room-in-roof junctions',
	r11: 'R11: Upstands or kerbs of rooflights'
}];

const saveForm = (fields: LinearThermalBridgeData) => {
	store.$patch((state) => {
		const { livingSpaceLinearThermalBridges } = state.livingSpaceFabric.livingSpaceThermalBridging;

		const option = options.find(o => Object.keys(o).includes(fields.typeOfThermalBridge));
		const entry = Object.entries(option!).find(o => o[0] === fields.typeOfThermalBridge);

		const thermalBridge: LinearThermalBridgeData = {
			name: entry?.[1],
			typeOfThermalBridge: fields.typeOfThermalBridge,
			linearThermalTransmittance: fields.linearThermalTransmittance,
			length: fields.length
		};
		livingSpaceLinearThermalBridges.complete = false;
		saveToList(thermalBridge, livingSpaceLinearThermalBridges);
	});

	navigateTo("/living-space/thermal-bridging");
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
			help="Junction type from SAP 10.2 Table R2"
			name="typeOfThermalBridge"
			validation="required"
			:options="options"
		/>
		<FormKit
			id="linearThermalTransmittance"
			type="govInputWithSuffix"
			label="Linear thermal transmittance"
			help="Linear thermal transmittance of the thermal bridge"
			name="linearThermalTransmittance"
			validation="required | number | min:0 | max:2"
			suffix-text="W / m.K"
		/>
		<FormKit
			id="length"
			type="govInputWithSuffix"
			label="Length of thermal bridge"
			name="length"
			validation="required | number | min:0 | max:10000"
			suffix-text="m"
		/>
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>