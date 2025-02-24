<script setup lang="ts">
const title = "Doors";
const page = usePage();
const store = useEcaasStore();

type DoorType = keyof typeof store.livingSpaceFabric.livingSpaceDoors;
interface DoorData extends ExternalUnglazedDoorData, ExternalGlazedDoorData, InternalDoorData {};

function handleRemove(doorType: DoorType, index: number) {
	const doors = store.livingSpaceFabric.livingSpaceDoors[doorType]?.data;

	if (doors) {
		doors.splice(index, 1);

		store.$patch((state) => {
			state.livingSpaceFabric.livingSpaceDoors[doorType]!.data = doors.length ? doors : [];
			state.livingSpaceFabric.livingSpaceDoors[doorType]!.complete = doors.length > 0;
		});
	}
} 

function handleDuplicate<T extends DoorData>(doorType: DoorType, index: number) {
	const doors  = store.livingSpaceFabric.livingSpaceDoors[doorType]?.data;
	const door = doors?.[index];
    
	if (door) {
		const duplicates = doors.filter(f => f.name.match(duplicateNamePattern(door.name)));

		store.$patch((state) => {
			const newDoor = {
				...door,
				name: `${door.name} (${duplicates.length})`
			} as T;

			state.livingSpaceFabric.livingSpaceDoors[doorType]!.data.push(newDoor);
		});
	}
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
		id="externalUnglazed"
		title="External unglazed door"
		:form-url="`${page?.url!}/external-unglazed`"
		:items="store.livingSpaceFabric.livingSpaceDoors.livingSpaceExternalUnglazedDoor.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('livingSpaceExternalUnglazedDoor', index)"
		@duplicate="(index: number) => handleDuplicate('livingSpaceExternalUnglazedDoor', index)"
	/>
	<GovCustomList
		id="externalGlazed"
		title="External glazed door"
		:form-url="`${page?.url!}/external-glazed`"
		:items="store.livingSpaceFabric.livingSpaceDoors.livingSpaceExternalGlazedDoor.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('livingSpaceExternalGlazedDoor', index)"
		@duplicate="(index: number) => handleDuplicate('livingSpaceExternalGlazedDoor', index)"
	/>
	<GovCustomList
		id="internal"
		title="Internal door"
		:form-url="`${page?.url!}/internal`"
		:items="store.livingSpaceFabric.livingSpaceDoors.livingSpaceInternalDoor.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('livingSpaceInternalDoor', index)"
		@duplicate="(index: number) => handleDuplicate('livingSpaceInternalDoor', index)"
	/>

	<GovButton
		href="/living-space"
		secondary
	>
		Return to living space overview
	</GovButton>
</template>
