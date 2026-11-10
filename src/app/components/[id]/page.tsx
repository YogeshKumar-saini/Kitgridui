import { ComponentView } from "@/features/gallery/component"

export default async function ComponentPage({
  params,
  searchParams,
}: PageProps<"/components/[id]">) {
  const [{ id }, query] = await Promise.all([params, searchParams])
  return (
    <ComponentView
      id={id}
      full={"full" in query}
      props={typeof query.props === "string" ? query.props : undefined}
    />
  )
}
