import { axios } from "../../../lib/axios";
export type LoginCredentialsDTO = {
  phoneNumber: string;
  password: string;
};

export const loginWithEmailAndPassword = (data: LoginCredentialsDTO) => {
  return axios.post("/auth/signin/admin", data);
};
