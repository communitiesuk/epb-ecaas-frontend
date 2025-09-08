<script setup lang="ts">
const title = "Floor elements";
const page = usePage();
const store = useEcaasStore();

type FloorType = keyof typeof store.dwellingFabric.dwellingSpaceFloors;
type FloorData = GroundFloorData & InternalFloorData & ExposedFloorData;

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

function handleDuplicate<T extends FloorData>(floorType: FloorType, index: number) {
	const floors  = store.dwellingFabric.dwellingSpaceFloors[floorType]?.data;
	const floor = floors?.[index];
    
	if (floor) {
		const newName = "data" in floor ? floor.data.name : floor.name;
		const duplicates = floors.filter(f => "data" in f ? f.data.name.match(duplicateNamePattern(newName)) : f.name.match(duplicateNamePattern(newName)));
		
		store.$patch((state) => {
			const newFloor = {
				...floor,
				name: `${newName} (${duplicates.length})`
			} as T;
			
			if (floorType === "dwellingSpaceGroundFloor" && "data" in floor) {
				state.dwellingFabric.dwellingSpaceFloors[floorType].data.push({
					data: {
						...floor.data,
						name: `${newName} (${duplicates.length})`
					},
					complete: floor.complete
				});
			} else if (floorType === "dwellingSpaceInternalFloor" || floorType === "dwellingSpaceExposedFloor") {
				state.dwellingFabric.dwellingSpaceFloors[floorType].data.push(newFloor);
			}
		});
		store.dwellingFabric.dwellingSpaceFloors[floorType].complete = false;
	}
}

function handleComplete() {
	store.$patch({
		dwellingFabric: {
			dwellingSpaceFloors: {
				dwellingSpaceExposedFloor: { complete: true },
				dwellingSpaceGroundFloor: { complete: true },
				dwellingSpaceInternalFloor: { complete: true }
			}
		}
	});

	navigateTo("/dwelling-space");
}

function checkIsComplete(){
	const floors = store.dwellingFabric.dwellingSpaceFloors;
	return Object.values(floors).every(floor => floor.complete);
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
		:items="store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceGroundFloor.data.map(x => x.data.name)"
		@remove="(index: number) => handleRemove('dwellingSpaceGroundFloor', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceGroundFloor', index)"
	/>
	<CustomList
		id="internal"
		title="Internal floor"
		:form-url="`${page?.url!}/internal`"
		:items="store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor?.data?.map(x => x.name)"
		@remove="(index: number) => handleRemove('dwellingSpaceInternalFloor', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceInternalFloor', index)"
	/>
	<CustomList
		id="exposed"
		title="Exposed floor"
		:form-url="`${page?.url!}/exposed`"
		:items="store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceExposedFloor?.data?.map(x => x.name)"
		@remove="(index: number) => handleRemove('dwellingSpaceExposedFloor', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceExposedFloor', index)"

	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton
			href="/dwelling-space"
			secondary
		>
			Return to dwelling space
		</GovButton>
		<CompleteElement :is-complete="checkIsComplete()" @completed="handleComplete"/>

	</div>
</template>
