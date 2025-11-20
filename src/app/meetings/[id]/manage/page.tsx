import React from 'react';
import MeetingDetail from '@/components/MeetingDetail';

export default function ManagePage({ params }: { params: { id: string } }) {
  return <MeetingDetail id={params.id} />;
}
