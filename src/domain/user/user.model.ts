/**
 * User domain model
 */
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  age: number;
  university: string;
  company: string;
  role: string;
}

/**
 * User query filters
 */
export interface UserFilters {
  search?: string;
  limit?: number;
  skip?: number;
  sortBy?: keyof User;
  order?: "asc" | "desc";
}
