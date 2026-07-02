extends Node

@onready var transi = preload("res://Scene/Transition/blur_transition.tscn")
@onready var team_setup_scene = preload("res://Scene/TeamSetup/team_setup.tscn")
@onready var combat_scene = preload("res://Scene/Combat/combat.tscn")

const background_database: Dictionary = {
	"plains_dawn": preload("res://Assets/Capture/plains_dawn.png"),
	"plains_night": preload("res://Assets/Capture/plains_night.png"),
	"plains_day": preload("res://Assets/Capture/plains_day.png"),
	"beach_day": preload("res://Assets/Capture/beach_day.png")
}

const map: Dictionary = {
	"map_01" = preload("res://Scene/World01/world_01.tscn")
}

const monster_database: Dictionary = {
	"burpy": preload("res://Scene/Monster/burpy.tscn"),
	"fishet": preload("res://Scene/Monster/fishet.tscn"),
	"gigantomakia": preload("res://Scene/Monster/gigantomakia.tscn"),
	"leafs": preload("res://Scene/Monster/leafs.tscn"),
	"monkel": preload("res://Scene/Monster/monkel.tscn"),
	"papate": preload("res://Scene/Monster/papate.tscn"),
	"pigeonne": preload("res://Scene/Monster/pigeonne.tscn"),
	"pisciner": preload("res://Scene/Monster/pisciner.tscn"),
	"sharky": preload("res://Scene/Monster/sharky.tscn"),
	"squirel": preload("res://Scene/Monster/squirel.tscn")
}

const monster_icon_database: Dictionary = {
	"burpy": preload("res://Assets/Monster/spritesheet/Burpy/sprite-1-1.png"),
	"fishet": preload("res://Assets/Monster/spritesheet/Fishet/sprite-1-1.png"),
	"gigantomakia": preload("res://Assets/Monster/spritesheet/Gigantomakia/sprite-1-1.png"),
	"leafs": preload("res://Assets/Monster/spritesheet/Leafs/sprite-1-1.png"),
	"monkel": preload("res://Assets/Monster/spritesheet/Monkel/sprite-1-1-copy-0.png"),
	"papate": preload("res://Assets/Monster/spritesheet/Papate/sprite-1-1-copy-1.png"),
	"pigeonne": preload("res://Assets/Monster/spritesheet/Pigeonne/sprite-1-1.png"),
	"pisciner": preload("res://Assets/Monster/spritesheet/Pisciner/pisciner_01.png"),
	"sharky": preload("res://Assets/Monster/spritesheet/Sharky/sprite-1-1 (1).png"),
	"squirel": preload("res://Assets/Monster/spritesheet/Squirel/sprite-1-1 (2).png")
}

const object_database: Dictionary = {
	"potion": preload("res://Assets/Inventory/Icon_04.png"),
	"golden ticket": preload("res://Assets/Inventory/Icon_03.png"),
	"rage": preload("res://Assets/Inventory/Icon_05.png"),
	"bomb": preload("res://Assets/Inventory/Icon_09.png"),
}

const monster_description: Dictionary = {
	"burpy": "Water 💧 | 🔵 Uncommon | HP: 100 | Slimy, gooey, and somehow absolutely adorable. Just don't hug it too tight.",
	"fishet": "Water 💧 | ⚪ Common | HP: 120 | Chubby, cute and cuddly… until the spikes come out. Don't let the big eyes fool you, it tanks hits better than your main defender.",
	"gigantomakia": "Earth 🪨 | 🟠 Rare | HP: 200 | A war-forged stone golem standing at attention for millennia. Nobody knows who gave the orders. It's still waiting.",
	"leafs": "Plant 🌿 | ⚪ Common | HP: 80 | A wild ball of leaves and branches that charges in headfirst without thinking. Super aggressive, super fragile.",
	"monkel": "Neutral ☯️| 🔵 Uncommon | HP: 130 | A curious little monkey that pokes at everything it shouldn't. Balanced in a fight, but its natural instinct is to take the hit and keep smiling.",
	"papate": "Earth 🪨 | 🔵 Uncommon | HP: 180 | A snobbish bulldog in a shell. Too classy to fight, too tough to die.",
	"pigeonne": "Flying 🪶 | 🟠 Rare | HP: 120 | Don't let the bird fool you. Fast, hits hard, and definitely saw you coming.",
	"pisciner": "Neutral ☯️ | ✨ Not Foundable | HP: 50 | Rumored to haunt the halls of 42, forever stuck in his pool exam. Useless in battle, useless in life.",		
	"sharky": "Water 💧 | 🟠 Rare | HP: 150 | A shark wreathed in crackling energy, cutting through battle like a ghost through water. By the time you see it, it's already too late.",
	"squirel": "Neutral ☯️ | ⚪ Common | HP: 100 | Half squirrel, half hedgehog, all chaos. Cute enough to distract you, spiky enough to regret it"
}

const object_description: Dictionary = {
	"potion": "tous est dans le nom j'",
	"golden ticket": "golden ticket",
	"rage": "rage",
	"bomb": "bomb"
}

@export var available_skins: Array[SkinData] = [
		preload("res://Scene/PlayerCharacter/Skin/DinoBlue/dinoBlueRessource.tres"),
		preload("res://Scene/PlayerCharacter/Skin/DinoYellow/dinoYellowRessource.tres"),
		preload("res://Scene/PlayerCharacter/Skin/DinoGreen/dinoGreenRessource.tres"),
		preload("res://Scene/PlayerCharacter/Skin/DinoRed/dinoRedRessource.tres"),
		preload("res://Scene/PlayerCharacter/Skin/Ghost/ghostRessource.tres"),
		preload("res://Scene/PlayerCharacter/Skin/Ghost02/ghost02Ressource.tres"),
		preload("res://Scene/PlayerCharacter/Skin/Ghost03/ghost03Ressource.tres"),
		preload("res://Scene/PlayerCharacter/Skin/Satyr01/satyr01Ressource.tres"),
		preload("res://Scene/PlayerCharacter/Skin/Satyr02/satyr02Ressource.tres"),
		preload("res://Scene/PlayerCharacter/Skin/Satyr03/satyr03Ressource.tres"),
	]

func get_equipped_skin() -> SkinData:
	for skin in available_skins:
		if skin.skin_id == player["asset"]:
			return skin
	push_warning("Skin introuvable, fallback sur le premier skin disponible." )
	return available_skins[0] if available_skins.size() > 0 else null

func set_equipped_skin(skin_id: String) -> void:
	player["asset"] = skin_id

func get_equipped_skin_enemy() -> SkinData:
	for skin in available_skins:
		if skin.skin_id == enemy["asset"]:
			return skin
	print("Skin introuvable, fallback sur le premier skin disponible.")
	return available_skins[0] if available_skins.size() > 0 else null

func set_equipped_skin_enemy(skin_id: String) -> void:
	enemy["asset"] = skin_id

const player_charactere_scene = preload("res://Scene/PlayerCharacter/character.tscn") 
const player_enemy_scene = preload("res://Scene/PlayerCharacter/enemy_character.tscn") 

var player: Dictionary = {
	"id": 0,
	"name": "archimedee",
	"asset": "satyr03",
	"currentMonster": {
		"name": "",
		"slot": -1,
		"life": {
			"current": 0,
			"max": 0
		},
		"skill": [
			{
				"name": "",
				"current": 0,
				"max": 0
			},
			{
				"name": "",
				"current": 0,
				"max": 0
			},
			{
				"name": "",
				"current": 0,
				"max": 0
			},
			{
				"name": "",
				"current": 0,
				"max": 0
			},
		],
		"status": []
	},
	"battle_team": [
		{
			"name": "",
			"slot": 0,
			"life": {
				"current": 100,
				"max": 200
			},
		},
		{
			"name": "",
			"slot": 0,
			"life": {
				"current": 0,
				"max": 0
			},
		},
		{
			"name": "",
			"slot": 0,
			"life": {
				"current": 1,
				"max": 200
			},
		},
	],
	"team": ["fishet", "leafs", "squirel", "burpy", "sharky", ""],
	"inventory": [
		{
			"name": "rage",
			"scene": "",
			"current": 0
		},
		{
			"name": "golden ticket",
			"scene": "map",
			"current": 1
		},
		{
			"name": "bomb",
			"scene": "",
			"current": 0
		},
		{
			"name": "bomb",
			"scene": "combat",
			"current": 1
		},
	]
}

var enemy: Dictionary = {
	"id": 0,
	"name": "gg",
	"asset": "satyr03",
	"currentMonster": {
		"name": "burpy",
		"life": {
			"current": 0,
			"max": 0
		},
		"status": []
	},
	"team": ["burpy", "burpy", "pisciner", "pisciner", "sharky", "sharky"],
}

const SPEED_TEXT = 0.03
const WAIT_TEXT = 0.3

var position_player = Vector2(0.0, 0.0)
var player_speed = 0.0
var timer = 1781786220

var current_item = ""
var current_map = "map_01"
var monster_encounter = "burpy"
var text = []

var tile = ""
var background_capture = "plains_day"
var background_battle = "plains_night"
