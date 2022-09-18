import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { SidebarWithHeader } from "~/components";
import { verifyCurrentUser } from "~/utils/auth.server";
import { useCurrentUser } from "~/utils/hooks";

export const loader: LoaderFunction = async ({ request }) => {
  const currentUser = await verifyCurrentUser(request);
  const data = { currentUser };
  return json(data);
};

export default function Index() {
  const currentUser = useCurrentUser();
  return (
    <SidebarWithHeader
      name={currentUser.name ?? ""}
      roleName={currentUser.role.name}
    >
      <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
        <h1>Welcome to remix-saas-starter</h1>
      </div>
    </SidebarWithHeader>
  );
}
