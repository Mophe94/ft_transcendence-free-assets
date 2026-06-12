extends Node

@onready var transi = preload("res://Scene/Transition/blur_transition.tscn")

enum SEND_NAME {
	REQUEST_ITEM,
	ADD_ITEM,
	NEW_ENCOUNTER,
	TRY_CATCH,
	DELETE_MONSTER,
	DELETE_ITEM,
	USE_ITEM,
	TEAM_CHOICE,
	CHANGE_CURRENT_MONSTER,
	TRY_ATTACK
}

const SEND_TAB = {
	SEND_NAME.REQUEST_ITEM: "request_item",
	SEND_NAME.ADD_ITEM: "new_item",
	SEND_NAME.NEW_ENCOUNTER: "new_encounter",
	SEND_NAME.TRY_CATCH: "try_catch",
	SEND_NAME.DELETE_MONSTER: "delete_monster",
	SEND_NAME.DELETE_ITEM: "delete_item",
	SEND_NAME.TEAM_CHOICE: "team_choice",
	SEND_NAME.CHANGE_CURRENT_MONSTER: "change_current_monster",
	SEND_NAME.TRY_ATTACK: "try_attack"
}

const background_database: Dictionary = {
	"plains_dawn": preload("res://Assets/Capture/plains_dawn.png"),
	"plains_night": preload("res://Assets/Capture/plains_night.png"),
	"plains_day": preload("res://Assets/Capture/plains_day.png"),
	"beach_day": preload("res://Assets/Capture/beach_day.png")
}

const map: Dictionary = {
	"map_01": preload("res://Scene/World01/world_01.tscn")
}

const monster_database: Dictionary = {
	"manTree": preload("res://Scene/Monster/mantree.tscn"),
	"mushroom": preload("res://Scene/Monster/mushroom.tscn"),
	"burpy": preload("res://Scene/Monster/burpy.tscn"),
	"fishet": preload("res://Scene/Monster/fishet.tscn"),
	"fishet_2": preload("res://Scene/Monster/fishet_2.tscn"),
	"gigantomakia": preload("res://Scene/Monster/gigantomakia.tscn"),
	"leafs": preload("res://Scene/Monster/leafs.tscn"),
	"monkel": preload("res://Scene/Monster/monkel.tscn"),
	"papate": preload("res://Scene/Monster/papate.tscn"),
	"pigeonne": preload("res://Scene/Monster/pigeonne.tscn"),
	"sharky": preload("res://Scene/Monster/sharky.tscn"),
	"squirel": preload("res://Scene/Monster/squirel.tscn")
}

const monster_icon_database: Dictionary = {
	"mushroom": preload("res://Assets/Monster/Token/Mushroom.tres"),
	"manTree": preload("res://Assets/Monster/Token/man_three.tres"),
	"burpy": preload("res://Assets/Monster/Token/burpy.png"),
	"fishet": preload("res://Assets/Monster/Token/fishet.png"),
	"fishet_2": preload("res://Assets/Monster/Token/fishet_2.png"),
	"gigantomakia": preload("res://Assets/Monster/Token/gigantomakia.png"),
	"leafs": preload("res://Assets/Monster/Token/leafs.png"),
	"monkel": preload("res://Assets/Monster/Token/monkel.png"),
	"papate": preload("res://Assets/Monster/Token/papate.png"),
	"pigeonne": preload("res://Assets/Monster/Token/pigeonne.png"),
	"sharky": preload("res://Assets/Monster/Token/sharky.png"),
	"squirel": preload("res://Assets/Monster/Token/squirel.png")
}

const object_database: Dictionary = {
	"potion": preload("res://Assets/Inventory/Icon_04.png"),
	"golden ticket": preload("res://Assets/Inventory/Icon_03.png"),
	"rage": preload("res://Assets/Inventory/Icon_05.png"),
	"test": preload("res://Assets/Inventory/Icon_09.png"),
}
const hero_database: Dictionary = {
	"dino": preload("res://Scene/PlayerCharactere/dino_01.tscn") 
}

var player: Dictionary = {
	"id": 0,
	"name": "ff",
	"asset": "dino",
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
				"current": 0,
				"max": 0
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
				"current": 0,
				"max": 0
			},
		},
	],
	"team": ["fishet", "squirel", "", "", "", "sharky"],
	"inventory": [
		{
			"name": "",
			"current": 0
		},
		{
			"name": "",
			"current": 0
		},
		{
			"name": "",
			"current": 0
		},
		{
			"name": "",
			"current": 0
		},
	]
}

var enemy: Dictionary = {
	"id": 0,
	"name": "gg",
	"asset": "dino",
	"currentMonster": {
		"name": "",
		"index": 0,
		"life": {
			"current": 0,
			"max": 0
		},
		"status": []
	},
	"team": ["", "", "", "", "", ""],
}

const SPEED_TEXT = 0.03

var position_player = Vector2(0.0, 0.0)
var player_speed = 0.0
var timer = 0

var current_item = ""
var current_map = ""
var monster_encounter = ""
var text = []

var tile = ""
var background_capture = ""

var background_battle = ""
