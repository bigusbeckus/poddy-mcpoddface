import { Switch } from "@headlessui/react";

export type ToggleProps = {
  enabled: boolean;
  onChange?(checked: boolean): void;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  srLabel: string;
  className?: string;
};

export const Toggle: React.FC<ToggleProps> = (props) => {
  const leading = props.leading ? (
    <span className="pr-4">{props.leading}</span>
  ) : (
    ""
  );
  const trailing = props.trailing ? (
    <span className="pl-4">{props.trailing}</span>
  ) : (
    ""
  );

  return (
    <div className={`inline-block ${props.className ?? ""}`}>
      {leading}
      <Switch
        checked={props.enabled}
        onChange={props.onChange}
        className={`${
          props.enabled ? "bg-green-600" : "bg-black/20 dark:bg-white/20"
        } relative inline-flex h-6 w-11 items-center rounded-full`}>
        <span className="sr-only">{props.srLabel}</span>
        <span
          className={`${
            props.enabled ? "translate-x-6" : "translate-x-1"
          } inline-block h-4 w-4 transform rounded-full transition bg-white shadow-xl`}
        />
      </Switch>
      {trailing}
    </div>
  );
};
