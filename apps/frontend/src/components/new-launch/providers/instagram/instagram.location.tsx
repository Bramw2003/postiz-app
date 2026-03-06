'use client';

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useSettings } from '@gitroom/frontend/components/launches/helpers/use.values';
import { useCustomProviderFunction } from '@gitroom/frontend/components/launches/helpers/use.custom.provider.function';
import clsx from 'clsx';

export const InstagramLocation: FC<{
  name: string;
  onChange: (event: { target: { value: string; name: string } }) => void;
}> = ({ name, onChange }) => {
  const { getValues } = useSettings();
  const { get } = useCustomProviderFunction();

  const [query, setQuery] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [results, setResults] = useState<{ id: string; name: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = getValues()[name];
    const savedName = getValues()[`${name}_display`];
    if (saved && savedName) {
      setSelectedName(savedName);
      setQuery(savedName);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const search = useCallback(
    async (q: string) => {
      if (!q.trim()) {
        setResults([]);
        setOpen(false);
        return;
      }
      setLoading(true);
      try {
        const data = await get('locationSearch', { q });
        setResults(data || []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [get]
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setQuery(val);
      setSelectedName('');
      onChange({ target: { value: '', name } });

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => search(val), 400);
    },
    [search, onChange, name]
  );

  const handleSelect = useCallback(
    (place: { id: string; name: string }) => {
      setSelectedName(place.name);
      setQuery(place.name);
      setOpen(false);
      setResults([]);
      onChange({ target: { value: place.id, name } });
    },
    [onChange, name]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    setSelectedName('');
    setResults([]);
    setOpen(false);
    onChange({ target: { value: '', name } });
  }, [onChange, name]);

  return (
    <div ref={containerRef} className="flex flex-col gap-[6px] relative">
      <div className="text-[14px]">Location (optional)</div>
      <div className="bg-newBgColorInner h-[42px] border-newTableBorder border rounded-[8px] flex items-center px-[16px] gap-[8px]">
        <input
          type="text"
          value={query}
          onChange={handleInput}
          placeholder="Search for a location..."
          className="flex-1 h-full bg-transparent outline-none text-[14px] text-textColor placeholder-textColor"
        />
        {loading && (
          <div className="w-[14px] h-[14px] border-2 border-textColor border-t-transparent rounded-full animate-spin" />
        )}
        {selectedName && (
          <button
            type="button"
            onClick={handleClear}
            className="text-textColor hover:opacity-70 text-[18px] leading-none"
          >
            ×
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-[4px] left-0 right-0 z-50 bg-newBgColorInner border border-newTableBorder rounded-[8px] overflow-hidden shadow-lg">
          {results.map((place) => (
            <button
              key={place.id}
              type="button"
              onMouseDown={() => handleSelect(place)}
              className={clsx(
                'w-full text-left px-[16px] py-[10px] text-[13px] text-textColor hover:bg-tableBorder transition-colors'
              )}
            >
              {place.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
