export default defineNuxtPlugin(() => {
	if (process.env.NODE_ENV === "production") {
		const store = useEcaasStore();
		store.$subscribe(async () => {
			await store.postEcaasState();
		});
	}
});
