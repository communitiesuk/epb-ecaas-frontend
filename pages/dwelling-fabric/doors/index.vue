<script setup lang="ts">
import { isEcaasForm, type EcaasForm, type ExternalGlazedDoorData, type InternalDoorData } from "~/stores/ecaasStore.schema";
import formStatus from "~/constants/formStatus";

const title = "Doors";
const page = usePage();
const store = useEcaasStore();

type DoorType = keyof typeof store.dwellingFabric.dwellingSpaceDoors;
type DoorData = EcaasForm<ExternalUnglazedDoorData> & EcaasForm<ExternalGlazedDoorData> & EcaasForm<InternalDoorData>;

function isFrontDoor(door: EcaasForm<ExternalUnglazedDoorData | ExternalGlazedDoorData | InternalDoorData>) {
	return door.complete && "isTheFrontDoor" in door.data && door.data.isTheFrontDoor;
}
function handleRemove(doorType: DoorType, index: number) {
	const doors = store.dwellingFabric.dwellingSpaceDoors[doorType]?.data;
	const windows = store.dwellingFabric.dwellingSpaceWindows.data;

	if (doors) {
		doors.splice(index, 1);

		store.$patch((state) => {
			state.dwellingFabric.dwellingSpaceDoors[doorType].data = doors.length ? doors : [];
			state.dwellingFabric.dwellingSpaceDoors[doorType].complete = false;
		});
	}

	if (doorType === "dwellingSpaceExternalGlazedDoor" && !doors.length && !windows.length) {
		store.$patch((state) => {
			state.dwellingFabric.dwellingSpaceWindows.complete = false;
		});
	}
} 

function handleDuplicate<T extends DoorData>(doorType: DoorType, index: number) {
	const doors = store.dwellingFabric.dwellingSpaceDoors[doorType]?.data;
	const door = doors?.[index] as EcaasForm<ExternalUnglazedDoorData | ExternalGlazedDoorData | InternalDoorData>;
	let name: string;
    
	if (door) {
		const duplicates = doors.filter(f => {
			if (isEcaasForm(f) && isEcaasForm(door)) {
				name = door.data.name;
				return f.data.name.match(duplicateNamePattern(door.data.name));
			}
			return false;
		});

		store.$patch((state) => {
			const newItem = {
				complete: isFrontDoor(door) ? false : door.complete,
				data: {
					...door.data,
					name: `${name} (${duplicates.length})`,
				},
			} as T;

			state.dwellingFabric.dwellingSpaceDoors[doorType].data.push(newItem);
			store.dwellingFabric.dwellingSpaceDoors[doorType].complete = false;
		});
	}
}

function handleComplete() {
	store.$patch({
		dwellingFabric: {
			dwellingSpaceDoors: {
				dwellingSpaceExternalGlazedDoor: { complete: true },
				dwellingSpaceExternalUnglazedDoor: { complete: true },
				dwellingSpaceInternalDoor: { complete: true },
			},
		},
	});

	navigateTo("/dwelling-fabric");
}

const hasIncompleteEntries = () =>
	Object.values(store.dwellingFabric.dwellingSpaceDoors)
		.some(section => section.data.some(item => isEcaasForm(item) && !item.complete));

</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<CustomList
		id="externalUnglazed"
		title="External unglazed door"
		:form-url="`${page?.url!}/external-unglazed`"
		:items="store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalUnglazedDoor.data.filter(x => isEcaasForm(x)).map(x => ({
			name: x.data?.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		@remove="(index: number) => handleRemove('dwellingSpaceExternalUnglazedDoor', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceExternalUnglazedDoor', index)"
	/>
	<CustomList
		id="externalGlazed"
		title="External glazed door"
		:form-url="`${page?.url!}/external-glazed`"
		:items="store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor.data.filter(x => isEcaasForm(x)).map(x => ({
			name: x.data?.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		@remove="(index: number) => handleRemove('dwellingSpaceExternalGlazedDoor', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceExternalGlazedDoor', index)"
	/>
	<CustomList
		id="internal"
		title="Internal door"
		:form-url="`${page?.url!}/internal`"
		:items="store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceInternalDoor.data.filter(x => isEcaasForm(x)).map(x => ({
			name: x.data?.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		@remove="(index: number) => handleRemove('dwellingSpaceInternalDoor', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceInternalDoor', index)"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton
			href="/dwelling-fabric"
			secondary
		>
			Return to dwelling fabric
		</GovButton>
		<CompleteElement
			:is-complete="Object.values(store.dwellingFabric.dwellingSpaceDoors).every(section => section.complete)"
			:disabled="hasIncompleteEntries()"
			@completed="handleComplete"/>
	</div>
</template>
