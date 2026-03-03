<script setup lang="ts">
import { getUrl } from "#imports";
import { getUpdatedOrientation } from "~/utils/changeOrientation";

const title = "Change orientation of dwelling";
const { handleInvalidSubmit, errorMessages } = useErrorSummary();
const store = useEcaasStore();

const saveForm = () => {
	
	// navigateTo(getUrl(""));
};
const { dwellingSpaceExternalGlazedDoor, dwellingSpaceExternalUnglazedDoor, dwellingSpaceInternalDoor } = store.dwellingFabric.dwellingSpaceDoors;
const doors = [ dwellingSpaceExternalGlazedDoor.data, dwellingSpaceExternalUnglazedDoor.data, dwellingSpaceInternalDoor.data ].flat();
const frontDoor = doors.find(door => door.data.isTheFrontDoor);
const { dwellingSpaceExternalWall } = store.dwellingFabric.dwellingSpaceWalls;
const { dwellingSpaceRoofs } = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
const pvs = store.pvAndBatteries.pvArrays.data;
const externalWalls = store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceExternalWall.data;
const roofs = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs.data;
const windows = store.dwellingFabric.dwellingSpaceWindows.data;

const itemTaggedToDoor = store.getTaggedItem([dwellingSpaceExternalWall, dwellingSpaceRoofs], frontDoor?.data.associatedItemId);

const orientationOfFrontDoor = computed(() => {
	if (!frontDoor) return;
	return "orientation" in frontDoor.data ? frontDoor.data.orientation : itemTaggedToDoor?.orientation;

});

type ChangeOrientationModel = {
	name?: string,
	orientation?: number, 
	newOrientation?: number
};
const model = ref<ChangeOrientationModel>({
	name: frontDoor?.data.name,
	newOrientation: undefined,
});

function getDiffInOrientation() {
	if (orientationOfFrontDoor.value === undefined || model.value.newOrientation === undefined) return;
	return model.value.newOrientation - orientationOfFrontDoor.value; 
}

const items = [...doors, pvs, externalWalls, roofs, windows].flat();

const changeOrientationOfItems = () => {
	const difference = getDiffInOrientation();
	if (difference) {
		for (const item of items) {
			if ("orientation" in item.data && item.data.orientation !== undefined) {
				item.data.orientation = getUpdatedOrientation(item.data.orientation, difference);
			}
			
		}
	}
};
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="heatSourceErrorSummary" />
		<GovInset>Doing this will update the orientation of all component parts in the calculation, including fabric, vents and PV systems.</GovInset>
		<div>
			<legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
				Current orientation of the front door
			</legend>
			<div id="'current-orientation-hint'" class="govuk-hint">
				The door below has been marked as the front door. To change this go to <NuxtLink :to="getUrl('dwellingSpaceDoors')">
					doors
				</NuxtLink>
			</div>
			<ul class="govuk-list">
				<li>Door: <span data-testid="frontDoorName" class="bold">{{ model?.name }}</span></li>
				<li>Orientation: <span data-testid="currentOrientation" class="bold">{{ orientationOfFrontDoor }}</span></li>
			</ul>
		</div>
		<FormKit
			id="newOrientation"
			name="newOrientation"
			type="govInputWithSuffix"
			label="New orientation of the front door"
			help="Enter the new orientation of the front door measured clockwise from true north. All other elements will be moved in accordance with this door."
			validation="number | min:0 | max:360" 
			suffix-text="°"
		/>
		<GovButton test-id="changeOrientationButton" @click="changeOrientationOfItems" >Change orientation</GovButton>
	</formkit>
</template>


<style scoped lang="scss">
.bold {
	font-weight: bold;
}
</style>
