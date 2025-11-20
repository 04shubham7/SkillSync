import { redirect } from 'next/navigation';

export default function Page({ params }: { params: { id: string } }) {
  // server-side redirect to the canonical meeting room route
  redirect(`/meeting/${params.id}`);
}
