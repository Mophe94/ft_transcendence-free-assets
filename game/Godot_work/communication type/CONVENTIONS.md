# 🎮 Game Naming Conventions

## 📁 File Tree Structure

### `assets_generaux/`
General assets folder — a "catch-all" for assets that caught our eye but are not yet used in the project.

### `communication/`
Handles all communication logic, such as server interactions.

### `godot/`
Contains all active assets, scenes, and scripts used in the project.
It is divided into 4 subfolders:

| Folder | Description |
|--------|-------------|
| `scripts/` | All GDScript files |
| `assets/` | All game assets |
| `scenes/` | All game scenes |
| `shaders/` | Shaders used for scene transitions |

---

## 📐 Folder & File Structure Rules

### Assets
Each asset is stored in a folder that **mirrors the name of the scene folder** where it is used.

### Scenes
Scenes are organized into folders that **represent their logical function** and separate the different features of the game.

### ⚠️ Important Rule
Every folder in `scenes/` **must have a matching folder** in both `assets/` and `scripts/`.

This ensures that finding the scripts or assets for any given scene is as simple as navigating to the folder with the same name.

> Exceptions may apply in specific cases.

---

## ✏️ Naming Conventions

### Folders
- **PascalCase** — each word starts with a capital letter, no separators
- Example: `DossierName`, `BattleMenu`, `WorldMap`

### Files
- **snake_case** — all lowercase, words separated by underscores
- Numbers are **zero-padded** after an underscore
- Example: `dino_01.tscn`, `player_idle_02.png`, `battle_music_01.ogg`

### Variables
- **camelCase** — starts with a lowercase letter, each new word starts with a capital letter
- Example: `playerHealth`, `encounterChance`, `currentMapName`