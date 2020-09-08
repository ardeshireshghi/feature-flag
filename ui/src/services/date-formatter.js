export const dateTimeAgo = (dateString) => {
  const updatedMinsAgo = (Date.now() - Date.parse(dateString)) / 1000 / 60;

  if (updatedMinsAgo < 1) {
    return `${Math.round(updatedMinsAgo * 60)} seconds ago`;
  }

  if (updatedMinsAgo < 60) {
    return `${Math.floor(updatedMinsAgo)} minutes ago`;
  }

  if (updatedMinsAgo < 60 * 24) {
    return `${Math.floor(updatedMinsAgo / 60)} hours ago`;
  }

  return `${Math.floor(updatedMinsAgo / (60 * 24))} days ago`;
};
