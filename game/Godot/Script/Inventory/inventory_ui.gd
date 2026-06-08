extends Control

@onready var slots = $NinePatchRect/GridContainerObject.get_children()
@onready var monster_slots = $NinePatchRect/GridContainerMonster.get_children()

var is_open = false

func _ready():
	update_slots()
	close()

func update_slots():
	var inventory = GeneralData.player["inventory"]
	for i in range(min(inventory.size(), slots.size())):
		print(inventory[i]["name"])
		slots[i].update(inventory[i])
	var team = GeneralData.player["team"]
	for i in range(min(team.size(), monster_slots.size())):
		monster_slots[i].update_monster(team[i])

func _process(_delta):
	if Input.is_action_just_pressed("menu"):
		if is_open: close()
		else: open()

func open():
	visible = true
	is_open = true

func close():
	visible = false
	is_open = false
