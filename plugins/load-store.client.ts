export default defineNuxtPlugin(async () => {
	if (process.env.NODE_ENV === "production") {
		await syncCacheToLocalStorage();
	}
});
