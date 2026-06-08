extends Node

@onready var transi = preload("res://Scene/Transition/blur_transition.tscn")

const background_database: Dictionary = {
	"plains_dawn": preload("res://Assets/Capture/plains_dawn.png"),
	"plains_night": preload("res://Assets/Capture/plains_night.png"),
	"plains_day": preload("res://Assets/Capture/plains_day.png"),
	"beach_day": preload("res://Assets/Capture/beach_day.png")
}

const map_01: Dictionary = {
	"map_01" = preload("res://Scene/World01/world_01.tscn")
}

const monster_database: Dictionary = {
	"manTree": preload("res://Scene/Monster/mantree.tscn"),
	"mushroom": preload("res://Scene/Monster/mushroom.tscn")
}

const monster_icon_database: Dictionary = {
	"mushroom": preload("res://Assets/Monster/Mushroom.tres"),
	"manTree": preload("res://Assets/Inventory/monster.png"),
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
	"name": "Gerard",
	"asset": "dino",
	"currentMonster": {
		"name": "",
		"index": -1,
		"life": {
			"current": 0,
			"max": 0
		},
		"skill": [
			{
				"name": "claw",
				"current": 5,
				"max": 10
			},
			{
				"name": "deflagration",
				"current": 1,
				"max": 1
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
			"life": {
				"current": 20,
				"max": 60
			},
		},
		{
			"name": "",
			"life": {
				"current": 90,
				"max": 100
			},
		},
		{
			"name": "",
			"life": {
				"current": 0,
				"max": 60
			},
		},
	],
	"team": ["manTree", "", "", "", "", ""],
	"inventory": [
		{
			"name": "potion",
			"current": 1
		},
		{
			"name": "golden ticket",
			"current": 4
		},
		{
			"name": "rage",
			"current": 6
		},
		{
			"name": "",
			"current": 0
		},
	]
}

var enemy: Dictionary = {
	"id": 0,
	"name": "Samantha",
	"asset": "dino",
	"currentMonster": {
		"name": "",
		"index": 0,
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
			"life": {
				"current": 0,
				"max": 0
			},
		},
		{
			"name": "",
			"life": {
				"current": 0,
				"max": 0
			},
		},
		{
			"name": "",
			"life": {
				"current": 0,
				"max": 0
			},
		},
	],
	"team": ["", "manTree", "manTree", "mushroom", "mushroom", ""],
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

const SPEED_TEXT = 0.03
var position_player = Vector2(0.0, 0.0)
var tile = ""
var object = ""
var current_map = "map_01"
var monster_encounter = "mushroom"
var background_capture = "beach_day"
var background_battle = "plains_night"
