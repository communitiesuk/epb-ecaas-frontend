<script setup lang="ts">
const store = useEcaasStore();
const route = useRoute();

let model: Ref<GroundFloorData>;

const saveForm = (fields: GroundFloorData) => {

	store.$patch((state) => {
		if (!state.livingSpaceFabric.livingSpaceFloors.livingSpaceGroundFloor.data) {
			state.livingSpaceFabric.livingSpaceFloors.livingSpaceGroundFloor.data = [];
		}

		const index = parseInt(route.params.floor as string);
		const floor = {
			name: fields.name,
			surfaceAreaInZone: fields.surfaceAreaInZone,
			surfaceAreaAllZones: fields.surfaceAreaAllZones,
			pitch: fields.pitch,
			uValue: fields.uValue,
			kappaValue: fields.kappaValue,
			massDistributionClass: fields.massDistributionClass,
			perimeter: fields.perimeter,
			psiOfWallJunction: fields.psiOfWallJunction,
			typeOfGroundFloor: fields.typeOfGroundFloor,
			edgeInsulationType: fields.edgeInsulationType,
			edgeInsulationWidth: fields.edgeInsulationWidth,
			edgeInsulationThermalResistance: fields.edgeInsulationThermalResistance,
		};

		if (route.params.floor && route.params.floor !== 'create') {
			state.livingSpaceFabric.livingSpaceFloors.livingSpaceGroundFloor.data[index] = floor;
		} else {
			state.livingSpaceFabric.livingSpaceFloors.livingSpaceGroundFloor.data.push(floor);
		}

		state.livingSpaceFabric.livingSpaceFloors.livingSpaceGroundFloor.complete = true;
	});

	navigateTo("/living-space/floors");
};

</script>

<template>
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
	>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Give this element a name so it can be identified later "
			name="name"
			validation="required"
		/>
		<FormKit
			id="surfaceAreaInZone"
			type="govInputWithSuffix"
			label="Surface area of element in zone"
			help="Net area of the ground floor"
			name="surfaceAreaInZone"
			validation="required | number | min:5 | max:10000"
			suffix-text="m2"
		/>
		<FormKit
			id="surfaceAreaAllZones"
			type="govInputWithSuffix"
			suffix-text="m2"
			label="Surface area of element as a whole (across all zones)"
			help="Total area of the building element across entire dwelling; if the floor is divided among several zones, this is the total area across all zone"
			name="surfaceAreaAllZones"
			validation="required | number"
		/>
		<FormKit
			id="pitch"
			type="govInputWithSuffix"
			suffix-text="degrees"
			label="Pitch"
			help="Tilt angle of the surface from horizontal, between 0 and 180, where 0 means the external surface is facing up, 90 means the external surface is vertical and 180 means the external surface is facing down"
			name="pitch"
			validation="required | number"
		/>
		<FormKit
			id="uValue"
			type="govInputWithSuffix"
			suffix-text="W/(m2.K)"
			label="U-value"
			help="Steady-state thermal transmittance of the building element"
			name="uValue"
			validation="required | number | min:0.01 | max:10"
		/>
		<FormKit
			id="kappaValue"
			type="govInputWithSuffix"
			suffix-text="J/m2.K"
			label="Kappa value"
			help="This is the total heat capacity of all the construction layers, that is, the sum of the heat capacities of each individual layers"
			name="kappaValue"
			validation="required | number | min:100 | max:5000000"
		/>
		<FormKit
			id="massDistributionClass"
			type="govRadios"
			:options="{
				internal: 'Mass distributed on internal side',
				external: 'Mass concentrated on external side',
				divided: 'Mass divided over internal and external side',
				equally: 'Mass equally distributed',
				inside: 'Mass concentrated inside',
			}"
			label="Mass distribution class"
			help="The mass distribution class is used to determine which layers of the construction are relevant to thermal mass heat storage in the model"
			name="massDistributionClass"
			validation="required"
		/>
		<FormKit
			id="perimeter"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Perimeter"
			help="Exposed perimeter of the floor, where heat loss may occur, usually the base of the external walls where they meet the ground floor. Do not include internal wall perimeters. "
			name="perimeter"
			validation="required | number | min:0 | max:1000"
		/>
		<FormKit
			id="psiOfWallJunction"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Psi of wall junction"
			help="Linear thermal transmittance of the junction between the floor and the walls"
			name="psiOfWallJunction"
			validation="required | number | min:0 | max:2"
		/>
		<FormKit
			id="typeOfGroundFloor"
			type="govRadios"
			:options="{
				slabNoEdgeInsulation: 'Slab no edge insulation',
				slabWithEdgeInsulation: 'Slab edge insulation',
				suspendedFloor: 'Suspended floor',
				heatedBasement: 'Heated basement',
				unheatedBasement: 'Unheated basement',
			}"
			label="Type of ground floor "
			help="This affects what inputs are necessary"
			name="typeOfGroundFloor"
			validation="required"
		/>

		<FormKit
			v-if="model.typeOfGroundFloor === 'slabWithEdgeInsulation'"
			id="edgeInsulationType"
			type="govRadios"
			:options="{
				horizontal: 'Horizontal',
				vertical: 'Vertical',
			}"
			label="Edge insulation type"
			name="edgeInsulationType"
		/>
		<FormKit
			v-if="model.typeOfGroundFloor === 'slabWithEdgeInsulation'"
			id="edgeInsulationWidth"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Edge insulation width"
			help="Width not thickness"
			name="edgeInsulationWidth"
			validation="required | number | min:0 | max:100"
		/>
		<FormKit
			v-if="model.typeOfGroundFloor === 'slabWithEdgeInsulation'"
			id="edgeInsulationThermalResistance"
			type="govInputWithSuffix"
			suffix-text="m2·K/W"
			label="Edge insulation thermal resistance "
			name="edgeInsulationThermalResistance"
		/>

		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	
	</FormKit>
</template>