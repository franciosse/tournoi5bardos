export interface ScheduledMatch {
  field: number;
  startTime: Date;
  team1Id: number;
  team2Id: number;
  refTeamId: number | null;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateSchedule(
  teamIds: number[],
  matchDurationMin = 7,
  transitionMin = 2,
  tournamentDate?: Date
): ScheduledMatch[] {
  const slotDuration = matchDurationMin + transitionMin; // minutes per time slot

  const base = tournamentDate ?? new Date();
  const startTime = new Date(base);
  startTime.setHours(10, 0, 0, 0);
  const endTime = new Date(base);
  endTime.setHours(12, 30, 0, 0);

  // Generate all round-robin matchups
  const matchups: [number, number][] = [];
  for (let i = 0; i < teamIds.length; i++) {
    for (let j = i + 1; j < teamIds.length; j++) {
      matchups.push([teamIds[i], teamIds[j]]);
    }
  }
  const shuffled = shuffleArray(matchups);

  const schedule: ScheduledMatch[] = [];
  const refCounts: Record<number, number> = {};
  teamIds.forEach((id) => (refCounts[id] = 0));

  let matchIndex = 0;
  let slotIndex = 0;

  while (matchIndex < shuffled.length) {
    const slotTime = new Date(
      startTime.getTime() + slotIndex * slotDuration * 60000
    );
    if (slotTime >= endTime) break;

    // Fill both fields without repeating a team in the same slot
    const usedTeams = new Set<number>();
    const slotMatches: { match: [number, number]; field: number }[] = [];

    for (let field = 1; field <= 2; field++) {
      for (let k = matchIndex; k < shuffled.length; k++) {
        const [t1, t2] = shuffled[k];
        if (!usedTeams.has(t1) && !usedTeams.has(t2)) {
          // Swap to matchIndex position
          [shuffled[matchIndex], shuffled[k]] = [shuffled[k], shuffled[matchIndex]];
          slotMatches.push({ match: [t1, t2], field });
          usedTeams.add(t1);
          usedTeams.add(t2);
          matchIndex++;
          break;
        }
      }
    }

    if (slotMatches.length === 0) break;

    // Assign referees: teams not playing this slot, sorted by least referee duty
    const available = teamIds
      .filter((id) => !usedTeams.has(id))
      .sort((a, b) => refCounts[a] - refCounts[b]);

    slotMatches.forEach(({ match: [t1, t2], field }, i) => {
      const refTeamId = available[i] ?? null;
      if (refTeamId !== null) refCounts[refTeamId]++;
      schedule.push({
        field,
        startTime: new Date(slotTime),
        team1Id: t1,
        team2Id: t2,
        refTeamId,
      });
    });

    slotIndex++;
  }

  return schedule;
}
