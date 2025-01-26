import type { PropsWithChildren } from 'react';

export type TConditional = PropsWithChildren<{
  if: boolean;
}>;

const Conditional = (props: TConditional) => {
  const { if: condition, children } = props;
  return condition ? children : null;
};

export default Conditional;