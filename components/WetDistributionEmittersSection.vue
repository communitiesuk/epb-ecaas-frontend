<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import type { WetDistributionEmitterData } from "~/stores/ecaasStore.schema";
import type { Product } from "~/pcdb/pcdb.types";

const route = useRoute();

const emitterTypeOptions = {
	radiator: "Radiator",
	underfloorHeating: "Underfloor heating",
	fanCoil: "Fan coil",
} as const;
// boolean for switch for underfloor heating feature
const useUnderfloorHeating: boolean = false;

const { underfloorHeating, ...others } = emitterTypeOptions;
const heatEmitterTypes = useUnderfloorHeating ? emitterTypeOptions : others;
type EmitterType = keyof typeof emitterTypeOptions;

const props = defineProps<{
	index: number;
}>();

const store = useEcaasStore();

const emitters = computed(() => {
	const heatEmitter = store.spaceHeating.heatEmitters.data[props.index];
	if (heatEmitter && "emitters" in heatEmitter.data) {
		return (heatEmitter.data as { emitters: (Partial<WetDistributionEmitterData> & { id: string })[] }).emitters;
	}
	return [];
});

const formModel = ref<Record<string, unknown>>({});
const editIndex = ref<number | null>(null);
const isEditing = computed(() => editIndex.value !== null);
const showAddForm = ref(false);
const emitterCards = ref<HTMLElement[]>([]);

const queryEmitterIndex = route.query.emitterIndex != null ? Number(route.query.emitterIndex) : null;
if (queryEmitterIndex != null && emitters.value[queryEmitterIndex]) {
	editIndex.value = queryEmitterIndex;
	formModel.value = { ...emitters.value[queryEmitterIndex] };
}

onMounted(() => {
	if (queryEmitterIndex != null && emitterCards.value[queryEmitterIndex]) {
		emitterCards.value[queryEmitterIndex].scrollIntoView({ behavior: "instant", block: "start" });
	}
});

const productDetails = ref<Record<string, string[]>>({});

const fetchProductName = async (productReference: string) => {
	if (productDetails.value[productReference]) return;
	const { data: product } = await useFetch<Product>(`/api/products/${productReference}`);
	if (product.value?.modelName) {
		productDetails.value[productReference] = [product.value.brandName, product.value.modelName, product.value.modelQualifier].filter(Boolean) as string[];
	}
};

watch(
	emitters,
	(list) => {
		list.forEach((emitter) => {
			if (emitter.productReference) {
				fetchProductName(emitter.productReference);
			}
		});
	},
	{ immediate: true },
);

const emitterSummaryData = (emitter: Partial<WetDistributionEmitterData> & { id: string }) => {
	const { typeOfHeatEmitter, productReference } = emitter;
	const typeName = typeOfHeatEmitter ? emitterTypeOptions[typeOfHeatEmitter] : undefined;
	const product = productReference ? productDetails.value[productReference] : undefined;

	switch (typeOfHeatEmitter) {
		case "radiator":
			return {
				"Type of emitter": typeName,
				"Radiator product": product,
				"Length": (emitter as { length?: number }).length != null ? `${(emitter as { length: number }).length} m` : undefined,
				"Number of radiators": (emitter as { numOfRadiators?: number }).numOfRadiators,
			};
		case "fanCoil":
			return {
				"Type of emitter": typeName,
				"Fan coil product": product,
				"Number of fan coils": (emitter as { numOfFanCoils?: number }).numOfFanCoils,
			};
		case "underfloorHeating":
			return {
				"Type of emitter": typeName,
				"Underfloor heating product": product,
				"Area of underfloor heating": (emitter as { areaOfUnderfloorHeating?: number }).areaOfUnderfloorHeating != null ? `${(emitter as { areaOfUnderfloorHeating: number }).areaOfUnderfloorHeating} m²` : undefined,
			};
		default:
			return {
				"Type of emitter": typeName,
			};
	}
};

const addEmitter = (type: unknown) => {
	const id = uuidv4();
	const newEmitter = {
		id,
		typeOfHeatEmitter: type,
		name: emitterTypeOptions[type as EmitterType] ?? type,
	};

	store.$patch((state) => {
		const heatEmitter = state.spaceHeating.heatEmitters.data[props.index];
		if (heatEmitter && "emitters" in heatEmitter.data) {
			(heatEmitter.data as { emitters: unknown[] }).emitters.push(newEmitter);
			heatEmitter.complete = false;
		}
	});

	showAddForm.value = false;
	const newIndex = emitters.value.length - 1;
	editIndex.value = newIndex;
	formModel.value = { ...emitters.value[newIndex]! };
};

const removeEmitter = (emitterIndex: number) => {
	store.$patch((state) => {
		const heatEmitter = state.spaceHeating.heatEmitters.data[props.index];
		if (heatEmitter && "emitters" in heatEmitter.data) {
			(heatEmitter.data as { emitters: unknown[] }).emitters.splice(emitterIndex, 1);
		}
		heatEmitter!.complete = false;
	});
	if (editIndex.value === emitterIndex) {
		editIndex.value = null;
		formModel.value = {};
	}
};

const startEdit = (emitterIndex: number) => {
	editIndex.value = emitterIndex;
	formModel.value = { ...emitters.value[emitterIndex]! };
	store.$patch((state) => {
		const heatEmitter = state.spaceHeating.heatEmitters.data[props.index];
		if (heatEmitter) {
			heatEmitter.complete = false;
		}
	});
};

const cancelEdit = () => {
	editIndex.value = null;
	formModel.value = {};
};

watch(
	() => formModel.value.typeOfHeatEmitter,
	(newType, oldType) => {
		if (oldType && newType !== oldType) {
			const { id, name } = formModel.value;
			formModel.value = { id, name, typeOfHeatEmitter: newType };
		}
	},
);

watch(
	formModel,
	(newData) => {
		if (editIndex.value === null) return;
		const emitterIndex = editIndex.value;

		store.$patch((state) => {
			const heatEmitter = state.spaceHeating.heatEmitters.data[props.index];
			if (heatEmitter && "emitters" in heatEmitter.data) {
				const emittersList = (heatEmitter.data as { emitters: Record<string, unknown>[] }).emitters;
				if (emittersList[emitterIndex]) {
					emittersList[emitterIndex] = { ...newData };
				}
			}
		});
	},
	{ deep: true },
);

const saveEmitter = () => {
	editIndex.value = null;
	formModel.value = {};
};
</script>

<template>
	<div data-testid="emittersSection">
		<h2 class="govuk-heading-l">Emitters</h2>
		<div
			v-for="(emitter, i) in emitters"
			:key="emitter.id"
			ref="emitterCards"
			:data-testid="`emitter-${emitter.id}`"
			class="govuk-summary-card"
		>
			<div class="govuk-summary-card__title-wrapper">
				<h2 v-if="editIndex === i" class="govuk-summary-card__title">Edit emitter</h2>
				<h2 v-else class="govuk-summary-card__title">{{ emitter.name }}</h2>
				<ul v-if="editIndex !== i" class="govuk-summary-card__actions">
					<li class="govuk-summary-card__action">
						<a
							href="#"
							class="govuk-link govuk-body-s"
							:data-testid="`emitter_edit_${i}`"
							@click.prevent="startEdit(i)"
						>
							Edit
						</a>
					</li>
					<li class="govuk-summary-card__action">
						<a
							href="#"
							class="govuk-link govuk-body-s"
							:data-testid="`emitter_remove_${i}`"
							@click.prevent="removeEmitter(i)"
						>
							Remove
						</a>
					</li>
				</ul>
			</div>
			<div v-if="editIndex !== i" class="govuk-summary-card__content emitter-summary">
				<SummaryList :id="`emitter-${i}`" :data="emitterSummaryData(emitter)" />
			</div>
			<div v-else class="govuk-summary-card__content">
				<FormKit
					v-model="formModel"
					type="form"
					:actions="false"
					:incomplete-message="false"
					@submit="saveEmitter"
				>
					<FormKit
						:id="`emitterName_${i}`"
						type="govInputText"
						label="Name"
						name="name"
						validation="required"
					/>
					<FormKit
						:id="`typeOfHeatEmitter_${i}`"
						type="govRadios"
						label="Type of emitter"
						:options="emitterTypeOptions"
						name="typeOfHeatEmitter"
						validation="required"
					/>
					<template v-if="formModel.typeOfHeatEmitter === 'radiator'">
						<FormKit
							:id="`productReference_${i}`"
							type="govInputText"
							label="Product reference"
							name="productReference"
							validation="required"
						/>
						<FormKit
							:id="`numOfRadiators_${i}`"
							type="govInputInt"
							label="Number of radiators"
							name="numOfRadiators"
							validation="required"
						/>
						<FormKit
							:id="`length_${i}`"
							type="govInputWithSuffix"
							label="Length"
							name="length"
							suffix-text="m"
							validation="required | number | min:0.001"
						/>
					</template>
					<template v-if="formModel.typeOfHeatEmitter === 'fanCoil'">
						<FormKit
							:id="`selectFanCoil_${i}`"
							type="govPcdbProduct"
							label="Select a product"
							name="productReference"
							validation="required"
							help="Select the fan coil type from the PCDB using the button below."
							:selected-product-reference="formModel.productReference as string"
							selected-product-type="fanCoil"
							:page-url="route.fullPath"
							:page-index="props.index"
							:emitter-index="i"
						/>
						<FormKit
							:id="`numOfFanCoils_${i}`"
							type="govInputInt"
							label="Number of fan coils"
							name="numOfFanCoils"
							validation="required"
						/>
					</template>
					<template v-if="formModel.typeOfHeatEmitter === 'underfloorHeating'">
						<FormKit
							:id="`productReference_${i}`"
							type="govInputText"
							label="Product reference"
							name="productReference"
							validation="required"
						/>
						<FormKit
							:id="`areaOfUnderfloorHeating_${i}`"
							type="govInputWithSuffix"
							label="Area of underfloor heating"
							name="areaOfUnderfloorHeating"
							suffix-text="m²"
							validation="required | number"
						/>
					</template>
					<div class="govuk-button-group">
						<button
							type="submit"
							class="govuk-button govuk-button--secondary"
							:data-testid="`saveEmitter_${i}`"
						>
							Save emitter
						</button>
						<a
							href="#"
							class="govuk-link govuk-body-s"
							:data-testid="`emitter_cancel_${i}`"
							@click.prevent="cancelEdit"
						>
							Cancel
						</a>
					</div>
				</FormKit>
			</div>
		</div>

		<GovButton
			v-if="emitters.length > 0 && !showAddForm && !isEditing"
			secondary
			test-id="addEmitterButton"
			:click="() => { showAddForm = true }"
		>
			Add another emitter
		</GovButton>

		<div v-if="(showAddForm || emitters.length === 0) && !isEditing" class="govuk-summary-card">
			<div class="govuk-summary-card__title-wrapper">
				<h2 class="govuk-summary-card__title">Add emitter</h2>
				<ul v-if="emitters.length > 0" class="govuk-summary-card__actions">
					<li class="govuk-summary-card__action">
						<a
							href="#"
							class="govuk-link govuk-body-s"
							data-testid="cancelAddEmitter"
							@click.prevent="showAddForm = false"
						>
							Cancel
						</a>
					</li>
				</ul>
			</div>
			<div class="govuk-summary-card__content">
				<FormKit type="group" :ignore="true">
					<FormKit
						id="typeOfHeatEmitter"
						type="govRadios"
						label="Type of emitter"
						:options="heatEmitterTypes"
						name="emitterTypeSelection"
						@input="addEmitter"
					/>
				</FormKit>
			</div>
		</div>
	</div>
</template>

<style scoped>
.emitter-summary :deep(.govuk-summary-list__key),
.emitter-summary :deep(.govuk-summary-list__value) {
	font-size: 1.1875rem;
}

:deep(.govuk-fieldset__legend--m),
:deep(.govuk-body--m),
:deep(.govuk-label--m) {
	font-size: 1.1875rem !important;
}
</style>
