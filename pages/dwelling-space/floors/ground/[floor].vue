<script setup lang="ts">
import { Length, centimetre } from '~/utils/units/length';
import { FloorType, WindShieldLocation } from '~/schema/api-schema.types';

const title = "Ground floor";
const store = useEcaasStore();
const { saveToList } = useForm();

const floorData = useItemToEdit('floor', store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceGroundFloor.data);

// prepopulate edge insulation width when using old input format
if (floorData?.typeOfGroundFloor === FloorType.Slab_edge_insulation && typeof floorData.edgeInsulationWidth === 'number') {
	floorData.edgeInsulationWidth = new Length(floorData.edgeInsulationWidth, centimetre);
};

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
			{				
				floor = {
					...commonFields,
					typeOfGroundFloor: fields.typeOfGroundFloor,
					edgeInsulationType: fields.edgeInsulationType,
					edgeInsulationWidth: fields.edgeInsulationWidth,
					edgeInsulationThermalResistance: fields.edgeInsulationThermalResistance,
				};
				break;
			}
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

const withinMinAndMax = (node: FormKitNode, min: number, max: number) => {
	const value = node.value as Length;
	return value.amount >= min && value.amount <= max;
};

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
			help="Enter the total surface area of the entire building element in the dwelling"
			name="surfaceArea"
			validation="required | number | min:1"
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
		<FieldsArealHeatCapacity id="kappaValue" name="kappaValue"/>
		<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass"/>
		<FormKit
			id="perimeter"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Perimeter"
			help="Enter the length of the exposed perimeter of the floor"
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
			label="PSI value of E5 junction"
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
			id="typeOfGroundFloor"
			type="govRadios"
			:options="typeOfGroundFloorOptions"
			label="Type of ground floor "
			help="The type of ground floor affects the additional inputs needed"
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
				help="Select the type of edge insulation"
				validation="required">
				<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
					<table class="govuk-table">
						<thead class="govuk-table__head">
							<tr class="govuk-table__row">
								<th scope="col" class="govuk-table__header">Edge insulation type</th>
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
				name="edgeInsulationWidth"
				label="Edge insulation height or width"
				help="This is the coverage distance of edge insulation rather than the thickness of the insulation"
				type="govInputWithUnit"
				:unit="centimetre"
				:validation-rules="{ withinMinAndMax }"
				validation="required | withinMinAndMax:0,10000"
				:validation-messages="{
					withinMinAndMax: `Edge insulation width must be at least 0 and no more than 10,000 ${centimetre.name}.`,
				}"
			>
				<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
					<table class="govuk-table">
						<thead class="ovuk-table__head">
							<tr class="govuk-table__row">
								<th scope="col" class="govuk-table__header table-header-medium-width">Edge insulation type</th>
								<th scope="col" class="govuk-table__header">Description</th>
								<th scope="col" class="govuk-table__header">Typical width</th>
							</tr>
						</thead>
						<tbody>
							<tr class="govuk-table__row">
								<td class="govuk-table__cell">Vertical</td>
								<td class="govuk-table__cell">This is the height of the vertical edge insulation strips used around the perimeter of the floor.</td>
								<td class="govuk-table__cell">10 - 15cm</td>
							</tr>
							<tr class="govuk-table__row">
								<td class="govuk-table__cell">Horizontal</td>
								<td class="govuk-table__cell">This is the width or extension of the insulation from the edge of the slab.</td>
								<td class="govuk-table__cell">60 - 120cm</td>
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
				suffix-text="mm"
				label="Height of the floor upper surface"
				help="Enter the height of the top surface of the ground floor above the external ground level. Typically between 15mm and 60mm."
				name="heightOfFloorUpperSurface"
				validation="required | number | min:0 | max:100000"/>
			<FormKit
				id="underfloorSpaceThermalResistance"
				type="govInputWithSuffix"
				suffix-text="(m²·K)/W"
				label="Thermal resistance of insulation on base of underfloor space"
				help="Enter the thermal resistance or R-value of the insulation installed at the base of the underfloor space. Typically between 0.5 and 2.5 (m²·K)/W"
				name="underfloorSpaceThermalResistance"
				validation="required | number"/>
			<FormKit
				id="thermalTransmittanceOfWallsAboveGround"
				type="govInputWithSuffix"
				suffix-text="W/(m²·K)"
				label="Thermal transmittance of walls above ground"
				help="Enter the thermal transmittance (or U-value) of the external walls above ground level. Typically between 0.13 and 0.25 W(m²·K)"
				name="thermalTransmittanceOfWallsAboveGround"
				validation="required | number"/>
			<FormKit
				id="ventilationOpeningsArea"
				type="govInputWithSuffix"
				suffix-text="mm²/m"
				label="Area of ventilation openings per perimeter"
				help="Enter the total area of the ventilation openings per metre of external wall perimeter. Typically between 0.1 and 1 mm² of opening per metre of wall."
				name="ventilationOpeningsArea"
				validation="required | number">
				<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
					<p class="govuk-hint">Often suspended floors require additional ventilation to prevent moisture build up and structural damage. While ventilation is crucial for moisture control, it can lead to heat loss from the building.</p>
				</GovDetails>
			</FormKit>
			<FormKit
				id="windShieldingFactor"
				type="govRadios"
				:options="windShieldingFactorOptions"
				label="Wind shielding factor"
				name="windShieldingFactor"
				help="This refers to how much the external wind conditions impact the airflow and heat loss through the void beneath the suspended floor"
				validation="required">
				<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
					<table class="govuk-table">
						<thead class="ovuk-table__head">
							<tr class="govuk-table__row">
								<th scope="col" class="govuk-table__header table-header-medium-width">Level of wind shielding</th>
								<th scope="col" class="govuk-table__header">Description</th>
								<th scope="col" class="govuk-table__header">Examples</th>
							</tr>
						</thead>
						<tbody>
							<tr class="govuk-table__row">
								<td class="govuk-table__cell">Sheltered</td>
								<td class="govuk-table__cell">This applies to buildings in locations where the ground floor and its perimeter are significantly protected from direct wind exposure.</td>
								<td class="govuk-table__cell">
									<ul>
										<li>Dense urban areas with many tall buildings closely spaced.</li>
										<li>Buildings surrounded by the substantial windbreaks like mature trees, high walls, or other structures that significantly block airflow at ground level.</li>
										<li>Deeply recessed or courtyard-like areas where the suspended floor's perimeter is not directly exposed to prevailing winds.</li>
									</ul>
								</td>
							</tr>
							<tr class="govuk-table__row">
								<td class="govuk-table__cell">Average</td>
								<td class="govuk-table__cell">This represents a typical or moderate level of wind exposure for a building.</td>
								<td class="govuk-table__cell">
									<ul>
										<li>Suburban areas with detached or semi-detached houses, where there are some nearby buildings and vegetation, but not enough to create strong shielding.</li>
										<li>Buildings on the edge of urban areas where some protection is offered by the urban fabric, but still open to some prevailing winds.</li>
										<li>Areas with scattered obstructions that offer partial wind protection.</li>
									</ul>
								</td>
							</tr>
							<tr class="govuk-table__row">
								<td class="govuk-table__cell">Exposed</td>
								<td class="govuk-table__cell">This applies to buildings in highly exposed locations where the ground floor perimeter is directly subjected to strong winds.</td>
								<td class="govuk-table__cell">
									<ul>
										<li>Open countryside or rural areas with no significant windbreaks.</li>
										<li>Coastal areas or open plains.</li>
										<li>Buildings on hilltops or at the end of long, unobstructed roads where wind can funnel directly to the property.</li>
										<li>Isolated buildings without any nearby structures or dense vegetation.</li>
									</ul>
								</td>
							</tr>
						</tbody>
					</table>
				</GovDetails>
			</FormKit>
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
		<GovLLMWarning />
		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>

<style scoped lang="scss">
	.table-header-medium-width {
		width: 28%;
	}

	.govuk-table__cell ul {
		margin: 0;
	}
</style>
