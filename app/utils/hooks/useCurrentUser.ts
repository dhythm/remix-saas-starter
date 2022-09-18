import { useLoaderData } from "@remix-run/react";
import type { verifyCurrentUser } from "../auth.server";

export type CurrentUser = Awaited<ReturnType<typeof verifyCurrentUser>>;

type LoaderData = {
  currentUser: CurrentUser;
};

export const useCurrentUser = () => {
  const data = useLoaderData<LoaderData>();
  return data?.currentUser;
};
