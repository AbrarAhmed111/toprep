import { PreparationWorkspace } from '@/components/preparations/PreparationWorkspace'

export default async function PreparationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <PreparationWorkspace preparationId={id} />
}
