import { BedDouble } from "lucide-react";
import type { LodgingArea } from "../types/travel";

interface LodgingGuideProps {
  readonly lodgingAreas: readonly LodgingArea[];
}

/**
 * Renders lodging area recommendations.
 *
 * @param props - Lodging areas to display.
 * @returns Lodging guide panel.
 */
export function LodgingGuide({ lodgingAreas }: LodgingGuideProps) {
  return (
    <article className="info-panel lodging-guide">
      <div className="panel-heading">
        <BedDouble size={20} aria-hidden="true" />
        <div>
          <h2>住哪里少受罪</h2>
          <p>住宿跟路线绑定，选错区域会把每天都变成通勤。</p>
        </div>
      </div>

      <div className="lodging-list">
        {lodgingAreas.map((area) => (
          <section className="lodging-card" key={area.id}>
            <h3>{area.name}</h3>
            <p>{area.roast}</p>
            <div>
              <strong>适合：</strong>
              <span>{area.bestFor.join("、")}</span>
            </div>
            <div>
              <strong>代价：</strong>
              <span>{area.tradeoffs.join("、")}</span>
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
