export const getStatusColor = (status: string) => {
  switch (status) {
    case "VERIFIED":
      return "bg-green-500";
    case "UNVERIFIED":
      return "bg-yellow-500";
    case "SOLD":
      return "bg-red-500";
    case "REJECTED":
      return "bg-gray-500";
    case "PENDING":
      return "bg-blue-500";
    default:
      return "bg-gray-300";
  }
};
