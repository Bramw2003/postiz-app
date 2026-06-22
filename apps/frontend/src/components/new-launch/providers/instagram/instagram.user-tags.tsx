'use client';

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useSettings } from '@gitroom/frontend/components/launches/helpers/use.values';
import { useIntegration } from '@gitroom/frontend/components/launches/helpers/use.integration';
import { useCustomProviderFunction } from '@gitroom/frontend/components/launches/helpers/use.custom.provider.function';

interface UserTagItem { label: string; x: number; y: number; }
interface UserSuggestion { username: string; name: string; profilePic: string; }

export const InstagramUserTags: FC<{
  name: string;
  onChange: (event: { target: { value: UserTagItem[]; name: string } }) => void;
}> = ({ name, onChange }) => {
  const { getValues } = useSettings();
  const { value: posts } = useIntegration();
  const customFunc = useCustomProviderFunction();
  const [tags, setTags] = useState<UserTagItem[]>([]);
  const [pendingPos, setPendingPos] = useState<{ x: number; y: number } | null>(null);
  const [pendingName, setPendingName] = useState('');
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const images = posts[0]?.image || [];
  const imageUrl = images[0]?.path;
  const isVideo = !!imageUrl && (imageUrl.includes('.mp4') || imageUrl.includes('.mov'));
  const isCarousel = images.length > 1;

  useEffect(() => {
    const saved = getValues()[name];
    if (Array.isArray(saved) && saved.length) setTags(saved);
  }, []);

  const update = useCallback(
    (newTags: UserTagItem[]) => {
      setTags(newTags);
      onChange({ target: { value: newTags, name } });
    },
    [name, onChange]
  );

  // Debounced user search
  useEffect(() => {
    if (!pendingPos) return;
    const q = pendingName.replace(/^@/, '');
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await customFunc.get('searchUsers', { q });
        setSuggestions(Array.isArray(results) ? results : []);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => {
      clearTimeout(timer);
      setSearching(false);
    };
  }, [pendingName, pendingPos]);

  const handleImageClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (tags.length >= 20) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
      setPendingPos({ x, y });
      setPendingName('');
      setSuggestions([]);
      setActiveIdx(-1);
      requestAnimationFrame(() => inputRef.current?.focus());
    },
    [tags.length]
  );

  const confirmTag = useCallback(
    (label: string) => {
      if (!label.trim() || !pendingPos) return;
      update([...tags, { label: label.trim().replace(/^@/, ''), x: pendingPos.x, y: pendingPos.y }]);
      setPendingPos(null);
      setPendingName('');
      setSuggestions([]);
      setActiveIdx(-1);
    },
    [pendingPos, tags, update]
  );

  const cancel = useCallback(() => {
    setPendingPos(null);
    setPendingName('');
    setSuggestions([]);
    setActiveIdx(-1);
  }, []);

  const removeTag = useCallback(
    (i: number) => update(tags.filter((_, idx) => idx !== i)),
    [tags, update]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, -1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIdx >= 0 && suggestions[activeIdx]) {
          confirmTag(suggestions[activeIdx].username);
        } else {
          confirmTag(pendingName);
        }
      } else if (e.key === 'Escape') {
        if (suggestions.length > 0) {
          setSuggestions([]);
          setActiveIdx(-1);
        } else {
          cancel();
        }
      }
    },
    [activeIdx, suggestions, pendingName, confirmTag, cancel]
  );

  if (!imageUrl || isVideo || isCarousel) {
    return null;
  }

  return (
    <div className="flex flex-col gap-[8px]">
      <div className="text-[14px]">
        Tag users (max 20) — click image to place tag
      </div>

      <div
        className="relative cursor-crosshair select-none rounded-[8px] overflow-hidden"
        onClick={handleImageClick}
      >
        <img
          src={imageUrl}
          className="w-full h-auto block pointer-events-none"
          alt="Post preview"
        />

        {/* Placed tags */}
        {tags.map((tag, i) => (
          <div
            key={i}
            className="absolute"
            style={{ left: `${tag.x * 100}%`, top: `${tag.y * 100}%`, transform: 'translate(-50%, -100%)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white/90 text-black text-[11px] px-[6px] py-[2px] rounded flex items-center gap-[4px] whitespace-nowrap shadow">
              @{tag.label}
              <button
                className="opacity-60 hover:opacity-100 text-[13px] font-bold leading-none ml-[2px]"
                onClick={() => removeTag(i)}
              >
                ×
              </button>
            </div>
            <div className="w-[2px] h-[6px] bg-white/80 mx-auto" />
          </div>
        ))}

        {/* Pending tag input + autocomplete */}
        {pendingPos && (
          <div
            className="absolute z-20"
            style={{
              left: `${pendingPos.x * 100}%`,
              top: `${pendingPos.y * 100}%`,
              transform: pendingPos.y < 0.2 ? 'translate(-50%, 8px)' : 'translate(-50%, calc(-100% - 6px))',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input row */}
            <div className="bg-newBgColorInner border border-newTableBorder rounded-[6px] px-[10px] py-[6px] shadow-xl flex items-center gap-[6px]">
              <input
                ref={inputRef}
                value={pendingName}
                onChange={(e) => { setPendingName(e.target.value); setActiveIdx(-1); }}
                onKeyDown={handleKeyDown}
                className="bg-transparent outline-none text-[12px] w-[140px] text-textColor placeholder-textColor"
                placeholder="@username"
              />
              {searching && (
                <span className="opacity-40 text-[10px]">…</span>
              )}
              <button
                className="opacity-60 hover:opacity-100 text-[12px]"
                onMouseDown={(e) => { e.preventDefault(); confirmTag(activeIdx >= 0 && suggestions[activeIdx] ? suggestions[activeIdx].username : pendingName); }}
              >
                ✓
              </button>
              <button
                className="opacity-60 hover:opacity-100 text-[12px]"
                onMouseDown={(e) => { e.preventDefault(); cancel(); }}
              >
                ✕
              </button>
            </div>

            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <div className="bg-newBgColorInner border border-newTableBorder rounded-[6px] mt-[2px] shadow-xl overflow-hidden max-h-[180px] overflow-y-auto">
                {suggestions.map((s, i) => (
                  <div
                    key={s.username}
                    className={`flex items-center gap-[8px] px-[10px] py-[6px] cursor-pointer text-[12px] ${i === activeIdx ? 'bg-newTableBorder' : 'hover:bg-newTableBorder/50'}`}
                    onMouseDown={(e) => { e.preventDefault(); confirmTag(s.username); }}
                    onMouseEnter={() => setActiveIdx(i)}
                  >
                    {s.profilePic ? (
                      <img src={s.profilePic} alt="" className="w-[24px] h-[24px] rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-[24px] h-[24px] rounded-full bg-newTableBorder shrink-0" />
                    )}
                    <div className="flex flex-col leading-tight min-w-0">
                      <span className="text-textColor font-medium truncate">@{s.username}</span>
                      {s.name && <span className="text-textColor/60 truncate">{s.name}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-[6px]">
          {tags.map((tag, i) => (
            <div
              key={i}
              className="flex items-center gap-[4px] bg-newBgColorInner border border-newTableBorder rounded-[4px] px-[8px] py-[3px] text-[12px]"
            >
              @{tag.label}
              <button
                className="opacity-60 hover:opacity-100 font-bold"
                onClick={() => removeTag(i)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
