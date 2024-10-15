export const formatDate = (date) => {
  return date
    ? date.toDate().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "No date available";
};
