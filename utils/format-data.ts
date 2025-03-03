export default formatData;

function formatData(
  value: string | number | boolean | undefined,
  capitaliseFirstLetter: boolean
) {
  if (value === undefined) {
    return "";
  }

  if (typeof value == "string") {
    const formattedString = value.split(/(?=[A-Z])/).join(" ");
    if (capitaliseFirstLetter) {
      return (
        formattedString.charAt(0).toUpperCase() +
        formattedString.slice(1).toLowerCase()
      );
    } else return formattedString.toLowerCase();
  }

  return value;
}