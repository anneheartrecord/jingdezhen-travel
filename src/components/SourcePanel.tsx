import type { ResearchSource } from "../data/sources";

interface SourcePanelProps {
  readonly sources: readonly ResearchSource[];
}

/**
 * Renders compact source cards for research transparency.
 *
 * @param props - Research sources used by the project.
 * @returns Source list component.
 */
export function SourcePanel({ sources }: SourcePanelProps) {
  return (
    <div className="source-list">
      {sources.map((source) =>
        source.url.startsWith("research/") ? (
          <div className="source-card" key={source.url}>
            <span>{source.type}</span>
            <strong>{source.title}</strong>
            <small>{source.usedFor.join("、")}</small>
          </div>
        ) : (
          <a className="source-card" href={source.url} key={source.url} rel="noreferrer" target="_blank">
            <span>{source.type}</span>
            <strong>{source.title}</strong>
            <small>{source.usedFor.join("、")}</small>
          </a>
        ),
      )}
    </div>
  );
}
