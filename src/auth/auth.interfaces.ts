export interface JwtPayload {
  _id: string;
  email: string;
}

export interface RegistrationStatus {
  success: boolean;
  message: string;
}

export interface IUpdate {
  email: string;
  oldPassword: string;
  newPassword: string;
  newPasswordAgain: string;
}
