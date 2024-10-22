import { ACCESS_TOKEN } from "./constant";

export function isUserLoggedIn() {
  return !!localStorage.getItem(ACCESS_TOKEN);
}
