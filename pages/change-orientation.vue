<script setup lang="ts">
import { getUrl, useBanner } from "#imports";
import { getUpdatedOrientation } from "~/utils/changeOrientation";


const title = "Change orientation of dwelling";
const { handleInvalidSubmit, errorMessages } = useErrorSummary();
const banner = useBanner();
const store = useEcaasStore();


const { dwellingSpaceExternalGlazedDoor, dwellingSpaceExternalUnglazedDoor, dwellingSpaceInternalDoor } = store.dwellingFabric.dwellingSpaceDoors;
const doors = computed(() => [
	dwellingSpaceExternalGlazedDoor.data,
	dwellingSpaceExternalUnglazedDoor.data,
	dwellingSpaceInternalDoor.data,
].flat());

const frontDoor = computed(() =>
	doors.value.find(
		door => door.data.isTheFrontDoor === true && door.complete === true,
	),
);
const { dwellingSpaceExternalWall } = store.dwellingFabric.dwellingSpaceWalls;
const { dwellingSpaceRoofs } = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
const pvs = store.pvAndBatteries.pvArrays.data;
const externalWalls = store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceExternalWall.data;
const roofs = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs.data;
const windows = store.dwellingFabric.dwellingSpaceWindows.data;

const orientationOfFrontDoor = computed(() => {
	if (!frontDoor.value) return;
	if ("orientation" in frontDoor.value.data && frontDoor.value.data.orientation !== undefined) {
		return frontDoor.value.data.orientation; 
	} else {
		const itemTaggedToDoor = store.getTaggedItem([dwellingSpaceExternalWall, dwellingSpaceRoofs], frontDoor.value?.data.associatedItemId);
		return itemTaggedToDoor?.orientation;
	}
});

export type ChangeOrientationModel = {
	name?: string,
	newOrientation?: number
};
const model = ref<ChangeOrientationModel>({
	name: frontDoor.value?.data.name,
	newOrientation: undefined,
});

function getDiffInOrientation() {
	if (orientationOfFrontDoor.value === undefined || model.value.newOrientation === undefined) return;
	return model.value.newOrientation - orientationOfFrontDoor.value; 
}

const items = [...doors.value, pvs, externalWalls, roofs, windows].flat();

const changeOrientationOfItems = () => {
	const difference = getDiffInOrientation();
	if (difference) {
		for (const item of items) {
			if ("orientation" in item.data && item.data.orientation !== undefined) {
				item.data.orientation = getUpdatedOrientation(item.data.orientation, difference);
			}
			
		}
		banner.value = { type: "change-orientation-complete", difference, orientation: model.value.newOrientation! };
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
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="heatSourceErrorSummary" />
		<GovInset>Doing this will update the orientation of all component parts in the calculation, including fabric, vents and PV systems.</GovInset>
		<div>
			<label class="govuk-label govuk-label--m">
				Current orientation of the front door
			</label>
			<div id="current-orientation-hint" class="govuk-hint">
				The door below has been marked as the front door. To change this go to
				<NuxtLink :to="getUrl('dwellingSpaceDoors')">
					doors
				</NuxtLink>
			</div>
			<div v-if="!model.name && orientationOfFrontDoor === undefined" class="govuk-error-message" :data-testid="`noFrontDoor_error`">
				<span class="govuk-visually-hidden">Error:</span>No door has been marked as the front door, or the 'door' form has not been marked as complete. To change this go to <NuxtLink :to="getUrl('dwellingSpaceDoors')">
					doors
				</NuxtLink>
			</div>
			<div
				v-else-if="model.name && orientationOfFrontDoor === undefined"
				class="govuk-error-message"
				:data-testid="`frontDoorWithoutOrientation_error`"
			>
				<span class="govuk-visually-hidden">Error:</span>
				The selected door does not have an orientation. This may be because the
				wall or roof it is associated with is missing the orientation, or is not
				marked as complete.
				<br><br>
				To change this go to
				<NuxtLink :to="getUrl('dwellingFabric')">
					dwelling fabric.
				</NuxtLink>
				<br><br>
				<ul class="govuk-list">
					<li>Door: <span data-testid="frontDoorName" class="bold">{{ model.name }}</span></li>
					<li>Orientation: <span data-testid="currentOrientation" class="bold">-</span></li>
				</ul>
			</div>
			<ul v-if="model.name && orientationOfFrontDoor !== undefined" class="govuk-list">
				<li>Door: <span data-testid="frontDoorName" class="bold">{{ model.name }}</span></li>
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
		<div class="govuk-!-margin-top-1 govuk-button-group">
			<GovButton  href="/" test-id="changeOrientationButton" @click="changeOrientationOfItems">Change orientation</GovButton>
			<GovButton href="/" secondary>
				Return to overview
			</GovButton>
		</div>
	</formkit>
</template>


<style scoped lang="scss">
.bold {
	font-weight: bold;
}
</style>
