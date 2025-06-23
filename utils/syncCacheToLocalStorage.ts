export const syncCacheToLocalStorage = async () => {

	if(localStorage.getItem("ecaas")){
		return;
	}
	await $fetch("/api/getState",{ method: "GET"});

};
