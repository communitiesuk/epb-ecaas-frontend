<script setup lang="ts">
import { AdjacentSpaceType, getUrl } from '#imports';

const { adjacentSpaceType } = defineProps<{
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

let options = adjacentSpaceType === AdjacentSpaceType.heatedSpace ? [
	dwellingSpaceInternalWall.data.map(x => [x.data.id, x.data.name] as [string, string]),
	dwellingSpaceCeilings.data
		.filter(x => x.data.type === AdjacentSpaceType.heatedSpace)
		.map(x => [x.data.id, x.data.name] as [string, string])
] : [
	dwellingSpaceWallToUnheatedSpace.data.map(x => [x.data.id, x.data.name] as [string, string]),
	dwellingSpaceCeilings.data
		.filter(x => x.data.type === AdjacentSpaceType.unheatedSpace)
		.map(x => [x.data.id, x.data.name] as [string, string]),
	dwellingSpacePartyWall.data.map(x => [x.data.id, x.data.name] as [string, string])
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
			<div v-if="!options.length">
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