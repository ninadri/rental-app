export const buildSortOptions = (query: any) => {
  let sortDirection: 1 | -1 = -1;

  if (query.sort === "asc") {
    sortDirection = 1;
  }

  return { createdAt: sortDirection };
};
