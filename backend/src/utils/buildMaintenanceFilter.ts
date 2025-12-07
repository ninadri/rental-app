export const buildMaintenanceFilter = (query: any, baseFilter: any = {}) => {
  const filter: any = { ...baseFilter };

  // Urgency
  if (query.urgency) {
    filter.urgency = query.urgency;
  }

  // Category
  const validCategories = [
    "hvac",
    "kitchen",
    "washer-dryer",
    "bathroom",
    "living-room",
    "garage",
    "lawn",
    "bedroom",
    "electrical",
    "plumbing",
    "general",
  ];

  if (query.category && validCategories.includes(query.category)) {
    filter.category = query.category;
  }

  return filter;
};
