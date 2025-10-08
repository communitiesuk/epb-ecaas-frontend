<script setup lang="ts">
import type { SummarySection } from "~/common.types";
import { getUrl, getTabItems, type ArealHeatCapacityValue } from "#imports";
import { FloorType } from "~/schema/api-schema.types";
import { emptyValueRendering } from "#imports";

const title = "Dwelling fabric summary";
const store = useEcaasStore();

function calculateFrameToOpeningRatio(openingToFrameRatio: number): number {
	// note - use parseFloat and toFixed to avoid JS precision issues
	return parseFloat((1 - openingToFrameRatio).toFixed(10));
}

const zoneParametersData = store.dwellingFabric.dwellingSpaceZoneParameters.data;

const zoneParametersSummary: SummarySection = {
	id: "dwellingSpaceZoneParameters",
	label: "Zone parameters",
	data: {
		"Area": dim(zoneParametersData.area, "metres square"),
		"Volume": dim(zoneParametersData.volume, "cubic metres"),
		// "Heat emitting system for this zone": zoneParametersData.spaceHeatingSystemForThisZone,
		// "Heating control type": zoneParametersData.heatingControlType
	},
	editUrl: getUrl("dwellingSpaceZoneParameters"),
};

const lightingData = store.dwellingFabric.dwellingSpaceLighting.data;

const lightingSummary: SummarySection = {
	id: "dwellingSpaceLighting",
	label: "Lighting",
	data: {
		"Number of LED bulbs": show(lightingData.numberOfLEDBulbs),
		"Number of incandescent bulbs": show(lightingData.numberOfIncandescentBulbs),
	},
	editUrl: getUrl("dwellingSpaceLighting"),
};

const groundFloorData = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceGroundFloor.data;
const internalFloorData = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor?.data;
const exposedFloorData = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceExposedFloor?.data;

const groundFloorSummary: SummarySection = {
	id: "dwellingSpaceGroundFloors",
	label: "Ground floor",
	data: groundFloorData.map( ({ data: x }) => {
		const isSlabEdgeInsulation = x.typeOfGroundFloor === FloorType.Slab_edge_insulation;
		const edgeInsulationType =  "edgeInsulationType" in x ? (displayCamelToSentenceCase(show(x.edgeInsulationType))) : emptyValueRendering;
		const edgeInsulationWidth = "edgeInsulationWidth" in x ? dim(x.edgeInsulationWidth) : emptyValueRendering;
		const edgeInsulationThermalResistance = "edgeInsulationThermalResistance" in x ? dim(x.edgeInsulationThermalResistance, "square metre kelvin per watt") : emptyValueRendering;

		const isSuspendedFloor = x.typeOfGroundFloor === FloorType.Suspended_floor;
		const heightOfFloorUpperSurface = "heightOfFloorUpperSurface" in x ? dim(x.heightOfFloorUpperSurface, "millimetres") : emptyValueRendering;
		const underfloorSpaceThermalResistance = "underfloorSpaceThermalResistance" in x ? dim(x.underfloorSpaceThermalResistance, "square metre kelvin per watt") : emptyValueRendering;
		const thermalTransmittanceOfWallsAboveGround = "thermalTransmittanceOfWallsAboveGround" in x ? dim(x.thermalTransmittanceOfWallsAboveGround, "watts per square metre kelvin") : emptyValueRendering;
		const ventilationOpeningsArea = "ventilationOpeningsArea" in x ? dim(x.ventilationOpeningsArea, "millimetres square per metre") : emptyValueRendering;
		const windShieldingFactor = "windShieldingFactor" in x ? show(x.windShieldingFactor) : emptyValueRendering;

		return {
			"Name": show(x.name),
			"Gross surface area of the floor": dim(x.surfaceArea, "metres square"),
			"Pitch": dim(x.pitch, "degrees"),
			"U-value": dim(x.uValue, "watts per square metre kelvin"),
			"Thermal resistance": dim(x.thermalResistance, "square metre kelvin per watt"),
			"Areal heat capacity": displayArealHeatCapacity(x.kappaValue as ArealHeatCapacityValue),
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
			"Perimeter": dim(x.perimeter, "metres"),
			"Psi of wall junction": dim(x.psiOfWallJunction, "watts per metre kelvin"),
			"Thickness of walls at the edge of the floor": dim(x.thicknessOfWalls, "millimetres"),
			"Type of ground floor": displaySnakeToSentenceCase(show(x.typeOfGroundFloor)),
			"Edge insulation type": isSlabEdgeInsulation ? edgeInsulationType : undefined,
			"Edge insulation width": isSlabEdgeInsulation ? edgeInsulationWidth : undefined,
			"Edge insulation thermal resistance": isSlabEdgeInsulation ? edgeInsulationThermalResistance : undefined,
			"Height of the floor upper surface": isSuspendedFloor ? heightOfFloorUpperSurface : undefined,
			"Thermal resistance of insulation on base of underfloor space": isSuspendedFloor ? underfloorSpaceThermalResistance : undefined,
			"Thermal transmittance of walls above ground": isSuspendedFloor ? thermalTransmittanceOfWallsAboveGround : undefined,
			"Area of ventilation openings per perimeter": isSuspendedFloor ? ventilationOpeningsArea : undefined,
			"Wind shielding factor": isSuspendedFloor ? windShieldingFactor : undefined,
		};
	}),
	editUrl: getUrl("dwellingSpaceFloors"),
};

const internalFloorSummary: SummarySection = {
	id: "dwellingSpaceInternalFloors",
	label: "Internal floor",
	data: internalFloorData?.map(({ data: x }) => {
		const isInternalFloorToUnheatedSpace = x.typeOfInternalFloor === AdjacentSpaceType.unheatedSpace;
		const thermalResistanceOfAdjacentUnheatedSpace = "thermalResistanceOfAdjacentUnheatedSpace" in x ? dim(x.thermalResistanceOfAdjacentUnheatedSpace, "square metre kelvin per watt") : emptyValueRendering;

		return {
			"Type of internal floor": displayAdjacentSpaceType(x.typeOfInternalFloor, "Internal floor"),
			"Name": show(x.name),
			"Gross surface area of the floor": dim(x.surfaceAreaOfElement, "metres square"),
			"Areal heat capacity": displayArealHeatCapacity(x.kappaValue as ArealHeatCapacityValue),
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
			"Thermal resistance of adjacent unheated space": isInternalFloorToUnheatedSpace ? thermalResistanceOfAdjacentUnheatedSpace : undefined,
		};
	}) || [],
	editUrl: getUrl("dwellingSpaceFloors"),
};

const exposedFloorSummary: SummarySection = {
	id: "dwellingSpaceExposedFloors",
	label: "Exposed floor",
	data: exposedFloorData?.map(({ data: x }) => {
		return {
			"Name": show(x.name),
			"Length": dim(x.length, "metres"),
			"Width": dim(x.width, "metres"),
			"Elevational height of building element at its base": dim(x.elevationalHeight, "metres"),
			"Gross surface area of the floor": dim(x.surfaceArea, "metres square"),
			"Solar absorption coefficient": dim(x.solarAbsorption),
			"U-value": dim(x.uValue, "watts per square metre kelvin"),
			"Areal heat capacity": displayArealHeatCapacity(x.kappaValue as ArealHeatCapacityValue),
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
		};
	}) || [],
	editUrl: getUrl("dwellingSpaceFloors"),
};

const floorSummarySections: SummarySection[] = [
	groundFloorSummary,
	internalFloorSummary,
	exposedFloorSummary,
];

const externalWallData = store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceExternalWall?.data;
const internalWallData = store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceInternalWall?.data;
const wallToUnheatedSpaceData = store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceWallToUnheatedSpace?.data;
const partyWallData = store.dwellingFabric.dwellingSpaceWalls.dwellingSpacePartyWall?.data;

const externalWallSummary: SummarySection = {
	id: "dwellingSpaceExternalWalls",
	label: "External wall",
	data: externalWallData?.map(({ data: x }) => {
		return {
			"Name": show(x.name),
			"Pitch": dim(x.pitch, "degrees"),
			"Orientation": dim(x.orientation, "degrees"),
			"Height": dim(x.height, "metres"),
			"Length": dim(x.length, "metres"),
			"Elevational height of building element at its base": dim(x.elevationalHeight, "metres"),
			"Gross surface area": dim(x.surfaceArea, "metres square"),
			"Solar absorption coefficient": dim(x.solarAbsorption),
			"U-value": dim(x.uValue, "watts per square metre kelvin"),
			"Areal heat capacity": displayArealHeatCapacity(x.kappaValue as ArealHeatCapacityValue),
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
		};
	}) || [],
	editUrl: getUrl("dwellingSpaceWalls"),
};

const internalWallSummary: SummarySection = {
	id: "dwellingSpaceInternalWalls",
	label: "Internal wall",
	data: internalWallData?.map(({ data: x }) => {
		return {
			"Name": show(x.name),
			"Pitch": dim(x.pitch, "degrees"),
			"Gross surface area": dim(x.surfaceAreaOfElement, "metres square"),
			"Areal heat capacity": displayArealHeatCapacity(x.kappaValue as ArealHeatCapacityValue),
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
		};
	}) || [],
	editUrl: getUrl("dwellingSpaceWalls"),
};

const wallToUnheatedSpaceSummary: SummarySection = {
	id: "dwellingSpaceUnheatedSpaceWalls",
	label: "Wall to unheated space",
	data: wallToUnheatedSpaceData?.map(({ data: x }) => {
		return {
			"Name": show(x.name),
			"Pitch": dim(x.pitch, "degrees"),
			"Gross surface area": dim(x.surfaceAreaOfElement, "metres square"),
			"U-value": dim(x.uValue, "watts per square metre kelvin"),
			"Areal heat capacity": displayArealHeatCapacity(x.arealHeatCapacity as ArealHeatCapacityValue),
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
			"Thermal resistance of adjacent unheated space": dim(x.thermalResistanceOfAdjacentUnheatedSpace, "square metre kelvin per watt"),
		};
	}) || [],
	editUrl: getUrl("dwellingSpaceWalls"),
};

const partyWallSummary: SummarySection = {
	id: "dwellingSpacePartyWalls",
	label: "Party wall",
	data: partyWallData?.map(({ data: x }) => {
		return {
			"Name": show(x.name),
			"Pitch": dim(x.pitch, "degrees"),
			"Gross surface area": dim(x.surfaceArea, "metres square"),
			"U-value": dim(x.uValue, "watts per square metre kelvin"),
			"Areal heat capacity": displayArealHeatCapacity(x.kappaValue as ArealHeatCapacityValue),
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
		};
	}) || [],
	editUrl: getUrl("dwellingSpaceWalls"),
};

const wallSummarySections: SummarySection[] = [
	externalWallSummary,
	internalWallSummary,
	wallToUnheatedSpaceSummary,
	partyWallSummary,
];

const ceilingData = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings.data;
const roofData = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs.data;

const ceilingSummary: SummarySection = {
	id: "dwellingSpaceCeilings",
	label: "Ceiling",
	data: ceilingData.map(({ data: x }) => {
		const isCeilingToUnheatedSpace = x.type === AdjacentSpaceType.unheatedSpace;
		const uValue = "uValue" in x ? dim(x.uValue, "watts per square metre kelvin") : emptyValueRendering;
		const thermalResistanceOfAdjacentUnheatedSpace = "thermalResistanceOfAdjacentUnheatedSpace" in x ? dim(x.thermalResistanceOfAdjacentUnheatedSpace, "square metre kelvin per watt") : emptyValueRendering;

		return {
			"Type of ceiling": displayAdjacentSpaceType(x.type, "Ceiling"),
			"Name": show(x.name),
			"Pitch": dim(x.pitch, "degrees"),
			"Gross surface area": dim(x.surfaceArea, "metres square"),
			"U-value": isCeilingToUnheatedSpace ? uValue : undefined,
			"Areal heat capacity": displayArealHeatCapacity(x.kappaValue as ArealHeatCapacityValue),
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
			"Thermal resistance of adjacent unheated space": isCeilingToUnheatedSpace ? thermalResistanceOfAdjacentUnheatedSpace : undefined,
		};
	}),
	editUrl: getUrl("dwellingSpaceCeilingsAndRoofs"),
};

const roofSummary: SummarySection = {
	id: "dwellingSpaceRoofs",
	label: "Roof",
	data: roofData.filter(x => !!x.data).map(({ data: x }) => {
		const isTypeOfRoofSelected = x.typeOfRoof != undefined; 
		const isPitchedRoof = x.typeOfRoof === "pitchedInsulatedAtRoof" || x.typeOfRoof === "pitchedInsulatedAtCeiling";
		
		const pitch = dim(x.pitch, "degrees");
		const orientation = x.orientation !== undefined ? dim(x.orientation, "degrees") : emptyValueRendering;
		const uValue = dim(x.uValue, "watts per square metre kelvin");
		const arealHeatCapacity = displayArealHeatCapacity(x.kappaValue as ArealHeatCapacityValue);
		const massDistributionClass = displayMassDistributionClass(x.massDistributionClass);

		return {
			"Name": show(x.name),
			"Type of roof": displayCamelToSentenceCase(show(x.typeOfRoof)),
			"Pitch": isTypeOfRoofSelected ? pitch : undefined,
			"Orientation": isPitchedRoof ? orientation : undefined,
			"Length": dim(x.length, "metres"),
			"Width": dim(x.width, "metres"),
			"Elevational height of building element at its base": dim(x.elevationalHeightOfElement, "metres"),
			"Gross surface area of ceiling": dim(x.surfaceArea, "metres square"),
			"Solar absorption coefficient": dim(x.solarAbsorptionCoefficient),
			"U-value": isTypeOfRoofSelected ? uValue : undefined,
			"Areal heat capacity": isTypeOfRoofSelected ? arealHeatCapacity : undefined,
			"Mass distribution class": isTypeOfRoofSelected ? massDistributionClass : undefined,
		};
	}),
	editUrl: getUrl("dwellingSpaceCeilingsAndRoofs"),
};

const ceilingAndRoofSummarySections: SummarySection[] = [
	ceilingSummary,
	roofSummary,
];

const unglazedDoorData = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor.data;
const glazedDoorData = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor.data;
const internalDoorData = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceInternalDoor.data;

const { dwellingSpaceExternalWall } = store.dwellingFabric.dwellingSpaceWalls;
const { dwellingSpaceRoofs } = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;


const unglazedDoorSummary: SummarySection = {
	id: "dwellingSpaceUnglazedDoors",
	label: "External unglazed door",
	data: unglazedDoorData.map(({ data: x }) => {
		const taggedItem = store.getTaggedItem([dwellingSpaceExternalWall, dwellingSpaceRoofs], x.associatedWallRoofCeilingId);

		return {
			"Name": show(x.name),
			"Pitch": taggedItem && taggedItem?.pitch !== undefined ? dim(taggedItem.pitch, "degrees") : emptyValueRendering,
			"Orientation": taggedItem && taggedItem?.orientation !== undefined ? dim(taggedItem.orientation, "degrees") : emptyValueRendering,
			"Height": dim(x.height, "metres"),
			"Width": dim(x.width, "metres"),
			"Elevational height of building element at its base": dim(x.elevationalHeight, "metres"),
			"Net surface area": dim(x.surfaceArea, "metres square"),
			"Solar absorption coefficient": dim(x.solarAbsorption),
			"U-value": dim(x.uValue, "watts per square metre kelvin"),
			"Areal heat capacity": displayArealHeatCapacity(x.kappaValue as ArealHeatCapacityValue | undefined),
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
		};
	}),
	editUrl: getUrl("dwellingSpaceDoors"),
};

const glazedDoorSummary: SummarySection = {
	id: "dwellingSpaceGlazedDoors",
	label: "External glazed door",
	data: glazedDoorData.map(({ data: x }) => {
		const taggedItem = store.getTaggedItem([dwellingSpaceExternalWall, dwellingSpaceRoofs], x.associatedWallRoofCeilingId);

		return {
			"Name": show(x.name),
			"Pitch": taggedItem && taggedItem?.pitch !== undefined ? dim(taggedItem.pitch, "degrees") : emptyValueRendering,
			"Orientation": taggedItem && taggedItem?.orientation !== undefined ? dim(taggedItem.orientation, "degrees") : emptyValueRendering,
			"Height": dim(x.height, "metres"),
			"Width": dim(x.width, "metres"),
			"Elevational height of building element at its base": dim(x.elevationalHeight, "metres"),
			"Net surface area": dim(x.surfaceArea, "metres square"),
			"U-value": dim(x.uValue, "watts per square metre kelvin"),
			"Transmittance of solar energy": dim(x.solarTransmittance),
			"Mid height": dim(x.midHeight, "metres"),
			"Opening to frame ratio": dim(x.openingToFrameRatio),
		};
	}),
	editUrl: getUrl("dwellingSpaceDoors"),
};

const { dwellingSpaceInternalWall } = store.dwellingFabric.dwellingSpaceWalls;
const { dwellingSpaceCeilings } = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;

const internalDoorSummary: SummarySection = {
	id: "dwellingSpaceInternalDoors",
	label: "Internal door",
	data: internalDoorData?.map(({ data: x }) => {
		const taggedItem = store.getTaggedItem([dwellingSpaceInternalWall, dwellingSpaceCeilings], x.associatedHeatedSpaceElementId);

		const isInternalDoorToUnheatedSpace = x.typeOfInternalDoor === AdjacentSpaceType.unheatedSpace;
		const uValue = "uValue" in x ? dim(x.uValue, "watts per square metre kelvin") : emptyValueRendering;
		const thermalResistanceOfAdjacentUnheatedSpace = "thermalResistanceOfAdjacentUnheatedSpace" in x ? dim(x.thermalResistanceOfAdjacentUnheatedSpace, "square metre kelvin per watt") : emptyValueRendering;

		return {
			"Type": displayAdjacentSpaceType(x.typeOfInternalDoor, "Internal door"),
			"Name": show(x.name),
			"Pitch": taggedItem && taggedItem?.pitch !== undefined ? dim(taggedItem.pitch, "degrees") : emptyValueRendering,
			"Net surface area of element": dim(x.surfaceArea, "metres square"),
			"U-value": isInternalDoorToUnheatedSpace ? uValue : undefined,
			"Areal heat capacity": displayArealHeatCapacity(x.kappaValue as ArealHeatCapacityValue),
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
			"Thermal resistance of adjacent unheated space": isInternalDoorToUnheatedSpace ? thermalResistanceOfAdjacentUnheatedSpace : undefined,
		};
	}) || [],
	editUrl: getUrl("dwellingSpaceDoors"),
};

const doorSummarySections: SummarySection[] = [
	unglazedDoorSummary,
	glazedDoorSummary,
	internalDoorSummary,
];

const windowData = store.dwellingFabric.dwellingSpaceWindows.data;

const windowSummary: SummarySection = {
	id: "dwellingSpaceWindows",
	label: "Windows",
	data: windowData.map( ({ data: x }) => {

		const taggedItem = store.getTaggedItem([dwellingSpaceExternalWall, dwellingSpaceRoofs, dwellingSpaceCeilings], x.taggedItem);

		const numberOfOpenableParts =  parseInt(x.numberOpenableParts ?? "0");

		const heightOpenableArea = "heightOpenableArea" in x ? dim(x.heightOpenableArea, "metres") : emptyValueRendering;
		const maximumOpenableArea = "maximumOpenableArea" in x ? dim(x.maximumOpenableArea, "metres square") : emptyValueRendering;
		const midHeightOpenablePart1 = "midHeightOpenablePart1" in x ? dim(x.midHeightOpenablePart1, "metres") : emptyValueRendering;
		const midHeightOpenablePart2 = "midHeightOpenablePart2" in x ? dim(x.midHeightOpenablePart2, "metres") : emptyValueRendering;
		const midHeightOpenablePart3 = "midHeightOpenablePart3" in x ? dim(x.midHeightOpenablePart3, "metres") : emptyValueRendering;
		const midHeightOpenablePart4 = "midHeightOpenablePart4" in x ? dim(x.midHeightOpenablePart4, "metres") : emptyValueRendering;

		const treatmentType = "treatmentType" in x ? displayCamelToSentenceCase(show(x.treatmentType)) : emptyValueRendering;
		const curtainsControlObject = "curtainsControlObject" in x ? displaySnakeToSentenceCase(x.curtainsControlObject!) : emptyValueRendering;
		const thermalResistivityIncrease = "thermalResistivityIncrease" in x ? dim(x.thermalResistivityIncrease, "watts per square metre kelvin") : emptyValueRendering;
		const solarTransmittanceReduction = "solarTransmittanceReduction" in x ? show(x.solarTransmittanceReduction) : emptyValueRendering;

		return {
			"Name": show(x.name),
			"Pitch": taggedItem && taggedItem?.pitch !== undefined ? dim(taggedItem.pitch, "degrees") : emptyValueRendering,
			"Orientation": taggedItem && taggedItem?.orientation !== undefined ? dim(taggedItem.orientation, "degrees") : emptyValueRendering,
			"Height": dim(x.height, "metres"),
			"Width": dim(x.width, "metres"),
			"Elevational height of building element at its base": dim(x.elevationalHeight, "metres"),
			"Net surface area": dim(x.surfaceArea, "metres square"),
			"U-value": dim(x.uValue, "watts per square metre kelvin"),
			"Transmittance of solar energy": show(x.solarTransmittance),
			"Mid height": dim(x.midHeight, "metres"),
			"Frame to opening ratio": show(x.openingToFrameRatio && calculateFrameToOpeningRatio(x.openingToFrameRatio)),
			"Number of openable parts": show(x.numberOpenableParts),
			"Height of the openable area": numberOfOpenableParts >= 1 ? heightOpenableArea : undefined,
			"Maximum openable area": numberOfOpenableParts >= 1 ? maximumOpenableArea : undefined,
			"Mid height of the air flow path for openable part 1": numberOfOpenableParts >= 1 ? midHeightOpenablePart1 : undefined,
			"Mid height of the air flow path for openable part 2": numberOfOpenableParts >= 2 ? midHeightOpenablePart2 : undefined,
			"Mid height of the air flow path for openable part 3": numberOfOpenableParts >= 3 ? midHeightOpenablePart3 : undefined,
			"Mid height of the air flow path for openable part 4": numberOfOpenableParts == 4 ? midHeightOpenablePart4 : undefined,
			"Overhang depth": dim(x.overhangDepth),
			"Overhang distance from glass": dim(x.overhangDistance),
			"Side fin right depth": dim(x.sideFinRightDepth),
			"Side fin right distance from glass": dim(x.sideFinRightDistance),
			"Side fin left depth": dim(x.sideFinLeftDepth),
			"Side fin left distance from glass": dim(x.sideFinLeftDistance),
			"Type": x.curtainsOrBlinds ? treatmentType : undefined,
			"Curtains control object reference": "treatmentType" in x && x.treatmentType === "curtains" ? curtainsControlObject : undefined,
			"Thermal resistivity increase": x.curtainsOrBlinds ? thermalResistivityIncrease : undefined,
			"Solar transmittance reduction": x.curtainsOrBlinds ? solarTransmittanceReduction : undefined,
		};
	}) || [],
	editUrl: getUrl("dwellingSpaceWindows"),
};

const linearThermalBridgesData = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges.data;
const pointThermalBridgesData = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpacePointThermalBridges.data;

const linearThermalBridgesSummary: SummarySection = {
	id: "dwellingSpaceLinearThermalBridging",
	label: "Linear thermal bridges",
	data: linearThermalBridgesData.map(({ data: x }) => {
		return {
			"Type of thermal bridge": displayCamelToSentenceCase(show(x.typeOfThermalBridge)),
			"Linear thermal transmittance": dim(x.linearThermalTransmittance, "watts per metre kelvin"),
			"Length of thermal bridge": dim(x.length, "metres"),
		};
	}),
	editUrl: getUrl("dwellingSpaceThermalBridging"),
};

const pointThermalBridgesSummary: SummarySection = {
	id: "dwellingSpacePointThermalBridging",
	label: "Point thermal bridges",
	data: pointThermalBridgesData.map(({ data: x }) => {
		return {
			"Name": show(x.name),
			"Heat transfer coefficient": dim(x.heatTransferCoefficient, "watts per kelvin"),
		};
	}),
	editUrl: getUrl("dwellingSpaceThermalBridging"),
};

const thermalBridgeSummarySections: SummarySection[] = [
	linearThermalBridgesSummary,
	pointThermalBridgesSummary,
];

</script>

<template>

	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovTabs v-slot="tabProps" :items="getTabItems([zoneParametersSummary])">
		<SummaryTab :summary="zoneParametersSummary" :selected="tabProps.currentTab === 0" />
	</GovTabs>

	<GovTabs v-slot="tabProps" :items="getTabItems([lightingSummary])">
		<SummaryTab :summary="lightingSummary" :selected="tabProps.currentTab === 0" />
	</GovTabs>

	<GovTabs v-slot="tabProps" :items="getTabItems(floorSummarySections)">
		<SummaryTab :summary="groundFloorSummary" :selected="tabProps.currentTab === 0">
			<template #empty>
				<h2 class="govuk-heading-m">No ground floors added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('dwellingSpaceGroundFloorCreate')">
					Add ground floors
				</NuxtLink>
			</template>
		</SummaryTab>

		<SummaryTab :summary="internalFloorSummary" :selected="tabProps.currentTab === 1">
			<template #empty>
				<h2 class="govuk-heading-m">No internal floors added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('dwellingSpaceInternalFloorCreate')">
					Add internal floors
				</NuxtLink>
			</template>
		</SummaryTab>

		<SummaryTab :summary="exposedFloorSummary" :selected="tabProps.currentTab === 2">
			<template #empty>
				<h2 class="govuk-heading-m">No exposed floors added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('dwellingSpaceExposedFloorCreate')">
					Add exposed floors
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>

	<GovTabs v-slot="tabProps" :items="getTabItems(wallSummarySections)">
		<SummaryTab :summary="externalWallSummary" :selected="tabProps.currentTab === 0">
			<template #empty>
				<h2 class="govuk-heading-m">No external walls added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('dwellingSpaceExternalWallCreate')">
					Add external walls
				</NuxtLink>
			</template>
		</SummaryTab>

		<SummaryTab :summary="internalWallSummary" :selected="tabProps.currentTab === 1">
			<template #empty>
				<h2 class="govuk-heading-m">No internal walls added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('dwellingSpaceInternalWallCreate')">
					Add internal walls
				</NuxtLink>
			</template>
		</SummaryTab>

		<SummaryTab :summary="wallToUnheatedSpaceSummary" :selected="tabProps.currentTab === 2">
			<template #empty>
				<h2 class="govuk-heading-m">No walls to unheated spaces added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('dwellingSpaceWallToUnheatedSpaceCreate')">
					Add walls to unheated spaces
				</NuxtLink>
			</template>
		</SummaryTab>

		<SummaryTab :summary="partyWallSummary" :selected="tabProps.currentTab === 3">
			<template #empty>
				<h2 class="govuk-heading-m">No party walls added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('dwellingSpacePartyWallCreate')">
					Add party walls
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>

	<GovTabs v-slot="tabProps" :items="getTabItems(ceilingAndRoofSummarySections)">
		<SummaryTab :summary="ceilingSummary" :selected="tabProps.currentTab === 0">
			<template #empty>
				<h2 class="govuk-heading-m">No ceilings added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('dwellingSpaceCeilingsCreate')">
					Add ceilings
				</NuxtLink>
			</template>
		</SummaryTab>

		<SummaryTab :summary="roofSummary" :selected="tabProps.currentTab === 1">
			<template #empty>
				<h2 class="govuk-heading-m">No roofs added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('dwellingSpaceRoofsCreate')">
					Add roofs
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>

	<GovTabs v-slot="tabProps" :items="getTabItems(doorSummarySections)">
		<SummaryTab :summary="unglazedDoorSummary" :selected="tabProps.currentTab === 0">
			<template #empty>
				<h2 class="govuk-heading-m">No external unglazed doors added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('dwellingSpaceExternalUnglazedDoorCreate')">
					Add external unglazed doors
				</NuxtLink>
			</template>
		</SummaryTab>

		<SummaryTab :summary="glazedDoorSummary" :selected="tabProps.currentTab === 1">
			<template #empty>
				<h2 class="govuk-heading-m">No external glazed doors added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('dwellingSpaceExternalGlazedDoorCreate')">
					Add external glazed doors
				</NuxtLink>
			</template>
		</SummaryTab>

		<SummaryTab :summary="internalDoorSummary" :selected="tabProps.currentTab === 2">
			<template #empty>
				<h2 class="govuk-heading-m">No internal doors added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('dwellingSpaceInternalDoorCreate')">
					Add internal doors
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>

	<GovTabs v-slot="tabProps" :items="getTabItems([windowSummary])">
		<SummaryTab :summary="windowSummary" :selected="tabProps.currentTab === 0">
			<template #empty>
				<h2 class="govuk-heading-m">No windows added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('dwellingSpaceWindowCreate')">
					Add windows
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>

	<GovTabs v-slot="tabProps" :items="getTabItems(thermalBridgeSummarySections)">
		<SummaryTab :summary="linearThermalBridgesSummary" :selected="tabProps.currentTab === 0">
			<template #empty>
				<h2 class="govuk-heading-m">No linear thermal bridges added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('dwellingSpaceLinearThermalBridgesCreate')">
					Add linear thermal bridges
				</NuxtLink>
			</template>
		</SummaryTab>

		<SummaryTab :summary="pointThermalBridgesSummary" :selected="tabProps.currentTab === 1">
			<template #empty>
				<h2 class="govuk-heading-m">No point thermal bridges added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('dwellingSpacePointThermalBridgesCreate')">
					Add point thermal bridges
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>
	<GovButton href="/">Return to overview</GovButton>
</template>