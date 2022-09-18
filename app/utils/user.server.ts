import { db } from "./db.server";
import { getUserId } from "./session.server";

export async function getCurrentUser(
  request: Request,
  isFallback: boolean = false
) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      organizationCode: true,
      name: true,
      email: true,
      role: {
        select: {
          name: true,
        },
      },
    },
  });

  return user;
}
