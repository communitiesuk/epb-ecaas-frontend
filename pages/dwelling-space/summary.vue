<script setup lang="ts">
import type { SummarySection } from '~/common.types';
import { getUrl, getTabItems, type ArealHeatCapacityValue } from '#imports';
import { FloorType } from '~/schema/api-schema.types';
import { metresSquare, millimetresSquarePerMetre } from '~/utils/units/area';
import { degrees } from '~/utils/units/angle';
import { squareMeterKelvinPerWatt, wattsPerKelvin, wattsPerMeterKelvin, wattsPerSquareMeterKelvin } from '~/utils/units/thermalConductivity';
import { centimetre, metre, millimetre } from '~/utils/units/length';
import { cubicMetre } from '~/utils/units/volume';

const title = "Dwelling fabric summary";
const store = useEcaasStore();

function calculateFrameToOpeningRatio(openingToFrameRatio: number): number {
	// note - use parseFloat and toFixed to avoid JS precision issues
	return parseFloat((1 - openingToFrameRatio).toFixed(10));
}

const zoneParametersData = store.dwellingFabric.dwellingSpaceZoneParameters.data;

const zoneParametersSummary: SummarySection = {
	id: 'dwellingSpaceZoneParameters',
	label: 'Zone parameters',
	data: {
		"Area": zoneParametersData.area ? `${zoneParametersData.area} ${metresSquare.suffix}` : undefined,
		"Volume": zoneParametersData.volume ? `${zoneParametersData.volume} ${cubicMetre.suffix}` : undefined,
		// "Heat emitting system for this zone": zoneParametersData.spaceHeatingSystemForThisZone,
		// "Heating control type": zoneParametersData.heatingControlType
	},
	editUrl: getUrl('dwellingSpaceZoneParameters')
};

const lightingData = store.dwellingFabric.dwellingSpaceLighting.data;

const lightingSummary: SummarySection = {
	id: 'dwellingSpaceLighting',
	label: 'Lighting',
	data: {
		"Number of LED bulbs": lightingData.numberOfLEDBulbs,
		"Number of incandescent bulbs": lightingData.numberOfIncandescentBulbs,
	},
	editUrl: getUrl('dwellingSpaceLighting')
};

const groundFloorData = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceGroundFloor.data;
const internalFloorData = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor?.data;
const exposedFloorData = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceExposedFloor?.data;

const groundFloorSummary: SummarySection = {
	id: 'dwellingSpaceGroundFloors',
	label: 'Ground floor',
	data: groundFloorData.map(x => {
		const edgeInsulationWidth = x.typeOfGroundFloor === FloorType.Slab_edge_insulation ? (typeof x.edgeInsulationWidth === 'number' ? x.edgeInsulationWidth : x.edgeInsulationWidth.amount) : undefined;
		
		return {
			"Name": x.name,
			"Net surface area of this element": `${x.surfaceArea} ${metresSquare.suffix}`,
			"Pitch": `${x.pitch} ${degrees.suffix}`,
			"U-value": `${x.uValue} ${wattsPerSquareMeterKelvin.suffix}`,
			"Thermal resistance": `${x.thermalResistance} ${squareMeterKelvinPerWatt.suffix}`,
			"Areal heat capacity": displayArealHeatCapacity(x.kappaValue as ArealHeatCapacityValue),
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
			"Perimeter": `${x.perimeter} ${metre.suffix}`,
			"Psi of wall junction": `${x.psiOfWallJunction} ${wattsPerMeterKelvin.suffix}`,
			"Thickness of walls at the edge of the floor": `${x.thicknessOfWalls} ${millimetre.suffix}`,
			"Type of ground floor": displaySnakeToSentenceCase(x.typeOfGroundFloor),
			"Edge insulation type": x.typeOfGroundFloor === FloorType.Slab_edge_insulation ? displayCamelToSentenceCase(x.edgeInsulationType) : undefined,
			"Edge insulation width": edgeInsulationWidth ? `${edgeInsulationWidth} ${centimetre.suffix}` : undefined,
			"Edge insulation thermal resistance": x.typeOfGroundFloor === FloorType.Slab_edge_insulation ? `${x.edgeInsulationThermalResistance} ${squareMeterKelvinPerWatt.suffix}` : undefined,
			"Height of the floor upper surface": x.typeOfGroundFloor === FloorType.Suspended_floor ? `${x.heightOfFloorUpperSurface} ${millimetre.suffix}` : undefined,
			"Thermal resistance of insulation on base of underfloor space": x.typeOfGroundFloor === FloorType.Suspended_floor ? `${x.underfloorSpaceThermalResistance} ${squareMeterKelvinPerWatt.suffix}` : undefined,
			"Thermal transmittance of walls above ground": x.typeOfGroundFloor === FloorType.Suspended_floor ? `${x.thermalTransmittanceOfWallsAboveGround} ${wattsPerSquareMeterKelvin.suffix}` : undefined,
			"Area of ventilation openings per perimeter": x.typeOfGroundFloor === FloorType.Suspended_floor ? `${x.ventilationOpeningsArea} ${millimetresSquarePerMetre.suffix}` : undefined,
			"Wind shielding factor": x.typeOfGroundFloor === FloorType.Suspended_floor ? x.windShieldingFactor : undefined,
			"Depth of basement floor below ground level": x.typeOfGroundFloor === FloorType.Heated_basement || x.typeOfGroundFloor === FloorType.Unheated_basement ? `${x.depthOfBasementFloorBelowGround} ${metre.suffix}` : undefined,
			"Thermal resistance of walls of basement": x.typeOfGroundFloor === FloorType.Heated_basement ? `${x.thermalResistanceOfBasementWalls} ${squareMeterKelvinPerWatt.suffix}` : undefined,
			"Thermal transmittance of floor above basement": x.typeOfGroundFloor === FloorType.Unheated_basement ? `${x.thermalTransmittanceOfFloorAboveBasement} ${wattsPerSquareMeterKelvin.suffix}` : undefined,
			"Height of the basement walls above ground level": x.typeOfGroundFloor === FloorType.Unheated_basement ? `${x.heightOfBasementWallsAboveGround} ${metre.suffix}` : undefined
		};
	}),
	editUrl: getUrl('dwellingSpaceFloors')
};

const internalFloorSummary: SummarySection = {
	id: 'dwellingSpaceInternalFloors',
	label: 'Internal floor',
	data: internalFloorData?.map(x => {
		return {
			"Type of internal floor": displayAdjacentSpaceType(x.typeOfInternalFloor, 'Internal floor'),
			"Name": x.name,
			"Net surface area of element": `${x.surfaceAreaOfElement} ${metresSquare.suffix}`,
			"Areal heat capacity": displayArealHeatCapacity(x.kappaValue as ArealHeatCapacityValue),
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
			...(x.typeOfInternalFloor === AdjacentSpaceType.unheatedSpace ? { "Thermal resistance of adjacent unheated space": `${x.thermalResistanceOfAdjacentUnheatedSpace} ${squareMeterKelvinPerWatt.suffix}` } : {})
		};
	}) || [],
	editUrl: getUrl('dwellingSpaceFloors')
};

const exposedFloorSummary: SummarySection = {
	id: 'dwellingSpaceExposedFloors',
	label: 'Exposed floor',
	data: exposedFloorData?.map(x => {
		return {
			"Name": x.name,
			"Length": `${x.length} ${metre.suffix}`,
			"Width": `${x.width} ${metre.suffix}`,
			"Elevational height of building element at its base": `${x.elevationalHeight} ${metre.suffix}`,
			"Net surface area": `${x.surfaceArea} ${metresSquare.suffix}`,
			"Solar absorption coefficient": x.solarAbsorption,
			"U-value": `${x.uValue} ${wattsPerSquareMeterKelvin.suffix}`,
			"Areal heat capacity": displayArealHeatCapacity(x.kappaValue as ArealHeatCapacityValue),
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass)
		};
	}) || [],
	editUrl: getUrl('dwellingSpaceFloors')
};

const floorSummarySections: SummarySection[] = [
	groundFloorSummary,
	internalFloorSummary,
	exposedFloorSummary
];

const externalWallData = store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceExternalWall?.data;
const internalWallData = store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceInternalWall?.data;
const wallToUnheatedSpaceData = store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceWallToUnheatedSpace?.data;
const partyWallData = store.dwellingFabric.dwellingSpaceWalls.dwellingSpacePartyWall?.data;

const externalWallSummary: SummarySection = {
	id: 'dwellingSpaceExternalWalls',
	label: 'External wall',
	data: externalWallData?.map(x => {
		return {
			"Name": x.name,
			"Pitch": `${x.pitch} ${degrees.suffix}`,
			"Orientation": `${x.orientation} ${degrees.suffix}`,
			"Height": `${x.height} ${metre.suffix}`,
			"Length": `${x.length} ${metre.suffix}`,
			"Elevational height of building element at its base": `${x.elevationalHeight} ${metre.suffix}`,
			"Net surface area": `${x.surfaceArea} ${metresSquare.suffix}`,
			"Solar absorption coefficient": x.solarAbsorption,
			"U-value": `${x.uValue} ${wattsPerSquareMeterKelvin.suffix}`,
			"Areal heat capacity": displayArealHeatCapacity(x.kappaValue as ArealHeatCapacityValue),
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass)
		};
	}) || [],
	editUrl: getUrl('dwellingSpaceWalls')
};

const internalWallSummary: SummarySection = {
	id: 'dwellingSpaceInternalWalls',
	label: 'Internal wall',
	data: internalWallData?.map(x => {
		return {
			"Name": x.name,
			"Pitch": `${x.pitch} ${degrees.suffix}`,
			"Net surface area of element": `${x.surfaceAreaOfElement} ${metresSquare.suffix}`,
			"Areal heat capacity": displayArealHeatCapacity(x.kappaValue as ArealHeatCapacityValue),
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass)
		};
	}) || [],
	editUrl: getUrl('dwellingSpaceWalls')
};

const wallToUnheatedSpaceSummary: SummarySection = {
	id: 'dwellingSpaceUnheatedSpaceWalls',
	label: 'Wall to unheated space',
	data: wallToUnheatedSpaceData?.map(x => {
		return {
			"Name": x.name,
			"Pitch": `${x.pitch} ${degrees.suffix}`,
			"Net surface area of element": `${x.surfaceAreaOfElement} ${metresSquare.suffix}`,
			"U-value": `${x.uValue} ${wattsPerSquareMeterKelvin.suffix}`,
			"Areal heat capacity": displayArealHeatCapacity(x.arealHeatCapacity as ArealHeatCapacityValue),
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
			"Thermal resistance of adjacent unheated space": `${x.thermalResistanceOfAdjacentUnheatedSpace} ${squareMeterKelvinPerWatt.suffix}`
		};
	}) || [],
	editUrl: getUrl('dwellingSpaceWalls')
};

const partyWallSummary: SummarySection = {
	id: 'dwellingSpacePartyWalls',
	label: 'Party wall',
	data: partyWallData?.map(x => {
		return {
			"Name": x.name,
			"Pitch": `${x.pitch} ${degrees.suffix}`,
			"Net surface area": `${x.surfaceArea} ${metresSquare.suffix}`,
			"U-value": `${x.uValue} ${wattsPerSquareMeterKelvin.suffix}`,
			"Areal heat capacity": displayArealHeatCapacity(x.kappaValue as ArealHeatCapacityValue),
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass)
		};
	}) || [],
	editUrl: getUrl('dwellingSpaceWalls')
};

const wallSummarySections: SummarySection[] = [
	externalWallSummary,
	internalWallSummary,
	wallToUnheatedSpaceSummary,
	partyWallSummary
];

const ceilingData = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings.data;
const roofData = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs.data;

const ceilingSummary: SummarySection = {
	id: 'dwellingSpaceCeilings',
	label: 'Ceiling',
	data: ceilingData.map(({ data: x }) => {
		return {
			"Type of ceiling": displayAdjacentSpaceType(x.type, 'Ceiling'),
			"Name": x.name,
			"Pitch": `${x.pitch} ${degrees.suffix}`,
			"Net surface area": `${x.surfaceArea} ${metresSquare.suffix}`,
			"U-value": x.type === 'unheatedSpace' ? `${x.uValue} ${wattsPerSquareMeterKelvin.suffix}` : undefined,
			"Areal heat capacity": displayArealHeatCapacity(x.kappaValue as ArealHeatCapacityValue),
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
			"Thermal resistance of adjacent unheated space": x.type === 'unheatedSpace' ? `${x.thermalResistanceOfAdjacentUnheatedSpace} ${squareMeterKelvinPerWatt.suffix}` : undefined,
		};
	}),
	editUrl: getUrl('dwellingSpaceCeilingsAndRoofs')
};

const roofSummary: SummarySection = {
	id: 'dwellingSpaceRoofs',
	label: 'Roof',
	data: roofData.map(({ data: x }) => {
		return {
			"Name": x.name,
			"Type of roof": displayCamelToSentenceCase(x.typeOfRoof),
			"Pitch": `${x.pitch} ${degrees.suffix}`,
			"Orientation": x.orientation !== undefined ? `${x.orientation} ${degrees.suffix}` : undefined,
			"Length": `${x.length} ${metre.suffix}`,
			"Width": `${x.width} ${metre.suffix}`,
			"Elevational height of building element at its base": `${x.elevationalHeightOfElement} ${metre.suffix}`,
			"Net surface area": `${x.surfaceArea} ${metresSquare.suffix}`,
			"Solar absorption coefficient": x.solarAbsorptionCoefficient,
			"U-value": `${x.uValue} ${wattsPerSquareMeterKelvin.suffix}`,
			"Areal heat capacity": displayArealHeatCapacity(x.kappaValue as ArealHeatCapacityValue),
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass)
		};
	}),
	editUrl: getUrl('dwellingSpaceCeilingsAndRoofs')
};

const ceilingAndRoofSummarySections: SummarySection[] = [
	ceilingSummary,
	roofSummary
];

const unglazedDoorData = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor.data;
const glazedDoorData = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor.data;
const internalDoorData = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceInternalDoor.data;

const unglazedDoorSummary: SummarySection = {
	id: 'dwellingSpaceUnglazedDoors',
	label: 'External unglazed door',
	data: unglazedDoorData.map(x => {
		return {
			"Name": x.name,
			"Pitch": `${x.pitch} ${degrees.suffix}`,
			"Orientation": `${x.orientation} ${degrees.suffix}`,
			"Height": `${x.height} ${metre.suffix}`,
			"Width": `${x.width} ${metre.suffix}`,
			"Elevational height of building element at its base": `${x.elevationalHeight} ${metre.suffix}`,
			"Net surface area": `${x.surfaceArea} ${metresSquare.suffix}`,
			"Solar absorption coefficient": x.solarAbsorption,
			"U-value": `${x.uValue} ${wattsPerSquareMeterKelvin.suffix}`,
			"Areal heat capacity": displayArealHeatCapacity(x.kappaValue as ArealHeatCapacityValue),
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass)
		};
	}),
	editUrl: getUrl('dwellingSpaceDoors')
};

const glazedDoorSummary: SummarySection = {
	id: 'dwellingSpaceGlazedDoors',
	label: 'External glazed door',
	data: glazedDoorData.map(x => {
		return {
			"Name": x.name,
			"Pitch": `${x.pitch} ${degrees.suffix}`,
			"Orientation": `${x.orientation} ${degrees.suffix}`,
			"Height": `${x.height} ${metre.suffix}`,
			"Width": `${x.width} ${metre.suffix}`,
			"Elevational height of building element at its base": `${x.elevationalHeight} ${metre.suffix}`,
			"Net surface area": `${x.surfaceArea} ${metresSquare.suffix}`,
			"U-value": `${x.uValue} ${wattsPerSquareMeterKelvin.suffix}`,
			"Transmittance of solar energy": x.solarTransmittance,
			"Mid height": `${x.midHeight} ${metre.suffix}`,
			"Opening to frame ratio": x.numberOpenableParts !== '0' ? x.openingToFrameRatio : undefined
		};
	}),
	editUrl: getUrl('dwellingSpaceDoors')
};

const internalDoorSummary: SummarySection = {
	id: 'dwellingSpaceInternalDoors',
	label: 'Internal door',
	data: internalDoorData?.map(x => {
		return {
			"Type": displayAdjacentSpaceType(x.typeOfInternalDoor, 'Internal door'),
			"Name": x.name,
			"Pitch": `${x.pitch} ${degrees.suffix}`,
			"Net surface area of element": `${x.surfaceArea} ${metresSquare.suffix}`,
			"U-value": x.typeOfInternalDoor === AdjacentSpaceType.unheatedSpace ? `${x.uValue} ${wattsPerSquareMeterKelvin.suffix}` : undefined,
			"Areal heat capacity": displayArealHeatCapacity(x.kappaValue as ArealHeatCapacityValue),
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
			"Thermal resistance of adjacent unheated space": x.typeOfInternalDoor === AdjacentSpaceType.unheatedSpace ? `${x.thermalResistanceOfAdjacentUnheatedSpace} ${squareMeterKelvinPerWatt.suffix}` : undefined,
		};
	}) || [],
	editUrl: getUrl('dwellingSpaceDoors')
};

const doorSummarySections: SummarySection[] = [
	unglazedDoorSummary,
	glazedDoorSummary,
	internalDoorSummary
];

const windowData = store.dwellingFabric.dwellingSpaceWindows.data;

const windowSummary: SummarySection = {
	id: 'dwellingSpaceWindows',
	label: 'Windows',
	data: windowData.map(x => {
		return {
			"Name": x.name,
			"Pitch": `${x.pitch} ${degrees.suffix}`,
			"Orientation": `${x.orientation} ${degrees.suffix}`,
			"Height": `${x.height} ${metre.suffix}`,
			"Width": `${x.width} ${metre.suffix}`,
			"Elevational height of building element at its base": `${x.elevationalHeight} ${metre.suffix}`,
			"Net surface area": `${x.surfaceArea} ${metresSquare.suffix}`,
			"U-value": `${x.uValue} ${wattsPerSquareMeterKelvin.suffix}`,
			"Transmittance of solar energy": x.solarTransmittance,
			"Mid height": `${x.midHeight} ${metre.suffix}`,
			"Frame to opening ratio": x.numberOpenableParts !== '0' ? calculateFrameToOpeningRatio(x.openingToFrameRatio) : undefined,
			"Number of openable parts": x.numberOpenableParts,
			"Height of the openable area": x.numberOpenableParts !== '0' ? `${x.heightOpenableArea} ${metre.suffix}` : undefined,
			"Maximum openable area": x.numberOpenableParts !== '0' ? `${x.maximumOpenableArea} ${metresSquare.suffix}` : undefined,
			"Mid height of the air flow path for openable part 1": x.numberOpenableParts !== '0' ? `${x.midHeightOpenablePart1} ${metre.suffix}` : undefined,
			"Mid height of the air flow path for openable part 2": x.numberOpenableParts !== '0' && x.numberOpenableParts !== '1' ? `${x.midHeightOpenablePart2} ${metre.suffix}` : undefined,
			"Mid height of the air flow path for openable part 3": x.numberOpenableParts === '3' || x.numberOpenableParts === '4' ? `${x.midHeightOpenablePart3} ${metre.suffix}` : undefined,
			"Mid height of the air flow path for openable part 4": x.numberOpenableParts === '4' ? `${x.midHeightOpenablePart4} ${metre.suffix}` : undefined,
			"Overhang depth": 'overhangDepth' in x && x.overhangDepth ? (typeof x.overhangDepth === 'number' ? `${x.overhangDepth} ${millimetre.suffix}` : `${x.overhangDepth.amount} ${millimetre.suffix}`) : undefined,
			"Overhang distance from glass": 'overhangDistance' in x && x.overhangDistance ? (typeof x.overhangDistance === 'number' ? `${x.overhangDistance} ${millimetre.suffix}` : `${x.overhangDistance.amount} ${millimetre.suffix}`): undefined,
			"Side fin right depth": 'sideFinRightDepth' in x && x.sideFinRightDepth ? (typeof x.sideFinRightDepth === 'number' ? `${x.sideFinRightDepth} ${millimetre.suffix}` : `${x.sideFinRightDepth.amount} ${millimetre.suffix}`) : undefined,
			"Side fin right distance from glass": 'sideFinRightDistance' in x  && x.sideFinRightDistance ? (typeof x.sideFinRightDistance === 'number' ? `${x.sideFinRightDistance} ${millimetre.suffix}` : `${x.sideFinRightDistance.amount} ${millimetre.suffix}`) : undefined,
			"Side fin left depth": 'sideFinLeftDepth' in x && x.sideFinLeftDepth ? (typeof x.sideFinLeftDepth === 'number' ? `${x.sideFinLeftDepth} ${millimetre.suffix}` : `${x.sideFinLeftDepth.amount} ${millimetre.suffix}`) : undefined,
			"Side fin left distance from glass": 'sideFinLeftDistance' in x && x.sideFinLeftDistance ? (typeof x.sideFinLeftDistance === 'number' ? `${x.sideFinLeftDistance} ${millimetre.suffix}` : `${x.sideFinLeftDistance.amount} ${millimetre.suffix}`) : undefined,
			"Type": x.curtainsOrBlinds ? displayCamelToSentenceCase(x.treatmentType) : undefined,
			"Curtains control object reference": 'curtainsControlObject' in x ? displaySnakeToSentenceCase(x.curtainsControlObject!) : undefined,
			"Thermal resistivity increase": 'thermalResistivityIncrease' in x ? `${x.thermalResistivityIncrease} ${wattsPerSquareMeterKelvin.suffix}` : undefined,
			"Solar transmittance reduction": 'solarTransmittanceReduction' in x ? x.solarTransmittanceReduction : undefined
		};
	}) || [],
	editUrl: getUrl('dwellingSpaceWindows')
};

const linearThermalBridgesData = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges.data;
const pointThermalBridgesData = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpacePointThermalBridges.data;

const linearThermalBridgesSummary: SummarySection = {
	id: 'dwellingSpaceLinearThermalBridging',
	label: 'Linear thermal bridges',
	data: linearThermalBridgesData.map(({ data: x }) => {
		return {
			"Type of thermal bridge": displayCamelToSentenceCase(x.typeOfThermalBridge),
			"Linear thermal transmittance": `${x.linearThermalTransmittance} ${wattsPerMeterKelvin.suffix}`,
			"Length of thermal bridge": `${x.length} ${metre.suffix}`
		};
	}),
	editUrl: getUrl('dwellingSpaceThermalBridging')
};

const pointThermalBridgesSummary: SummarySection = {
	id: 'dwellingSpacePointThermalBridging',
	label: 'Point thermal bridges',
	data: pointThermalBridgesData.map(({ data: x }) => {
		return {
			"Name": x.name,
			"Heat transfer coefficient": `${x.heatTransferCoefficient} ${wattsPerKelvin.suffix}`
		};
	}),
	editUrl: getUrl('dwellingSpaceThermalBridging')
};

const thermalBridgeSummarySections: SummarySection[] = [
	linearThermalBridgesSummary,
	pointThermalBridgesSummary
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