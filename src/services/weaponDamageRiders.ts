import type { DDBParsedCharacter, DDBWeaponAttack } from "../types/ddb";
import type { WeaponDamageRiderOperation } from "../types/manualFormula";
import { ALL_MANUAL_ACTION_FORMULAS } from "../assets/manual-formulas/index";

export interface ActiveWeaponRider {
  id: string;
  name: string;
  dice?: string;
  bonus?: number;
  flatBonus?: number;
  damageType: string;
  frequency: "every_hit" | "first_hit_per_turn";
}

export interface AvailableRiderChoice {
  riderId: string;
  riderName: string;
  choices: string[];
  currentChoice: string;
  bonusDice: string;
  flatBonus: number;
}

export interface ResolvedWeaponRiders {
  flatBonus: number;
  flatBonusReasons: string[];
  activeDiceRiders: ActiveWeaponRider[];
  availableRiderChoice?: AvailableRiderChoice;
}

export interface ResolveWeaponRidersParams {
  character: DDBParsedCharacter | null;
  weapon: DDBWeaponAttack;
  activeBuffs?: Set<string> | string[];
  riderChoice?: string;
  usedRidersThisTurn?: Set<string>;
}

export function getAllWeaponRiders(): WeaponDamageRiderOperation[] {
  const riders: WeaponDamageRiderOperation[] = [];
  for (const formula of Object.values(ALL_MANUAL_ACTION_FORMULAS)) {
    if (formula.weaponRider) {
      riders.push(formula.weaponRider);
    }
  }
  return riders;
}

function normalizeBuffSet(activeBuffs?: Set<string> | string[]): Set<string> {
  const set = new Set<string>();
  if (!activeBuffs) return set;
  for (const b of activeBuffs) {
    set.add(b.toLowerCase().trim());
  }
  return set;
}

export function resolveWeaponRiders({
  character,
  weapon,
  activeBuffs,
  riderChoice,
  usedRidersThisTurn = new Set(),
}: ResolveWeaponRidersParams): ResolvedWeaponRiders {
  const result: ResolvedWeaponRiders = {
    flatBonus: 0,
    flatBonusReasons: [],
    activeDiceRiders: [],
  };

  if (!character) return result;

  const buffSet = normalizeBuffSet(activeBuffs);
  const allRiders = getAllWeaponRiders();

  for (const rider of allRiders) {
    const charClass = character.classes?.find(
      (c) => c.name.toLowerCase() === rider.classId.toLowerCase(),
    );
    if (!charClass) continue;

    if (rider.minLevel && charClass.level < rider.minLevel) continue;

    if (rider.subclassId) {
      const subIdLower = rider.subclassId.toLowerCase();
      const hasSubclassMatch =
        (charClass.subclass &&
          charClass.subclass.toLowerCase().replace(/[^a-z0-9]/g, "").includes(
            subIdLower.replace(/[^a-z0-9]/g, ""),
          )) ||
        character.actions?.some(
          (a) =>
            a.name.toLowerCase().includes(rider.name?.toLowerCase() || subIdLower) ||
            a.id.toLowerCase().includes(rider.id.toLowerCase()),
        ) ||
        character.feats?.some(
          (f) =>
            f.name.toLowerCase().includes(rider.name?.toLowerCase() || subIdLower),
        );

      if (!hasSubclassMatch) continue;
    }

    if (rider.requiresBuff) {
      const required = rider.requiresBuff.toLowerCase();
      if (!buffSet.has(required)) continue;
    }

    if (rider.requiresWeaponProperties && rider.requiresWeaponProperties.length > 0) {
      const weaponProps = (weapon.properties || []).map((p) => p.toLowerCase());
      const isRangedWeapon = Boolean(
        weapon.type === "ranged" ||
        weaponProps.some((wp) => wp.includes("ranged"))
      );
      const matches = rider.requiresWeaponProperties.some((prop) => {
        const p = prop.toLowerCase();
        if (p === "ranged") return isRangedWeapon;
        return weaponProps.some((wp) => wp.includes(p));
      });
      if (!matches) continue;
    }

    if (rider.flat?.byClassLevel) {
      const tier = [...rider.flat.byClassLevel]
        .filter((t) => t.minLevel <= charClass.level)
        .sort((a, b) => b.minLevel - a.minLevel)[0];

      if (tier && tier.value > 0) {
        result.flatBonus += tier.value;
        result.flatBonusReasons.push(
          `${rider.name || rider.classId} (+${tier.value})`,
        );
      }
    }

    let chosenDamageType = rider.damageType || weapon.damageType || "weapon";
    if (rider.damageTypeChoices && rider.damageTypeChoices.length > 0) {
      const matchedChoice = rider.damageTypeChoices.find(
        (c) => c.toLowerCase() === riderChoice?.toLowerCase(),
      );
      chosenDamageType = matchedChoice || rider.defaultChoice || rider.damageTypeChoices[0];

      let previewDice = rider.dice || "";
      if (rider.diceByClassLevel) {
        const tier = [...rider.diceByClassLevel]
          .filter((t) => t.minLevel <= charClass.level)
          .sort((a, b) => b.minLevel - a.minLevel)[0];
        if (tier) previewDice = tier.dice;
      }
      const previewBonus =
        rider.bonus === "halfClassLevel"
          ? Math.max(1, Math.floor(charClass.level / 2))
          : 0;

      result.availableRiderChoice = {
        riderId: rider.id,
        riderName: rider.name || "Damage Rider",
        choices: rider.damageTypeChoices,
        currentChoice: chosenDamageType,
        bonusDice: previewDice,
        flatBonus: previewBonus,
      };
    }

    if (
      rider.frequency === "first_hit_per_turn" &&
      usedRidersThisTurn.has(rider.id)
    ) {
      continue;
    }

    let dice = rider.dice;
    if (rider.diceByClassLevel) {
      const tier = [...rider.diceByClassLevel]
        .filter((t) => t.minLevel <= charClass.level)
        .sort((a, b) => b.minLevel - a.minLevel)[0];
      if (tier) dice = tier.dice;
    }

    let extraBonus = 0;
    if (rider.bonus === "halfClassLevel") {
      extraBonus = Math.max(1, Math.floor(charClass.level / 2));
    }

    if (dice) {
      result.activeDiceRiders.push({
        id: rider.id,
        name: rider.name || rider.id,
        dice,
        bonus: extraBonus > 0 ? extraBonus : undefined,
        damageType:
          chosenDamageType === "weapon" ? weapon.damageType : chosenDamageType,
        frequency: rider.frequency || "every_hit",
      });
    }
  }

  return result;
}
