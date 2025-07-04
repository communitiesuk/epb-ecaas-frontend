<script setup lang="ts">
import type { SummarySection } from '~/common.types';
import { getUrl, getTabItems } from '#imports';
import { FloorType } from '~/schema/api-schema.types';

const title = "Living space fabric summary";
const store = useEcaasStore();

definePageMeta({ layout: false });

const zoneParametersData = store.dwellingFabric.dwellingSpaceZoneParameters.data;

const zoneParametersSummary: SummarySection = {
	id: 'dwellingSpaceZoneParameters',
	label: 'Zone parameters',
	data: {
		"Area": zoneParametersData.area,
		"Volume": zoneParametersData.volume,
		// "Heat emitting system for this zone": zoneParametersData.spaceHeatingSystemForThisZone,
		"Number of LED bulbs": zoneParametersData.numberOfLEDBulbs,
		"Number of incandescent bulbs": zoneParametersData.numberOfIncandescentBulbs,
		// "Heating control type": zoneParametersData.heatingControlType
	},
	editUrl: getUrl('dwellingSpaceZoneParameters')!
};

const groundFloorData = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceGroundFloor.data;
const internalFloorData = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor?.data;
const exposedFloorData = store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceExposedFloor?.data;

const groundFloorSummary: SummarySection = {
	id: 'dwellingSpaceGroundFloors',
	label: 'Ground floor',
	data: groundFloorData.map(x => {
		return {
			"Name": x.name,
			"Net surface area of this element": x.surfaceArea,
			"Pitch": x.pitch,
			"U-value": x.uValue,
			"Thermal resistance": x.thermalResistance,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
			"Perimeter": x.perimeter,
			"Psi of wall junction": x.psiOfWallJunction,
			"Thickness of walls for ground floor": x.thicknessOfWalls,
			"Type of ground floor": displaySnakeToSentenceCase(x.typeOfGroundFloor),
			"Edge insulation type": x.typeOfGroundFloor === FloorType.Slab_edge_insulation ? x.edgeInsulationType : undefined,
			"Edge insulation width": x.typeOfGroundFloor === FloorType.Slab_edge_insulation ? x.edgeInsulationWidth : undefined,
			"Edge insulation thermal resistance": x.typeOfGroundFloor === FloorType.Slab_edge_insulation ? x.edgeInsulationThermalResistance : undefined,
			"Height of the floor upper surface": x.typeOfGroundFloor === FloorType.Suspended_floor ? x.heightOfFloorUpperSurface : undefined,
			"Thermal resistance of insulation on base of underfloor space": x.typeOfGroundFloor === FloorType.Suspended_floor ? x.underfloorSpaceThermalResistance : undefined,
			"Thermal transmittance of walls above ground": x.typeOfGroundFloor === FloorType.Suspended_floor ? x.thermalTransmittanceOfWallsAboveGround : undefined,
			"Area of ventilation openings per perimeter": x.typeOfGroundFloor === FloorType.Suspended_floor ? x.ventilationOpeningsArea : undefined,
			"Depth of basement floor below ground level": x.typeOfGroundFloor === FloorType.Heated_basement || x.typeOfGroundFloor === FloorType.Unheated_basement ? x.depthOfBasementFloorBelowGround : undefined,
			"Thermal resistance of walls of basement": x.typeOfGroundFloor === FloorType.Heated_basement ? x.thermalResistanceOfBasementWalls : undefined,
			"Thermal transmittance of floor above basement": x.typeOfGroundFloor === FloorType.Unheated_basement ? x.thermalTransmittanceOfFloorAboveBasement : undefined,
			"Height of the basement walls above ground level": x.typeOfGroundFloor === FloorType.Unheated_basement ? x.heightOfBasementWallsAboveGround : undefined
		};
	}),
	editUrl: getUrl('dwellingSpaceFloors')!
};

const internalFloorSummary: SummarySection = {
	id: 'dwellingSpaceInternalFloors',
	label: 'Internal floor',
	data: internalFloorData?.map(x => {
		return {
			"Type of internal floor": displayAdjacentSpaceType(x.typeOfInternalFloor, 'Internal floor'),
			"Name": x.name,
			"Net surface area of element": x.surfaceAreaOfElement,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
			...(x.typeOfInternalFloor === AdjacentSpaceType.unheatedSpace ? {"Thermal resistance of adjacent unheated space": x.thermalResistanceOfAdjacentUnheatedSpace} : {})
		};
	}) || [],
	editUrl: getUrl('dwellingSpaceFloors')!
};

const exposedFloorSummary: SummarySection = {
	id: 'dwellingSpaceExposedFloors',
	label: 'Exposed floor',
	data: exposedFloorData?.map(x => {
		return {
			"Name": x.name,
			"Pitch": x.pitch,
			"Orientation": x.orientation,
			"Length": x.length,
			"Width": x.width,
			"Elevational height of building element at its base": x.elevationalHeight,
			"Net surface area": x.surfaceArea,
			"Solar absorption coefficient": x.solarAbsorption,
			"U-value": x.uValue,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass)
		};
	}) || [],
	editUrl: getUrl('dwellingSpaceFloors')!
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
			"Pitch": x.pitch,
			"Orientation": x.orientation,
			"Height": x.height,
			"Length": x.length,
			"Elevational height of building element at its base": x.elevationalHeight,
			"Net surface area": x.surfaceArea,
			"Solar absorption coefficient": x.solarAbsorption,
			"U-value": x.uValue,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass)
		};
	}) || [],
	editUrl: getUrl('dwellingSpaceWalls')!
};

const internalWallSummary: SummarySection = {
	id: 'dwellingSpaceInternalWalls',
	label: 'Internal wall',
	data: internalWallData?.map(x => {
		return {
			"Name": x.name,
			"Net surface area of element": x.surfaceAreaOfElement,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
			"Pitch": x.pitch
		};
	}) || [],
	editUrl: getUrl('dwellingSpaceWalls')!
};

const wallToUnheatedSpaceSummary: SummarySection = {
	id: 'dwellingSpaceUnheatedSpaceWalls',
	label: 'Wall to unheated space',
	data: wallToUnheatedSpaceData?.map(x => {
		return {
			"Name": x.name,
			"Net surface area of element": x.surfaceAreaOfElement,
			"U-value": x.uValue,
			"Areal heat capacity": displayArealHeatCapacity(x.arealHeatCapacity),
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
			"Pitch": x.pitch,
			"Thermal resistance of adjacent unheated space": x.thermalResistanceOfAdjacentUnheatedSpace
		};
	}) || [],
	editUrl: getUrl('dwellingSpaceWalls')!
};

const partyWallSummary: SummarySection = {
	id: 'dwellingSpacePartyWalls',
	label: 'Party wall',
	data: partyWallData?.map(x => {
		return {
			"Name": x.name,
			"Pitch": x.pitch,
			"Orientation": x.orientation,
			"Height": x.height,
			"Length": x.length,
			"Elevational height of building element at its base": x.elevationalHeight,
			"Net surface area": x.surfaceArea,
			"Solar absorption coefficient": x.solarAbsorption,
			"U-value": x.uValue,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass)
		};
	}) || [],
	editUrl: getUrl('dwellingSpaceWalls')!
};

const wallSummarySections: SummarySection[] = [
	externalWallSummary,
	internalWallSummary,
	wallToUnheatedSpaceSummary,
	partyWallSummary
];

const ceilingData = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceCeilings.data;
const roofData = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs.data;
const unheatedPitchedRoofData = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceUnheatedPitchedRoofs.data;

const ceilingSummary: SummarySection = {
	id: 'dwellingSpaceCeilings',
	label: 'Ceiling',
	data: ceilingData.map(x => {
		return {
			"Type of ceiling": displayAdjacentSpaceType(x.type, 'Ceiling'),
			"Name": x.name,
			"Net surface area": x.surfaceArea,
			"U-value": x.type === 'unheatedSpace' ? x.uValue : undefined,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
			"Pitch": x.pitch,
			"Thermal resistance of adjacent unheated space": x.type === 'unheatedSpace' ? x.thermalResistanceOfAdjacentUnheatedSpace: undefined,
		};
	}),
	editUrl: getUrl('dwellingSpaceCeilingsAndRoofs')!
};

const roofSummary: SummarySection = {
	id: 'dwellingSpaceRoofs',
	label: 'Roof',
	data: roofData.map(x => {
		return {
			"Name": x.name,
			"Type of roof": x.typeOfRoof,
			"Pitch": x.pitch,
			"Orientation": x.orientation,
			"Length": x.length,
			"Width": x.width,
			"Elevational height of building element at its base": x.elevationalHeightOfElement,
			"Net surface area": x.surfaceArea,
			"Solar absorption coefficient": x.solarAbsorptionCoefficient,
			"U-value": x.uValue,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass)
		};
	}),
	editUrl: getUrl('dwellingSpaceCeilingsAndRoofs')!
};

const unheatedPitchedRoofSummary: SummarySection = {
	id: 'dwellingSpaceUnheatedPitchedRoofs',
	label: 'Unheated pitched roof',
	data: unheatedPitchedRoofData.map(x => {
		return {
			"Name": x.name,
			"Type of roof": x.typeOfRoof,
			"Pitch": x.pitch,
			"Orientation": x.orientation,
			"Length": x.length,
			"Width": x.width,
			"Elevational height of building element at its base": x.elevationalHeightOfElement,
			"Net surface area of ceiling": x.surfaceArea,
			"Solar absorption coefficient": x.solarAbsorptionCoefficient,
			"U-value": x.uValue,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass)
		};
	}),
	editUrl: getUrl('dwellingSpaceCeilingsAndRoofs')!
};

const ceilingAndRoofSummarySections: SummarySection[] = [
	ceilingSummary,
	roofSummary,
	unheatedPitchedRoofSummary
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
			"Pitch": x.pitch,
			"Orientation": x.orientation,
			"Height": x.height,
			"Width": x.width,
			"Elevational height of building element at its base": x.elevationalHeight,
			"Net surface area": x.surfaceArea,
			"Solar absorption coefficient": x.solarAbsorption,
			"U-value": x.uValue,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass)
		};
	}),
	editUrl: getUrl('dwellingSpaceDoors')!
};

const glazedDoorSummary: SummarySection = {
	id: 'dwellingSpaceGlazedDoors',
	label: 'External glazed door',
	data: glazedDoorData.map(x => {
		return {
			"Name": x.name,
			"Orientation": x.orientation,
			"Net surface area": x.surfaceArea,
			"Height": x.height,
			"Width": x.width,
			"U-value": x.uValue,
			"Pitch": x.pitch,
			"Transmittance of solar energy": x.solarTransmittance,
			"Elevational height of building element at its base": x.elevationalHeight,
			"Mid height": x.midHeight,
			"Number of openable parts": x.numberOpenableParts,
			"Frame to opening ratio": x.numberOpenableParts !== '0' ? x.frameToOpeningRatio : undefined,
			"Maximum openable area": x.numberOpenableParts !== '0' ? x.maximumOpenableArea : undefined,
			"Height of the openable area": x.numberOpenableParts !== '0' ? x.heightOpenableArea : undefined,
			"Mid height of the air flow path for openable part 1": x.numberOpenableParts !== '0' ? x.midHeightOpenablePart1 : undefined,
			"Mid height of the air flow path for openable part 2": (x.numberOpenableParts !== '0' && x.numberOpenableParts !== '1') ? x.midHeightOpenablePart2 : undefined,
			"Mid height of the air flow path for openable part 3": (x.numberOpenableParts === '3' || x.numberOpenableParts === '4') ? x.midHeightOpenablePart3 : undefined,
			"Mid height of the air flow path for openable part 4": x.numberOpenableParts === '4' ? x.midHeightOpenablePart4 : undefined
		};
	}),
	editUrl: getUrl('dwellingSpaceDoors')!
};

const internalDoorSummary: SummarySection = {
	id: 'dwellingSpaceInternalDoors',
	label: 'Internal door',
	data: internalDoorData?.map(x => {
		return {
			"Type": displayAdjacentSpaceType(x.typeOfInternalDoor, 'Internal door'),
			"Name": x.name,
			"Net surface area of element": x.surfaceArea,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
			"Pitch": x.pitch,
			"Thermal resistance of adjacent unheated space": x.typeOfInternalDoor === AdjacentSpaceType.unheatedSpace ? x.thermalResistanceOfAdjacentUnheatedSpace : undefined,
		};
	}) || [],
	editUrl: getUrl('dwellingSpaceDoors')!
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
			"Orientation": x.orientation,
			"Net surface area": x.surfaceArea,
			"Height": x.height,
			"Width": x.width,
			"U-value": x.uValue,
			"Pitch": x.pitch,
			"Transmittance of solar energy": x.solarTransmittance,
			"Elevational height of building element at its base": x.elevationalHeight,
			"Mid height": x.midHeight,
			"Number of openable parts": x.numberOpenableParts,
			"Frame to opening ratio": x.numberOpenableParts !== '0' ? x.frameToOpeningRatio : undefined,
			"Maximum openable area": x.numberOpenableParts !== '0' ? x.maximumOpenableArea : undefined,
			"Height of the openable area": x.numberOpenableParts !== '0' ? x.heightOpenableArea : undefined,
			"Mid height of the air flow path for openable part 1": x.numberOpenableParts !== '0' ? x.midHeightOpenablePart1 : undefined,
			"Mid height of the air flow path for openable part 2": x.numberOpenableParts !== '0' && x.numberOpenableParts !== '1' ? x.midHeightOpenablePart2 : undefined,
			"Mid height of the air flow path for openable part 3": x.numberOpenableParts === '3' || x.numberOpenableParts === '4' ? x.midHeightOpenablePart3 : undefined,
			"Mid height of the air flow path for openable part 4": x.numberOpenableParts === '4' ? x.midHeightOpenablePart4 : undefined,
			"Overhang depth": 'overhangDepth' in x ? x.overhangDepth : undefined,
			"Overhang distance": 'overhangDistance' in x ? x.overhangDistance : undefined,
			"Side fin right depth": 'sideFinRightDepth' in x ? x.sideFinRightDepth : undefined,
			"Side fin right distance": 'sideFinRightDistance' in x ? x.sideFinRightDistance : undefined,
			"Side fin left depth": 'sideFinLeftDepth' in x ? x.sideFinLeftDepth : undefined,
			"Side fin left distance": 'sideFinLeftDistance' in x ? x.sideFinLeftDistance : undefined,
			"Type": x.treatmentType,
			"Curtains control object reference": 'curtainsControlObject' in x ? x.curtainsControlObject : undefined,
			"Thermal resistivity increase": 'thermalResistivityIncrease' in x ? x.thermalResistivityIncrease : undefined,
			"Solar transmittance reduction": 'solarTransmittanceReduction' in x ? x.solarTransmittanceReduction : undefined
		};
	}) || [],
	editUrl: getUrl('dwellingSpaceWindows')!
};

const linearThermalBridgesData = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges.data;
const pointThermalBridgesData = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpacePointThermalBridges.data;

const linearThermalBridgesSummary: SummarySection = {
	id: 'dwellingSpaceLinearThermalBridging',
	label: 'Linear thermal bridges',
	data: linearThermalBridgesData.map(x => {
		return {
			"Name": x.name,
			"Type of thermal bridge": x.typeOfThermalBridge,
			"Linear thermal transmittance": x.linearThermalTransmittance,
			"Length of thermal bridge": x.length
		};
	}),
	editUrl: getUrl('dwellingSpaceThermalBridging')!
};

const pointThermalBridgesSummary: SummarySection = {
	id: 'dwellingSpacePointThermalBridging',
	label: 'Point thermal bridges',
	data: pointThermalBridgesData.map(x => {
		return {
			"Name": x.name,
			"Heat transfer coefficient": x.heatTransferCoefficient
		};
	}),
	editUrl: getUrl('dwellingSpaceThermalBridging')!
};

const thermalBridgeSummarySections: SummarySection[] = [
	linearThermalBridgesSummary,
	pointThermalBridgesSummary
];

</script>

<template>
	<div>
		<NuxtLayout name="one-column">
			<Head>
				<Title>{{ title }}</Title>
			</Head>
			<h1 class="govuk-heading-l">{{ title }}</h1>
			<GovTabs v-slot="tabProps" :items="getTabItems([zoneParametersSummary])">
				<SummaryTab :summary="zoneParametersSummary" :selected="tabProps.currentTab === 0" />
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

				<SummaryTab :summary="unheatedPitchedRoofSummary" :selected="tabProps.currentTab === 2">
					<template #empty>
						<h2 class="govuk-heading-m">No unheated pitched roofs added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('dwellingSpaceUnheatedPitchedRoofsCreate')">
							Add unheated pitched roof
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
			<NuxtLink to="/" class="govuk-button">Return to task list</NuxtLink>
		</NuxtLayout>
	</div>
</template>