<script setup lang="ts">
import formStatus from "~/constants/formStatus";

const title = "Windows";
const page = usePage();
const store = useEcaasStore();

function handleRemove(index: number) {
	const windows = store.dwellingFabric.dwellingSpaceWindows?.data;
	if(windows){
		windows.splice(index, 1);
		
		store.$patch({
			dwellingFabric: {
				dwellingSpaceWindows: {
					data: windows.length ? windows : [],
					complete: false,
				},
			},
		});
	}
}

function handleDuplicate(index: number) {
	const windows = store.dwellingFabric.dwellingSpaceWindows.data;
	const window = windows?.[index];
	let name: string;

	if (window) {
		const duplicates = windows.filter(w => 
		{
			if (isEcaasForm(w) && isEcaasForm(window)) {
				name = window.data.name;
				return w.data.name.match(duplicateNamePattern(window.data.name));
			}
			return false;
		});
		store.$patch((state) => {
			const newItem: EcaasForm<WindowData> = {
				complete: window.complete,
				data: {
					...(window.data as WindowData),
					name: `${name} (${duplicates.length})`,
				},
			};

			state.dwellingFabric.dwellingSpaceWindows.data.push(newItem);
			state.dwellingFabric.dwellingSpaceWindows.complete = false;
		});
	}
}

function handleComplete() {
	store.$patch({
		dwellingFabric: {
			dwellingSpaceWindows: {
				complete: true,
			},
		},
	});
	navigateTo("/dwelling-fabric");

}

function hasIncompleteEntries(){

	const windows = store.dwellingFabric.dwellingSpaceWindows;
	return windows.data.some(
		window => isEcaasForm(window) ? !window.complete : false);
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
		id="windows"
		title="Window"
		:form-url="page?.url!"
		:items="store.dwellingFabric.dwellingSpaceWindows.data.map(x =>  ({
			name: x.data.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress}))"
		:show-status="true"
		@remove="handleRemove"
		@duplicate="handleDuplicate"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton href="/dwelling-fabric" secondary>
			Return to dwelling fabric
		</GovButton>
		<CompleteElement :is-complete="store.dwellingFabric.dwellingSpaceWindows.complete ?? false" :disabled="hasIncompleteEntries()" @completed="handleComplete"/>
	</div>
</template>
