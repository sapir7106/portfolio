# Gallery Editing Guide · מדריך עריכת הגלריה
### logos-art-for-fun.html

---

## 🇮🇱 עברית

### איך הגלריה עובדת

הגלריה בנויה מ**סקשנים** (sections). כל סקשן הוא קבוצה של 1–6 תמונות שנערמות זו על גבי זו בזמן הגלילה (האפקט של Sania). כשסקשן נגמר, הסקשן הבא דוחף את הערימה למעלה ומתחיל ערימה חדשה — ככה אף פעם אין ערימה אינסופית.

**סקשן עם תמונה אחת** = רגע רגוע, בלי ערימה.

בכל סקשן, **שתי התמונות הראשונות יושבות זו לצד זו למעלה** (כמו אצל Sania), ומהתמונה השלישית מתחילה הערימה.

### 📁 שמות הקבצים — פורמט חדש

הפורמט: **`מספר-שם.סיומת`**

```
01-butterfly.jpg
02-collage.png
03-logotype.png
```

- **המספר בהתחלה** קובע את הקישור בקוד (`n:1` → `01-...`)
- **השם** עוזר לך לזהות את הקובץ בקלות
- **הסיומת** (jpg/png/gif) מזוהה אוטומטית — לא צריך לכתוב אותה בקוד

**חשוב:** המיקום על העמוד נקבע לפי **הסדר ברשימת `SECTIONS`** בקוד — לא לפי המספר בשם הקובץ. המספר בשם הוא רק כדי לקשר קובץ למספר בקוד.

### ✏️ איפה עורכים

הכל במערך `SECTIONS` בתוך תגית ה-`<script>`:

```javascript
const SECTIONS = [

  // סקשן 1 — 5 תמונות
  [
    { n:1, size:'medium', col:'left'   },
    { n:2, size:'small',  col:'right'  },
    { n:3, size:'small',  col:'right'  },
    { n:4, size:'mini',   col:'left'   },
    { n:5, size:'medium', col:'center' },
  ],

];
```

### 🔧 פעולות נפוצות

| מה אני רוצה | איך |
|---|---|
| **לשנות סדר בתוך סקשן** | מזיזים שורה למעלה/למטה בתוך ה-`[ ]` |
| **להעביר תמונה לסקשן אחר** | גוזרים שורה `{ n:X, ... }` ומדביקים בסקשן אחר |
| **סקשן חדש** | מוסיפים מערך `[ ... ]` חדש |
| **למחוק סקשן** | מוחקים את המערך שלו |
| **להסתיר תמונה** | מוחקים את השורה |
| **גודל** | משנים `size` |
| **מיקום אופקי** | משנים `col` |
| **תמונה חדשה** | מעלים `16-name.jpg` + מוסיפים `{ n:16, size:'medium', col:'left' }` |

### 📐 גדלים (size)

6 גדלים. שולטים ברוחב בלבד — **לעולם לא חותכים** את התמונה:

| ערך | רוחב | מתי |
|---|---|---|
| `'xl'` | מלא | רגע דרמטי, תמונה בודדת |
| `'large'` | ~66% | תמונות חזקות |
| `'medium'` | ~55% | ברירת מחדל |
| `'small'` | ~44% | משניות |
| `'mini'` | ~33% | לוגואים |
| `'tiny'` | ~22% | אקסנטים |

**טיפ:** אם שתי התמונות הראשונות בסקשן צריכות לשבת זו לצד זו — השתמשי ב-`medium` + `small` (יחד = רוחב מלא).

### 📍 מיקום אופקי (col)

`'left'` · `'center'` · `'right'`

### 🖼️ העלאת תמונות

1. תיקייה: `portfolio images/logos-art-for-fun/`
2. פורמט שם: `01-butterfly.jpg`, `02-collage.png` (מספר עם אפס מוביל)
3. סיומת: `.jpg` / `.png` / `.gif` — מזוהה אוטומטית
4. **חשוב:** אם יש 15 תמונות, אל תוסיפי שורות ל-16+. הקוד טוען רק מה שב-`SECTIONS`, אז העמוד מהיר.

---

## 🇬🇧 English

### How it works

The gallery is a list of **sections**. Each section is a group of 1–6 images that stack on scroll (the Sania effect). When a section ends, the next pushes the stack up — so no endless pile.

**A section with one image** = a calm moment, no stacking.

In each section, the **first two images sit side-by-side at the top** (like Sania), and stacking begins from the third image.

### 📁 Filename format

Format: **`number-name.ext`**

```
01-butterfly.jpg
02-collage.png
03-logotype.png
```

- **The leading number** links to the code (`n:1` → `01-...`)
- **The name** helps you identify the file
- **The extension** (jpg/png/gif) is auto-detected — not written in code

**Important:** Position on the page comes from the **order in `SECTIONS`** — not the filename number. The number just links a file to its code entry.

### ✏️ Where to edit

Everything in the `SECTIONS` array inside `<script>`:

```javascript
const SECTIONS = [
  // Section 1 — 5 images
  [
    { n:1, size:'medium', col:'left'   },
    { n:2, size:'small',  col:'right'  },
    ...
  ],
];
```

### 🔧 Common actions

| I want to | How |
|---|---|
| **Reorder within a section** | Move a row up/down in the `[ ]` |
| **Move to another section** | Cut `{ n:X, ... }`, paste elsewhere |
| **New section** | Add a new `[ ... ]` array |
| **Delete section** | Delete its array |
| **Hide image** | Delete its row |
| **Resize** | Change `size` |
| **Horizontal position** | Change `col` |
| **New image** | Upload `16-name.jpg` + add `{ n:16, size:'medium', col:'left' }` |

### 📐 Sizes

Six sizes, width only — **never cropped**:

| Value | Width | Use |
|---|---|---|
| `'xl'` | full | dramatic solo |
| `'large'` | ~66% | strong pieces |
| `'medium'` | ~55% | default |
| `'small'` | ~44% | secondary |
| `'mini'` | ~33% | logos |
| `'tiny'` | ~22% | accents |

**Tip:** For two images side-by-side at a section's top, use `medium` + `small` (together = full width).

### 📍 Horizontal (col)

`'left'` · `'center'` · `'right'`

### 🖼️ Uploading

1. Folder: `portfolio images/logos-art-for-fun/`
2. Name format: `01-butterfly.jpg`, `02-collage.png` (leading zero)
3. Extension: `.jpg` / `.png` / `.gif` — auto-detected
4. **Important:** With 15 images, don't add rows for 16+. The code only loads what's in `SECTIONS`, keeping it fast.

---

## 📱 Responsive behavior · התנהגות רספונסיבית

זה מבוסס על מחקר של ה-CSS האמיתי של Sania — לא ניחוש.

**חשוב:** אפקט ה-stacking נשמר בכל המכשירים. הוא לא נכבה במובייל.

**Desktop (מעל 767px):** גריד 9 עמודות, קומפוזיציה מלאה עם ה-offsets שיוצרים את הפיזור.

**Tablet קטן / מובייל (עד 767px):** בדיוק כמו Sania —
- כל section שומר על מבנה ה-grid שלו, מפושט ל-2 עמודות
- **כל התמונות מקבלות `top:0`** אבל נשארות `position:sticky`
- התוצאה: כולן נתקעות באותו קו עליון, וכל תמונה מכסה את הקודמת בגלילה — הערמה נשמרת

**טלפון קטן (עד 479px):** עמודה אחת, כל תמונה ברוחב מלא, עדיין נערמות.

הכל אוטומטי — לא צריך לגעת בכלום.

---

Based on research of Sania's actual CSS — not guesswork.

**Important:** The stacking effect is preserved on all devices. It is NOT disabled on mobile.

**Desktop (>767px):** 9-column grid, full composition with the offsets that create the scatter.

**Small tablet / mobile (≤767px):** Exactly like Sania —
- Each section keeps its grid structure, simplified to 2 columns
- **Every image gets `top:0`** but stays `position:sticky`
- Result: they all pin at the same top line, and each image covers the previous on scroll — the stack survives

**Small phone (≤479px):** Single column, each image full-width, still stacking.

All automatic — nothing to touch.

---

## 🗺️ Current layout · הלייאאוט הנוכחי

```
Section 1 · 5 images   [1 medium-left] [2 small-right] · then 3,4,5 stack
Section 2 · 4 images   [6 medium-left] [7 small-right] · then 8,9 stack
Section 3 · 1 image    [10 xl-center — big calm moment]
Section 4 · 3 images   [11 medium-left] [12 small-right] · then 13 stacks
Section 5 · 2 images   [14 medium-left] [15 small-right]
```

Mirrors Sania's opening composition (5-4-1-3-2).
מחקה את הקומפוזיציה של Sania (5-4-1-3-2).

---

## 🔤 Filename → code map · מפת שמות

Fill this in as you name your files · מלאי כשאת נותנת שמות:

```
01-________.___  →  n:1
02-________.___  →  n:2
03-________.___  →  n:3
04-________.___  →  n:4
05-________.___  →  n:5
06-________.___  →  n:6
07-________.___  →  n:7
08-________.___  →  n:8
09-________.___  →  n:9
10-________.___  →  n:10
11-________.___  →  n:11
12-________.___  →  n:12
13-________.___  →  n:13
14-________.___  →  n:14
15-________.___  →  n:15
```
