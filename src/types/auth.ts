
export type UserRole = "CUSTOMER" | "DELIVERY_AGENT" | "ADMIN";


export type AuthUser = {
  userId: number;
  role: UserRole;
};