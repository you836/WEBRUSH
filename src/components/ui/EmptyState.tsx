import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <SearchX className="w-12 h-12 text-ivory-muted/40 mb-4" />
      <h3 className="font-serif text-xl text-ivory mb-2">{title}</h3>
      <p className="text-sm text-ivory-muted max-w-md">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 text-sm bg-surface-light text-ivory rounded-md hover:bg-border transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
