<script setup lang="ts">
import formStatus from "~/constants/formStatus";

const title = "Lighting";
const page = usePage();
const store = useEcaasStore();

function handleRemove(index: number) {
	const bulbs = store.dwellingFabric.dwellingSpaceLighting.data;

	bulbs.splice(index, 1);

	store.$patch({
		dwellingFabric: {
			dwellingSpaceLighting: {
				data: bulbs.length ? bulbs : [],
				complete: false,
			},
		},
	});
}

function handleDuplicate(index: number) {
	const bulbs = store.dwellingFabric.dwellingSpaceLighting.data;
	const bulb = bulbs[index];
	let name: string;

	if (!bulb) {
		return;
	}

	const duplicates = bulbs.filter(x => {
		if (isEcaasForm(x) && isEcaasForm(bulb)) {
			name = bulb.data.name;
			return x.data.name.match(duplicateNamePattern(bulb.data.name));
		}
		return false;
	});

	store.$patch((state) => {
		const newItem: EcaasForm<DwellingSpaceLightingData> = {
			complete: bulb.complete,
			data: {
				...bulb.data,
				name: `${name} (${duplicates.length})`,
			} as DwellingSpaceLightingData,
		};

		state.dwellingFabric.dwellingSpaceLighting.data.push(newItem);
		state.dwellingFabric.dwellingSpaceLighting.complete = false;
	});
}

function handleComplete() {
	store.$patch({
		dwellingFabric: {
			dwellingSpaceLighting: {
				complete: true,
			},
		},
	});

	navigateTo("/dwelling-fabric");
}

function hasIncompleteEntries() {
	const bulbs = store.dwellingFabric.dwellingSpaceLighting;

	return bulbs.data.some(bulb => isEcaasForm(bulb) ? !bulb.complete : false);
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
		id="lighting"
		title="Bulb"
		:form-url="`${page?.url!}/bulb`"
		:items="store.dwellingFabric.dwellingSpaceLighting.data.map(x => ({
			name: x.data.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress,
		}))"
		:show-status="true"
		@remove="handleRemove"
		@duplicate="handleDuplicate"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton href="/dwelling-fabric" secondary>
			Return to dwelling fabric
		</GovButton>
		<CompleteElement
			:is-complete="store.dwellingFabric.dwellingSpaceLighting.complete ?? false"
			:disabled="hasIncompleteEntries()"
			@completed="handleComplete"
		/>
	</div>
</template>
