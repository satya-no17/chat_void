import ClientChat from "./ClientChat";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const code = params?.code ?? null;
  const name = params?.name ?? null;

  return <ClientChat code={code} name={name} />;
}