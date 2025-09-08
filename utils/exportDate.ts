export const lastExportDateCookieName = "last_export_date" as const;

export const clearLastExportDate = () => {
	useCookie(lastExportDateCookieName).value = undefined;
};