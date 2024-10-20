import Cookies from "js-cookie";
import { ACCESS_TOKEN } from "./constant";

export function isUserLoggedIn() {
  return !!Cookies.get(ACCESS_TOKEN);
}
