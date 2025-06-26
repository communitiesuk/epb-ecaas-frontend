<script setup lang="ts">
const title = "Walls";
const page = usePage();
const store = useEcaasStore();

type WallType = keyof typeof store.dwellingFabric.dwellingSpaceWalls;
interface WallData extends ExternalWallData, InternalWallData, WallsToUnheatedSpaceData, PartyWallData {}

function handleRemove( wallType: WallType, index: number) {
	const walls = store.dwellingFabric.dwellingSpaceWalls[wallType]?.data;

	if (walls) {
		walls.splice(index, 1);

		store.$patch((state) => {
			state.dwellingFabric.dwellingSpaceWalls[wallType]!.data = walls.length ? walls : [];
			state.dwellingFabric.dwellingSpaceWalls[wallType]!.complete = false;
		});
	}
}

function handleDuplicate<T extends WallData>(wallType: WallType, index: number) {
	const walls = store.dwellingFabric.dwellingSpaceWalls[wallType]?.data;
	const wall = walls?.[index];

	if (wall) {
		const duplicates = walls.filter(w => w.name.match(duplicateNamePattern(wall.name)));
	
		store.$patch((state) => {
			const newWall = {
				...wall, 
				name: `${wall.name} (${duplicates.length})`
			} as T;

			state.dwellingFabric.dwellingSpaceWalls[wallType]!.data.push(newWall);
			state.dwellingFabric.dwellingSpaceWalls[wallType]!.complete = false;
		});
	}
}

function handleComplete() {
	store.$patch({
		dwellingFabric: {
			dwellingSpaceWalls: {
				dwellingSpaceExternalWall: { complete: true },
				dwellingSpaceInternalWall: { complete: true },
				dwellingSpacePartyWall: { complete: true },
				dwellingSpaceWallToUnheatedSpace: { complete: true }
			}
		}
	});

	navigateTo('/dwelling-space');
}
function checkIsComplete(){
	const walls = store.dwellingFabric.dwellingSpaceWalls;
	return Object.values(walls).every(wall => wall.complete);
}

</script>
<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<CustomList
		id="external"
		title="External wall"
		:form-url="`${page?.url!}/external`"
		:items="store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceExternalWall?.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('dwellingSpaceExternalWall', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceExternalWall', index)"
	/>
	<CustomList
		id="internal"
		title="Internal wall"
		:form-url="`${page?.url!}/internal`"
		:items="store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceInternalWall?.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('dwellingSpaceInternalWall', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceInternalWall', index)"
	/>
	<CustomList
		id="toHeatedSpace"
		title="Wall to unheated space"
		:form-url="`${page?.url!}/wall-to-unheated-space`"
		:items="store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceWallToUnheatedSpace?.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('dwellingSpaceWallToUnheatedSpace', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceWallToUnheatedSpace', index)"
	/>
	<CustomList
		id="party"
		title="Party wall"
		:form-url="`${page?.url!}/party`"
		:items="store.dwellingFabric.dwellingSpaceWalls.dwellingSpacePartyWall?.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('dwellingSpacePartyWall', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpacePartyWall', index)"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton
			href="/dwelling-space"
			secondary
		>
			Return to overview
		</GovButton>
		<CompleteElement :is-complete="checkIsComplete()" @completed="handleComplete"/>

	</div>
</template>