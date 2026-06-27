import { World } from "../../core/World";
import { Position } from "../../shared/types/Position";

type Node = {
    pos: Position;
    g: number;
    f: number;
    parent: Node | null;
};

export class PathfindingSystem {

    static nextStep(from: Position, to: Position, world: World): Position | null {
        if (from.x === to.x && from.y === to.y) return null;

        const key = (p: Position) => `${p.x},${p.y}`;
        const h = (p: Position) => Math.abs(p.x - to.x) + Math.abs(p.y - to.y);

        const open = new Map<string, Node>();
        const closed = new Set<string>();

        // Define first vertex
        open.set(key(from), { pos: from, g: 0, f: h(from), parent: null });

        while (open.size > 0) {
            let current!: Node;
            for (const node of open.values()) {
                if (!current || node.f < current.f) current = node;
            }

            if (current.pos.x === to.x && current.pos.y === to.y) {
                while (current.parent?.parent) current = current.parent;
                return current.pos;
            }

            open.delete(key(current.pos));
            closed.add(key(current.pos));

            const neighbors: Position[] = [
                { x: current.pos.x + 1, y: current.pos.y },
                { x: current.pos.x - 1, y: current.pos.y },
                { x: current.pos.x, y: current.pos.y + 1 },
                { x: current.pos.x, y: current.pos.y - 1 },
            ];

            for (const neighbor of neighbors) {
                const nKey = key(neighbor);
                if (closed.has(nKey)) continue;

                const isDestination = neighbor.x === to.x && neighbor.y === to.y;
                if (!isDestination && !world.isValidPosition(neighbor)) continue;

                const g = current.g + 1;
                const existing = open.get(nKey);
                if (!existing || g < existing.g) {
                    open.set(nKey, { pos: neighbor, g, f: g + h(neighbor), parent: current });
                }
            }
        }

        return null;
    }

    static closestAdjacentValid(from: Position, target: Position, world: World): Position | null {
        const candidates: Position[] = [
            { x: target.x + 1, y: target.y },
            { x: target.x - 1, y: target.y },
            { x: target.x, y: target.y + 1 },
            { x: target.x, y: target.y - 1 },
        ].filter(p => world.isValidPosition(p));

        if (candidates.length === 0) return null;

        let best = candidates[0]!;
        for (const p of candidates) {
            const dist = Math.abs(p.x - from.x) + Math.abs(p.y - from.y);
            const bestDist = Math.abs(best.x - from.x) + Math.abs(best.y - from.y);
            if (dist < bestDist) best = p;
        }
        return best;
    }
}