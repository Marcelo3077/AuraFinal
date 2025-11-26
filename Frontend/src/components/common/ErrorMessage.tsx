import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface ErrorMessageProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  title = 'Error',
  message,
  retry 
}) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        {retry && (
          <button
            onClick={retry}
            className="underline hover:no-underline"
          >
            Try again
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
};
