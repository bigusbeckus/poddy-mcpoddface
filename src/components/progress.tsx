import { FC, useMemo } from "react";

type ProgressProps = {
  percent: number;
};

export const ProgressCircular: FC<{
  percent?: number;
  thickness?: number;
}> = ({ percent, thickness }) => {
  const _percent = percent ?? 80;
  const _thickness = thickness ?? 20;

  // const vBoxDimension = 100;
  const circleDimension = 50; // vBoxDimension / 2;
  const strokeWidth = circleDimension * (_thickness / 100);
  const radius = circleDimension - Math.floor(strokeWidth / 2);

  return (
    <div className="overflow-clip p-1">
      <div className="animate-spin animation-quick">
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          width={30}
          height={30}
          className="-rotate-90 w-full h-full stroke-indigo-900">
          <circle
            cx={circleDimension}
            cy={circleDimension}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={100}
            pathLength={100}
            strokeDashoffset={100 - _percent}
          />
        </svg>
      </div>
    </div>
  );
};
