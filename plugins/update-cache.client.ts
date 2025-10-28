export default defineNuxtPlugin(() => {
	const store = useEcaasStore();
	store.$subscribe(async () => {
		await store.postEcaasState();
	});
});
