'use client';

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useSettings } from '@gitroom/frontend/components/launches/helpers/use.values';
import { useCustomProviderFunction } from '@gitroom/frontend/components/launches/helpers/use.custom.provider.function';

interface LocationItem { id: string; name: string; }

export const InstagramLocationSelector: FC<{
  name: string;
  label: string;
  onChange: (event: { target: { value: LocationItem | undefined; name: string } }) => void;
}> = ({ name, label, onChange }) => {
  const { getValues } = useSettings();
  const customFunc = useCustomProviderFunction();
  const [value, setValue] = useState<LocationItem | undefined>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = getValues()[name];
    if (saved?.id) setValue(saved);
  }, []);

  const emit = useCallback(
    (loc: LocationItem | undefined) => {
      setValue(loc);
      onChange({ target: { value: loc, name } });
    },
    [onChange, name]
  );

  useEffect(() => {
    if (!open || query.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const list = await customFunc.get('locationSearch', { q: query });
        setResults(Array.isArray(list) ? list : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => {
      clearTimeout(timer);
      setLoading(false);
    };
  }, [query, open]);

  if (value) {
    return (
      <div className="flex flex-col gap-[6px]">
        <div className="text-[14px]">{label}</div>
        <div className="flex items-center gap-[8px] bg-newBgColorInner border border-newTableBorder rounded-[6px] px-[10px] py-[6px] text-[13px]">
          <span className="flex-1 truncate text-textColor">{value.name}</span>
          <button
            className="opacity-60 hover:opacity-100 font-bold text-[14px] leading-none shrink-0"
            onClick={() => emit(undefined)}
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[6px] relative">
      <div className="text-[14px]">{label}</div>
      <div className="bg-newBgColorInner border border-newTableBorder rounded-[6px] px-[10px] py-[6px] flex items-center gap-[6px]">
        <input
          ref={inputRef}
          value={query}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none text-[13px] text-textColor placeholder-textColor/50"
          placeholder="Search location…"
        />
        {loading && <span className="opacity-40 text-[11px] shrink-0">…</span>}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-20 mt-[2px] bg-newBgColorInner border border-newTableBorder rounded-[6px] shadow-xl overflow-hidden max-h-[180px] overflow-y-auto">
          {results.map((r) => (
            <div
              key={r.id}
              className="px-[10px] py-[7px] text-[13px] text-textColor cursor-pointer hover:bg-newTableBorder/50"
              onMouseDown={() => { emit(r); setOpen(false); setQuery(''); }}
            >
              {r.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
