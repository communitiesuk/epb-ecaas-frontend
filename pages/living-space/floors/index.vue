<script setup lang="ts">
const title = "Floor elements";
const page = usePage();
const store = useEcaasStore();

type FloorType = keyof typeof store.livingSpaceFabric.livingSpaceFloors;
interface FloorData extends GroundFloorData, InternalFloorData, ExposedFloorData {};

function handleRemove(floorType: FloorType, index: number) {
	const floors = store.livingSpaceFabric.livingSpaceFloors[floorType]?.data;

	if (floors) {
		floors.splice(index, 1);

		store.$patch((state) => {
			state.livingSpaceFabric.livingSpaceFloors[floorType]!.data = floors.length ? floors : [];
			state.livingSpaceFabric.livingSpaceFloors[floorType]!.complete = floors.length > 0;
		});
	}
} 

function handleDuplicate<T extends FloorData>(floorType: FloorType, index: number) {
	const floors  = store.livingSpaceFabric.livingSpaceFloors[floorType]?.data;
	const floor = floors?.[index];
    
	if (floor) {
		const duplicates = floors.filter(f => f.name.match(duplicateNamePattern(floor.name)));

		store.$patch((state) => {
			const newFloor = {
				...floor,
				name: `${floor.name} (${duplicates.length})`
			} as T;

			state.livingSpaceFabric.livingSpaceFloors[floorType]!.data.push(newFloor);
		});
	}
}

function handleComplete() {
	store.$patch({
		livingSpaceFabric: {
			livingSpaceFloors: {
				livingSpaceExposedFloor: { complete: true },
				livingSpaceGroundFloor: { complete: true },
				livingSpaceInternalFloor: { complete: true }
			}
		}
	});

	navigateTo('/living-space');
}
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<GovCustomList
		id="ground"
		title="Ground floor"
		:form-url="`${page?.url!}/ground`"
		:items="store.livingSpaceFabric.livingSpaceFloors.livingSpaceGroundFloor.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('livingSpaceGroundFloor', index)"
		@duplicate="(index: number) => handleDuplicate('livingSpaceGroundFloor', index)"
	/>
	<GovCustomList
		id="internal"
		title="Internal floor"
		:form-url="`${page?.url!}/internal`"
		:items="store.livingSpaceFabric.livingSpaceFloors.livingSpaceInternalFloor?.data?.map(x => x.name)"
		@remove="(index: number) => handleRemove('livingSpaceInternalFloor', index)"
		@duplicate="(index: number) => handleDuplicate('livingSpaceInternalFloor', index)"
	/>
	<GovCustomList
		id="exposed"
		title="Exposed floor"
		:form-url="`${page?.url!}/exposed`"
		:items="store.livingSpaceFabric.livingSpaceFloors.livingSpaceExposedFloor?.data?.map(x => x.name)"
		@remove="(index: number) => handleRemove('livingSpaceExposedFloor', index)"
		@duplicate="(index: number) => handleDuplicate('livingSpaceExposedFloor', index)"

	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton
			href="/living-space"
			secondary
		>
			Return to overview
		</GovButton>
		<GovButton data-testid="completeSection" @click="handleComplete">
			Mark section as complete
		</GovButton>
	</div>
</template>
