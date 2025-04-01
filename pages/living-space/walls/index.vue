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

	if (wall) {
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

function handleComplete() {
	store.$patch({
		livingSpaceFabric: {
			livingSpaceWalls: {
				livingSpaceExternalWall: { complete: true },
				livingSpaceInternalWall: { complete: true },
				livingSpacePartyWall: { complete: true },
				livingSpaceWallToUnheatedSpace: { complete: true }
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
		id="external"
		title="External wall"
		:form-url="`${page?.url!}/external`"
		:items="store.livingSpaceFabric.livingSpaceWalls.livingSpaceExternalWall?.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('livingSpaceExternalWall', index)"
		@duplicate="(index: number) => handleDuplicate('livingSpaceExternalWall', index)"
	/>
	<GovCustomList
		id="internal"
		title="Internal wall"
		:form-url="`${page?.url!}/internal`"
		:items="store.livingSpaceFabric.livingSpaceWalls.livingSpaceInternalWall?.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('livingSpaceInternalWall', index)"
		@duplicate="(index: number) => handleDuplicate('livingSpaceInternalWall', index)"
	/>
	<GovCustomList
		id="toHeatedSpace"
		title="Wall to unheated space"
		:form-url="`${page?.url!}/wall-to-unheated-space`"
		:items="store.livingSpaceFabric.livingSpaceWalls.livingSpaceWallToUnheatedSpace?.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('livingSpaceWallToUnheatedSpace', index)"
		@duplicate="(index: number) => handleDuplicate('livingSpaceWallToUnheatedSpace', index)"
	/>
	<GovCustomList
		id="party"
		title="Party wall"
		:form-url="`${page?.url!}/party`"
		:items="store.livingSpaceFabric.livingSpaceWalls.livingSpacePartyWall?.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('livingSpacePartyWall', index)"
		@duplicate="(index: number) => handleDuplicate('livingSpacePartyWall', index)"
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