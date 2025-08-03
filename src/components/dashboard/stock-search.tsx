
'use client';

import * as React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
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

  React.useEffect(() => {
    if (debouncedQuery) {
      setIsLoading(true);
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
    }
  }, [debouncedQuery]);

  const handleSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
    setQuery('');
    setDropdownOpen(false);
  };

  return (
    <>
      <div className="relative">
        <Command className="overflow-visible">
          <CommandInput
            placeholder="Search stocks..."
            value={query}
            onValueChange={setQuery}
            onFocus={() => setDropdownOpen(true)}
            onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
            className="w-full sm:w-64"
          />
          <CommandList className={`absolute top-full mt-2 w-full sm:w-64 rounded-md border bg-background shadow-lg z-50 ${isDropdownOpen && (query || results.length > 0) ? 'block' : 'hidden'}`}>
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
        </Command>
      </div>
      {selectedSymbol && (
        <StockDetailsDialog 
            symbol={selectedSymbol}
            open={!!selectedSymbol}
            onOpenChange={(open) => {
                if(!open) setSelectedSymbol(null)
            }}
        />
      )}
    </>
  );
}
