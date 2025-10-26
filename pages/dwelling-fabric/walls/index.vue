<script setup lang="ts">
import formStatus from "~/constants/formStatus";
import { v4 as uuidv4 } from "uuid";

const title = "Walls";
const page = usePage();
const store = useEcaasStore();
const { vents } = store.infiltrationAndVentilation
const { dwellingSpaceExternalGlazedDoor } = store.dwellingFabric.dwellingSpaceDoors
const { dwellingSpaceExternalUnglazedDoor } = store.dwellingFabric.dwellingSpaceDoors
const { dwellingSpaceInternalDoor } = store.dwellingFabric.dwellingSpaceDoors

type WallType = keyof typeof store.dwellingFabric.dwellingSpaceWalls;
type WallData = EcaasForm<ExternalWallData> & EcaasForm<InternalWallData> & EcaasForm<WallsToUnheatedSpaceData> & EcaasForm<PartyWallData>;


const { dwellingSpaceWindows } = store.dwellingFabric

function handleRemove(wallType: WallType, index: number) {
	const walls = store.dwellingFabric.dwellingSpaceWalls[wallType]?.data;

	const externalWallId = wallType === "dwellingSpaceExternalWall" && store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceExternalWall.data[index]?.data.id;
	const internalWallId = wallType === "dwellingSpaceInternalWall" && store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceInternalWall.data[index]?.data.id;
	const unheatedSpaceWallId = wallType === "dwellingSpaceWallToUnheatedSpace" && store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceWallToUnheatedSpace.data[index]?.data.id;
	const partyWallId = wallType === "dwellingSpacePartyWall" && store.dwellingFabric.dwellingSpaceWalls.dwellingSpacePartyWall.data[index]?.data.id;

	if (walls) {
		walls.splice(index, 1);

		store.$patch((state) => {
			state.dwellingFabric.dwellingSpaceWalls[wallType].data = walls.length ? walls : [];
			state.dwellingFabric.dwellingSpaceWalls[wallType].complete = false;
		});

		if (externalWallId) {
			store.removeTaggedAssociations()([vents, dwellingSpaceExternalGlazedDoor, dwellingSpaceExternalUnglazedDoor], externalWallId)
			store.removeTaggedAssociations()([dwellingSpaceWindows], externalWallId, "taggedItem")
		}
		if (internalWallId) {
			store.removeTaggedAssociations()([dwellingSpaceInternalDoor], internalWallId)
		}
		if (unheatedSpaceWallId) {
			store.removeTaggedAssociations()([dwellingSpaceInternalDoor], unheatedSpaceWallId);
		}
		if (partyWallId) {
			store.removeTaggedAssociations()([dwellingSpaceInternalDoor], partyWallId);
		}
	}
}

function handleDuplicate<T extends WallData>(wallType: WallType, index: number) {
	const walls = store.dwellingFabric.dwellingSpaceWalls[wallType]?.data;
	const wall = walls?.[index];

	if (wall) {
		const duplicates = walls.filter(w => w.data.name.match(duplicateNamePattern(wall.data.name)));

		store.$patch((state) => {
			const newWall = {
				data: {
					...wall.data,
					id: "id" in wall.data ? uuidv4() : undefined,
					name: `${wall.data.name} (${duplicates.length})`,
				},
			} as T;

			state.dwellingFabric.dwellingSpaceWalls[wallType].data.push(newWall);
			state.dwellingFabric.dwellingSpaceWalls[wallType].complete = false;
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
				dwellingSpaceWallToUnheatedSpace: { complete: true },
			},
		},
	});

	navigateTo("/dwelling-fabric");
}

function checkIsComplete() {
	const walls = store.dwellingFabric.dwellingSpaceWalls;
	return Object.values(walls).every(wall => wall.complete);
}

function hasIncompleteEntries() {
	const wallTypes = store.dwellingFabric.dwellingSpaceWalls;

	return Object.values(wallTypes).some(
		walls => walls.data.some(
			wall => isEcaasForm(wall) ? !wall.complete : false));
}
</script>
<template>

	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<CustomList id="external" title="External wall" :form-url="`${page?.url!}/external`" :items="store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceExternalWall?.data.map(x => ({
		name: x.data?.name,
		status: x.complete ? formStatus.complete : formStatus.inProgress
	}))" :show-status="true" @remove="(index: number) => handleRemove('dwellingSpaceExternalWall', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceExternalWall', index)" />
	<CustomList id="internal" title="Internal wall" :form-url="`${page?.url!}/internal`" :items="store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceInternalWall?.data.map(x => ({
		name: x.data?.name,
		status: x.complete ? formStatus.complete : formStatus.inProgress
	}))" :show-status="true" @remove="(index: number) => handleRemove('dwellingSpaceInternalWall', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceInternalWall', index)" />
	<CustomList id="toHeatedSpace" title="Wall to unheated space" :form-url="`${page?.url!}/wall-to-unheated-space`"
		:items="store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceWallToUnheatedSpace?.data.map(x => ({
			name: x.data?.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))" :show-status="true" @remove="(index: number) => handleRemove('dwellingSpaceWallToUnheatedSpace', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceWallToUnheatedSpace', index)" />
	<CustomList id="party" title="Party wall" :form-url="`${page?.url!}/party`" :items="store.dwellingFabric.dwellingSpaceWalls.dwellingSpacePartyWall?.data.map(x => ({
		name: x.data?.name,
		status: x.complete ? formStatus.complete : formStatus.inProgress
	}))" :show-status="true" @remove="(index: number) => handleRemove('dwellingSpacePartyWall', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpacePartyWall', index)" />
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton href="/dwelling-fabric" secondary>
			Return to dwelling fabric
		</GovButton>
		<CompleteElement :is-complete="checkIsComplete()" :disabled="hasIncompleteEntries()" @completed="handleComplete" />
	</div>
</template>