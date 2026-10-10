# Class & Subclass Mechanics Architecture Guide

คู่มือมาตรฐานสำหรับการเพิ่มและจัดการระบบ Mechanics ของ Class และ Subclass ใน `src/assets/manual-formulas` เพื่อให้ระบบเป็น **Data-Driven (Single Source of Truth)** ปราศจากการ Hardcode ใน UI

> 📖 สำหรับเอกสารสถาปัตยกรรมฉบับเต็มและกติกา Level 1–20 ทั้งหมด ดูที่ [DATA_DRIVEN_ARCHITECTURE.md](file:///f:/Project/embers-spellcasting/src/assets/manual-formulas/DATA_DRIVEN_ARCHITECTURE.md)

---

## 1. ปรัชญาสำคัญ: ห้ามใส่แค่ Text Description ถ้ามีกติกาที่คำนวณได้จริง

ในอดีต ไฟล์ใน `subclasses/*.ts` มักจะใส่เพียง:
```typescript
// ❌ ไม่ถูกต้อง: โค้ดไม่สามารถนำไปทอยลูกเต๋าหรือคำนวณได้
operations: [
  {
    type: "apply_effect",
    name: "Holy Wrath",
    description: "While raging, the first target you hit takes extra 1d6 + half Barbarian level Radiant or Necrotic damage."
  }
]
```
สิ่งนี้ทำให้ระบบต้องไปเขียนโค้ดพิเศษ (Hardcode) ข้างนอกเพื่อดึงตัวเลข 

**สิ่งที่ถูกต้อง**: ต้องประกาศในรูปแบบ **Machine-Readable Structure** เพื่อให้ Engine กลาง (`weaponDamageRiders.ts`, `effectsTool.ts`, `BG3FlyoutBar.tsx`) ดึงไปทำงานได้อัตโนมัติ 100%!

---

## 2. การเพิ่ม Weapon Damage Rider (`weaponRider`)

ใช้สำหรับความเสียหายเสริมของการโจมตีด้วยอาวุธ (on-hit damage):

```typescript
export interface WeaponDamageRiderOperation {
  type: "weapon_damage_rider";
  id: string;
  name?: string;
  classId: string;
  subclassId?: string;
  minLevel?: number;
  requiresBuff?: string;                // เช่น "rage"
  requiresWeaponProperties?: string[]; // เช่น ["finesse", "ranged"]
  flat?: {
    byClassLevel: Array<{ minLevel: number; value: number }>;
  };
  dice?: string;                        // เช่น "1d6", "1d8"
  diceByClassLevel?: Array<{ minLevel: number; dice: string }>;
  bonus?: "halfClassLevel";             // เช่น Divine Fury
  damageType?: string;                  // เช่น "Radiant", "weapon"
  damageTypeChoices?: string[];         // เช่น ["Radiant", "Necrotic"]
  defaultChoice?: string;
  frequency?: "every_hit" | "first_hit_per_turn";
}
```

### ตัวอย่างที่ 1: Flat Bonus ตามเลเวล (เช่น Rage Damage)
```typescript
// src/assets/manual-formulas/classes/barbarian/index.ts
rage: {
  id: "embers:barbarian:rage",
  name: "Rage",
  kind: "class_feature",
  // ...
  weaponRider: {
    type: "weapon_damage_rider",
    id: "rage-damage",
    name: "Rage Damage Bonus",
    classId: "barbarian",
    requiresBuff: "rage",
    flat: {
      byClassLevel: [
        { minLevel: 1, value: 2 },
        { minLevel: 9, value: 3 },
        { minLevel: 16, value: 4 },
      ],
    },
    frequency: "every_hit",
  },
}
```

### ตัวอย่างที่ 2: เต๋า + ครึ่งเลเวล + มีชอยส์ธาตุ + First Hit Only (เช่น Zealot Divine Fury)
```typescript
// src/assets/manual-formulas/classes/barbarian/subclasses/pathOfTheZealot.ts
divineFury: {
  id: "embers:barbarian:zealot:divine-fury",
  name: "Divine Fury",
  kind: "class_feature",
  // ...
  weaponRider: {
    type: "weapon_damage_rider",
    id: "divine-fury",
    name: "Divine Fury",
    classId: "barbarian",
    subclassId: "pathOfTheZealot",
    requiresBuff: "rage",
    dice: "1d6",
    bonus: "halfClassLevel",
    damageTypeChoices: ["Radiant", "Necrotic"],
    defaultChoice: "Radiant",
    frequency: "first_hit_per_turn", // กติกา Option A: Extra Attack ไม่ติดซ้ำ
  },
}
```

### ตัวอย่างที่ 3: สเกลเต๋าตามเลเวล + จำกัดประเภทอาวุธ (เช่น Sneak Attack)
```typescript
// src/assets/manual-formulas/classes/rogue/index.ts
sneakAttack: {
  id: "embers:rogue:sneak-attack",
  name: "Sneak Attack",
  kind: "class_feature",
  // ...
  weaponRider: {
    type: "weapon_damage_rider",
    id: "sneak-attack",
    name: "Sneak Attack",
    classId: "rogue",
    requiresWeaponProperties: ["finesse", "ranged"],
    diceByClassLevel: [
      { minLevel: 1, dice: "1d6" },
      { minLevel: 3, dice: "2d6" },
      { minLevel: 5, dice: "3d6" },
      { minLevel: 7, dice: "4d6" },
      { minLevel: 9, dice: "5d6" },
      { minLevel: 11, dice: "6d6" },
      { minLevel: 13, dice: "7d6" },
      { minLevel: 15, dice: "8d6" },
      { minLevel: 17, dice: "9d6" },
      { minLevel: 19, dice: "10d6" },
    ],
    damageType: "weapon",
    frequency: "first_hit_per_turn",
  },
}
```

---

## 3. การเพิ่มตัวเลือก Interactive Flyout (`options`)

เมื่อฟีเจอร์มีตัวเลือกย่อยให้กดใช้งานบน Baldur's Gate 3 Flyout Bar (เช่น Metamagic, Ki, Maneuvers, Cunning Strike):

```typescript
export interface FeatureActionOption {
  id: string;
  name: string;
  cost: number;
  desc: string;
  actionType: "action" | "bonus" | "reaction" | "none";
}
```

### ตัวอย่าง: Metamagic Options ใน `classes/sorcerer/index.ts`
```typescript
export const METAMAGIC_OPTIONS: FeatureActionOption[] = [
  {
    id: "quickened",
    name: "Quickened Spell",
    cost: 2,
    desc: "Change casting time from 1 action to 1 bonus action",
    actionType: "none",
  },
  {
    id: "twinned",
    name: "Twinned Spell",
    cost: 1,
    desc: "Target second creature when upcasting single-target spell",
    actionType: "none",
  },
  // ...
];

export const SORCERER_CLASS_FORMULAS = {
  metamagic: {
    id: "embers:sorcerer:metamagic",
    name: "Metamagic",
    kind: "class_feature",
    classes: ["sorcerer"],
    activationType: "special",
    options: METAMAGIC_OPTIONS, // ผูก Options ตรงนี้!
    operations: [
      {
        type: "apply_effect",
        name: "Metamagic Shaping",
        description: "Expend Sorcery Points to alter spells.",
      },
    ],
  },
};
```

---

## 4. การจัดการ Resource Pools & Conversions

### 4.1 นิยาม Resource Pool
ระบุในฟิลด์ `resource`:
```typescript
resource: {
  name: "Sorcery Points",
  maxPerClassLevel: 1,
  resetType: "Long Rest", // หรือ "Short or Long Rest"
}
```

### 4.2 การแปลงทรัพยากร (เช่น Font of Magic)
```typescript
operations: [
  {
    type: "convert_spell_slot_to_resource",
    actionType: "none",
    resourcePerSlotLevel: 1,
  },
  {
    type: "create_spell_slot",
    actionType: "bonus",
    maxSlotLevel: 5,
    options: [
      { slotLevel: 1, pointCost: 2, minimumClassLevel: 2 },
      { slotLevel: 2, pointCost: 3, minimumClassLevel: 3 },
      { slotLevel: 3, pointCost: 5, minimumClassLevel: 5 },
      { slotLevel: 4, pointCost: 6, minimumClassLevel: 7 },
      { slotLevel: 5, pointCost: 7, minimumClassLevel: 9 },
    ],
  },
]
```

---

## 5. Checklist เมื่อเพิ่ม Subclass ใหม่

1. [ ] สร้างไฟล์ `src/assets/manual-formulas/classes/<class>/subclasses/<subclass>.ts`
2. [ ] หากมี On-hit Damage: ใส่ฟิลด์ `weaponRider` พร้อมระบุ `frequency` และ `requiresBuff` ชัดเจน
3. [ ] หากมีปุ่มตัวเลือกย่อยใน Flyout Bar: ใส่ฟิลด์ `options: FeatureActionOption[]`
4. [ ] หากมี Resource ประจำ Subclass: ใส่ฟิลด์ `resource: { name, resetType }`
5. [ ] Export และรวมเข้ากับ `index.ts` ของคลาสนั้นๆ
6. [ ] เพิ่ม Unit Test ใน `src/services/__tests__/weaponDamageRiders.test.ts`
7. [ ] รัน `npx vitest run` และ `npm run build` ตรวจสอบว่าผ่าน 100%
