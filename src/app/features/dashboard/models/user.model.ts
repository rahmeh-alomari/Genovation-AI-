export interface User {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  role: string;
  department?: string;
  fleet?: string;
  rfi?: string;
  dPhone?: string;
  otp?:string
}
export interface AdminUser extends User {
  password: string;    
}
export interface SignupFormValue {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role:string
}