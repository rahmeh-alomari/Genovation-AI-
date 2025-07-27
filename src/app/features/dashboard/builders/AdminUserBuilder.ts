
import { AdminUser } from "../models/user.model.js";


export class AdminUserBuilder {
  private user: AdminUser;

  constructor() {
    this.user = {
      id: 0,       
      email: '',
      password: '',
      role: 'admin', 
      firstName: '',
      lastName: '',
      otp: ""    };
  }
 
  setId(id: number): this {
    this.user.id = id;
    return this;
  }

 setEmail(email: string): this {
  this.user.email = email.trim().toLowerCase();
  return this;
}

  setPassword(password: string): this {
    this.user.password = password;
    return this;
  }

  setRole(role: string): this {
    this.user.role = role;
    return this;
  }

  setFirstName(firstName: string): this {
    this.user.firstName = firstName;
    return this;
  }
 setLastName(lastName: string): this {
    this.user.lastName = lastName;
    return this;
  }


  setOtp(otp: string): this {
    this.user.otp = otp;
    return this;
  }

  build(): AdminUser {
    return { ...this.user };
  }
}
