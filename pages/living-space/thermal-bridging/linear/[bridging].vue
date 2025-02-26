<script setup lang="ts">
const title = "Linear thermal bridges";
const store = useEcaasStore();
const route = useRoute();

const thermalBridgeData = useItemToEdit('bridging', store.livingSpaceFabric.livingSpaceThermalBridging.livingSpaceLinearThermalBridges.data);
const model: Ref<LinearThermalBridgeData> = ref(thermalBridgeData!);

const saveForm = (fields: LinearThermalBridgeData) => {
	store.$patch((state) => {
		const { livingSpaceThermalBridging } = state.livingSpaceFabric;
		
		if (!livingSpaceThermalBridging.livingSpaceLinearThermalBridges?.data) {
			livingSpaceThermalBridging.livingSpaceLinearThermalBridges = { data: [] };
		}

		const thermalBridge: LinearThermalBridgeData = {
			name: fields.name,
			typeOfThermalBridge: fields.typeOfThermalBridge,
			linearThermalTransmittance: fields.linearThermalTransmittance,
			length: fields.length
		};

		if (route.params.bridging && route.params.bridging !== 'create') {
			const index = parseInt(route.params.bridging as string);
			livingSpaceThermalBridging.livingSpaceLinearThermalBridges.data[index] = thermalBridge;
		} else {
			livingSpaceThermalBridging.livingSpaceLinearThermalBridges.data.push(thermalBridge);
		}

		state.livingSpaceFabric.livingSpaceThermalBridging.livingSpaceLinearThermalBridges.complete = true;
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
			id="name"
			type="govInputText"
			label="Name"
			help="Give this element a name so it can be identified later."
			name="name"
			validation="required"
		/>
		<FormKit
			id="typeOfThermalBridge"
			type="govDropdown"
			label="Type of thermal bridge"
			help="Junction type from SAP 10.2 Table R2"
			name="typeOfThermalBridge"
			validation="required"
			:options="[{
				e1: 'E1: Wall-to-window head junction (top of the window frame where it meets the wall)',
				e2: 'E2: Wall-to-window jamb junction (sides of the window frame where it meets the wall).',
				e3: 'E3: Wall-to-window sill junction (bottom of the window frame where it meets the wall).',
				e4: 'E4: Wall-to-door head junction (top of the door frame where it meets the wall).',
				e5: 'E5: Wall-to-door jamb junction (sides of the door frame where it meets the wall).',
				e6: 'E6: External wall-to-ground floor junction (connection of the external wall to the base of the building).',
				e7: 'E7: External wall-to-intermediate floor junction (e.g., floor slab edge in multi-story buildings).',
				e8: 'E8: External wall-to-balcony slab junction (e.g., cantilevered balcony or terrace).',
				e9: 'E9: External wall-to-roof junction (e.g., where insulation continuity is required at the roof level).',
				e10: 'E10: External wall-to-steel frame penetration (e.g., thermal bridges caused by steel beams or framing).',
				e11: 'E11: External wall-to-timber frame penetration.',
				e12: 'E12: External wall-to-concrete frame penetration.',
				e13: 'E13: Junction of two external walls at an external corner.',
				e14: 'E14: Junction of two external walls at an internal corner.',
				e15: 'E15: External wall-to-internal partition wall junction (thermal bridge from external to internal space).',
				e16: 'E16: Wall-to-parapet junction (e.g., parapet wall on top of the roof).',
				e17: 'E17: Wall-to-ground level service penetration (e.g., pipes passing through external walls).',
				e18: 'E18: Wall-to-roof parapet detail.',
				e19: 'E19: Wall-to-roof eaves junction (e.g., sloped or overhanging roofs).',
				e20: 'E20: Junction of external wall with horizontal service penetrations.',
				e21: 'E21: Junction of external wall with cavity closers.',
				e22: 'E22: Wall-to-flat roof junction (insulated flat roof detail).',
				e23: 'E23: Junction of external wall and overhanging cantilever element (e.g., a projecting structure).',
				e24: 'E24: External wall-to-basement wall junction (where a basement or retaining wall meets the above-ground wall).',
				e25: 'E25: Junction of external wall to perimeter floor slab (e.g., exposed floor edge).'
			},{
				p1: 'P1: Wall-to-parapet junction (basic parapet wall connection).',
				p2: 'P2: Wall-to-parapet with a cavity wall.',
				p3: 'P3: Parapet with thermal insulation wrap.',
				p4: 'P4: Parapet with roof insulation continuity.',
				p5: 'P5: Parapet junction with external thermal insulation composite system (ETICS).',
				p6: 'P6: Parapet with thermally broken connections.',
				p7: 'P7: Parapet with non-insulated external wall.',
				p8: 'P8: Parapet with insulated wall but no roof insulation continuity.',
			},{
				r1: 'R1: Flat roof-to-wall junction (insulated connection at a flat roof).',
				r2: 'R2: Pitched roof-to-wall junction (e.g., attic or sloped roof connections).',
				r3: 'R3: Roof eaves junction (overhanging roof edge with thermal bridging consideration).',
				r4: 'R4: Gable wall-to-roof junction (gable-end roof connection).',
				r5: 'R5: Roof ridge junction (connection at the peak of a pitched roof).',
				r6: 'R6: Valley roof junction (intersection of two sloping roof sections).',
				r7: 'R7: Hip roof junction (junction of roof slopes at an external corner).',
				r8: 'R8: Roof-to-chimney junction (penetration of a chimney through a roof).',
				r9: 'R9: Rooflight-to-roof junction (roof window or skylight).',
				r10: 'R10: Junction of green roofs or insulated roof gardens.',
				r11: 'R11: Connection of insulated roof and external service penetrations.'
			}]"
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