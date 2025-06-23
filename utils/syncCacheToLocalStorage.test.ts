describe("syncCacheToLocalStorage", () => {

	const mockResponse = { test: "value" };
	global.$fetch = vi.fn(() =>
		Promise.resolve({
			json: () => Promise.resolve(mockResponse),
		})
	) as unknown as typeof global.$fetch;

	const getItemSpy = vi.spyOn(localStorage, "getItem");
	const setItemSpy = vi.spyOn(localStorage, "setItem");
	beforeEach(() => {
		localStorage.clear();
		getItemSpy.mockClear();
		getItemSpy.mockReset();
		setItemSpy.mockClear();
	});

	it("should return if local storage has ecaas data", async () => {
		getItemSpy.mockReturnValue("localStorageData");
		await syncCacheToLocalStorage();
		expect(getItemSpy).toHaveBeenCalledWith("ecaas");
		expect(setItemSpy).not.toHaveBeenCalled();
		expect($fetch).not.toHaveBeenCalled();
	});

	it("should fetch data from cache if local storage has no ecaas data", async () => {
		await syncCacheToLocalStorage();
		expect($fetch).toHaveBeenCalledWith("/api/getState", { method: "GET" });
	});
});
