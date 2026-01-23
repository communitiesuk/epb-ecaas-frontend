describe("syncCacheToLocalStorage", () => {
	const mockResponse = { test: "value" };
	interface CacheData {
		[key: string]: string;
	}

	function mockFetchResponse(mockResponse: CacheData | undefined) {
		return (global.$fetch = vi.fn(() =>
			Promise.resolve(mockResponse),
		) as unknown as typeof global.$fetch);
	}

	const getItemSpy = vi.spyOn(localStorage, "getItem");
	const setItemSpy = vi.spyOn(localStorage, "setItem");
	const fetchSpy = vi.spyOn(global, "$fetch");

	beforeEach(() => {
		localStorage.clear();
		getItemSpy.mockClear();
		getItemSpy.mockReset();
		setItemSpy.mockClear();
		fetchSpy.mockClear();
	});

	it("should return if local storage has ecaas data", async () => {
		getItemSpy.mockReturnValue("localStorageData");
		await syncCacheToLocalStorage();
		expect(getItemSpy).toHaveBeenCalledWith("ecaas");
		expect(setItemSpy).not.toHaveBeenCalled();
		expect($fetch).not.toHaveBeenCalled();
	});

	it("should fetch data from cache if local storage has no ecaas data", async () => {
		mockFetchResponse(mockResponse);
		await syncCacheToLocalStorage();
		expect($fetch).toHaveBeenCalledWith("/api/session", { method: "GET" });
	});

	it("should update local storage with cached data if local storage has no ecaas data", async () => {
		mockFetchResponse(mockResponse);
		await syncCacheToLocalStorage();
		expect(setItemSpy).toHaveBeenCalledWith(
			"ecaas",
			JSON.stringify(mockResponse),
		);
		expect(localStorage.ecaas).toEqual(JSON.stringify(mockResponse));
	});

	it("should not update local storage if there is no cached data", async () => {
		mockFetchResponse(undefined);
		await syncCacheToLocalStorage();
		expect(fetchSpy).toHaveBeenCalledTimes(1);
		expect(setItemSpy).not.toHaveBeenCalled();
	});

	//try assigning the console to a variable

	// it("should log an error if fetch fails", async () => {
	// 	const consoleSpy = vi.spyOn(console, "error");
	// 	global.$fetch = vi.fn(() => {
	// 		return Promise.reject("Network error");
	// 	}) as unknown as typeof global.$fetch;
	// 	await syncCacheToLocalStorage();

	// 	expect(consoleSpy).toHaveBeenCalledWith("Failed to fetch data: Network error");
	// 	expect(setItemSpy).not.toHaveBeenCalled();
	// });
});
