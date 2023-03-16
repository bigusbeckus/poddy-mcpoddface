import { ProgressCircular } from "@/components/progress/progress-circular";

export const Loading: React.FC = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <ProgressCircular className="w-12 stroke-black dark:stroke-white" />
    </div>
  );
};
