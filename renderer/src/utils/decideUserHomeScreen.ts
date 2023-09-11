import router from "next/router";

export const decideUserHomeScreen = (user: any) => {
  if (user) {
    router.push(`/platform/transactions/new`);
  } else {
    router.push("/signup");
  }
};
