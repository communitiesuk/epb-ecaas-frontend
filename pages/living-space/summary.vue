<script setup lang="ts">
import type { SummarySection } from '~/common.types';
import { getUrl, getTabItems } from '#imports';
import { FloorType } from '~/schema/api-schema.types';

const title = "Living space fabric summary";
const store = useEcaasStore();

definePageMeta({ layout: false });

const zoneParametersData = store.livingSpaceFabric.livingSpaceZoneParameters.data;

const zoneParametersSummary: SummarySection = {
	id: 'livingSpaceZoneParameters',
	label: 'Zone parameters',
	data: {
		"Area": zoneParametersData.area,
		"Volume": zoneParametersData.volume,
		"Heat emitting system for this zone": zoneParametersData.spaceHeatingSystemForThisZone
		// "Heating control type": zoneParametersData.heatingControlType
	},
	editUrl: getUrl('livingSpaceZoneParameters')!
};

const groundFloorData = store.livingSpaceFabric.livingSpaceFloors.livingSpaceGroundFloor.data;
const internalFloorData = store.livingSpaceFabric.livingSpaceFloors.livingSpaceInternalFloor?.data;
const exposedFloorData = store.livingSpaceFabric.livingSpaceFloors.livingSpaceExposedFloor?.data;

const groundFloorSummary: SummarySection = {
	id: 'livingSpaceGroundFloors',
	label: 'Ground floor',
	data: groundFloorData.map(x => {
		return {
			"Name": x.name,
			"Net surface area in zone": x.surfaceAreaInZone,
			"Surface area in all zones": x.surfaceAreaAllZones,
			"Pitch": x.pitch,
			"U-value": x.uValue,
			"Thermal resistance of floor construction": x.thermalResistanceOfFloorConstruction,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
			"Perimeter": x.perimeter,
			"Psi of wall junction": x.psiOfWallJunction,
			"Type of ground floor": displaySnakeToSentenceCase(x.typeOfGroundFloor),
			"Edge insulation type": x.typeOfGroundFloor === FloorType.Slab_edge_insulation ? x.edgeInsulationType : undefined,
			"Edge insulation width": x.typeOfGroundFloor === FloorType.Slab_edge_insulation ? x.edgeInsulationWidth : undefined,
			"Edge insulation thermal resistance": x.typeOfGroundFloor === FloorType.Slab_edge_insulation ? x.edgeInsulationThermalResistance : undefined,
			"Height of the floor upper surface": x.typeOfGroundFloor === FloorType.Suspended_floor ? x.heightOfFloorUpperSurface : undefined,
			"Thickness of walls": x.typeOfGroundFloor === FloorType.Suspended_floor || x.typeOfGroundFloor === FloorType.Unheated_basement ? x.thicknessOfWalls : undefined,
			"Thermal resistance of insulation on base of underfloor space": x.typeOfGroundFloor === FloorType.Suspended_floor ? x.underfloorSpaceThermalResistance : undefined,
			"Thermal transmittance of walls above ground": x.typeOfGroundFloor === FloorType.Suspended_floor ? x.thermalTransmittanceOfWallsAboveGround : undefined,
			"Area of ventilation openings per perimeter": x.typeOfGroundFloor === FloorType.Suspended_floor ? x.ventilationOpeningsArea : undefined,
			"Depth of basement floor below ground level": x.typeOfGroundFloor === FloorType.Heated_basement || x.typeOfGroundFloor === FloorType.Unheated_basement ? x.depthOfBasementFloorBelowGround : undefined,
			"Thermal resistance of walls of basement": x.typeOfGroundFloor === FloorType.Heated_basement ? x.thermalResistanceOfBasementWalls : undefined,
			"Thermal transmittance of floor above basement": x.typeOfGroundFloor === FloorType.Unheated_basement ? x.thermalTransmittanceOfFloorAboveBasement : undefined,
			"Height of the basement walls above ground level": x.typeOfGroundFloor === FloorType.Unheated_basement ? x.heightOfBasementWallsAboveGround : undefined
		};
	}),
	editUrl: getUrl('livingSpaceFloors')!
};

const internalFloorSummary: SummarySection = {
	id: 'livingSpaceInternalFloors',
	label: 'Internal floor',
	data: internalFloorData?.map(x => {
		return {
			"Type of internal floor": x.typeOfInternalFloor,
			"Name": x.name,
			"Net surface area of element": x.surfaceAreaOfElement,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
			...(x.typeOfInternalFloor === AdjacentSpaceType.unheatedSpace ? {"Thermal resistance of adjacent unheated space": x.thermalResistanceOfAdjacentUnheatedSpace} : {})
		};
	}) || [],
	editUrl: getUrl('livingSpaceFloors')!
};

const exposedFloorSummary: SummarySection = {
	id: 'livingSpaceExposedFloors',
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
	editUrl: getUrl('livingSpaceFloors')!
};

const floorSummarySections: SummarySection[] = [
	groundFloorSummary,
	internalFloorSummary,
	exposedFloorSummary
];

const externalWallData = store.livingSpaceFabric.livingSpaceWalls.livingSpaceExternalWall?.data;
const internalWallData = store.livingSpaceFabric.livingSpaceWalls.livingSpaceInternalWall?.data;
const wallToUnheatedSpaceData = store.livingSpaceFabric.livingSpaceWalls.livingSpaceWallToUnheatedSpace?.data;
const partyWallData = store.livingSpaceFabric.livingSpaceWalls.livingSpacePartyWall?.data;

const externalWallSummary: SummarySection = {
	id: 'livingSpaceExternalWalls',
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
	editUrl: getUrl('livingSpaceWalls')!
};

const internalWallSummary: SummarySection = {
	id: 'livingSpaceInternalWalls',
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
	editUrl: getUrl('livingSpaceWalls')!
};

const wallToUnheatedSpaceSummary: SummarySection = {
	id: 'livingSpaceUnheatedSpaceWalls',
	label: 'Wall to unheated space',
	data: wallToUnheatedSpaceData?.map(x => {
		return {
			"Name": x.name,
			"Net surface area of element": x.surfaceAreaOfElement,
			"U-value": x.uValue,
			"Areal heat capacity": x.arealHeatCapacity,
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
			"Pitch": x.pitch,
			"Thermal resistance of adjacent unheated space": x.thermalResistanceOfAdjacentUnheatedSpace
		};
	}) || [],
	editUrl: getUrl('livingSpaceWalls')!
};

const partyWallSummary: SummarySection = {
	id: 'livingSpacePartyWalls',
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
	editUrl: getUrl('livingSpaceWalls')!
};

const wallSummarySections: SummarySection[] = [
	externalWallSummary,
	internalWallSummary,
	wallToUnheatedSpaceSummary,
	partyWallSummary
];

const ceilingData = store.livingSpaceFabric.livingSpaceCeilingsAndRoofs.livingSpaceCeilings.data;
const roofData = store.livingSpaceFabric.livingSpaceCeilingsAndRoofs.livingSpaceRoofs.data;
const unheatedPitchedRoofData = store.livingSpaceFabric.livingSpaceCeilingsAndRoofs.livingSpaceUnheatedPitchedRoofs.data;

const ceilingSummary: SummarySection = {
	id: 'livingSpaceCeilings',
	label: 'Ceiling',
	data: ceilingData.map(x => {
		return {
			"Type of ceiling": x.type,
			"Name": x.name,
			"Net surface area": x.surfaceArea,
			"U-value": x.type === 'unheatedSpace' ? x.uValue : undefined,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
			"Pitch": x.pitch,
			"Thermal resistance of adjacent unheated space": x.type === 'unheatedSpace' ? x.thermalResistanceOfAdjacentUnheatedSpace: undefined,
		};
	}),
	editUrl: getUrl('livingSpaceCeilingsAndRoofs')!
};

const roofSummary: SummarySection = {
	id: 'livingSpaceRoofs',
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
	editUrl: getUrl('livingSpaceCeilingsAndRoofs')!
};

const unheatedPitchedRoofSummary: SummarySection = {
	id: 'livingSpaceUnheatedPitchedRoofs',
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
	editUrl: getUrl('livingSpaceCeilingsAndRoofs')!
};

const ceilingAndRoofSummarySections: SummarySection[] = [
	ceilingSummary,
	roofSummary,
	unheatedPitchedRoofSummary
];

const unglazedDoorData = store.livingSpaceFabric.livingSpaceDoors.livingSpaceExternalUnglazedDoor.data;
const glazedDoorData = store.livingSpaceFabric.livingSpaceDoors.livingSpaceExternalGlazedDoor.data;
const internalDoorData = store.livingSpaceFabric.livingSpaceDoors.livingSpaceInternalDoor.data;

const unglazedDoorSummary: SummarySection = {
	id: 'livingSpaceUnglazedDoors',
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
	editUrl: getUrl('livingSpaceDoors')!
};

const glazedDoorSummary: SummarySection = {
	id: 'livingSpaceGlazedDoors',
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
	editUrl: getUrl('livingSpaceDoors')!
};

const internalDoorSummary: SummarySection = {
	id: 'livingSpaceInternalDoors',
	label: 'Internal door',
	data: internalDoorData?.map(x => {
		return {
			"Type": x.typeOfInternalDoor,
			"Name": x.name,
			"Net surface area of element": x.surfaceArea,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": displayMassDistributionClass(x.massDistributionClass),
			"Pitch": x.pitch,
			"Thermal resistance of adjacent unheated space": x.typeOfInternalDoor === AdjacentSpaceType.unheatedSpace ? x.thermalResistanceOfAdjacentUnheatedSpace : undefined,
		};
	}) || [],
	editUrl: getUrl('livingSpaceDoors')!
};

const doorSummarySections: SummarySection[] = [
	unglazedDoorSummary,
	glazedDoorSummary,
	internalDoorSummary
];

const windowData = store.livingSpaceFabric.livingSpaceWindows.data;

const windowSummary: SummarySection = {
	id: 'livingSpaceWindows',
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
	editUrl: getUrl('livingSpaceWindows')!
};

const linearThermalBridgesData = store.livingSpaceFabric.livingSpaceThermalBridging.livingSpaceLinearThermalBridges.data;
const pointThermalBridgesData = store.livingSpaceFabric.livingSpaceThermalBridging.livingSpacePointThermalBridges.data;

const linearThermalBridgesSummary: SummarySection = {
	id: 'livingSpaceLinearThermalBridging',
	label: 'Linear thermal bridges',
	data: linearThermalBridgesData.map(x => {
		return {
			"Name": x.name,
			"Type of thermal bridge": x.typeOfThermalBridge,
			"Linear thermal transmittance": x.linearThermalTransmittance,
			"Length of thermal bridge": x.length
		};
	}),
	editUrl: getUrl('livingSpaceThermalBridging')!
};

const pointThermalBridgesSummary: SummarySection = {
	id: 'livingSpacePointThermalBridging',
	label: 'Point thermal bridges',
	data: pointThermalBridgesData.map(x => {
		return {
			"Name": x.name,
			"Heat transfer coefficient": x.heatTransferCoefficient
		};
	}),
	editUrl: getUrl('livingSpaceThermalBridging')!
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
						<NuxtLink class="govuk-link" :to="getUrl('livingSpaceGroundFloorCreate')">
							Add ground floors
						</NuxtLink>
					</template>
				</SummaryTab>

				<SummaryTab :summary="internalFloorSummary" :selected="tabProps.currentTab === 1">
					<template #empty>
						<h2 class="govuk-heading-m">No internal floors added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('livingSpaceInternalFloorCreate')">
							Add internal floors
						</NuxtLink>
					</template>
				</SummaryTab>

				<SummaryTab :summary="exposedFloorSummary" :selected="tabProps.currentTab === 2">
					<template #empty>
						<h2 class="govuk-heading-m">No exposed floors added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('livingSpaceExposedFloorCreate')">
							Add exposed floors
						</NuxtLink>
					</template>
				</SummaryTab>
			</GovTabs>

			<GovTabs v-slot="tabProps" :items="getTabItems(wallSummarySections)">
				<SummaryTab :summary="externalWallSummary" :selected="tabProps.currentTab === 0">
					<template #empty>
						<h2 class="govuk-heading-m">No external walls added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('livingSpaceExternalWallCreate')">
							Add external walls
						</NuxtLink>
					</template>
				</SummaryTab>

				<SummaryTab :summary="internalWallSummary" :selected="tabProps.currentTab === 1">
					<template #empty>
						<h2 class="govuk-heading-m">No internal walls added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('livingSpaceInternalWallCreate')">
							Add internal walls
						</NuxtLink>
					</template>
				</SummaryTab>

				<SummaryTab :summary="wallToUnheatedSpaceSummary" :selected="tabProps.currentTab === 2">
					<template #empty>
						<h2 class="govuk-heading-m">No walls to unheated spaces added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('livingSpaceWallToUnheatedSpaceCreate')">
							Add walls to unheated spaces
						</NuxtLink>
					</template>
				</SummaryTab>

				<SummaryTab :summary="partyWallSummary" :selected="tabProps.currentTab === 3">
					<template #empty>
						<h2 class="govuk-heading-m">No party walls added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('livingSpacePartyWallCreate')">
							Add party walls
						</NuxtLink>
					</template>
				</SummaryTab>
			</GovTabs>

			<GovTabs v-slot="tabProps" :items="getTabItems(ceilingAndRoofSummarySections)">
				<SummaryTab :summary="ceilingSummary" :selected="tabProps.currentTab === 0">
					<template #empty>
						<h2 class="govuk-heading-m">No ceilings added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('livingSpaceCeilingsCreate')">
							Add ceilings
						</NuxtLink>
					</template>
				</SummaryTab>

				<SummaryTab :summary="roofSummary" :selected="tabProps.currentTab === 1">
					<template #empty>
						<h2 class="govuk-heading-m">No roofs added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('livingSpaceRoofsCreate')">
							Add roofs
						</NuxtLink>
					</template>
				</SummaryTab>

				<SummaryTab :summary="unheatedPitchedRoofSummary" :selected="tabProps.currentTab === 2">
					<template #empty>
						<h2 class="govuk-heading-m">No unheated pitched roofs added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('livingSpaceUnheatedPitchedRoofsCreate')">
							Add unheated pitched roof
						</NuxtLink>
					</template>
				</SummaryTab>
			</GovTabs>

			<GovTabs v-slot="tabProps" :items="getTabItems(doorSummarySections)">
				<SummaryTab :summary="unglazedDoorSummary" :selected="tabProps.currentTab === 0">
					<template #empty>
						<h2 class="govuk-heading-m">No external unglazed doors added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('livingSpaceExternalUnglazedDoorCreate')">
							Add external unglazed doors
						</NuxtLink>
					</template>
				</SummaryTab>

				<SummaryTab :summary="glazedDoorSummary" :selected="tabProps.currentTab === 1">
					<template #empty>
						<h2 class="govuk-heading-m">No external glazed doors added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('livingSpaceExternalGlazedDoorCreate')">
							Add external glazed doors
						</NuxtLink>
					</template>
				</SummaryTab>

				<SummaryTab :summary="internalDoorSummary" :selected="tabProps.currentTab === 2">
					<template #empty>
						<h2 class="govuk-heading-m">No internal doors added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('livingSpaceInternalDoorCreate')">
							Add internal doors
						</NuxtLink>
					</template>
				</SummaryTab>
			</GovTabs>

			<GovTabs v-slot="tabProps" :items="getTabItems([windowSummary])">
				<SummaryTab :summary="windowSummary" :selected="tabProps.currentTab === 0">
					<template #empty>
						<h2 class="govuk-heading-m">No windows added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('livingSpaceWindowCreate')">
							Add windows
						</NuxtLink>
					</template>
				</SummaryTab>
			</GovTabs>

			<GovTabs v-slot="tabProps" :items="getTabItems(thermalBridgeSummarySections)">
				<SummaryTab :summary="linearThermalBridgesSummary" :selected="tabProps.currentTab === 0">
					<template #empty>
						<h2 class="govuk-heading-m">No linear thermal bridges added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('livingSpaceLinearThermalBridgesCreate')">
							Add linear thermal bridges
						</NuxtLink>
					</template>
				</SummaryTab>

				<SummaryTab :summary="pointThermalBridgesSummary" :selected="tabProps.currentTab === 1">
					<template #empty>
						<h2 class="govuk-heading-m">No point thermal bridges added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('livingSpacePointThermalBridgesCreate')">
							Add point thermal bridges
						</NuxtLink>
					</template>
				</SummaryTab>
			</GovTabs>
			<NuxtLink to="/" class="govuk-button">Return to task list</NuxtLink>
		</NuxtLayout>
	</div>
</template>