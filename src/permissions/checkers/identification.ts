export const isAllowedIdentification = (
  role: string,
  identifications: number
) => {
  if (role === "admin") return true;
  if (role === "user" && identifications > 0) return false;
};
