
'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useDebounce } from '@/hooks/use-debounce';
import { searchStocksAction } from '@/app/actions';
import type { SearchResult } from '@/lib/market-data';
import { StockDetailsDialog } from './stock-details-dialog';

export function StockSearch() {
  const [query, setQuery] = React.useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDropdownOpen, setDropdownOpen] = React.useState(false);
  const [selectedSymbol, setSelectedSymbol] = React.useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (debouncedQuery) {
      setIsLoading(true);
      setDropdownOpen(true);
      searchStocksAction(debouncedQuery).then((res) => {
        if (!('error' in res)) {
          setResults(res);
        } else {
          setResults([]);
        }
        setIsLoading(false);
      });
    } else {
      setResults([]);
      setDropdownOpen(false);
    }
  }, [debouncedQuery]);

  const handleSelect = (symbol: string) => {
    setQuery('');
    setDropdownOpen(false);
    setSelectedSymbol(symbol);
    setDialogOpen(true);
  };

  const handleInputFocus = () => {
    if (results.length > 0) {
      setDropdownOpen(true);
    }
  };
  
  const handleInputBlur = () => {
    // Delay hiding the dropdown to allow click events to register
    setTimeout(() => {
      setDropdownOpen(false);
    }, 150);
  };
  
  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
        setSelectedSymbol(null);
    }
  }

  return (
    <>
      <div className="relative">
        <Command className="overflow-visible bg-transparent">
            <CommandInput
              placeholder="Search stocks..."
              value={query}
              onValueChange={setQuery}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="h-10"
            />
          {isDropdownOpen && (
            <CommandList className="absolute top-full mt-2 w-full sm:w-64 rounded-md border bg-background shadow-lg z-50">
              {isLoading && <CommandItem disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" />Searching...</CommandItem>}
              {!isLoading && results.length === 0 && query && <CommandEmpty>No results found.</CommandEmpty>}
              <CommandGroup>
                {results.map((result) => (
                  <CommandItem
                    key={result.symbol}
                    value={result.symbol}
                    onSelect={() => handleSelect(result.symbol)}
                    className="cursor-pointer"
                  >
                    <span className="font-semibold">{result.symbol}</span>
                    <span className="ml-2 text-muted-foreground truncate">{result.description}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      </div>
      {selectedSymbol && (
        <StockDetailsDialog 
            symbol={selectedSymbol}
            open={isDialogOpen}
            onOpenChange={handleOpenChange}
        />
      )}
    </>
  );
}
