import { AlertTriangle } from "lucide-react";
import type { PitfallNote, TravelSpot } from "../types/travel";

interface PitfallPanelProps {
  readonly notes: readonly PitfallNote[];
  readonly selectedSpot: TravelSpot;
}

/**
 * Renders pitfall notes with context-aware highlighting.
 *
 * @param props - Pitfall notes and currently selected attraction.
 * @returns Pitfall guide panel.
 */
export function PitfallPanel({ notes, selectedSpot }: PitfallPanelProps) {
  return (
    <article className="info-panel pitfall-panel">
      <div className="panel-heading">
        <AlertTriangle size={20} aria-hidden="true" />
        <div>
          <h2>雷点指北</h2>
          <p>当前选中：{selectedSpot.shortName}</p>
        </div>
      </div>

      <div className="pitfall-list">
        {notes.map((note) => {
          const isRelevant = note.appliesTo.includes(selectedSpot.cluster);
          return (
            <section className={isRelevant ? "pitfall-card relevant" : "pitfall-card"} key={note.id}>
              <div>
                <strong>{note.title}</strong>
                <span>{note.severity}</span>
              </div>
              <p>{note.content}</p>
            </section>
          );
        })}
      </div>
    </article>
  );
}
