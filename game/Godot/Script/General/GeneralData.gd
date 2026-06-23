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
	"burpy": "burpy",
	"fishet": "fishet",
	"gigantomakia": "gigantomakia",
	"leafs": "leafs",
	"monkel": "monkel",
	"papate": "papate",
	"pigeonne": "pigeonne",
	"pisciner": "pisciner",
	"sharky": "sharky",
	"squirel": "squirel"
}

const object_description: Dictionary = {
	"potion": "potion",
	"golden ticket": "golden ticket",
	"rage": "rage",
	"bomb": "bomb"
}

@export var available_skins: Array[SkinData] = [
		preload("res://Scene/PlayerCharacter/Skin/DinoBlue/dinoBlueRessource.tres"),
		preload("res://Scene/PlayerCharacter/Skin/DinoGreen/dinoGreenRessource.tres"),
		preload("res://Scene/PlayerCharacter/Skin/DinoRed/dinoRedRessource.tres"),
		
	]

func get_equipped_skin() -> SkinData:
	for skin in available_skins:
		if skin.skin_id == player["asset"]:
			return skin
	push_warning("Skin '%s' introuvable, fallback sur le premier skin disponible." % player["asset"])
	return available_skins[0] if available_skins.size() > 0 else null

func set_equipped_skin(skin_id: String) -> void:
	player["asset"] = skin_id

const player_charactere_scene = preload("res://Scene/PlayerCharacter/character.tscn") 

var player: Dictionary = {
	"id": 0,
	"name": "archimedee",
	"asset": "dinoBlue",
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
			"name": "gigantomakia",
			"slot": 0,
			"life": {
				"current": 100,
				"max": 200
			},
		},
		{
			"name": "burpy",
			"slot": 0,
			"life": {
				"current": 0,
				"max": 0
			},
		},
		{
			"name": "pisciner",
			"slot": 0,
			"life": {
				"current": 1,
				"max": 200
			},
		},
	],
	"team": ["pisciner", "leafs", "squirel", "burpy", "sharky", ""],
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
	"asset": "dino",
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
