import { Badge } from './ui/badge';

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const Code = ({ className, children }: Props) => {
  return (
    <Badge variant="secondary" className={className}>
      <code className={'text-xs font-semibold'}>{children}</code>
    </Badge>
  );
};
