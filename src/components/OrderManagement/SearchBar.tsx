
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
}

const SearchBar = ({ searchTerm, onSearchChange, onClearSearch }: SearchBarProps) => {
  return (
    <div className="flex items-center space-x-2 mt-4">
      <Search className="h-4 w-4 text-gray-500" />
      <Input
        placeholder="Search by Order ID..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
      {searchTerm && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearSearch}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
