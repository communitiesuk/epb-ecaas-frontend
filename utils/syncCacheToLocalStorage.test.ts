import { mockNuxtImport } from "@nuxt/test-utils/runtime";

const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn() }));

mockNuxtImport("$fetch", () => fetchMock);

describe("syncCacheToLocalStorage", () => {
	const mockResponse = { test: "value" };
	interface CacheData {
		[key: string]: string;
	}

	function mockFetchResponse(mockResponse: CacheData | undefined) {
		fetchMock.mockResolvedValue(mockResponse);
	}

	let getItemSpy: ReturnType<typeof vi.spyOn>;
	let setItemSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		getItemSpy = vi.spyOn(localStorage, "getItem");
		setItemSpy = vi.spyOn(localStorage, "setItem");
		fetchMock.mockReset();
		localStorage.clear();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should return if local storage has ecaas data", async () => {
		getItemSpy.mockReturnValue("localStorageData");
		await syncCacheToLocalStorage();
		expect(getItemSpy).toHaveBeenCalledWith("ecaas");
		expect(setItemSpy).not.toHaveBeenCalled();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("should fetch data from cache if local storage has no ecaas data", async () => {
		mockFetchResponse(mockResponse);
		await syncCacheToLocalStorage();
		expect(fetchMock).toHaveBeenCalledWith("/api/session", { method: "GET" });
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
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(setItemSpy).not.toHaveBeenCalled();
	});
});
