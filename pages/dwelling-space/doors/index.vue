<script setup lang="ts">
import { isEcaasForm } from "~/stores/ecaasStore.schema";
import formStatus from "~/constants/formStatus";

const title = "Doors";
const page = usePage();
const store = useEcaasStore();

type DoorType = keyof typeof store.dwellingFabric.dwellingSpaceDoors;
type DoorData = EcaasForm<ExternalUnglazedDoorData> & EcaasForm<ExternalGlazedDoorData> & InternalDoorData;

function handleRemove(doorType: DoorType, index: number) {
	const doors = store.dwellingFabric.dwellingSpaceDoors[doorType]?.data;

	if (doors) {
		doors.splice(index, 1);

		store.$patch((state) => {
			state.dwellingFabric.dwellingSpaceDoors[doorType].data = doors.length ? doors : [];
			state.dwellingFabric.dwellingSpaceDoors[doorType].complete = false;
		});
	}
} 

function handleDuplicate<T extends DoorData>(doorType: DoorType, index: number) {
	const doors  = store.dwellingFabric.dwellingSpaceDoors[doorType]?.data;
	const door = doors?.[index];
	let name: string;
    
	if (door) {
		const duplicates = doors.filter(f => {
			if (isEcaasForm(f) && isEcaasForm(door)) {
				name = door.data.name;
				return f.data.name.match(duplicateNamePattern(door.data.name));
			} else if (!isEcaasForm(f) && !isEcaasForm(door)) {
				name = door.name;
				return f.name.match(duplicateNamePattern(door.name));
			}

			return false;
		});

		store.$patch((state) => {
			let newItem;

			if (isEcaasForm(door)) {
				newItem = {
					complete: door.complete,
					data: {
						...door.data,
						name: `${name} (${duplicates.length})`
					}
				} as T;
			} else {
				newItem = {
					...door,
					name: `${name} (${duplicates.length})`
				} as T;
			}

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
				dwellingSpaceInternalDoor: { complete: true }
			}
		}
	});

	navigateTo("/dwelling-space");
}

function checkIsComplete(){
	const doors = store.dwellingFabric.dwellingSpaceDoors;
	return Object.values(doors).every(door => door.complete);
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
		:items="store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceInternalDoor.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('dwellingSpaceInternalDoor', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceInternalDoor', index)"
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
