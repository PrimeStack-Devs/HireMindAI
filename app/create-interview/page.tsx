import AdvancedInterviewForm from "@/components/interview/create/AdvancedInterviewForm";
import BasicInterviewForm from "@/components/interview/create/BasicInterviewForm";

type CreateInterviewPageProps = {
  searchParams?: {
    type?: string;
  };
};

export default function CreateInterviewPage({
  searchParams,
}: CreateInterviewPageProps) {
  const type = searchParams?.type;
  const interviewType =
    type === "advanced" || type === "advance" ? "advanced" : "basic";

  return interviewType === "advanced" ? (
    <AdvancedInterviewForm />
  ) : (
    <BasicInterviewForm />
  );
}
