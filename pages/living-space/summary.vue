<script setup lang="ts">
import type { SummarySection } from '~/common.types';
import { getUrl, getTabItems } from '#imports';

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
		"Heating control type": zoneParametersData.heatingControlType
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
			"Surface area in zone": x.surfaceAreaInZone,
			"Surface area in all zones": x.surfaceAreaAllZones,
			"Pitch": x.pitch,
			"U-value": x.uValue,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": x.massDistributionClass,
			"Perimeter": x.perimeter,
			"Psi of wall junction": x.psiOfWallJunction,
			"Type of ground floor": x.typeOfGroundFloor,
			"Edge insulation type": x.edgeInsulationType,
			"Edge insulation width": x.edgeInsulationWidth,
			"Edge insulation thermal resistance": x.edgeInsulationThermalResistance,
			"Height of the floor upper surface": x.heightOfFloorUpperSurface,
			"Thickness of walls": x.thicknessOfWalls,
			"Thermal resistance of insulation on base of underfloor space": x.underfloorSpaceThermalResistance,
			"Thermal transmittance of walls above ground": x.thermalResistanceOfWallsAboveGround,
			"Area of ventilation openings per perimeter": x.ventilationOpeningsArea,
			"Depth of basement floor below ground level": x.depthOfBasementFloorBelowGround,
			"Thermal resistance of walls of basement": x.thermalResistanceOfBasementWalls,
			"Thermal transmittance of floor above basement": x.thermalTransmittanceOfFloorAboveBasement,
			"Thermal transmittance of walls of the basement": x.thermalTransmittanceOfBasementWalls,
			"Height of the basement walls above ground level": x.heightOfBasementWallsAboveGround
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
			"Surface area of element": x.surfaceAreaOfElement,
			"U-value": x.uValue,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": x.massDistributionClass,
			"Pitch": x.pitch,
			"Thermal resistance of adjacent unheated space": x.thermalResistanceOfAdjacentUnheatedSpace
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
			"Surface area": x.surfaceArea,
			"Solar absorption coefficient": x.solarAbsorbtion,
			"U-value": x.uValue,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": x.massDistributionClass
		};
	}) || [],
	editUrl: getUrl('livingSpaceFloors')!
};

const floorSummarySections: SummarySection[] = [
	groundFloorSummary,
	internalFloorSummary,
	exposedFloorSummary
];

const externalWallData = store.livingSpaceFabric.livingSpaceWalls.livingSpaceExternalWall.data;
const internalWallData = store.livingSpaceFabric.livingSpaceWalls.livingSpaceInternalWall.data;
const wallToUnheatedSpaceData = store.livingSpaceFabric.livingSpaceWalls.livingSpaceWallToUnheatedSpace?.data;
const partyWallData = store.livingSpaceFabric.livingSpaceWalls.livingSpacePartyWall?.data;

const externalWallSummary: SummarySection = {
	id: 'livingSpaceExternalWalls',
	label: 'External wall',
	data: externalWallData.map(x => {
		return {
			"Name": x.name,
			"Pitch": x.pitch,
			"Orientation": x.orientation,
			"Length": x.length,
			"Width": x.width,
			"Elevational height of building element at its base": x.elevationalHeight,
			"Surface area": x.surfaceArea,
			"Solar absorption coefficient": x.solarAbsorbtion,
			"U-value": x.uValue,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": x.massDistributionClass
		};
	}),
	editUrl: getUrl('livingSpaceWalls')!
};

const internalWallSummary: SummarySection = {
	id: 'livingSpaceInternalWalls',
	label: 'Internal wall',
	data: internalWallData.map(x => {
		return {
			"Name": x.name,
			"Surface area of element": x.surfaceAreaOfElement,
			"U-value": x.uValue,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": x.massDistributionClass,
			"Pitch": x.pitch
		};
	}),
	editUrl: getUrl('livingSpaceWalls')!
};

const wallToUnheatedSpaceSummary: SummarySection = {
	id: 'livingSpaceUnheatedSpaceWalls',
	label: 'Wall to unheated space',
	data: wallToUnheatedSpaceData?.map(x => {
		return {
			"Name": x.name,
			"Surface area of element": x.surfaceAreaOfElement,
			"U-value": x.uValue,
			"Areal heat capacity": x.arealHeatCapacity,
			"Mass distribution class": x.massDistributionClass,
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
			"Length": x.length,
			"Width": x.width,
			"Elevational height of building element at its base": x.elevationalHeight,
			"Surface area": x.surfaceArea,
			"Solar absorption coefficient": x.solarAbsorbtion,
			"U-value": x.uValue,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": x.massDistributionClass
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

const ceilingSummary: SummarySection = {
	id: 'livingSpaceCeilings',
	label: 'Ceiling',
	data: ceilingData.map(x => {
		return {
			"Type of ceiling": x.type,
			"Name": x.name,
			"Surface area": x.surfaceArea,
			"U-value": x.uValue,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": x.massDistributionClass,
			"Pitch": x.pitch,
			"Thermal resistance of adjacent unheated space": x.thermalResistanceOfAdjacentUnheatedSpace
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
			"Surface area": x.surfaceArea,
			"Solar absorption coefficient": x.solarAbsorbtionCoefficient,
			"U-value": x.uValue,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": x.massDistributionClass
		};
	}),
	editUrl: getUrl('livingSpaceCeilingsAndRoofs')!
};

const ceilingAndRoofSummarySections: SummarySection[] = [
	ceilingSummary,
	roofSummary
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
			"length": x.length,
			"Width": x.width,
			"Elevational height of building element at its base": x.elevationalHeight,
			"Surface area": x.surfaceArea,
			"Solar absorption coefficient": x.solarAbsorbtion,
			"U-value": x.uValue,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": x.massDistributionClass
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
			"Surface area": x.surfaceArea,
			"Length": x.length,
			"Width": x.width,
			"U-value": x.uValue,
			"Pitch": x.pitch,
			"Transmittance of solar energy": x.solarTransmittence,
			"Elevational height of building element at its base": x.elevationalHeight,
			"Mid height": x.midHeight,
			"Number of openable parts": x.numberOpenableParts,
			"Frame to opening ratio": x.frameToOpeningRatio,
			"Maximum openable area": x.maximumOpenableArea,
			"Height of the openable area": x.heightOpenableArea,
			"Mid height of the air flow path for openable part 1": x.midHeightOpenablePart1,
			"Mid height of the air flow path for openable part 2": x.midHeightOpenablePart2,
			"Mid height of the air flow path for openable part 3": x.midHeightOpenablePart3,
			"Mid height of the air flow path for openable part 4": x.midHeightOpenablePart4
		};
	}),
	editUrl: getUrl('livingSpaceDoors')!
};

const internalDoorSummary: SummarySection = {
	id: 'livingSpaceInternalDoors',
	label: 'Internal door',
	data: internalDoorData?.map(x => {
		return {
			"Type": x.typeOfCeiling,
			"Name": x.name,
			"Surface area of element": x.surfaceArea,
			"U-value": x.uValue,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": x.massDistributionClass,
			"Pitch": x.pitch,
			"Thermal resistance of adjacent unheated space": x.thermalResistanceOfAdjacentUnheatedSpace
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
			"Surface area": x.surfaceArea,
			"Length": x.length,
			"Width": x.width,
			"U-value": x.uValue,
			"Pitch": x.pitch,
			"Transmittance of solar energy": x.solarTransmittence,
			"Elevational height of building element at its base": x.elevationalHeight,
			"Mid height": x.midHeight,
			"Number of openable parts": x.numberOpenableParts,
			"Frame to opening ratio": x.frameToOpeningRatio,
			"Maximum openable area": x.maximumOpenableArea,
			"Height of the openable area": x.heightOpenableArea,
			"Mid height of the air flow path for openable part 1": x.midHeightOpenablePart1,
			"Mid height of the air flow path for openable part 2": x.midHeightOpenablePart2,
			"Mid height of the air flow path for openable part 3": x.midHeightOpenablePart3,
			"Mid height of the air flow path for openable part 4": x.midHeightOpenablePart4,
			"Overhang depth": x.overhangDepth,
			"Overhang distance": x.overhangDistance,
			"Side fin right depth": x.sideFinRightDepth,
			"Side fin right distance": x.sideFinRightDistance,
			"Side fin left depth": x.sideFinLeftDepth,
			"Side fin left distance": x.sideFinLeftDistance,
			"Type": x.type,
			"Curtains control object reference": x.curtainsControlObject,
			"Thermal resistivity increase": x.thermalResistivityIncrease,
			"Solar transmittance reduction": x.solarTransmittenceReduction
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
				<GovSummaryTab :summary="zoneParametersSummary" :selected="tabProps.currentTab === 0" />
			</GovTabs>

			<GovTabs v-slot="tabProps" :items="getTabItems(floorSummarySections)">
				<GovSummaryTab :summary="groundFloorSummary" :selected="tabProps.currentTab === 0">
					<template #empty>
						<h2 class="govuk-heading-m">No ground floors added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(groundFloorSummary.id)}/ground/create`">
							Add ground floors
						</NuxtLink>
					</template>
				</GovSummaryTab>

				<GovSummaryTab :summary="internalFloorSummary" :selected="tabProps.currentTab === 1">
					<template #empty>
						<h2 class="govuk-heading-m">No internal floors added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(internalFloorSummary.id)}/internal/create`">
							Add internal floors
						</NuxtLink>
					</template>
				</GovSummaryTab>

				<GovSummaryTab :summary="exposedFloorSummary" :selected="tabProps.currentTab === 2">
					<template #empty>
						<h2 class="govuk-heading-m">No exposed floors added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(exposedFloorSummary.id)}/exposed/create`">
							Add exposed floors
						</NuxtLink>
					</template>
				</GovSummaryTab>
			</GovTabs>

			<GovTabs v-slot="tabProps" :items="getTabItems(wallSummarySections)">
				<GovSummaryTab :summary="externalWallSummary" :selected="tabProps.currentTab === 0">
					<template #empty>
						<h2 class="govuk-heading-m">No external walls added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(externalWallSummary.id)}/external/create`">
							Add external walls
						</NuxtLink>
					</template>
				</GovSummaryTab>

				<GovSummaryTab :summary="internalWallSummary" :selected="tabProps.currentTab === 1">
					<template #empty>
						<h2 class="govuk-heading-m">No internal walls added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(internalWallSummary.id)}/internal/create`">
							Add internal walls
						</NuxtLink>
					</template>
				</GovSummaryTab>

				<GovSummaryTab :summary="wallToUnheatedSpaceSummary" :selected="tabProps.currentTab === 2">
					<template #empty>
						<h2 class="govuk-heading-m">No walls to unheated spaces added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(wallToUnheatedSpaceSummary.id)}/wall-to-unheated-space/create`">
							Add walls to unheated spaces
						</NuxtLink>
					</template>
				</GovSummaryTab>

				<GovSummaryTab :summary="partyWallSummary" :selected="tabProps.currentTab === 3">
					<template #empty>
						<h2 class="govuk-heading-m">No party walls added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(partyWallSummary.id)}/party/create`">
							Add party walls
						</NuxtLink>
					</template>
				</GovSummaryTab>
			</GovTabs>

			<GovTabs v-slot="tabProps" :items="getTabItems(ceilingAndRoofSummarySections)">
				<GovSummaryTab :summary="ceilingSummary" :selected="tabProps.currentTab === 0">
					<template #empty>
						<h2 class="govuk-heading-m">No ceilings added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(ceilingSummary.id)}/ceilings/create`">
							Add ceilings
						</NuxtLink>
					</template>
				</GovSummaryTab>

				<GovSummaryTab :summary="roofSummary" :selected="tabProps.currentTab === 1">
					<template #empty>
						<h2 class="govuk-heading-m">No roofs added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(roofSummary.id)}/roofs/create`">
							Add roofs
						</NuxtLink>
					</template>
				</GovSummaryTab>
			</GovTabs>

			<GovTabs v-slot="tabProps" :items="getTabItems(doorSummarySections)">
				<GovSummaryTab :summary="unglazedDoorSummary" :selected="tabProps.currentTab === 0">
					<template #empty>
						<h2 class="govuk-heading-m">No external unglazed doors added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(unglazedDoorSummary.id)}/external-unglazed/create`">
							Add external unglazed doors
						</NuxtLink>
					</template>
				</GovSummaryTab>

				<GovSummaryTab :summary="glazedDoorSummary" :selected="tabProps.currentTab === 1">
					<template #empty>
						<h2 class="govuk-heading-m">No external glazed doors added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(glazedDoorSummary.id)}/external-glazed/create`">
							Add external glazed doors
						</NuxtLink>
					</template>
				</GovSummaryTab>

				<GovSummaryTab :summary="internalDoorSummary" :selected="tabProps.currentTab === 2">
					<template #empty>
						<h2 class="govuk-heading-m">No internal doors added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(internalDoorSummary.id)}/internal/create`">
							Add internal doors
						</NuxtLink>
					</template>
				</GovSummaryTab>
			</GovTabs>

			<GovTabs v-slot="tabProps" :items="getTabItems([windowSummary])">
				<GovSummaryTab :summary="windowSummary" :selected="tabProps.currentTab === 0">
					<template #empty>
						<h2 class="govuk-heading-m">No windows added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(windowSummary.id)}/windows/create`">
							Add windows
						</NuxtLink>
					</template>
				</GovSummaryTab>
			</GovTabs>

			<GovTabs v-slot="tabProps" :items="getTabItems(thermalBridgeSummarySections)">
				<GovSummaryTab :summary="linearThermalBridgesSummary" :selected="tabProps.currentTab === 0">
					<template #empty>
						<h2 class="govuk-heading-m">No linear thermal bridges added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(linearThermalBridgesSummary.id)}/linear/create`">
							Add linear thermal bridges
						</NuxtLink>
					</template>
				</GovSummaryTab>

				<GovSummaryTab :summary="pointThermalBridgesSummary" :selected="tabProps.currentTab === 1">
					<template #empty>
						<h2 class="govuk-heading-m">No point thermal bridges added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(pointThermalBridgesSummary.id)}/point/create`">
							Add point thermal bridges
						</NuxtLink>
					</template>
				</GovSummaryTab>
			</GovTabs>
			<NuxtLink to="/" class="govuk-button">Return to task list</NuxtLink>
		</NuxtLayout>
	</div>
</template>