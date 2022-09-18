import { redirect } from "@remix-run/node";
import { getCurrentUser } from "./user.server";

export const verifyCurrentUser = async (request: Request) => {
  const user = await getCurrentUser(request);
  if (!user) {
    throw redirect("/login");
  }

  return user;
};
