<script setup lang="ts">
import { centimetre, metre, type Length } from "~/utils/units/length";
import { zodTypeAsFormKitValidation } from "#imports";
import type { SchemaWindShieldLocation } from "~/schema/aliases";
import { groundSurfaceAreaZod, groundTotalAreaZod, groundPerimeterZod, heightUpperSurfaceZod, thicknessOfWallsZod } from "~/stores/ecaasStore.schema";
import { getUrl, type GroundFloorData, uniqueName, unitValue } from "#imports";

const title = "Ground floor";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const groundFloorData = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceGroundFloor.data;
const index = getStoreIndex(groundFloorData);
const floorData = useItemToEdit("floor", groundFloorData);

// prepopulate edge insulation width/depth when using old input format (raw number stored in centimetres)
if (floorData?.data) {
	const data = floorData.data as Record<string, unknown>;
	if ("horizontalEdgeInsulationWidth" in data && typeof data.horizontalEdgeInsulationWidth === "number") {
		data.horizontalEdgeInsulationWidth = unitValue(data.horizontalEdgeInsulationWidth, centimetre);
	}
	if ("verticalEdgeInsulationDepth" in data && typeof data.verticalEdgeInsulationDepth === "number") {
		data.verticalEdgeInsulationDepth = unitValue(data.verticalEdgeInsulationDepth, centimetre);
	}
}

const model = ref(floorData?.data);

const includesInsulationType = (type: string) => {
	return (model.value as { edgeInsulationType?: string[] } | undefined)?.edgeInsulationType?.includes(type) ?? false;
};

// Removed heated and unheated basement options for summer
type ReducedGroundFloorOptions = "Slab_no_edge_insulation" | "Slab_edge_insulation" | "Suspended_floor";
const typeOfGroundFloorOptions: Record<ReducedGroundFloorOptions, SnakeToSentenceCase<ReducedGroundFloorOptions>> = {
	Slab_no_edge_insulation: "Slab no edge insulation",
	Slab_edge_insulation: "Slab edge insulation",
	Suspended_floor: "Suspended floor",
	// Heated_basement: 'Heated basement',
	// Unheated_basement: 'Unheated basement',
};

const windShieldingFactorOptions: Record<SchemaWindShieldLocation, SnakeToSentenceCase<SchemaWindShieldLocation>> = {
	Sheltered: "Sheltered",
	Average: "Average",
	Exposed: "Exposed",
};

const saveForm = (fields: GroundFloorData) => {
	store.$patch((state) => {
		const { dwellingSpaceFloors } = state.dwellingFabric;

		const commonFields = {
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
		};

		let floorData: GroundFloorData;

		switch (fields.typeOfGroundFloor) {
			case "Slab_edge_insulation":
			{
				if ("horizontalEdgeInsulationWidth" in fields && "verticalEdgeInsulationDepth" in fields) {
					floorData = {
						...commonFields,
						typeOfGroundFloor: "Slab_edge_insulation",
						edgeInsulationType: ["horizontal", "vertical"],
						horizontalEdgeInsulationWidth: fields.horizontalEdgeInsulationWidth,
						horizontalEdgeInsulationThermalResistance: fields.horizontalEdgeInsulationThermalResistance,
						verticalEdgeInsulationDepth: fields.verticalEdgeInsulationDepth,
						verticalEdgeInsulationThermalResistance: fields.verticalEdgeInsulationThermalResistance,
					};
				} else if ("horizontalEdgeInsulationWidth" in fields) {
					floorData = {
						...commonFields,
						typeOfGroundFloor: "Slab_edge_insulation",
						edgeInsulationType: ["horizontal"],
						horizontalEdgeInsulationWidth: fields.horizontalEdgeInsulationWidth,
						horizontalEdgeInsulationThermalResistance: fields.horizontalEdgeInsulationThermalResistance,
					};
				} else {
					floorData = {
						...commonFields,
						typeOfGroundFloor: "Slab_edge_insulation",
						edgeInsulationType: ["vertical"],
						verticalEdgeInsulationDepth: fields.verticalEdgeInsulationDepth,
						verticalEdgeInsulationThermalResistance: fields.verticalEdgeInsulationThermalResistance,
					};
				}
				break;
			}
			case "Slab_no_edge_insulation":
				floorData = {
					...commonFields,
					typeOfGroundFloor: fields.typeOfGroundFloor,
				};
				break;
			case "Suspended_floor":
				floorData = {
					...commonFields,
					typeOfGroundFloor: fields.typeOfGroundFloor,
					heightOfFloorUpperSurface: fields.heightOfFloorUpperSurface,
					underfloorSpaceThermalResistance: fields.underfloorSpaceThermalResistance,
					thermalTransmittanceOfWallsAboveGround: fields.thermalTransmittanceOfWallsAboveGround,
					ventilationOpeningsArea: fields.ventilationOpeningsArea,
					windShieldingFactor: fields.windShieldingFactor,
				};
				break;
			case "Heated_basement":
				floorData = {
					...commonFields,
					typeOfGroundFloor: fields.typeOfGroundFloor,
					depthOfBasementFloorBelowGround: fields.depthOfBasementFloorBelowGround,
					thermalResistanceOfBasementWalls: fields.thermalResistanceOfBasementWalls,
				};
				break;
			case "Unheated_basement":
				floorData = {
					...commonFields,
					typeOfGroundFloor: fields.typeOfGroundFloor,
					thermalTransmittanceOfFloorAboveBasement: fields.thermalTransmittanceOfFloorAboveBasement,
					thermalTransmittanceOfWallsAboveGround: fields.thermalTransmittanceOfWallsAboveGround,
					thermalResistanceOfBasementWalls: fields.thermalResistanceOfBasementWalls,
					depthOfBasementFloorBelowGround: fields.depthOfBasementFloorBelowGround,
					heightOfBasementWallsAboveGround: fields.heightOfBasementWallsAboveGround,
				};
				break;
			default:
				fields satisfies never;
				throw new Error(`Did not handle floor type '${ (fields as { typeOfGroundFloor: string }).typeOfGroundFloor }'`);

		}

		if (!dwellingSpaceFloors.dwellingSpaceGroundFloor) {
			dwellingSpaceFloors.dwellingSpaceGroundFloor = { data: [] };
		}
		
		dwellingSpaceFloors.dwellingSpaceGroundFloor.data[index] = { data: floorData, complete: true };
		dwellingSpaceFloors.dwellingSpaceGroundFloor.complete = false;
	});

	navigateTo("/dwelling-fabric/floors");
};

autoSaveElementForm<GroundFloorData>({
	model,
	storeData: store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceGroundFloor,
	defaultName: "Ground floor",
	onPatch: (state, newData, index) => {
		state.dwellingFabric.dwellingSpaceFloors.dwellingSpaceGroundFloor.data[index] = newData;
		state.dwellingFabric.dwellingSpaceFloors.dwellingSpaceGroundFloor.complete = false;
	},
});

const { handleInvalidSubmit, errorMessages } = useErrorSummary();

const greaterThanZero = (node: FormKitNode) => {
	const value = node.value as Length;
	return value.amount > 0;
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
			:validation-rules="{ uniqueName: uniqueName(groundFloorData, { index }) }"
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
			help="Enter the total area of the ground floor across the dwelling.  If the ground floor is made up of multiple floor types, this is the total area of all of the ground floor elements apart from basement walls."
			name="totalArea"
			:validation="zodTypeAsFormKitValidation(groundTotalAreaZod)"
			data-field="Zone.BuildingElement.*.area"
		/>
		<FieldsUValue id="uValue" name="uValue" help="Enter the U-value of the full thickness of the floor build-up, including the thermal resistance of the ground.  If the floor is suspended, this should include the effects of the void." />
		<FormKit
			id="thermalResistance"
			type="govInputWithSuffix"
			suffix-text="(m²·K)/W"
			label="Thermal resistance"
			help="Enter the thermal resistance of all layers in the floor construction only, not including surface resistances. For suspended floors, this should be calculated for the part of the floor construction above the void."
			name="thermalResistance"
			validation="required | number | min:0.00001 | max:50"
			data-field="Zone.BuildingElement.*.thermal_resistance_floor_construction">
			<GovDetails summary-text="Help with this input">
				<p class="govuk-hint">Thermal resistance is a property indicating a materials' opposition to heat flow. It is calculated as the thickness of the material divided by its thermal conductivity. Higher thermal resistance reduces heat transfer. The U-Value is the inverse of the total thermal resistance of a building element.</p>
			</GovDetails>
		</FormKit>
		<FieldsArealHeatCapacity id="arealHeatCapacity" name="arealHeatCapacity" help="This is the sum of the heat capacities of the full thickness of the floor build-up"/>
		<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass" help="This is the distribution of mass in the full thickness of the floor build up"/>
		<FormKit
			id="perimeter"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Perimeter"
			help="Enter the length of the exposed perimeter of the floor. This should include the perimeter to unconditioned spaces like garages, but not the perimeter to conditioned spaces such as adjacent heated dwellings."
			name="perimeter"
			:validation="zodTypeAsFormKitValidation(groundPerimeterZod)"
			data-field="Zone.BuildingElement.*.perimeter">
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
			data-field="Zone.BuildingElement.*.psi_wall_floor_junc"
		/>
		<FormKit
			id="thicknessOfWalls"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Thickness of walls at the edge of the floor"
			help="Enter the width or physical depth of the ground floor walls that are in contact with or directly relevant to the ground floor. Typically between 0.3m to 0.8m. If this value varies enter a weighted average."
			name="thicknessOfWalls"
			:validation="zodTypeAsFormKitValidation(thicknessOfWallsZod)"
			data-field="Zone.BuildingElement.*.thickness_walls">
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
			data-field="Zone.BuildingElement.*.floor_type"
		/>

		<template v-if="model?.typeOfGroundFloor === 'Slab_edge_insulation'">
			<FormKit
				id="edgeInsulationType"
				type="govCheckboxes"
				:options="{
					horizontal: 'Horizontal',
					vertical: 'Vertical',
				}"
				label="Types of edge insulation"
				name="edgeInsulationType"
				help="Select all the types of edge insulation that apply to this floor"
				validation="required"
				data-field="Zone.BuildingElement.*.edge_insulation.*.type">
				<GovDetails summary-text="Help with this input">
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
			<template v-if="includesInsulationType('horizontal')">
				<FormKit
					id="horizontalEdgeInsulationWidth"
					name="horizontalEdgeInsulationWidth"
					label="Width of horizontal edge insulation"
					help="This is the coverage distance of horizontal edge insulation rather than the thickness of the insulation"
					type="govInputWithUnit"
					:unit="metre"
					:validation-rules="{ exclusiveRangeFromMin: greaterThanZero }"
					validation="required | exclusiveRangeFromMin:0"
					:validation-messages="{
						exclusiveRangeFromMin: `Horizontal edge insulation width must be greater than 0 ${metre.name}.`,
					}"
					data-field="Zone.BuildingElement.*.edge_insulation.*.width"
				/>
				<FormKit
					id="horizontalEdgeInsulationThermalResistance"
					type="govInputWithSuffix"
					suffix-text="(m²·K)/W"
					label="Thermal resistance of horizontal edge insulation"
					name="horizontalEdgeInsulationThermalResistance"
					validation="required"
					data-field="Zone.BuildingElement.*.edge_insulation.*.edge_thermal_resistance"
				/>
			</template>
			<template v-if="includesInsulationType('vertical')">
				<FormKit
					id="verticalEdgeInsulationDepth"
					name="verticalEdgeInsulationDepth"
					label="Depth of vertical edge insulation"
					help="This is the coverage distance of vertical edge insulation rather than the thickness of the insulation"
					type="govInputWithUnit"
					:unit="metre"
					:validation-rules="{ exclusiveRangeFromMin: greaterThanZero }"
					validation="required | exclusiveRangeFromMin"
					:validation-messages="{
						exclusiveRangeFromMin: `Vertical edge insulation depth must be greater than 0 ${metre.name}.`,
					}"
					data-field="Zone.BuildingElement.*.edge_insulation.*.depth"
				/>
				<FormKit
					id="verticalEdgeInsulationThermalResistance"
					type="govInputWithSuffix"
					suffix-text="(m²·K)/W"
					label="Thermal resistance of vertical edge insulation"
					name="verticalEdgeInsulationThermalResistance"
					validation="required"
					data-field="Zone.BuildingElement.*.edge_insulation.*.edge_thermal_resistance"
				/>
			</template>
		</template>

		<template v-if="model?.typeOfGroundFloor === 'Suspended_floor'">
			<FormKit
				id="heightOfFloorUpperSurface"
				type="govInputWithSuffix"
				suffix-text="m"
				label="Height of the floor upper surface"
				help="Enter the height of the top surface of the ground floor above the external ground level. Typically between 0.015m and 0.06m."
				name="heightOfFloorUpperSurface"
				:validation="zodTypeAsFormKitValidation(heightUpperSurfaceZod)"
				data-field="Zone.BuildingElement.*.height_upper_surface"/>
			<FormKit
				id="underfloorSpaceThermalResistance"
				type="govInputWithSuffix"
				suffix-text="(m²·K)/W"
				label="Thermal resistance of insulation on base of underfloor space"
				help="Enter the thermal resistance or R-value of the insulation installed at the base of the underfloor space. Typically between 0.5 and 2.5 (m²·K)/W"
				name="underfloorSpaceThermalResistance"
				validation="required | number"
				data-field="Zone.BuildingElement.*.thermal_resist_insul"
			>
				<GovDetails summary-text="Help with this input"><p class="govuk-body">The thermal resistance of the insulation layer should be calculated for the part of the floor construction below the void, excluding the effect of surface resistances.</p></GovDetails>
			</FormKit>
			<FormKit
				id="thermalTransmittanceOfWallsAboveGround"
				type="govInputWithSuffix"
				suffix-text="W(m²/K)"
				label="Thermal transmittance of walls above ground"
				help="Enter the thermal transmittance (or U-value) of the external walls above ground level. Typically between 0.13 and 0.25 W(m²/K)"
				name="thermalTransmittanceOfWallsAboveGround"
				validation="required | number"
				data-field="Zone.BuildingElement.*.thermal_transm_walls"/>
			<FormKit
				id="ventilationOpeningsArea"
				type="govInputWithSuffix"
				suffix-text="mm²/m"
				label="Area of ventilation openings per perimeter"
				help="Enter the total area of the ventilation openings per metre of external wall perimeter. This needs to be above 1500mm² of opening per metre of wall."
				name="ventilationOpeningsArea"
				validation="required | number">
				<GovDetails summary-text="Help with this input">
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
				validation="required"
				data-field="Zone.BuildingElement.*.shield_fact_location">
				<GovDetails summary-text="Help with this input">
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

		<template v-if="model?.typeOfGroundFloor === 'Heated_basement'">
			<FormKit
				id="depthOfBasementFloorBelowGround"
				type="govInputWithSuffix"
				suffix-text="m"
				label="Depth of basement floor below ground level"
				name="depthOfBasementFloorBelowGround"
				validation="required | number"
				data-field="Zone.BuildingElement.*.depth_basement_floor"
			/>
			<FormKit
				id="thermalResistanceOfBasementWalls"
				type="govInputWithSuffix"
				suffix-text="(m²·K)/W"
				label="Thermal resistance of walls of basement"
				name="thermalResistanceOfBasementWalls"
				validation="required | number"
				data-field="Zone.BuildingElement.*.thermal_resist_walls_base"
			/>
		</template>

		<template v-if="model?.typeOfGroundFloor === 'Unheated_basement'">
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
				id="thermalResistanceOfBasementWalls"
				type="govInputWithSuffix"
				suffix-text="(m²·K)/W"
				label="Thermal resistance of walls of basement"
				name="thermalResistanceOfBasementWalls"
				validation="required | number"
			/>
			<FormKit
				id="depthOfBasementFloorBelowGround"
				type="govInputWithSuffix"
				suffix-text="m"
				label="Depth of basement floor below ground level"
				name="depthOfBasementFloorBelowGround"
				validation="required | number"
				data-field="Zone.BuildingElement.*.depth_basement_floor"
			/>
			<FormKit
				id="heightOfBasementWallsAboveGround"
				type="govInputWithSuffix"
				suffix-text="m"
				label="Height of the basement walls above ground level"
				name="heightOfBasementWallsAboveGround"
				validation="required | number"
				data-field="Zone.BuildingElement.*.height_basement_walls"
			/>
		</template>
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('dwellingSpaceFloors')" test-id="saveProgress" secondary>Save progress</GovButton>
		</div>
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
