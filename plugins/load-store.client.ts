export default defineNuxtPlugin(async () => {
		await syncCacheToLocalStorage();
});
