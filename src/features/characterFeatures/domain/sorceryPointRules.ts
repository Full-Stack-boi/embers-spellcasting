export function getAvailableSorceryPoints(maxPoints: number, spentPoints: number): number {
    return Math.min(Math.max(0, maxPoints), Math.max(0, maxPoints - Math.max(0, spentPoints)));
}

export function convertSlotToSorceryPoints(spentPoints: number, slotLevel: number, maxPoints: number): number {
    const currentSpent = Math.max(0, Math.min(maxPoints, spentPoints));
    return Math.max(0, currentSpent - Math.max(0, slotLevel));
}

export function canConvertSlotToSorceryPoints(maxPoints: number, spentPoints: number, slotLevel: number): boolean {
    const currentPoints = getAvailableSorceryPoints(maxPoints, spentPoints);
    const roomToMaximum = Math.max(0, maxPoints - currentPoints);
    return slotLevel > 0 && roomToMaximum >= slotLevel;
}

export function restoreSorceryPointsForLongRest(maxPoints: number): number {
    return Math.max(0, maxPoints);
}
