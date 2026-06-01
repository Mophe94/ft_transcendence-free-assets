extends Node

@onready var transi = preload("res://scene/transition/blur_transition.tscn")

const background_database: Dictionary = {
	"plains_dawn": preload("res://assets/background_battle_appaers/plains_dawn.png"),
	"plains_night": preload("res://assets/background_battle_appaers/plains_night.png"),
	"plains_day": preload("res://assets/background_battle_appaers/plains_day.png"),
	"beach_day": preload("res://assets/background_battle_appaers/beach_day.png")
}

#const map_01: Dictionary = {
#	"floor_0" = preload("res://scene/map_01/floor_0.tscn"),
#	"floor_1" = preload("res://scene/map_01/floor_01.tscn"),
#	"floor_2" = preload("res://scene/map_01/floor_02.tscn"),
#	"floor_3" = preload("res://scene/map_01/floor_03.tscn")
#}

const monster_database: Dictionary = {
	"manTree": preload("res://scene/monster/mantree.tscn"),
	"mushroom": preload("res://scene/monster/mushroom.tscn")
}

const hero_database: Dictionary = {
	"violet": preload("res://scene/hero/violet.tscn"),
	"white": preload("res://scene/hero/white.tscn")
}

var player: Dictionary = {
	"id": 0,
	"name": "Gerard",
	"asset": "white",
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
			"name": "popo",
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
	"asset": "violet",
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
var position_player = Vector2(13.0, -19.0)
var tile = ""
var object = ""
var current_map = "floor_0"
var monster_encounter = "mushroom"
var background_capture = "beach_day"
var background_battle = "plains_night"
