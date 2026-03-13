<script setup lang="ts">
import { getUrl, useBanner } from "#imports";
import { getUpdatedOrientation } from "~/utils/changeOrientation";

const store = useEcaasStore();
const title = "Change orientation of dwelling";
const banner = useBanner();

const pvs = store.pvAndBatteries.pvArrays;
const externalWalls = store.dwellingFabric.dwellingSpaceWalls.dwellingSpaceExternalWall;
const roofs = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs;
const windows = store.dwellingFabric.dwellingSpaceWindows;
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

const frontDoorName = frontDoor.value?.data.name;
const frontDoorOrientation = computed(() => {
	if (!frontDoor.value) return;
	if ("orientation" in frontDoor.value.data && frontDoor.value.data.orientation !== undefined) {
		return frontDoor.value.data.orientation; 
	} else {
		const itemTaggedToDoor = store.getTaggedItem([externalWalls, roofs], frontDoor.value?.data.associatedItemId);
		return itemTaggedToDoor?.orientation;
	}
});

const model = ref({
	newOrientation: undefined,
	updateDistantShading: [],
});

// const model = reactive({
// 	newOrientation: undefined as number | undefined,
// 	updateDistantShading: [] as string[],
// });


function getDiffInOrientation() {
	if (frontDoorOrientation.value === undefined || model.value.newOrientation === undefined) return;
	return model.value.newOrientation - frontDoorOrientation.value; 
}

function updateOrientations(items: EcaasForm<{ orientation?: number }>[], difference: number) {
	for (const item of items) {
		if ("orientation" in item.data && item.data.orientation !== undefined) {
			item.data.orientation = getUpdatedOrientation(item.data.orientation, difference);
		}
	}
}

function updateShadingAngles(shadingItems: EcaasFormList<ShadingData>, difference: number) {
	for (const item of shadingItems.data) {
		if ("startAngle" in item.data && item.data.startAngle !== undefined) {
			item.data.startAngle = getUpdatedOrientation(item.data.startAngle, difference);
		}
		if ("endAngle" in item.data && item.data.endAngle !== undefined) {
			item.data.endAngle = getUpdatedOrientation(item.data.endAngle, difference);
		}
	}
}

const changeOrientationOfItems = () => {
	const difference = getDiffInOrientation();
	if (difference !== undefined) {
		const items = [roofs.data, ...doors.value, pvs.data, externalWalls.data, windows.data].flat() as EcaasForm<{ orientation?: number }>[];
		updateOrientations(items, difference);
		
		if (model.value.updateDistantShading.length) {
			const shadingItems = store.dwellingDetails.shading;
			updateShadingAngles(shadingItems, difference);
		}
		banner.value = { type: "change-orientation-complete", difference, orientation: model.value.newOrientation! };
	}
};

const hasNewOrientaton = ref(false);

watch(() => model.value.newOrientation, (newVal) => {
	if (newVal === undefined) return;
	hasNewOrientaton.value = true;
});

function handleSubmit() {
	changeOrientationOfItems();
	navigateTo("/");
}

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
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
		@submit="handleSubmit"
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="heatSourceErrorSummary" />
		<GovInset>Doing this will update the orientation of all component parts in the calculation, including fabric, vents and PV systems.</GovInset>
		<ClientOnly>
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
				<div v-if="!frontDoorName && frontDoorOrientation === undefined" class="govuk-error-message" :data-testid="`noFrontDoor_error`">
					<span class="govuk-visually-hidden">Error:</span>No door has been marked as the front door, or the 'door' form has not been marked as complete. To change this go to <NuxtLink :to="getUrl('dwellingSpaceDoors')">
						doors
					</NuxtLink>
				</div>
				<div
					v-else-if="frontDoorName && frontDoorOrientation === undefined"
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
						<li>Door: <span data-testid="frontDoorName" class="bold">{{ frontDoorName }}</span></li>
						<li>Orientation: <span data-testid="currentOrientation" class="bold">-</span></li>
					</ul>
				</div>
				<ul v-if="frontDoorName && frontDoorOrientation !== undefined" class="govuk-list">
					<li>Door: <span data-testid="frontDoorName" class="bold">{{ frontDoorName }}</span></li>
					<li>Orientation: <span data-testid="currentOrientation" class="bold">{{ frontDoorOrientation }}</span></li>
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
			<FormKit
				id="updateDistantShading"
				type="govCheckboxes"
				name="updateDistantShading"
				label="Do you want to update the shading as well?"
				:options="{ updateShading: 'Change orientation of shading'}"
			/> 
			<div class="govuk-!-margin-top-1 govuk-button-group">
				<ClientOnly>
					<GovButton type="submit" test-id="changeOrientationButton" :disabled="!(frontDoor && frontDoorOrientation !== undefined) || !hasNewOrientaton">Change orientation</GovButton>
				</ClientOnly>
				<GovButton href="/" secondary>
					Return to overview
				</GovButton>
			</div>
		</ClientOnly>
	</formkit>
</template>


<style scoped lang="scss">
.bold {
	font-weight: bold;
}
</style>
