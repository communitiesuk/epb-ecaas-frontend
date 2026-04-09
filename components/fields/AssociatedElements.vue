<script setup lang="ts">
import type { AdjacentSpaceType } from "#imports";
import { getUrl } from "#imports";

const {
	adjacentSpaceType,
	help = undefined,
	validation = undefined,
	validationRules = undefined,
	validationMessages = undefined,
} = defineProps<{
	id: string;
	name: string;
	label: string;
	help?: string;
	validation?: string;
	validationRules?: Record<string, (node: FormKitNode) => boolean>;
	validationMessages?: Record<string, string>;
	adjacentSpaceType: AdjacentSpaceType;
}>();

const store = useEcaasStore();

const { dwellingSpaceInternalWall, dwellingSpacePartyWall, dwellingSpaceWallToUnheatedSpace } = store.dwellingFabric.dwellingSpaceWalls;
const { dwellingSpaceCeilings } = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;

const options = adjacentSpaceType === "heatedSpace" ? [
	dwellingSpaceInternalWall.data.map(x => [x.data.id, x.data.name] as [string, string]),
	dwellingSpaceCeilings.data
		.filter(x => x.data.type === "heatedSpace")
		.map(x => [x.data.id, x.data.name] as [string, string]),
] : [
	dwellingSpaceWallToUnheatedSpace.data.map(x => [x.data.id, x.data.name] as [string, string]),
	dwellingSpaceCeilings.data
		.filter(x => x.data.type === "unheatedSpace")
		.map(x => [x.data.id, x.data.name] as [string, string]),
	dwellingSpacePartyWall.data.map(x => [x.data.id, x.data.name] as [string, string]),
];

const flattenedOptions = options.flat().filter(x => x[0] !== undefined);
</script>

<template>
	<ClientOnly>
		<FormKit
			:id="id"
			type="govRadios"
			:options="new Map(flattenedOptions)"
			:label="label"
			:help="help"
			:name="name"
			:validation="validation ?? 'required'"
			:validation-rules="validationRules"
			:validation-messages="validationMessages">
			<div v-if="!flattenedOptions.length">
				<p class="govuk-error-message">No walls or ceilings added.</p>
				<div class="gov-radios-add-links">
					<NuxtLink :to="getUrl('dwellingSpaceWalls')" class="govuk-link gov-radios-add-link">
						Click here to add walls
					</NuxtLink>
					<NuxtLink :to="getUrl('dwellingSpaceCeilingsAndRoofs')" class="govuk-link gov-radios-add-link">
						Click here to add ceilings
					</NuxtLink>
				</div>
			</div>
		</FormKit>
	</ClientOnly>
</template>

<style scoped lang="scss">
.gov-radios-add-links {
	display: flex;
	flex-direction: column;
	gap: 20px;
}
</style>