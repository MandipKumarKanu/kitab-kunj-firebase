export const formatDate = (date) => {
  console.log(date)
  return date
    ? date.toDate().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "No date available";
};
