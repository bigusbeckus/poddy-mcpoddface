import { ProgressCircular } from "./progress/progress-circular";

export const Loading: React.FC = () => {
  return (
    <div className="h-full flex justify-center items-center">
      <ProgressCircular className="w-12 dark:stroke-white stroke-black" />
    </div>
  );
};
