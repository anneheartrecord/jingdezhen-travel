import { useMemo } from "react";
import {
  DndContext,
  PointerSensor,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Route, X } from "lucide-react";
import type { SpotId, TravelSpot } from "../types/travel";
import { buildCustomRoutePlan, formatDuration } from "../utils/planner";

interface CustomRouteBuilderProps {
  readonly selectedSpotIds: readonly SpotId[];
  readonly spots: readonly TravelSpot[];
  readonly onRouteChange: (spotIds: SpotId[]) => void;
}

interface SortableSpotRowProps {
  readonly spot: TravelSpot;
  readonly onRemove: (spotId: SpotId) => void;
}

/**
 * Renders a custom route builder with spot toggles and drag sorting.
 *
 * @param props - Available spots, selected route ids, and change handler.
 * @returns Custom route builder panel.
 */
export function CustomRouteBuilder({ selectedSpotIds, spots, onRouteChange }: CustomRouteBuilderProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const selectedSpots = useMemo(
    () => selectedSpotIds.map((spotId) => spots.find((spot) => spot.id === spotId)).filter(isTravelSpot),
    [selectedSpotIds, spots],
  );
  const unselectedSpots = spots.filter((spot) => !selectedSpotIds.includes(spot.id));
  const customPlan = useMemo(() => buildCustomRoutePlan(selectedSpotIds), [selectedSpotIds]);

  /**
   * Adds a spot to the custom route.
   *
   * @param spotId - Attraction id to append.
   */
  function handleAddSpot(spotId: SpotId): void {
    onRouteChange([...selectedSpotIds, spotId]);
  }

  /**
   * Removes a spot from the custom route.
   *
   * @param spotId - Attraction id to remove.
   */
  function handleRemoveSpot(spotId: SpotId): void {
    onRouteChange(selectedSpotIds.filter((selectedSpotId) => selectedSpotId !== spotId));
  }

  /**
   * Reorders custom route items after a drag operation.
   *
   * @param event - dnd-kit drag end event.
   */
  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = selectedSpotIds.indexOf(active.id as SpotId);
    const newIndex = selectedSpotIds.indexOf(over.id as SpotId);
    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    onRouteChange(arrayMove([...selectedSpotIds], oldIndex, newIndex));
  }

  return (
    <article className="info-panel custom-builder">
      <div className="panel-heading">
        <Route size={20} aria-hidden="true" />
        <div>
          <h2>自定义路线</h2>
          <p>已选 {selectedSpotIds.length} 个点 · 估算 {formatDuration(customPlan.totalMinutes)}</p>
        </div>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={[...selectedSpotIds]} strategy={verticalListSortingStrategy}>
          <div className="sortable-list">
            {selectedSpots.map((spot) => (
              <SortableSpotRow key={spot.id} spot={spot} onRemove={handleRemoveSpot} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="add-spot-grid">
        {unselectedSpots.map((spot) => (
          <button className="add-spot-button" key={spot.id} onClick={() => handleAddSpot(spot.id)} type="button">
            <Plus size={15} aria-hidden="true" />
            {spot.shortName}
          </button>
        ))}
      </div>
    </article>
  );
}

/**
 * Renders one sortable spot row.
 *
 * @param props - Spot row data and remove callback.
 * @returns Sortable route row.
 */
function SortableSpotRow({ spot, onRemove }: SortableSpotRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: spot.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="sortable-row" ref={setNodeRef} style={style}>
      <button className="drag-handle" type="button" {...attributes} {...listeners}>
        <GripVertical size={16} aria-hidden="true" />
      </button>
      <div>
        <strong>{spot.shortName}</strong>
        <span>{spot.areaLabel}</span>
      </div>
      <button className="remove-button" onClick={() => onRemove(spot.id)} type="button">
        <X size={15} aria-hidden="true" />
      </button>
    </div>
  );
}

/**
 * Narrows optional spot lookups to real travel spots.
 *
 * @param spot - Potential spot value.
 * @returns True when the value is a travel spot.
 */
function isTravelSpot(spot: TravelSpot | undefined): spot is TravelSpot {
  return spot !== undefined;
}
