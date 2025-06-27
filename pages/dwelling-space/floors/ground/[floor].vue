<script setup lang="ts">
import { FloorType, WindShieldLocation } from '~/schema/api-schema.types';

const title = "Ground floor";
const store = useEcaasStore();
const { saveToList } = useForm();

const floorData = useItemToEdit('floor', store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceGroundFloor.data);
const model: Ref<GroundFloorData> = ref(floorData!);

// Removed heated and unheated basement options for summer
type reducedGroundFloorOptions = FloorType.Slab_no_edge_insulation | FloorType.Slab_edge_insulation | FloorType.Suspended_floor;
const typeOfGroundFloorOptions: Record<reducedGroundFloorOptions, SnakeToSentenceCase<reducedGroundFloorOptions>> = {
	[FloorType.Slab_no_edge_insulation]: 'Slab no edge insulation',
	[FloorType.Slab_edge_insulation]: 'Slab edge insulation',
	[FloorType.Suspended_floor]: 'Suspended floor',
	// [FloorType.Heated_basement]: 'Heated basement',
	// [FloorType.Unheated_basement]: 'Unheated basement',
};

const windShieldingFactorOptions: Record<WindShieldLocation, SnakeToSentenceCase<WindShieldLocation>> = {
	[WindShieldLocation.Sheltered]: 'Sheltered',
	[WindShieldLocation.Average]: 'Average',
	[WindShieldLocation.Exposed]: 'Exposed'
};

const saveForm = (fields: GroundFloorData) => {
	store.$patch((state) => {
		const {dwellingSpaceFloors} = state.dwellingFabric;

		const commonFields = {
			name: fields.name,
			surfaceArea: fields.surfaceArea,
			pitch: 180,
			uValue: fields.uValue,
			thermalResistance: fields.thermalResistance,
			kappaValue: fields.kappaValue,
			massDistributionClass: fields.massDistributionClass,
			perimeter: fields.perimeter,
			psiOfWallJunction: fields.psiOfWallJunction,
			thicknessOfWalls: fields.thicknessOfWalls
		};

		let floor: GroundFloorData;

		switch(fields.typeOfGroundFloor) {
			case FloorType.Slab_edge_insulation:
				floor = {
					...commonFields,
					typeOfGroundFloor: fields.typeOfGroundFloor,
					edgeInsulationType: fields.edgeInsulationType,
					edgeInsulationWidth: fields.edgeInsulationWidth,
					edgeInsulationThermalResistance: fields.edgeInsulationThermalResistance,
				};
				break;
			case FloorType.Slab_no_edge_insulation:
				floor = {
					...commonFields,
					typeOfGroundFloor: fields.typeOfGroundFloor,
				};
				break;
			case FloorType.Suspended_floor:
				floor = {
					...commonFields,
					typeOfGroundFloor: fields.typeOfGroundFloor,
					heightOfFloorUpperSurface: fields.heightOfFloorUpperSurface,
					underfloorSpaceThermalResistance: fields.underfloorSpaceThermalResistance,
					thermalTransmittanceOfWallsAboveGround: fields.thermalTransmittanceOfWallsAboveGround,
					ventilationOpeningsArea: fields.ventilationOpeningsArea,
					windShieldingFactor: fields.windShieldingFactor,
				};
				break;
			case FloorType.Heated_basement:
				floor = {
					...commonFields,
					typeOfGroundFloor: fields.typeOfGroundFloor,
					depthOfBasementFloorBelowGround: fields.depthOfBasementFloorBelowGround,
					thermalResistanceOfBasementWalls: fields.thermalResistanceOfBasementWalls,
				};
				break;
			case FloorType.Unheated_basement:
				floor = {
					...commonFields,
					typeOfGroundFloor: fields.typeOfGroundFloor,
					thermalTransmittanceOfFloorAboveBasement: fields.thermalTransmittanceOfFloorAboveBasement,
					thermalTransmittanceOfWallsAboveGround: fields.thermalTransmittanceOfWallsAboveGround,
					depthOfBasementFloorBelowGround: fields.depthOfBasementFloorBelowGround,
					heightOfBasementWallsAboveGround: fields.heightOfBasementWallsAboveGround,
				};
				break;
			default:
				fields satisfies never;
				throw new Error(`Did not handle floor type '${ (fields as GroundFloorData).typeOfGroundFloor }'`);

		}

		if (!dwellingSpaceFloors.dwellingSpaceGroundFloor) {
			dwellingSpaceFloors.dwellingSpaceGroundFloor = { data: [] };
		}
		
		dwellingSpaceFloors.dwellingSpaceGroundFloor.complete = false;
		
		saveToList(floor, dwellingSpaceFloors.dwellingSpaceGroundFloor);
	});

	navigateTo("/dwelling-space/floors");
};

const {handleInvalidSubmit, errorMessages} = useErrorSummary();
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
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="surfaceArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Net surface area of this element"
			help="Enter the total surface area of the entire building element in the dwelling."
			name="surfaceArea"
			validation="required | number | min:1"
		/>
		<FormKit
			id="uValue"
			type="govInputWithSuffix"
			suffix-text="W/(m²·K)"
			label="U-value"
			help="Steady-state thermal transmittance of the building element"
			name="uValue"
			validation="required | number | min:0.01 | max:10"
		/>
		<FormKit
			id="thermalResistance"
			type="govInputWithSuffix"
			suffix-text="(m²·K)/W"
			label="Thermal resistance"
			help="A property indicating a material's opposition to heat flow. Calculated as the thickness of the material divided by its thermal conductivity. Higher thermal resistance reduces heat transfer. The U-value is the inverse of the total thermal resistance of a building element."
			name="thermalResistance"
			validation="required | number | min:0.00001 | max:50"
		/>
		<FieldsArealHeatCapacity id="kappaValue" name="kappaValue"/>
		<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass"/>
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
			suffix-text="W/(m·K)"
			label="PSI value of E5 junction"
			help="This is the linear thermal transmittance of the junction between the floor and the walls. This input needs to be entered here and in the thermal bridging section."
			name="psiOfWallJunction"
			validation="required | number | min:0 | max:2"
		/>
		<FormKit
			id="thicknessOfWalls"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Thickness of walls for ground floor"
			help="Enter the width or physical depth of the ground floor walls that are in contact with or directly relevant to the ground floor. This is usually measured from the inside surface to the outside surface. Typical range is 0.3 - 0.8."
			name="thicknessOfWalls"
			validation="required | number"
		/>
		<FormKit
			id="typeOfGroundFloor"
			type="govRadios"
			:options="typeOfGroundFloorOptions"
			label="Type of ground floor "
			help="This affects what inputs are necessary"
			name="typeOfGroundFloor"
			validation="required"
		/>

		<template v-if="model.typeOfGroundFloor === FloorType.Slab_edge_insulation">
			<FormKit
				id="edgeInsulationType"
				type="govRadios"
				:options="{
					horizontal: 'Horizontal',
					vertical: 'Vertical',
				}"
				label="Edge insulation type"
				name="edgeInsulationType"
				validation="required">
				<GovDetails summary-text="Help with this input">
					<table class="govuk-table">
						<thead class="govuk-table__head">
							<tr class="govuk-table__row">
								<th scope="col" class="govuk-table__header">Type</th>
								<th scope="col" class="govuk-table__header">Description</th>
								<th scope="col" class="govuk-table__header">Placement</th>
							</tr>
						</thead>
						<tbody class="govuk-table__body">
							<tr class="govuk-table__row">
								<td class="govuk-table__cell">Vertical</td>
								<td class="govuk-table__cell">Insulation placed upright along the slab edge to reduce heat loss at the wall junction.</td>
								<td class="govuk-table__cell">
									Between floor slab and external wall (vertical orientation).
								</td>
							</tr>
							<tr class="govuk-table__row">
								<td class="govuk-table__cell">Horizontal</td>
								<td class="govuk-table__cell">Insulation laid flat, extending inward from the edge of the slab to enhance perimeter insulation.</td>
								<td class="govuk-table__cell">
									Flat under floor slab, near the edge (horizontal orientation).
								</td>
							</tr>
						</tbody>
					</table>
				</GovDetails>
			</Formkit>
			<FormKit
				id="edgeInsulationWidth"
				type="govInputWithSuffix"
				suffix-text="m"
				label="Edge insulation width"
				help="Width not thickness"
				name="edgeInsulationWidth"
				validation="required | number | min:0 | max:100">
				<GovDetails summary-text="Help with this input">
					<table class="govuk-table">
						<thead class="govuk-table__head">
							<tr class="govuk-table__row">
								<th scope="col" class="govuk-table__header">Description</th>
								<th scope="col" class="govuk-table__header govuk-!-width-one-third">Example</th>
							</tr>
						</thead>
						<tbody class="govuk-table__body">
							<tr class="govuk-table__row">
								<td class="govuk-table__cell">A general term referring to the coverage distance of edge insulation - either vertical down the edge or horizontal into the floor. It does not refer to insulation board thickness.</td>
								<td class="govuk-table__cell">
									Vertical: 150 mm<br>
									Horizontal: 300 mm
								</td>
							</tr>
						</tbody>
					</table>
				</GovDetails>
			</FormKit>
			<FormKit
				id="edgeInsulationThermalResistance"
				type="govInputWithSuffix"
				suffix-text="(m²·K)/W"
				label="Edge insulation thermal resistance "
				name="edgeInsulationThermalResistance"
				validation="required"
			/>
		</template>

		<template v-if="model.typeOfGroundFloor === FloorType.Suspended_floor">
			<FormKit
				id="heightOfFloorUpperSurface"
				type="govInputWithSuffix"
				suffix-text="m"
				label="Height of the floor upper surface"
				help="Height of the floor upper surface, use an average value if it varies."
				name="heightOfFloorUpperSurface"
				validation="required | number | min:0 | max:100">
				<GovDetails summary-text="Help with this input">
					<table class="govuk-table">
						<thead class="govuk-table__head">
							<tr class="govuk-table__row">
								<th scope="col" class="govuk-table__header">Description</th>
								<th scope="col" class="govuk-table__header govuk-!-width-one-third">Example value</th>
							</tr>
						</thead>
						<tbody class="govuk-table__body">
							<tr class="govuk-table__row">
								<td class="govuk-table__cell">The height of the top surface of the ground floor above external ground level. This is used to determine thermal bridging and ventilation requirements.</td>
								<td class="govuk-table__cell">
									0.15 - 0.6 m
								</td>
							</tr>
						</tbody>
					</table>
				</GovDetails>
			</FormKit>
			<FormKit
				id="underfloorSpaceThermalResistance"
				type="govInputWithSuffix"
				suffix-text="(m²·K)/W"
				label="Thermal resistance of insulation on base of underfloor space"
				help="Thermal resistance of insulation on base of underfloor space."
				name="underfloorSpaceThermalResistance"
				validation="required | number">
				<GovDetails summary-text="Help with this input">
					<table class="govuk-table">
						<thead class="govuk-table__head">
							<tr class="govuk-table__row">
								<th scope="col" class="govuk-table__header">Description</th>
								<th scope="col" class="govuk-table__header govuk-!-width-one-third">Example value</th>
							</tr>
						</thead>
						<tbody class="govuk-table__body">
							<tr class="govuk-table__row">
								<td class="govuk-table__cell">The R-value (thermal resistance) of insulation installed at the base of any ventilated underfloor space.</td>
								<td class="govuk-table__cell">
									0.5 - 2.5 (m²·K)/W
								</td>
							</tr>
						</tbody>
					</table>
				</GovDetails>
			</FormKit>
			<FormKit
				id="thermalTransmittanceOfWallsAboveGround"
				type="govInputWithSuffix"
				suffix-text="W/(m²·K)"
				label="Thermal transmittance of walls above ground"
				help="in accordance with ISO 6946"
				name="thermalTransmittanceOfWallsAboveGround"
				validation="required | number">
				<GovDetails summary-text="Help with this input">
					<table class="govuk-table">
						<thead class="govuk-table__head">
							<tr class="govuk-table__row">
								<th scope="col" class="govuk-table__header">Description</th>
								<th scope="col" class="govuk-table__header govuk-!-width-one-third">Example value</th>
							</tr>
						</thead>
						<tbody class="govuk-table__body">
							<tr class="govuk-table__row">
								<td class="govuk-table__cell">The U-value of the external walls above ground level. A lower value indicates better insulation performance.</td>
								<td class="govuk-table__cell">
									0.13 - 0.25 W/(m²·K)
								</td>
							</tr>
						</tbody>
					</table>
				</GovDetails>
			</FormKit>
			<FormKit
				id="ventilationOpeningsArea"
				type="govInputWithSuffix"
				suffix-text="m²/m"
				label="Area of ventilation openings per perimeter"
				name="ventilationOpeningsArea"
				validation="required | number">
				<GovDetails summary-text="Help with this input">
					<table class="govuk-table">
						<thead class="govuk-table__head">
							<tr class="govuk-table__row">
								<th scope="col" class="govuk-table__header">Description</th>
								<th scope="col" class="govuk-table__header govuk-!-width-one-third">Example value</th>
							</tr>
						</thead>
						<tbody class="govuk-table__body">
							<tr class="govuk-table__row">
								<td class="govuk-table__cell">The total area of ventilation openings (e.g., air bricks) per metre of external wall perimeter. Important for moisture control in suspended timber floors. Measured in m² of opening per metre of wall.</td>
								<td class="govuk-table__cell">
									0.001 - 0.01 m²/m
								</td>
							</tr>
						</tbody>
					</table>
				</GovDetails>
			</FormKit>
			<FormKit
				id="windShieldingFactor"
				type="govRadios"
				:options="windShieldingFactorOptions"
				label="Wind shielding factor"
				name="windShieldingFactor"
				validation="required"
			/>
		</template>

		<template v-if="model.typeOfGroundFloor === FloorType.Heated_basement">
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
				suffix-text="(m²·K)/W"
				label="Thermal resistance of walls of basement"
				name="thermalResistanceOfBasementWalls"
				validation="required | number"
			/>
		</template>

		<template v-if="model.typeOfGroundFloor === FloorType.Unheated_basement">
			<FormKit
				id="thermalTransmittanceOfFloorAboveBasement"
				type="govInputWithSuffix"
				suffix-text="W/(m²·K)"
				label="Thermal transmittance of floor above basement"
				help="in accordance with ISO 6946"
				name="thermalTransmittanceOfFloorAboveBasement"
				validation="required | number"
			/>
			<FormKit
				id="thermalTransmittanceOfWallsAboveGround"
				type="govInputWithSuffix"
				suffix-text="W/(m²·K)"
				label="Thermal transmittance of walls above ground"
				name="thermalTransmittanceOfWallsAboveGround"
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