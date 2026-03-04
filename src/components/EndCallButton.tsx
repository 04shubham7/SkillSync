import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

function EndCallButton() {
  const call = useCall();
  const router = useRouter();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  if (!call) return null;

  const isMeetingOwner = localParticipant?.userId === call.state.createdBy?.id;
  if (!isMeetingOwner) return null;

  const endCall = async () => {
    try {
      await call.endCall();

      // If the call contains a meeting id or stream id, attempt to mark interview completed
      const meetingId = (call.state as any)?.meetingId || (call.state as any)?.meeting || null;
      if (meetingId) {
        try {
          await fetch(`/api/interviews/${meetingId}`, {
            method: 'PATCH',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ status: 'completed' }),
          });
        } catch (err) {
          console.error('Failed to notify server of meeting end', err);
        }
      }

      router.push('/');
      toast.success('Meeting ended for everyone');
    } catch (error) {
      console.log(error);
      toast.error('Failed to end meeting');
    }
  };

  return (
    <Button variant={"destructive"} onClick={endCall}>
      End Meeting
    </Button>
  );
}
export default EndCallButton;
