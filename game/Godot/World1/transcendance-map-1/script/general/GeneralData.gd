extends Node

@export var background_database: Dictionary = {
	"fields_day": preload("res://assets/background_battle_appaers/fields_day.png"),
	"fields_night": preload("res://assets/background_battle_appaers/fields_night.png"),
	"twilight_fields": preload("res://assets/background_battle_appaers/twilight_fields.png"),
	"plains_dawn": preload("res://assets/background_battle_appaers/plains_dawn.png"),
	"plains_night": preload("res://assets/background_battle_appaers/plains_night.png"),
	"plains_day": preload("res://assets/background_battle_appaers/plains_day.png"),
	"sky_day": preload("res://assets/background_battle_appaers/sky_day.png"),
	"sky_night": preload("res://assets/background_battle_appaers/sky_night.png")
}

@export var map_01: Dictionary = {
	"floor_0" = preload("res://scene/map_01/floor_0.tscn"),
	"floor_1" = preload("res://scene/map_01/floor_01.tscn"),
	"floor_2" = preload("res://scene/map_01/floor_02.tscn"),
	"floor_3" = preload("res://scene/map_01/floor_03.tscn")
}

@export var monster_database: Dictionary = {
	"manTree": preload("res://scene/monster/mantree.tscn"),
	"mushroom": preload("res://scene/monster/mushroom.tscn")
}

@export var hero_database: Dictionary = {
	"violet": preload("res://scene/hero/violet.tscn"),
	"white": preload("res://scene/hero/white.tscn")
}

var player: Dictionary = {
	"id": 0,
	"name": "Gerard",
	"asset": "white",
	"currentMonster": {
		"name": "mushroom",
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
	"team": ["manTree", "mushroom", "manTree", "manTree", "manTree", "manTree"],
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
	"name": "Samantha",
	"asset": "violet",
	"currentMonster": {
		"name": "mushroom",
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

var tile = ""
var object = ""
var current_map = "floor_0"
var monster_encounter = "manTree"
var background = "plains_night"
