<script setup lang="ts">
type DoorType = "ExternalUnglazed" | "ExternalGlazed" | "Internal";
type DoorData = ExternalGlazedDoorData | ExternalUnglazedDoorData | InternalDoorData;

const { index, doorType } = defineProps<{
	index: number;
	doorType: DoorType;
}>();

const store = useEcaasStore();

function canBeFrontDoor(node: FormKitNode) {
	if (!node.value) {
		return true;
	}

	const { dwellingSpaceExternalGlazedDoor, dwellingSpaceExternalUnglazedDoor, dwellingSpaceInternalDoor } = store.dwellingFabric.dwellingSpaceDoors;
	let doors: EcaasForm<DoorData>[] = [];

	if (doorType === "ExternalGlazed") {
		const glazedDoorsExcludingCurrent = dwellingSpaceExternalGlazedDoor.data.toSpliced(index, 1);
		doors = [...glazedDoorsExcludingCurrent, dwellingSpaceExternalUnglazedDoor.data, dwellingSpaceInternalDoor.data].flat() as EcaasForm<DoorData>[];
	}

	if (doorType === "ExternalUnglazed") {
		const unglazedDoorsExcludingCurrent = dwellingSpaceExternalUnglazedDoor.data.toSpliced(index, 1);
		doors = [...unglazedDoorsExcludingCurrent, dwellingSpaceExternalGlazedDoor.data, dwellingSpaceInternalDoor.data].flat() as EcaasForm<DoorData>[];
	}

	if (doorType === "Internal") {
		const internalDoorsExcludingCurrent = dwellingSpaceInternalDoor.data.toSpliced(index, 1);
		doors = [...internalDoorsExcludingCurrent, dwellingSpaceExternalUnglazedDoor.data, dwellingSpaceExternalGlazedDoor.data].flat() as EcaasForm<DoorData>[];
	}

	return doors.length ? doors.every(x => !x.data.isTheFrontDoor) : true;
}
</script>

<template>
	<FormKit
		id="isTheFrontDoor"
		type="govBoolean"
		label="Is this the front door?"
		help="The nominated front door is used as the reference point if you want to change the orientation of the whole dwelling"
		name="isTheFrontDoor"
		:validation-rules="{ canBeFrontDoor }"
		validation="required | canBeFrontDoor" 
		:validation-messages="{
			canBeFrontDoor: 'Another door has already been marked as the front door. Please change that entry if you wish to mark this door as the front door instead.'
		}"
	/>
</template>