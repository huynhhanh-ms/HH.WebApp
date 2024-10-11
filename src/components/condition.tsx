
interface ConditionProps {
  condition: boolean;
  children: React.ReactNode;
  elseChildren?: React.ReactNode;
}

export function Condition({ condition, children, elseChildren }: ConditionProps) {
  return <>{condition ? children : elseChildren}</>;
}