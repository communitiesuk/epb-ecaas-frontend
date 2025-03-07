<script setup lang="ts">
const title = "Ground floor";
const store = useEcaasStore();
const route = useRoute();

const floorData = useItemToEdit('floor', store.livingSpaceFabric.livingSpaceFloors.livingSpaceGroundFloor.data);
const model: Ref<GroundFloorData> = ref(floorData!);

const saveForm = (fields: GroundFloorData) => {
	store.$patch((state) => {
		const { livingSpaceFloors } = state.livingSpaceFabric;

		if (!livingSpaceFloors.livingSpaceGroundFloor.data) {
			livingSpaceFloors.livingSpaceGroundFloor.data = [];
		}

		const floor: GroundFloorData = {
			name: fields.name,
			surfaceAreaInZone: fields.surfaceAreaInZone,
			surfaceAreaAllZones: fields.surfaceAreaAllZones,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === '0' ? 0 : fields.pitch,
			uValue: fields.uValue,
			kappaValue: fields.kappaValue,
			massDistributionClass: fields.massDistributionClass,
			perimeter: fields.perimeter,
			psiOfWallJunction: fields.psiOfWallJunction,
			typeOfGroundFloor: fields.typeOfGroundFloor,
			edgeInsulationType: fields.edgeInsulationType,
			edgeInsulationWidth: fields.edgeInsulationWidth,
			edgeInsulationThermalResistance: fields.edgeInsulationThermalResistance,
			heightOfFloorUpperSurface: fields.heightOfFloorUpperSurface,
			thicknessOfWalls: fields.thicknessOfWalls,
			underfloorSpaceThermalResistance: fields.underfloorSpaceThermalResistance,
			thermalTransmittanceOfWallsAboveGround: fields.thermalTransmittanceOfWallsAboveGround,
			ventilationOpeningsArea: fields.ventilationOpeningsArea,
			depthOfBasementFloorBelowGround: fields.depthOfBasementFloorBelowGround,
			thermalResistanceOfBasementWalls: fields.thermalResistanceOfBasementWalls,
			thermalResistanceOfFloorAboveBasement: fields.thermalResistanceOfFloorAboveBasement,
			thermalResistanceOfWallsAboveGround: fields.thermalResistanceOfWallsAboveGround,
			thermalTransmittanceOfBasementWalls: fields.thermalTransmittanceOfBasementWalls,
			thermalTransmittanceOfFloorAboveBasement: fields.thermalTransmittanceOfFloorAboveBasement,
			heightOfBasementWallsAboveGround: fields.heightOfBasementWallsAboveGround
		};

		if (route.params.floor && route.params.floor !== 'create') {
			const index = parseInt(route.params.floor as string);
			livingSpaceFloors.livingSpaceGroundFloor.data[index] = floor;
		} else {
			livingSpaceFloors.livingSpaceGroundFloor.data.push(floor);
		}

		livingSpaceFloors.livingSpaceGroundFloor.complete = true;
	});

	navigateTo("/living-space/floors");
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
		<GovErrorSummary :error-list="errorMessages" test-id="groundFloorErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Give this element a name so it can be identified later."
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
			id="pitchOption"
			type="govRadios"
			:options="{
				'0': '0',
				custom: 'Custom'
			}"
			label="Pitch"
			help="Tilt angle of the surface from horizontal, between 0 and 180, where 0 means the external surface is facing up, 90 means the external surface is vertical and 180 means the external surface is facing down."
			name="pitchOption"
			validation="required"
		/>
		<FormKit
			v-if="model.pitchOption === 'custom'"
			id="pitch"
			type="govInputWithSuffix"
			suffix-text="degrees"
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
		<FieldsArealHeatCapacity id="kappaValue" name="kappaValue" />
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

		<template v-if="model.typeOfGroundFloor === 'slabWithEdgeInsulation'">
			<FormKit
				id="edgeInsulationType"
				type="govRadios"
				:options="{
					horizontal: 'Horizontal',
					vertical: 'Vertical',
				}"
				label="Edge insulation type"
				name="edgeInsulationType"
				validation="required"
			/>
			<FormKit
				id="edgeInsulationWidth"
				type="govInputWithSuffix"
				suffix-text="m"
				label="Edge insulation width"
				help="Width not thickness"
				name="edgeInsulationWidth"
				validation="required | number | min:0 | max:100"
			/>
			<FormKit
				id="edgeInsulationThermalResistance"
				type="govInputWithSuffix"
				suffix-text="m2·K/W"
				label="Edge insulation thermal resistance "
				name="edgeInsulationThermalResistance"
				validation="required"
			/>
		</template>
		
		<template v-if="model.typeOfGroundFloor === 'suspendedFloor'">
			<FormKit
				id="heightOfFloorUpperSurface"
				type="govInputWithSuffix"
				suffix-text="m"
				label="Height of the floor upper surface"
				help="Height of the floor upper surface, use an average value if it varies."
				name="heightOfFloorUpperSurface"
				validation="required | number | min:0 | max:100"
			/>
			<FormKit
				id="thicknessOfWalls"
				type="govInputWithSuffix"
				suffix-text="m"
				label="Thickness of walls at the edge of the floor"
				help="Ground floor external periodic heat transfer coefficient, equations as defined in BS EN ISO 13370:2017 Annex H, H.4.2 External temperature variation for ground floor slab. See other sections of the standard for other floor types."
				name="thicknessOfWalls"
				validation="required | number | min:0 | max:100"
			/>
			<FormKit
				id="underfloorSpaceThermalResistance"
				type="govInputWithSuffix"
				suffix-text="m2·K/W"
				label="Thermal resistance of insulation on base of underfloor space"
				help="Thermal resistance of insulation on base of underfloor space."
				name="underfloorSpaceThermalResistance"
				validation="required | number"
			/>
			<FormKit
				id="thermalTransmittanceOfWallsAboveGround"
				type="govInputWithSuffix"
				suffix-text="W/(m2·K)"
				label="Thermal transmittance of walls above ground"
				help="in accordance with ISO 6946"
				name="thermalTransmittanceOfWallsAboveGround"
				validation="required | number"
			/>
			<FormKit
				id="ventilationOpeningsArea"
				type="govInputWithSuffix"
				suffix-text="m2/m"
				label="Area of ventilation openings per perimeter"
				name="ventilationOpeningsArea"
				validation="required | number"
			/>
		</template>

		<template v-if="model.typeOfGroundFloor === 'heatedBasement'">
			<FormKit
				id="thicknessOfWalls"
				type="govInputWithSuffix"
				suffix-text="m"
				label="Thickness of walls at the edge of the floor"
				help="Ground floor external periodic heat transfer coefficient, equations as defined in BS EN ISO 13370:2017 Annex H, H.4.2 External temperature variation for ground floor slab. See other sections of the standard for other floor types."
				name="thicknessOfWalls"
				validation="required | number | min:0 | max:100"
			/>
			<FormKit
				id="depthOfBasementFloorBelowGround"
				type="govInputWithSuffix"
				suffix-text="m"
				label="Depth of basement floor below ground level"
				name="depthOfBasementFloorBelowGround"
				validation="required | number"
			/>
			<FormKit
				id="thermalResistanceOfBasementWalls"
				type="govInputWithSuffix"
				suffix-text="m2·K/W"
				label="Thermal resistance of walls of basement"
				name="thermalResistanceOfBasementWalls"
				validation="required | number"
			/>
		</template>

		<template v-if="model.typeOfGroundFloor === 'unheatedBasement'">
			<FormKit
				id="thermalTransmittanceOfFloorAboveBasement"
				type="govInputWithSuffix"
				suffix-text="W/(m2·K)"
				label="Thermal transmittance of floor above basement"
				help="in accordance with ISO 6946"
				name="thermalTransmittanceOfFloorAboveBasement"
				validation="required | number"
			/>
			<FormKit
				id="thermalTransmittanceOfWallsAboveGround"
				type="govInputWithSuffix"
				suffix-text="W/(m2·K)"
				label="Thermal transmittance of walls above ground"
				name="thermalTransmittanceOfWallsAboveGround"
				validation="required | number"
			/>
			<FormKit
				id="thermalTransmittanceOfBasementWalls"
				type="govInputWithSuffix"
				suffix-text="W/(m2·K)"
				label="Thermal transmittance of walls of the basement"
				name="thermalTransmittanceOfBasementWalls"
				validation="required | number"
			/>
			<FormKit
				id="thicknessOfWalls"
				type="govInputWithSuffix"
				suffix-text="m"
				label="Thickness of walls"
				name="thicknessOfWalls"
				validation="required | number"
			/>
			<FormKit
				id="depthOfBasementFloorBelowGround"
				type="govInputWithSuffix"
				suffix-text="m"
				label="Depth of basement floor below ground level"
				name="depthOfBasementFloorBelowGround"
				validation="required | number"
			/>
			<FormKit
				id="heightOfBasementWallsAboveGround"
				type="govInputWithSuffix"
				suffix-text="m"
				label="Height of the basement walls above ground level"
				name="heightOfBasementWallsAboveGround"
				validation="required | number"
			/>
		</template>

		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>