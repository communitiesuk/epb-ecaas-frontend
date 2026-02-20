<script setup lang="ts">
import type { PvShadingData } from "~/stores/ecaasStore.schema";

const props = defineProps<{
	index: number;
	model: PvShadingData[];
}>();

const store = useEcaasStore();

type ShadingFormModel = Partial<PvShadingData> & { typeOfShading?: string };

const shadingItems = ref<PvShadingData[]>([...props.model]);

const showAddForm = computed(() => shadingItems.value.length === 0 || isAddAnother.value);
const isAddAnother = ref(false);
const editIndex = ref<number | null>(null);
const formModel = ref<ShadingFormModel>({});

const isEditing = computed(() => editIndex.value !== null);

const typeOptions: Record<string, string> = {
	obstical: "Obstacle",
	left_side_fin: "Left side fin",
	right_side_fin: "Right side fin",
	overhang: "Overhang",
	frame_or_reveal: "Frame or reveal",
};


const buildShadingElement = (): PvShadingData | null => {
	const { typeOfShading, name } = formModel.value;
	if (!typeOfShading || !name) {
		return null;
	}
	if (typeOfShading === "obstical") {
		const { height, distance, transparancey } = formModel.value as Extract<PvShadingData, { typeOfShading: "obstical" }>;
		return {
			name,
			typeOfShading: "obstical",
			height: Number(height),
			distance: Number(distance),
			transparancey: Number(transparancey),
		};
	}
	const { depth, distance } = formModel.value as Extract<PvShadingData, { typeOfShading: Exclude<PvShadingData, { typeOfShading: "obstical" }> }>;
	return {
		name,
		typeOfShading,
		depth: Number(depth),
		distance: Number(distance),
	};
};

const writeToStore = (items: PvShadingData[]) => {
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
		<div
			v-for="(item, i) in shadingItems"
			:key="i"
			:data-testid="`shading_summary_${i}`"
			class="govuk-summary-card"
		>
			<div class="govuk-summary-card__title-wrapper">
				<h2 class="govuk-summary-card__title">{{ item.name }}</h2>
				<ul v-if="editIndex !== i" class="govuk-summary-card__actions">
					<li class="govuk-summary-card__action">
						<button
							type="button"
							class="govuk-link"
							:data-testid="`shading_edit_${i}`"
							@click="editIndex = i; formModel = { ...shadingItems[i] }"
						>
							Edit
						</button>
					</li>
					<li class="govuk-summary-card__action">
						<button
							type="button"
							class="govuk-link"
							:data-testid="`shading_remove_${i}`"
							@click="removeShading(i)"
						>
							Remove
						</button>
					</li>
				</ul>
			</div>
			<div v-if="editIndex !== i" class="govuk-summary-card__content">
				<dl class="govuk-summary-list">
					<div class="govuk-summary-list__row">
						<dt class="govuk-summary-list__key">Type of shading</dt>
						<dd class="govuk-summary-list__value">{{ typeOptions[item.typeOfShading] }}</dd>
					</div>
					<template v-if="item.typeOfShading === 'obstical'">
						<div class="govuk-summary-list__row">
							<dt class="govuk-summary-list__key">Height</dt>
							<dd class="govuk-summary-list__value">{{ item.height }} m</dd>
						</div>
						<div class="govuk-summary-list__row">
							<dt class="govuk-summary-list__key">Distance</dt>
							<dd class="govuk-summary-list__value">{{ item.distance }} m</dd>
						</div>
						<div class="govuk-summary-list__row">
							<dt class="govuk-summary-list__key">Transparency</dt>
							<dd class="govuk-summary-list__value">{{ item.transparancey }}</dd>
						</div>
					</template>
					<template v-else>
						<div class="govuk-summary-list__row">
							<dt class="govuk-summary-list__key">Depth</dt>
							<dd class="govuk-summary-list__value">{{ item.depth }} m</dd>
						</div>
						<div class="govuk-summary-list__row">
							<dt class="govuk-summary-list__key">Distance</dt>
							<dd class="govuk-summary-list__value">{{ item.distance }} m</dd>
						</div>
					</template>
				</dl>
			</div>
			<div v-else class="govuk-summary-card__content" data-testid="shading-add-form">
				<h2 class="govuk-heading-m">Edit shading</h2>
				<FormKit
					id="shadingName"
					v-model="formModel.name"
					type="govInputText"
					label="Name"
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
				<template v-if="formModel.typeOfShading === 'obstical'">
					<FormKit
						id="height"
						v-model="formModel.height"
						type="govInputWithSuffix"
						label="Height"
						suffix-text="m"
						validation="required | number | min:0"
					/>
					<FormKit
						id="distance"
						v-model="formModel.distance"
						type="govInputWithSuffix"
						label="Distance"
						suffix-text="m"
						validation="required | number | min:0"
					/>
					<FormKit
						id="transparancey"
						v-model="formModel.transparancey"
						type="govInputWithSuffix"
						label="Transparency"
						suffix-text="%"
						validation="required | number | min:0 | max:1"
					/>
				</template>
				<template v-else-if="formModel.typeOfShading === 'left_side_fin' || formModel.typeOfShading === 'right_side_fin' || formModel.typeOfShading === 'overhang' || formModel.typeOfShading === 'frame_or_reveal'">
					<FormKit
						id="depth"
						v-model="formModel.depth"
						type="govInputWithSuffix"
						label="Depth"
						suffix-text="m"
						validation="required | number | min:0"
					/>
					<FormKit
						id="distance"
						v-model="formModel.distance"
						type="govInputWithSuffix"
						label="Distance"
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
					<button
						type="button"
						class="govuk-link"
						data-testid="cancelShadingObject"
						@click="isAddAnother = false; editIndex = null; formModel = {}"
					>
						Cancel
					</button>
				</div>
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
				<h2 class="govuk-summary-card__title">{{ isAddAnother ? 'Add another shading object' : 'Add shading object' }}</h2>
			</div>
			<div class="govuk-summary-card__content" data-testid="shading-add-form">
				<FormKit type="form" :actions="false" @submit="saveShading">
					<FormKit
						id="shadingName"
						v-model="formModel.name"
						type="govInputText"
						label="Name"
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
					<template v-if="formModel.typeOfShading === 'obstical'">
						<FormKit
							id="height"
							v-model="formModel.height"
							type="govInputWithSuffix"
							label="Height"
							suffix-text="m"
							validation="required | number | min:0"
						/>
						<FormKit
							id="distance"
							v-model="formModel.distance"
							type="govInputWithSuffix"
							label="Distance"
							suffix-text="m"
							validation="required | number | min:0"
						/>
						<FormKit
							id="transparancey"
							v-model="formModel.transparancey"
							type="govInputWithSuffix"
							label="Transparency"
							suffix-text="%"
							validation="required | number | min:0 | max:1"
						/>
					</template>
					<template v-else-if="formModel.typeOfShading === 'left_side_fin' || formModel.typeOfShading === 'right_side_fin' || formModel.typeOfShading === 'overhang' || formModel.typeOfShading === 'frame_or_reveal'">
						<FormKit
							id="depth"
							v-model="formModel.depth"
							type="govInputWithSuffix"
							label="Depth"
							suffix-text="m"
							validation="required | number | min:0"
						/>
						<FormKit
							id="distance"
							v-model="formModel.distance"
							type="govInputWithSuffix"
							label="Distance"
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
						<button
							v-if="isAddAnother"
							type="button"
							class="govuk-link"
							data-testid="cancelShadingObject"
							@click="() => { isAddAnother = false; editIndex = null; formModel = {} }"
						>
							Cancel
						</button>
					</div>
				</FormKit>
			</div>
		</div>
	</div>
</template>