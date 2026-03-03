<script setup lang="ts">
import { sentenceToLowerCase } from "#imports";
import type { ShadingObjectData } from "~/stores/ecaasStore.schema";

const props = defineProps<{
	index: number;
	model: ShadingObjectData[];
}>();

const store = useEcaasStore();

type ShadingFormModel = Partial<ShadingObjectData> & { typeOfShading?: string };

const shadingItems = ref<ShadingObjectData[]>([...props.model]);

const showAddForm = computed(() => shadingItems.value.length === 0 || isAddAnother.value);
const isAddAnother = ref(false);
const editIndex = ref<number | null>(null);
const formModel = ref<ShadingFormModel>({});

const isEditing = computed(() => editIndex.value !== null);

const typeOptions: Record<string, string> = {
	obstacle: "Obstacle",
	left_side_fin: "Left side fin",
	right_side_fin: "Right side fin",
	overhang: "Overhang",
	frame_or_reveal: "Frame or reveal",
};
const typeOptionsSummary = {
	obstacle: "Obstacle",
	left_side_fin: "Left side fin",
	right_side_fin: "Right side fin",
	overhang: "Overhang",
	frame_or_reveal: "Frame / reveal",
};
const { handleInvalidSubmit } = useErrorSummary();

const shadingSummaryData = (item: ShadingObjectData) => {
	if (item.typeOfShading === "obstacle") {
		return {
			"Type of shading": typeOptionsSummary[item.typeOfShading],
			"Height": `${item.height}m`,
			"Distance": `${item.distance}m`,
			"Transparency": `${item.transparency}%`,
		};
	}
	return {
		"Type of shading": typeOptionsSummary[item.typeOfShading],
		[`Depth of ${sentenceToLowerCase(typeOptions[item.typeOfShading] as string)}`]: `${item.depth}m`,
		"Distance from edge of PV": `${item.distance}m`,
	};
};

const buildShadingElement = (): ShadingObjectData | null => {
	const { typeOfShading, name } = formModel.value;
	if (!typeOfShading || !name) {
		return null;
	}
	if (typeOfShading === "obstacle") {
		const { height, distance, transparency } = formModel.value as Extract<ShadingObjectData, { typeOfShading: "obstacle" }>;
		return {
			name,
			typeOfShading: "obstacle",
			height: Number(height),
			distance: Number(distance),
			transparency: Number(transparency),
		};
	}
	const { depth, distance } = formModel.value as Extract<ShadingObjectData, { typeOfShading: Exclude<ShadingObjectData, { typeOfShading: "obstacle" }> }>;
	return {
		name,
		typeOfShading,
		depth: Number(depth),
		distance: Number(distance),
	};
};

const writeToStore = (items: ShadingObjectData[]) => {
	store.$patch((state) => {
		const pvArray = state.pvAndBatteries.pvArrays.data[props.index];
		if (!pvArray) return;
		(pvArray.data as Record<string, unknown>).shading = items;
	});
};

const saveShading = async () => {
	await nextTick();
	const newItem = buildShadingElement();
	if (!newItem) return;

	const updatedItems = [...shadingItems.value];
	if (editIndex.value !== null) {
		updatedItems[editIndex.value] = newItem;
	} else {
		updatedItems.push(newItem);
	}
	shadingItems.value = updatedItems;
	writeToStore(updatedItems);

	editIndex.value = null;
	formModel.value = {};
	isAddAnother.value = false;
};

const removeShading = (i: number) => {
	const updatedItems = [...shadingItems.value];
	updatedItems.splice(i, 1);
	shadingItems.value = updatedItems;
	writeToStore(updatedItems);
};

</script>

<template>
	<div data-testid="pv-shading-section">
		<h2 v-if="shadingItems.length" class="govuk-heading-m">Objects that shade the PV array</h2>
		<div
			v-for="(item, i) in shadingItems"
			:key="i"
			:data-testid="`shading_summary_${i}`"
			class="govuk-summary-card"
		>
			<div class="govuk-summary-card__title-wrapper">
				<h2 v-if="!isEditing" class="govuk-summary-card__title">{{ item.name }}</h2>
				<h2 v-else class="govuk-summary-card__title">Edit shading</h2>
				<ul v-if="editIndex !== i" class="govuk-summary-card__actions">
					<li class="govuk-summary-card__action">
						<a
							href="#"
							class="govuk-link govuk-body-s"
							:data-testid="`shading_edit_${i}`"
							@click.prevent="editIndex = i; formModel = { ...shadingItems[i] }"
						>
							Edit
						</a>
					</li>
					<li class="govuk-summary-card__action">
						<a
							href="#"
							class="govuk-link govuk-body-s"
							:data-testid="`shading_remove_${i}`"
							@click.prevent="removeShading(i)"
						>
							Remove
						</a>
					</li>
				</ul>
				<ul v-else class="govuk-summary-card__actions">
					<li class="govuk-summary-card__action">
						<a
							href="#"
							class="govuk-link govuk-body-s"
							:data-testid="`shading_cancel_${i}`"
							@click.prevent="editIndex = null; formModel = {}"
						>
							Cancel
						</a>
					</li>
				</ul>
			</div>
			<div v-if="editIndex !== i" class="govuk-summary-card__content shading-summary">
				<SummaryList :id="`shading-${i}`" :data="shadingSummaryData(item)" />
			</div>
			<div v-else class="govuk-summary-card__content" data-testid="shading-add-form">
				<FormKit 
					type="form" 
					:actions="false" 
					:incomplete-message="false"
					@submit="saveShading"
					@invalid="handleInvalidSubmit"
				>
					<FormKit
						id="shadingName"
						v-model="formModel.name"
						type="govInputText"
						label="Name of shading"
						validation="required"
					/>
					<FormKit
						id="typeOfShading"
						v-model="formModel.typeOfShading"
						type="govRadios"
						label="Type of shading"
						:options="typeOptions"
						validation="required"
					/>
					<template v-if="formModel.typeOfShading === 'obstacle'">
						<FormKit
							id="height"
							v-model="formModel.height"
							type="govInputWithSuffix"
							label="Height of obstacle"
							suffix-text="m"
							validation="required | number | min:0"
						/>
						<FormKit
							id="distance"
							v-model="formModel.distance"
							type="govInputWithSuffix"
							label="Distance from edge of PV"
							suffix-text="m"
							validation="required | number | min:0"
						/>
						<FormKit
							id="transparency"
							v-model="formModel.transparency"
							type="govInputWithSuffix"
							label="Transparency of obstacle"
							help="100% is completely transparent. 0% is opaque."
							suffix-text="%"
							validation="required | number | min:0 | max:100"
						/>
					</template>
					<template v-else-if="formModel.typeOfShading === 'left_side_fin' || formModel.typeOfShading === 'right_side_fin' || formModel.typeOfShading === 'overhang' || formModel.typeOfShading === 'frame_or_reveal'">
						<FormKit
							id="depth"
							:key="`depth-${formModel.typeOfShading}`"
							v-model="formModel.depth"
							type="govInputWithSuffix"
							:label="'Depth of ' + sentenceToLowerCase(typeOptions[formModel.typeOfShading] as string)"
							suffix-text="m"
							validation="required | number | min:0"
						/>
						<FormKit
							id="distance"
							v-model="formModel.distance"
							type="govInputWithSuffix"
							label="Distance from edge of PV"
							suffix-text="m"
							validation="required | number | min:0"
						/>
					</template>
					<div class="govuk-button-group">
						<button
							type="button"
							class="govuk-button"
							data-testid="saveShadingObject"
							@click="saveShading"
						>
							Save shading object
						</button>
						<a
							href="#"
							class="govuk-link govuk-body-s"
							data-testid="cancelShadingObject"
							@click.prevent="isAddAnother = false; editIndex = null; formModel = {}"
						>
							Cancel
						</a>
					
					</div>
				</FormKit>
			</div>
		</div>

		<GovButton
			v-if="shadingItems.length > 0 && !showAddForm"
			secondary
			test-id="addAnotherShadingObject"
			:click="() => { editIndex = null; formModel = {}; isAddAnother = true }"
		>
			Add another shading object
		</GovButton>

		<div v-if="showAddForm && !isEditing" class="govuk-summary-card">
			<div class="govuk-summary-card__title-wrapper">
				<h2 class="govuk-summary-card__title">Add shading</h2>
				<ul v-if="isAddAnother" class="govuk-summary-card__actions">
					<li class="govuk-summary-card__action">
						<a
							href="#"
							class="govuk-link govuk-body-s"
							data-testid="cancelShadingObject"
							@click.prevent="() => { isAddAnother = false; editIndex = null; formModel = {} }"
						>
							Cancel
						</a>
					</li>
				</ul>
			</div>
			<div class="govuk-summary-card__content" data-testid="shading-add-form">
				<FormKit 
					type="form" 
					:actions="false" 
					:incomplete-message="false"
					@submit="saveShading"
					@invalid="handleInvalidSubmit"
				>
					<FormKit
						id="shadingName"
						v-model="formModel.name"
						type="govInputText"
						label="Name of shading"
						validation="required"
					/>
					<FormKit
						id="typeOfShading"
						v-model="formModel.typeOfShading"
						type="govRadios"
						label="Type of shading"
						:options="typeOptions"
						validation="required"
					/>
					<template v-if="formModel.typeOfShading === 'obstacle'">
						<FormKit
							id="height"
							v-model="formModel.height"
							type="govInputWithSuffix"
							label="Height of obstacle"
							suffix-text="m"
							validation="required | number | min:0"
						/>
						<FormKit
							id="distance"
							v-model="formModel.distance"
							type="govInputWithSuffix"
							label="Distance from edge of PV"
							suffix-text="m"
							validation="required | number | min:0"
						/>
						<FormKit
							id="transparency"
							v-model="formModel.transparency"
							type="govInputWithSuffix"
							label="Transparency of obstacle"
							help="100% is transparent. 0% is opaque."
							suffix-text="%"
							validation="required | number | min:0 | max:100"
						/>
					</template>
					<template v-else-if="formModel.typeOfShading === 'left_side_fin' || formModel.typeOfShading === 'right_side_fin' || formModel.typeOfShading === 'overhang' || formModel.typeOfShading === 'frame_or_reveal'">
						<FormKit
							id="depth"
							:key="`depth-${formModel.typeOfShading}`"
							v-model="formModel.depth"
							type="govInputWithSuffix"
							:label="'Depth of ' + sentenceToLowerCase(typeOptions[formModel.typeOfShading] as string)"
							suffix-text="m"
							validation="required | number | min:0"
						/>
						<FormKit
							id="distance"
							v-model="formModel.distance"
							type="govInputWithSuffix"
							label="Distance from edge of PV"
							suffix-text="m"
							validation="required | number | min:0"
						/>
					</template>
					<div class="govuk-button-group">
						<button
							type="submit"
							class="govuk-button govuk-button--secondary"
							data-testid="saveShadingObject"
						>
							Save shading object
						</button>
					</div>
				</FormKit>
			</div>
		</div>
	</div>
</template>

<style scoped>
.shading-summary :deep(.govuk-summary-list__key),
.shading-summary :deep(.govuk-summary-list__value) {
    font-size: 1rem;
}
</style>

