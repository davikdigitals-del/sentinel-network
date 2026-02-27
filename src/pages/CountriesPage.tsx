import { useState } from "react";
import { Link } from "react-router-dom";
import { natoCountries } from "@/data/mockData";
import { Check } from "lucide-react";

const CountriesPage = () => {
  const [selected, setSelected] = useState<string | null>("GB");
  const [search, setSearch] = useState("");

  const filtered = natoCountries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-8">
      <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">Countries & Flags</h1>
      <p className="text-muted-foreground mb-6">
        Select your country to personalise alerts, directives, and NATO-related content.
      </p>

      <input
        type="text"
        placeholder="Search countries..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2.5 bg-card border border-border rounded-sm text-sm mb-6 outline-none focus:ring-2 focus:ring-ring"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map((country) => (
          <button
            key={country.code}
            onClick={() => setSelected(country.code)}
            className={`flex items-center gap-3 p-3 rounded-sm border transition-all text-left ${
              selected === country.code
                ? "border-alert bg-alert/5 ring-1 ring-alert"
                : "border-border bg-card hover:border-muted-foreground/30"
            }`}
          >
            <span className="text-3xl">{country.flag}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{country.name}</p>
              <p className="text-xs text-muted-foreground">{country.code}</p>
            </div>
            {selected === country.code && (
              <Check className="w-4 h-4 text-alert shrink-0" />
            )}
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-8 p-4 bg-card border border-border rounded-sm">
          <p className="text-sm">
            <span className="font-semibold">Selected:</span>{" "}
            {natoCountries.find((c) => c.code === selected)?.flag}{" "}
            {natoCountries.find((c) => c.code === selected)?.name}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Content will be filtered to show relevant alerts and directives for your country.
          </p>
        </div>
      )}
    </div>
  );
};

export default CountriesPage;
