<script setup lang="ts">
const title = "Walls";
const page = usePage();
const store = useEcaasStore();

type WallType = keyof typeof store.livingSpaceFabric.livingSpaceWalls;
interface WallData extends ExternalWallData, InternalWallData, WallsToUnheatedSpaceData, PartyWallData {}

function handleRemove( wallType: WallType, index: number) {
	const walls = store.livingSpaceFabric.livingSpaceWalls[wallType]?.data;

	if (walls) {
		walls.splice(index, 1);

		store.$patch((state) => {
			state.livingSpaceFabric.livingSpaceWalls[wallType]!.data = walls.length ? walls : [];
			state.livingSpaceFabric.livingSpaceWalls[wallType]!.complete = walls.length > 0;
		});
	}
}

function handleDuplicate<T extends WallData>(wallType: WallType, index: number) {
	const walls = store.livingSpaceFabric.livingSpaceWalls[wallType]?.data;
	const wall = walls?.[index];

	if(wall) {
		const duplicates = walls.filter(w => w.name.match(duplicateNamePattern(wall.name)));
	
		store.$patch((state) => {
			const newWall = {
				...wall, 
				name: `${wall.name} (${duplicates.length})`
			} as T;

			state.livingSpaceFabric.livingSpaceWalls[wallType]!.data.push(newWall);
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
		id="externalWall"
		title="External wall"
		:form-url="`${page?.url!}/external`"
		:items="store.livingSpaceFabric.livingSpaceWalls.externalWalls?.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('externalWalls', index)"
		@duplicate="(index: number) => handleDuplicate('externalWalls', index)"
	/>
	<GovCustomList
		id="internalWall"
		title="Internal wall"
		:form-url="`${page?.url!}/internal`"
		:items="store.livingSpaceFabric.livingSpaceWalls.internalWalls?.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('internalWalls', index)"
		@duplicate="(index: number) => handleDuplicate('internalWalls', index)"
	/>
	<GovCustomList
		id="wallToUnheatedSpace"
		title="Wall to unheated space"
		:form-url="`${page?.url!}/unheated-space`"
		:items="store.livingSpaceFabric.livingSpaceWalls.wallsToUnheatedSpace?.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('wallsToUnheatedSpace', index)"
		@duplicate="(index: number) => handleDuplicate('wallsToUnheatedSpace', index)"
	/>
	<GovCustomList
		id="partyWall"
		title="Party wall"
		:form-url="`${page?.url!}/party`"
		:items="store.livingSpaceFabric.livingSpaceWalls.partyWalls?.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('partyWalls', index)"
		@duplicate="(index: number) => handleDuplicate('partyWalls', index)"
	/>
	<GovButton
		href="/living-space"
		secondary
	>
		Return to overview
	</GovButton>

</template>