<script setup lang="ts">
import type { SummarySection } from '~/common.types';
import { getUrl, getTabItems } from '#imports';

const title = "Living space fabric summary";
const store = useEcaasStore();

definePageMeta({ layout: false });

const groundFloorData = store.livingSpaceFabric.livingSpaceFloors.livingSpaceGroundFloor.data;
const internalFloorData = store.livingSpaceFabric.livingSpaceFloors.livingSpaceInternalFloor?.data;
const exposedFloorData = store.livingSpaceFabric.livingSpaceFloors.livingSpaceExposedFloor?.data;

const groundFloorSummary: SummarySection = {
	id: 'livingSpaceFloors',
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
			"Thermal transmittance of walls above ground": x.wallsAboveGroundThermalTransmittance,
			"Area of ventilation openings per perimeter": x.ventilationOpeningsArea,
			"Depth of basement floor below ground level": x.basementFloorDepth,
			"Thermal resistance of walls of basement": x.thermalResistanceOfBasementWalls,
			"Thermal transmittance of floor above basement": x.thermalTransmittanceOfFloorAboveBasement,
			"Thermal transmittance of walls of the basement": x.thermalTransmittanceOfBasementWalls,
			"Height of the basement walls above ground level": x.heightOfBasementWallsAboveGround
		};
	})
};

const internalFloorSummary: SummarySection = {
	id: 'livingSpaceFloors',
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
	}) || []
};

const exposedFloorSummary: SummarySection = {
	id: 'livingSpaceFloors',
	label: 'Exposed floor',
	data: exposedFloorData?.map(x => {
		return {
			"Name": x.name,
			"Pitch": x.pitch,
			"Orientation": x.orientation,
			"Height": x.height,
			"Width": x.width,
			"Elevational height of building element at its base": x.elevationalHeight,
			"Surface area": x.surfaceArea,
			"Solar absorption coefficient": x.solarAbsorbtion,
			"U-value": x.uValue,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": x.massDistributionClass
		};
	}) || []
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
	id: 'livingSpaceWalls',
	label: 'External wall',
	data: externalWallData.map(x => {
		return {
			"Name": x.name,
			"Pitch": x.pitch,
			"Orientation": x.orientation,
			"Height": x.height,
			"Width": x.width,
			"Elevational height of building element at its base": x.elevationalHeight,
			"Surface area": x.surfaceArea,
			"Solar absorption coefficient": x.solarAbsorbtion,
			"U-value": x.uValue,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": x.massDistributionClass
		};
	})
};

const internalWallSummary: SummarySection = {
	id: 'livingSpaceWalls',
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
	})
};

const wallToUnheatedSpaceSummary: SummarySection = {
	id: 'livingSpaceWalls',
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
	}) || []
};

const partyWallSummary: SummarySection = {
	id: 'livingSpaceWalls',
	label: 'Party wall',
	data: partyWallData?.map(x => {
		return {
			"Name": x.name,
			"Pitch": x.pitch,
			"Orientation": x.orientation,
			"Height": x.height,
			"Width": x.width,
			"Elevational height of building element at its base": x.elevationalHeight,
			"Surface area": x.surfaceArea,
			"Solar absorption coefficient": x.solarAbsorbtion,
			"U-value": x.uValue,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": x.massDistributionClass
		};
	}) || []
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
	id: 'livingSpaceCeilingsAndRoofs',
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
	})
};

const roofSummary: SummarySection = {
	id: 'livingSpaceCeilingsAndRoofs',
	label: 'Roof',
	data: roofData.map(x => {
		return {
			"Name": x.name,
			"Type of roof": x.typeOfRoof,
			"Pitch": x.pitch,
			"Orientation": x.orientation,
			"Height": x.height,
			"Width": x.width,
			"Elevational height of building element at its base": x.elevationalHeightOfElement,
			"Surface area": x.surfaceArea,
			"Solar absorption coefficient": x.solarAbsorbtionCoefficient,
			"U-value": x.uValue,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": x.massDistributionClass
		};
	})
};

const ceilingAndRoofSummarySections: SummarySection[] = [
	ceilingSummary,
	roofSummary
];

const unglazedDoorData = store.livingSpaceFabric.livingSpaceDoors.livingSpaceExternalUnglazedDoor.data;
const glazedDoorData = store.livingSpaceFabric.livingSpaceDoors.livingSpaceExternalGlazedDoor.data;
const internalDoorData = store.livingSpaceFabric.livingSpaceDoors.livingSpaceInternalDoor.data;

const unglazedDoorSummary: SummarySection = {
	id: 'livingSpaceDoors',
	label: 'External unglazed door',
	data: unglazedDoorData.map(x => {
		return {
			"Name": x.name,
			"Pitch": x.pitch,
			"Orientation": x.orientation,
			"Height": x.height,
			"Width": x.width,
			"Elevational height of building element at its base": x.elevationalHeight,
			"Surface area": x.surfaceArea,
			"Solar absorption coefficient": x.solarAbsorbtion,
			"U-value": x.uValue,
			"Areal heat capacity": x.kappaValue,
			"Mass distribution class": x.massDistributionClass
		};
	})
};

const glazedDoorSummary: SummarySection = {
	id: 'livingSpaceDoors',
	label: 'External glazed door',
	data: glazedDoorData.map(x => {
		return {
			"Name": x.name,
			"Orientation": x.orientation,
			"Surface area": x.surfaceArea,
			"Height": x.height,
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
	})
};

const internalDoorSummary: SummarySection = {
	id: 'livingSpaceDoors',
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
	}) || []
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
	data: windowData.windowObjects?.map(x => {
		return {
			"Name": x.name,
			"Orientation": x.orientation,
			"Surface area": x.surfaceArea,
			"Height": x.height,
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
	}) || []
};

const linearThermalBridgesData = store.livingSpaceFabric.livingSpaceThermalBridging.livingSpaceLinearThermalBridges.data;
const pointThermalBridgesData = store.livingSpaceFabric.livingSpaceThermalBridging.livingSpacePointThermalBridges.data;

const linearThermalBridgesSummary: SummarySection = {
	id: 'livingSpaceThermalBridging',
	label: 'Linear thermal bridges',
	data: linearThermalBridgesData.map(x => {
		return {
			"Name": x.name,
			"Type of thermal bridge": x.typeOfThermalBridge,
			"Linear thermal transmittance": x.linearThermalTransmittance,
			"Length of thermal bridge": x.length
		};
	})
};

const pointThermalBridgesSummary: SummarySection = {
	id: 'livingSpaceThermalBridging',
	label: 'Point thermal bridges',
	data: pointThermalBridgesData.map(x => {
		return {
			"Name": x.name,
			"Heat transfer coefficient": x.heatTransferCoefficient
		};
	})
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
			<GovTabs v-slot="tabProps" :items="getTabItems(floorSummarySections)">
				<GovTabPanel
					:id="groundFloorSummary.id"
					:data-testid="groundFloorSummary.id"
					:selected="tabProps.currentTab === 0"
				>
					<template v-if="groundFloorSummary.data.length">
						<h2 class="govuk-heading-m">{{ groundFloorSummary.label }}</h2>
						<GovSummaryList :data="groundFloorSummary.data" />
						<NuxtLink class="govuk-link" :to="getUrl(groundFloorSummary.id)">Edit</NuxtLink>
					</template>
					<template v-if="!groundFloorSummary.data.length">
						<h2 class="govuk-heading-m">No ground floors added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(groundFloorSummary.id)}/ground/create`">
							Add ground floors
						</NuxtLink>
					</template>
				</GovTabPanel>

				<GovTabPanel
					:id="internalFloorSummary.id"
					:data-testid="internalFloorSummary.id"
					:selected="tabProps.currentTab === 1"
				>
					<template v-if="internalFloorSummary.data.length">
						<h2 class="govuk-heading-m">{{ internalFloorSummary.label }}</h2>
						<GovSummaryList :data="internalFloorSummary.data" />
						<NuxtLink class="govuk-link" :to="getUrl(internalFloorSummary.id)">Edit</NuxtLink>
					</template>
					<template v-if="!internalFloorSummary.data.length">
						<h2 class="govuk-heading-m">No internal floors added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(internalFloorSummary.id)}/internal/create`">
							Add internal floors
						</NuxtLink>
					</template>
				</GovTabPanel>

				<GovTabPanel
					:id="exposedFloorSummary.id"
					:data-testid="exposedFloorSummary.id"
					:selected="tabProps.currentTab === 2"
				>
					<template v-if="exposedFloorSummary.data.length">
						<h2 class="govuk-heading-m">{{ exposedFloorSummary.label }}</h2>
						<GovSummaryList :data="exposedFloorSummary.data" />
						<NuxtLink class="govuk-link" :to="getUrl(exposedFloorSummary.id)">Edit</NuxtLink>
					</template>
					<template v-if="!exposedFloorSummary.data.length">
						<h2 class="govuk-heading-m">No exposed floors added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(exposedFloorSummary.id)}/exposed/create`">
							Add internal floors
						</NuxtLink>
					</template>
				</GovTabPanel>
			</GovTabs>

			<GovTabs v-slot="tabProps" :items="getTabItems(wallSummarySections)">
				<GovTabPanel
					:id="externalWallSummary.id"
					:data-testid="externalWallSummary.id"
					:selected="tabProps.currentTab === 0"
				>
					<template v-if="externalWallSummary.data.length">
						<h2 class="govuk-heading-m">{{ externalWallSummary.label }}</h2>
						<GovSummaryList :data="externalWallSummary.data" />
						<NuxtLink class="govuk-link" :to="getUrl(externalWallSummary.id)">Edit</NuxtLink>
					</template>
					<template v-if="!externalWallSummary.data.length">
						<h2 class="govuk-heading-m">No external walls added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(groundFloorSummary.id)}/external/create`">
							Add external walls
						</NuxtLink>
					</template>
				</GovTabPanel>

				<GovTabPanel
					:id="internalWallSummary.id"
					:data-testid="internalWallSummary.id"
					:selected="tabProps.currentTab === 1"
				>
					<template v-if="internalWallSummary.data.length">
						<h2 class="govuk-heading-m">{{ internalWallSummary.label }}</h2>
						<GovSummaryList :data="internalWallSummary.data" />
						<NuxtLink class="govuk-link" :to="getUrl(internalWallSummary.id)">Edit</NuxtLink>
					</template>
					<template v-if="!internalWallSummary.data.length">
						<h2 class="govuk-heading-m">No internal walls added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(internalWallSummary.id)}/internal/create`">
							Add internal walls
						</NuxtLink>
					</template>
				</GovTabPanel>

				<GovTabPanel
					:id="wallToUnheatedSpaceSummary.id"
					:data-testid="wallToUnheatedSpaceSummary.id"
					:selected="tabProps.currentTab === 2"
				>
					<template v-if="wallToUnheatedSpaceSummary.data.length">
						<h2 class="govuk-heading-m">{{ wallToUnheatedSpaceSummary.label }}</h2>
						<GovSummaryList :data="wallToUnheatedSpaceSummary.data" />
						<NuxtLink class="govuk-link" :to="getUrl(wallToUnheatedSpaceSummary.id)">Edit</NuxtLink>
					</template>
					<template v-if="!wallToUnheatedSpaceSummary.data.length">
						<h2 class="govuk-heading-m">No walls to unheated spaces added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(wallToUnheatedSpaceSummary.id)}/wall-to-unheated-space/create`">
							Add walls to unheated spaces
						</NuxtLink>
					</template>
				</GovTabPanel>

				<GovTabPanel
					:id="partyWallSummary.id"
					:data-testid="partyWallSummary.id"
					:selected="tabProps.currentTab === 3"
				>
					<template v-if="partyWallSummary.data.length">
						<h2 class="govuk-heading-m">{{ partyWallSummary.label }}</h2>
						<GovSummaryList :data="partyWallSummary.data" />
						<NuxtLink class="govuk-link" :to="getUrl(partyWallSummary.id)">Edit</NuxtLink>
					</template>
					<template v-if="!partyWallSummary.data.length">
						<h2 class="govuk-heading-m">No party walls added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(partyWallSummary.id)}/party/create`">
							Add party walls
						</NuxtLink>
					</template>
				</GovTabPanel>
			</GovTabs>

			<GovTabs v-slot="tabProps" :items="getTabItems(ceilingAndRoofSummarySections)">
				<GovTabPanel
					:id="ceilingSummary.id"
					:data-testid="ceilingSummary.id"
					:selected="tabProps.currentTab === 0"
				>
					<template v-if="ceilingSummary.data.length">
						<h2 class="govuk-heading-m">{{ ceilingSummary.label }}</h2>
						<GovSummaryList :data="ceilingSummary.data" />
						<NuxtLink class="govuk-link" :to="getUrl(ceilingSummary.id)">Edit</NuxtLink>
					</template>
					<template v-if="!ceilingSummary.data.length">
						<h2 class="govuk-heading-m">No ceilings added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(ceilingSummary.id)}/ceilings/create`">
							Add ceilings
						</NuxtLink>
					</template>
				</GovTabPanel>

				<GovTabPanel
					:id="roofSummary.id"
					:data-testid="roofSummary.id"
					:selected="tabProps.currentTab === 1"
				>
					<template v-if="roofSummary.data.length">
						<h2 class="govuk-heading-m">{{ roofSummary.label }}</h2>
						<GovSummaryList :data="roofSummary.data" />
						<NuxtLink class="govuk-link" :to="getUrl(roofSummary.id)">Edit</NuxtLink>
					</template>
					<template v-if="!roofSummary.data.length">
						<h2 class="govuk-heading-m">No roofs added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(roofSummary.id)}/roofs/create`">
							Add roofs
						</NuxtLink>
					</template>
				</GovTabPanel>
			</GovTabs>

			<GovTabs v-slot="tabProps" :items="getTabItems(doorSummarySections)">
				<GovTabPanel
					:id="unglazedDoorSummary.id"
					:data-testid="unglazedDoorSummary.id"
					:selected="tabProps.currentTab === 0"
				>
					<template v-if="unglazedDoorSummary.data.length">
						<h2 class="govuk-heading-m">{{ unglazedDoorSummary.label }}</h2>
						<GovSummaryList :data="unglazedDoorSummary.data" />
						<NuxtLink class="govuk-link" :to="getUrl(unglazedDoorSummary.id)">Edit</NuxtLink>
					</template>
					<template v-if="!unglazedDoorSummary.data.length">
						<h2 class="govuk-heading-m">No external unglazed doors added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(unglazedDoorSummary.id)}/external-unglazed/create`">
							Add external unglazed doors
						</NuxtLink>
					</template>
				</GovTabPanel>

				<GovTabPanel
					:id="internalFloorSummary.id"
					:data-testid="internalFloorSummary.id"
					:selected="tabProps.currentTab === 1"
				>
					<template v-if="internalFloorSummary.data.length">
						<h2 class="govuk-heading-m">{{ internalFloorSummary.label }}</h2>
						<GovSummaryList :data="internalFloorSummary.data" />
						<NuxtLink class="govuk-link" :to="getUrl(internalFloorSummary.id)">Edit</NuxtLink>
					</template>
					<template v-if="!internalFloorSummary.data.length">
						<h2 class="govuk-heading-m">No internal floors added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(internalFloorSummary.id)}/internal/create`">
							Add internal floors
						</NuxtLink>
					</template>
				</GovTabPanel>

				<GovTabPanel
					:id="exposedFloorSummary.id"
					:data-testid="exposedFloorSummary.id"
					:selected="tabProps.currentTab === 2"
				>
					<template v-if="exposedFloorSummary.data.length">
						<h2 class="govuk-heading-m">{{ exposedFloorSummary.label }}</h2>
						<GovSummaryList :data="exposedFloorSummary.data" />
						<NuxtLink class="govuk-link" :to="getUrl(exposedFloorSummary.id)">Edit</NuxtLink>
					</template>
					<template v-if="!exposedFloorSummary.data.length">
						<h2 class="govuk-heading-m">No exposed floors added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(exposedFloorSummary.id)}/exposed/create`">
							Add internal floors
						</NuxtLink>
					</template>
				</GovTabPanel>
			</GovTabs>

			<GovTabs v-slot="tabProps" :items="getTabItems([windowSummary])">
				<GovTabPanel
					:id="windowSummary.id"
					:data-testid="windowSummary.id"
					:selected="tabProps.currentTab === 0"
				>
					<template v-if="windowSummary.data.length">
						<h2 class="govuk-heading-m">{{ windowSummary.label }}</h2>
						<GovSummaryList :data="windowSummary.data" />
						<NuxtLink class="govuk-link" :to="getUrl(windowSummary.id)">Edit</NuxtLink>
					</template>
					<template v-if="!windowSummary.data.length">
						<h2 class="govuk-heading-m">No windows added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(windowSummary.id)}/windows/create`">
							Add windows
						</NuxtLink>
					</template>
				</GovTabPanel>
			</GovTabs>

			<GovTabs v-slot="tabProps" :items="getTabItems(thermalBridgeSummarySections)">
				<GovTabPanel
					:id="linearThermalBridgesSummary.id"
					:data-testid="linearThermalBridgesSummary.id"
					:selected="tabProps.currentTab === 0"
				>
					<template v-if="linearThermalBridgesSummary.data.length">
						<h2 class="govuk-heading-m">{{ linearThermalBridgesSummary.label }}</h2>
						<GovSummaryList :data="linearThermalBridgesSummary.data" />
						<NuxtLink class="govuk-link" :to="getUrl(linearThermalBridgesSummary.id)">Edit</NuxtLink>
					</template>
					<template v-if="!linearThermalBridgesSummary.data.length">
						<h2 class="govuk-heading-m">No linear thermal bridges added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(linearThermalBridgesSummary.id)}/linear/create`">
							Add linear thermal bridges
						</NuxtLink>
					</template>
				</GovTabPanel>

				<GovTabPanel
					:id="pointThermalBridgesSummary.id"
					:data-testid="pointThermalBridgesSummary.id"
					:selected="tabProps.currentTab === 1"
				>
					<template v-if="pointThermalBridgesSummary.data.length">
						<h2 class="govuk-heading-m">{{ pointThermalBridgesSummary.label }}</h2>
						<GovSummaryList :data="pointThermalBridgesSummary.data" />
						<NuxtLink class="govuk-link" :to="getUrl(pointThermalBridgesSummary.id)">Edit</NuxtLink>
					</template>
					<template v-if="!pointThermalBridgesSummary.data.length">
						<h2 class="govuk-heading-m">No point thermal bridges added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(pointThermalBridgesSummary.id)}/point/create`">
							Add point thermal bridges
						</NuxtLink>
					</template>
				</GovTabPanel>
			</GovTabs>
			<NuxtLink to="/" class="govuk-button">Return to task list</NuxtLink>
		</NuxtLayout>
	</div>
</template>