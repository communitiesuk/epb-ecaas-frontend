<script setup lang="ts">
const title = "Floor elements";
const page = usePage();
const store = useEcaasStore();

type FloorType = keyof typeof store.livingSpaceFabric.floors.data;

function handleRemove(floorType: FloorType, index: number) {
	const { data } = store.livingSpaceFabric.floors.data[floorType];

	data.splice(index, 1);

	store.$patch((state) => {
		state.livingSpaceFabric.floors.data[floorType].data = data.length ? data : [];
	});
} 

function handleDuplicate(floorType: FloorType, index: number) {
	const floors  = store.livingSpaceFabric.floors.data[floorType].data;
	const floor = floors[index];
	
	if (floor) {
		const duplicates = floors.filter(s => s.name.match(duplicateNamePattern(floor.name)));

		store.$patch((state) => {
			state.livingSpaceFabric.floors.data[floorType].data.push({
				...floor,
				name: `${floor.name} (${duplicates.length})`
			});
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
		id="ground"
		title="Ground floor"
		:form-url="`${page?.url!}/ground`"
		:items="store.livingSpaceFabric.floors.data?.groundFloor?.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('groundFloor', index)"
		@duplicate="(index: number) => handleDuplicate('groundFloor', index)"
	/>
	<GovCustomList
		id="internal"
		title="Internal floor"
		:form-url="`${page?.url!}/internal`"
		:items="store.livingSpaceFabric.floors.data?.internalFloor?.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('internalFloor', index)"
		@duplicate="(index: number) => handleDuplicate('internalFloor', index)"
	/>
	<GovCustomList
		id="exposed"
		title="Exposed floor"
		:form-url="`${page?.url!}/exposed`"
		:items="store.livingSpaceFabric.floors.data?.exposedFloor?.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('exposedFloor', index)"
		@duplicate="(index: number) => handleDuplicate('exposedFloor', index)"

	/>
	<GovButton
		href="/living-space"
		secondary
	>
		Return to overview
	</GovButton>
</template>
