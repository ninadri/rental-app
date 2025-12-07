export const formatRequest = (r: any) => {
  const obj = r.toObject();
  return {
    _id: obj._id,
    title: obj.title,
    description: obj.description,
    urgency: obj.urgency,
    category: obj.category,
    status: obj.status,
    images: obj.images,
    adminNotes: obj.adminNotes,
    user: obj.user,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};
