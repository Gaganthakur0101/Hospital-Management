"use client";

import React, { useEffect, useRef, useState } from "react";

interface StateOption {
    name: string;
    code: string;
}

interface Props {
    state: string;          // current state name value
    city: string;           // current city value
    onStateChange: (stateName: string, stateCode: string) => void;
    onCityChange: (city: string) => void;
    inputClass?: string;    // optional class override to match form styling
    disabled?: boolean;
}

const defaultInputClass =
    "w-full rounded-xl border border-cyan-100/30 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/15 disabled:opacity-50 disabled:cursor-not-allowed";

export default function StateCitySelector({
    state,
    city,
    onStateChange,
    onCityChange,
    inputClass,
    disabled = false,
}: Props) {
    const cls = inputClass ?? defaultInputClass;

    const [states, setStates] = useState<StateOption[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [loadingStates, setLoadingStates] = useState(true);
    const [loadingCities, setLoadingCities] = useState(false);

    // city search filter
    const [citySearch, setCitySearch] = useState(city);
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const cityRef = useRef<HTMLDivElement>(null);

    // Keep the stateCode that matches the current state name (needed for city fetch)
    const [selectedStateCode, setSelectedStateCode] = useState("");

    // ── Load states once ─────────────────────────────────────────────────────
    useEffect(() => {
        const fetchStates = async () => {
            try {
                const res = await fetch("/api/locations/states");
                if (!res.ok) throw new Error();
                const data: StateOption[] = await res.json();
                setStates(data);
            } catch {
                // silent — falls back gracefully (empty dropdown)
            } finally {
                setLoadingStates(false);
            }
        };
        fetchStates();
    }, []);

    // ── When state name is pre-filled (edit mode), find its code ─────────────
    useEffect(() => {
        if (!state || states.length === 0) return;
        const match = states.find(
            (s) => s.name.toLowerCase() === state.toLowerCase()
        );
        if (match && match.code !== selectedStateCode) {
            setSelectedStateCode(match.code);
        }
    }, [state, states, selectedStateCode]);

    // ── Load cities whenever selectedStateCode changes ────────────────────────
    useEffect(() => {
        if (!selectedStateCode) {
            setCities([]);
            return;
        }
        const fetchCities = async () => {
            setLoadingCities(true);
            try {
                const res = await fetch(`/api/locations/cities/${selectedStateCode}`);
                if (!res.ok) throw new Error();
                const data: string[] = await res.json();
                setCities(data);
            } catch {
                setCities([]);
            } finally {
                setLoadingCities(false);
            }
        };
        fetchCities();
    }, [selectedStateCode]);

    // ── Sync citySearch with external city prop ───────────────────────────────
    useEffect(() => {
        setCitySearch(city);
    }, [city]);

    // ── Close city dropdown on outside click ──────────────────────────────────
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
                setShowCityDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCode = e.target.value;
        const selectedState = states.find((s) => s.code === selectedCode);
        if (!selectedState) return;
        setSelectedStateCode(selectedCode);
        setCities([]);
        setCitySearch("");
        onCityChange("");
        onStateChange(selectedState.name, selectedCode);
    };

    const handleCitySelect = (c: string) => {
        setCitySearch(c);
        onCityChange(c);
        setShowCityDropdown(false);
    };

    const filteredCities = cities.filter((c) =>
        c.toLowerCase().includes(citySearch.toLowerCase())
    );

    const stateValue = states.find((s) => s.name === state)?.code ?? "";

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* ── State Dropdown ── */}
            <div>
                <label htmlFor="state-select" className="block text-sm font-medium text-slate-200 mb-1">
                    State *
                </label>
                <select
                    id="state-select"
                    value={stateValue}
                    onChange={handleStateChange}
                    disabled={disabled || loadingStates}
                    className={cls}
                >
                    <option value="" disabled>
                        {loadingStates ? "Loading states…" : "Select state"}
                    </option>
                    {states.map((s) => (
                        <option key={s.code} value={s.code}>
                            {s.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* ── City Searchable Dropdown ── */}
            <div ref={cityRef} className="relative">
                <label htmlFor="city-input" className="block text-sm font-medium text-slate-200 mb-1">
                    City *
                </label>
                <input
                    id="city-input"
                    type="text"
                    placeholder={
                        !state
                            ? "Select a state first"
                            : loadingCities
                                ? "Loading cities…"
                                : "Search city…"
                    }
                    value={citySearch}
                    onChange={(e) => {
                        setCitySearch(e.target.value);
                        onCityChange(e.target.value);
                        setShowCityDropdown(true);
                    }}
                    onFocus={() => {
                        if (cities.length > 0) setShowCityDropdown(true);
                    }}
                    disabled={disabled || !selectedStateCode || loadingCities}
                    className={cls}
                    autoComplete="off"
                />

                {/* Dropdown list */}
                {showCityDropdown && filteredCities.length > 0 && (
                    <ul className="absolute z-50 mt-1 w-full max-h-52 overflow-y-auto rounded-xl border border-cyan-100/20 bg-slate-900 shadow-2xl">
                        {filteredCities.map((c) => (
                            <li
                                key={c}
                                onMouseDown={() => handleCitySelect(c)}
                                className={`cursor-pointer px-4 py-2.5 text-sm transition hover:bg-cyan-400/15 hover:text-cyan-100 ${c === city ? "bg-cyan-400/10 text-cyan-200 font-medium" : "text-slate-200"
                                    }`}
                            >
                                {c}
                            </li>
                        ))}
                    </ul>
                )}

                {/* No results hint */}
                {showCityDropdown && selectedStateCode && !loadingCities && filteredCities.length === 0 && citySearch.length > 0 && (
                    <div className="absolute z-50 mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-400 shadow-lg">
                        No cities found for &quot;{citySearch}&quot;
                    </div>
                )}
            </div>
        </div>
    );
}
