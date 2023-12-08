import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";

export interface User {
  name: string;
  surname: string;
  email: string;
  password: string;
  api_token: string;
}

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  const user = ref<User>({} as User);
  const isAuthenticated = ref(!!JwtService.getToken());

  function setAuth(authUser: User) {
    isAuthenticated.value = true;
    user.value = authUser;
    errors.value = {};
    JwtService.saveToken(user.value.api_token);
  }

  function setError(error: any) {
    errors.value = { ...error };
  }

  function purgeAuth() {
    isAuthenticated.value = false;
    user.value = {} as User;
    errors.value = [];
    JwtService.destroyToken();
    localStorage.removeItem("userData");
  }

  function login(credentials: User) {
    return ApiService.post("user/login", credentials)
      .then(({ data }) => {
        if (data.msg != "success") {
          setError({ name: data.msg });
        } else {
          setAuth(data);

          localStorage.removeItem("userData");
          localStorage.setItem(
            "userData",
            JSON.stringify({
              id: data.id,
              name: data.name,
              username: data.username,
              group_id: data.group_id,
            })
          );
          //   console.log(JSON.parse(localStorage.getItem("userData")).id);
        }
      })
      .catch(({ response }) => {
        setError({ name: response.data.msg });
      });
  }

  function logout() {
    purgeAuth();
  }

  function register(credentials: User) {
    return ApiService.post("register", credentials)
      .then(({ data }) => {
        setAuth(data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function forgotPassword(email: string) {
    return ApiService.post("forgot_password", email)
      .then(() => {
        setError({});
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function verifyAuth() {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      ApiService.post("user/verify-token", { api_token: JwtService.getToken() })
        .then(({ data }) => {
          setAuth(data);
        })
        .catch(({ response }) => {
          setError(response.data.errors);
          purgeAuth();
        });
    } else {
      purgeAuth();
    }
  }

  return {
    errors,
    user,
    isAuthenticated,
    login,
    logout,
    register,
    forgotPassword,
    verifyAuth,
  };
});
