<script setup lang="ts">
import formStatus from '~/constants/formStatus';

const title = "Distant shading";
const page = usePage();
const store = useEcaasStore();

const { data = [] } = store.dwellingDetails.shading;

function handleRemove(index: number) {
	data.splice(index, 1);
	
	store.$patch({
		dwellingDetails: {
			shading: {
				data,
				complete: false
			}
		}
	});
}

function handleDuplicate(index: number) {
	const shading = data[index];
	
	if (shading) {
		const duplicates = data.filter(s => s.data.name.match(duplicateNamePattern(shading.data.name)));
		
		store.$patch((state) => {
			state.dwellingDetails.shading.data.push({
				complete: shading.complete,
				data: {
					...shading.data,
					name: `${shading.data.name} (${duplicates.length})`
				}
			});

			state.dwellingDetails.shading.complete = false;
		});
	}
}


function handleComplete() {
	store.$patch({
		dwellingDetails: {
			shading: { complete: true }
		}
	});
		
	navigateTo('/dwelling-details');		
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
		id="shading"
		title="Shading"
		:form-url="page?.url!"
		:items="store.dwellingDetails.shading?.data?.map(x => ({
			name: x.data.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		@remove="handleRemove"
		@duplicate="handleDuplicate"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton href="/dwelling-details" secondary>
			Return to dwelling details
		</GovButton>
		<CompleteElement
			:is-complete="!!store.dwellingDetails.shading.complete"
			:disabled="store.dwellingDetails.shading.data.some(s => !s.complete)"
			@completed="handleComplete"
		/>
	</div>
</template>

