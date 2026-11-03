import api, { setApiCsrfToken } from "./api";

let adapter = null;

const requiredMethods = ["login", "logout", "getSession"];

export function configureAuthAdapter(nextAdapter) {
  if (!nextAdapter || requiredMethods.some((method) => typeof nextAdapter[method] !== "function")) {
    throw new TypeError(`The auth adapter must implement: ${requiredMethods.join(", ")}`);
  }
  adapter = nextAdapter;
}

function getAdapter() {
  if (!adapter) {
    throw new Error("Authentication is not configured. Review campaigns/INTEGRATION_REPORT.md before connecting an auth adapter.");
  }
  return adapter;
}

export const authService = {
  login: (...args) => getAdapter().login(...args),
  logout: (...args) => getAdapter().logout(...args),
  getSession: (...args) => getAdapter().getSession(...args),
  setCsrfToken: setApiCsrfToken,
};

export function createAdminCookieAuthAdapter() {
  return {
    login: async () => {
      throw new Error("Login flow is intentionally unimplemented pending authentication integration approval.");
    },
    getSession: async () => {
      const { data } = await api.get("/user/admin/mfa/session");
      setApiCsrfToken(data.csrfToken);
      return data;
    },
    logout: async () => {
      const { data } = await api.post("/user/logout");
      setApiCsrfToken("");
      return data;
    },
  };
}
