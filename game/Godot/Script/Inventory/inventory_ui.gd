extends Control

@onready var slots = $NinePatchRect/GridContainerObject.get_children()
@onready var monster_slots = $NinePatchRect/GridContainerMonster.get_children()
@onready var confirmation_dialog = $ConfirmationDialog
@onready var buttonQuit = $ButtonQuit          
@onready var buttonYes = $ConfirmationDialog/Panel/ButtonYes  
@onready var buttonNo = $ConfirmationDialog/Panel/ButtonNo
var is_open = false

func _ready():
	update_slots()
	buttonQuit.pressed.connect(_on_quit_pressed)
	buttonYes.pressed.connect(_on_yes_pressed)
	buttonNo.pressed.connect(_on_no_pressed)
	close()

func _on_quit_pressed():
	confirmation_dialog.visible = true
	if is_open: close()

func _on_yes_pressed():
	get_tree().quit( )
	
func _on_no_pressed():
	confirmation_dialog.visible = false
	
func update_slots():
	var inventory = GeneralData.player["inventory"]
	for i in range(min(inventory.size(), slots.size())):
		print(inventory[i]["name"])
		slots[i].update(inventory[i])
	var team = GeneralData.player["team"]
	for i in range(min(team.size(), monster_slots.size())):
		monster_slots[i].update_monster(team[i]["name"])

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
