import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, BookOpen, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

const entries = [
  { letter: "A", items: ["Ammunition Storage", "Air Filtration", "Antibiotics (Emergency Use)", "Avalanche Safety"] },
  { letter: "B", items: ["Bug-Out Bag", "Blackout Preparedness", "Burns Treatment", "Battery Storage"] },
  { letter: "C", items: ["CPR Techniques", "Communication Systems", "Chemical Threats", "Cold Weather Survival", "Canning & Preservation"] },
  { letter: "D", items: ["Decontamination", "Disaster Psychology", "Drinking Water Sources"] },
  { letter: "E", items: ["Evacuation Planning", "Emergency Broadcasts", "EMP Protection", "Edible Plants"] },
  { letter: "F", items: ["First Aid Kits", "Fire Starting Methods", "Food Rationing", "Flood Safety"] },
  { letter: "G", items: ["Generator Operation", "Gas Mask Usage", "GPS Alternatives"] },
  { letter: "H", items: ["Ham Radio", "Hypothermia", "Home Fortification", "Hygiene in Crisis"] },
  { letter: "N", items: ["NATO Civil Preparedness", "Nuclear Fallout", "Navigation Without GPS", "Nutrition in Emergencies"] },
  { letter: "S", items: ["Shelter Building", "Signal Fires", "Solar Power", "Sanitation Systems", "Self-Defence"] },
  { letter: "W", items: ["Water Purification", "Wound Care", "Weather Monitoring", "Wilderness Navigation"] },
];

export default function EncyclopaediaPage() {
  const [search, setSearch] = useState("");

  const filteredEntries = entries.map(e => ({
    ...e,
    items: e.items.filter(i => i.toLowerCase().includes(search.toLowerCase())),
  })).filter(e => e.items.length > 0);

  return (
    <div className="container py-8">
      <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">Encyclopaedia of Survival Knowledge</h1>
      <p className="text-muted-foreground mb-6">A comprehensive A–Z reference of survival topics, techniques, and guidance.</p>

      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search encyclopaedia..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Letter index */}
      <div className="flex flex-wrap gap-1 mb-8">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(l => {
          const hasEntries = entries.some(e => e.letter === l);
          return (
            <a
              key={l}
              href={`#letter-${l}`}
              className={`w-8 h-8 flex items-center justify-center rounded-sm text-sm font-bold transition-colors ${hasEntries ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-muted text-muted-foreground"}`}
            >
              {l}
            </a>
          );
        })}
      </div>

      {/* Entries */}
      <div className="space-y-8">
        {filteredEntries.map(entry => (
          <div key={entry.letter} id={`letter-${entry.letter}`}>
            <h2 className="font-display font-bold text-4xl text-muted-foreground/30 border-b border-border pb-2 mb-4">{entry.letter}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {entry.items.map(item => (
                <Link
                  key={item}
                  to={`/encyclopaedia/${item.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="flex items-center gap-2 p-3 rounded-sm hover:bg-muted transition-colors group"
                >
                  <BookOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium group-hover:text-alert transition-colors">{item}</span>
                  <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
