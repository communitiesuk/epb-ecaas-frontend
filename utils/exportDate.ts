export const clearLastExportDate = () => {
	useCookie('last_export_date').value = undefined;
};