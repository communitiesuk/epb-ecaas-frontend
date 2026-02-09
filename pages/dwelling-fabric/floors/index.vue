<script setup lang="ts">
import formStatus from "~/constants/formStatus";
import { v4 as uuidv4 } from "uuid";
const title = "Floor elements";
const page = usePage();
const store = useEcaasStore();

type FloorType = keyof typeof store.dwellingFabric.dwellingSpaceFloors;

function handleRemove(floorType: FloorType, index: number) {
	const floors = store.dwellingFabric.dwellingSpaceFloors[floorType]?.data;

	if (floors) {
		floors.splice(index, 1);

		store.$patch((state) => {
			state.dwellingFabric.dwellingSpaceFloors[floorType].data = floors.length ? floors : [];
			state.dwellingFabric.dwellingSpaceFloors[floorType].complete = false;
		});
	}
} 

function handleDuplicate(floorType: FloorType, index: number) {
	const floorCollection = store.dwellingFabric.dwellingSpaceFloors[floorType];
	const floors = floorCollection?.data;
	const floorToDuplicate = floors?.[index];
    
	if (!floorToDuplicate || !floors) return;

	const numberOfFloorsWithSameName = floors.filter(f => 
		f.data.name.match(duplicateNamePattern(floorToDuplicate.data.name)),
	).length;

	const newFloorData = {
		...floorToDuplicate.data,
		name: `${floorToDuplicate.data.name} (${numberOfFloorsWithSameName})`,
	};

	// Add ID for heated basement floors
	if (floorType === "dwellingSpaceFloorOfHeatedBasement") {
		(newFloorData as { id?: string }).id = uuidv4();
	}

	const newFloor = {
		...floorToDuplicate,
		data: newFloorData,
		complete: false,
	};
	
	store.$patch((state) => {
		const targetFloors = state.dwellingFabric.dwellingSpaceFloors[floorType].data as Array<typeof floorToDuplicate>;
		targetFloors.push(newFloor as typeof floorToDuplicate);
		state.dwellingFabric.dwellingSpaceFloors[floorType].complete = false;
	});
}

function handleComplete() {
	store.$patch({
		dwellingFabric: {
			dwellingSpaceFloors: {
				dwellingSpaceExposedFloor: { complete: true },
				dwellingSpaceGroundFloor: { complete: true },
				dwellingSpaceInternalFloor: { complete: true },
				dwellingSpaceFloorAboveUnheatedBasement: { complete: true },
				dwellingSpaceFloorOfHeatedBasement: { complete: true },
			},
		},
	});

	navigateTo("/dwelling-fabric");
}

function checkIsComplete() {
	const floors = store.dwellingFabric.dwellingSpaceFloors;
	return Object.values(floors).every(floor => floor.complete);
}

function hasIncompleteEntries() {
	const floorTypes = store.dwellingFabric.dwellingSpaceFloors;
	
	return Object.values(floorTypes).some(
		floors => floors.data.some(
			floor => !floor.complete));
}
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<p class="govuk-hint">Where you have a multiple storey dwelling, internal floors should be inputted as floors or ceilings. You do not need to enter both.</p>
	<CustomList
		id="ground"
		title="Ground floor"
		:form-url="`${page?.url!}/ground`"
		:items="store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceGroundFloor.data.map(x => ({
			name: x.data.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		@remove="(index: number) => handleRemove('dwellingSpaceGroundFloor', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceGroundFloor', index)"
	/>
	<CustomList
		id="internal"
		title="Internal floor"
		:form-url="`${page?.url!}/internal`"
		:items="store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor.data.map(x => ({
			name: x.data.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		@remove="(index: number) => handleRemove('dwellingSpaceInternalFloor', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceInternalFloor', index)"
	/>
	<CustomList
		id="exposed"
		title="Exposed floor"
		:form-url="`${page?.url!}/exposed`"
		:items="store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceExposedFloor.data.map(x => ({
			name: x.data.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		@remove="(index: number) => handleRemove('dwellingSpaceExposedFloor', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceExposedFloor', index)"
	/>
	<CustomList
		id="aboveUnheatedBasement"
		title="Floors above an unheated basement"
		:form-url="`${page?.url!}/above-unheated-basement`"
		:items="store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorAboveUnheatedBasement.data.map(x => ({
			name: x.data.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		@remove="(index: number) => handleRemove('dwellingSpaceFloorAboveUnheatedBasement', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceFloorAboveUnheatedBasement', index)"
	/>
	<CustomList
		id="floorOfHeatedBasement"
		title="Floors of a heated basement"
		:form-url="`${page.url}/heated-basement`"
		:items="store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceFloorOfHeatedBasement.data.map(x => ({
			name: x.data.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		@remove="(index: number) => handleRemove('dwellingSpaceFloorOfHeatedBasement', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceFloorOfHeatedBasement', index)"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton
			href="/dwelling-fabric"
			secondary
		>
			Return to dwelling space
		</GovButton>
		<CompleteElement :is-complete="checkIsComplete()" :disabled="hasIncompleteEntries()" @completed="handleComplete"/>

	</div>
</template>
