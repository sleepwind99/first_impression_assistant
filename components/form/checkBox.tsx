"use client";

import { ReactElement } from "react";

export type CheckboxProps = {
  id: string;
  isDisabled?: boolean;
  isChecked: boolean;
  onChecked: (e: boolean) => void;
  children?: ReactElement;
};

const Checkbox = ({
  id,
  isDisabled,
  isChecked,
  onChecked,
  children,
}: CheckboxProps) => {
  return (
    <label id={id}>
      <input
        type="checkbox"
        disabled={isDisabled}
        checked={isChecked}
        onChange={({ target: { checked } }) => onChecked(checked)}
      />
      {children}
    </label>
  );
};
export default Checkbox;
