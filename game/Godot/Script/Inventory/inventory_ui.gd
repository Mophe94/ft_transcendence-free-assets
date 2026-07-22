extends Control
@onready var slots = $NinePatchRect/GridContainerObject.get_children()
@onready var monster_slots = $NinePatchRect/GridContainerMonster.get_children()
@onready var confirmation_dialog = $ConfirmationDialog
@onready var buttonQuit = $NinePatchRect/ButtonQuit
@onready var buttonYes = $ConfirmationDialog/Panel/ButtonYes
@onready var buttonNo = $ConfirmationDialog/Panel/ButtonNo
var is_open = false

var pending_action: String = ""   # NOUVEAU : "quit" / "delete_monster" / "delete_object"
var pending_index: int = -1       # NOUVEAU

func _ready():
	update_slots()
	buttonQuit.pressed.connect(_on_quit_pressed)
	buttonYes.pressed.connect(_on_yes_pressed)
	buttonNo.pressed.connect(_on_no_pressed)
	close()

func _on_quit_pressed():
	pending_action = "quit"                        # MODIFIÉ
	confirmation_dialog.visible = true

func _on_monster_delete_requested(index: int):     # NOUVEAU
	pending_action = "delete_monster"
	pending_index = index
	confirmation_dialog.visible = true

func _on_object_delete_requested(index: int):      # NOUVEAU
	pending_action = "delete_object"
	pending_index = index
	confirmation_dialog.visible = true

func _on_yes_pressed():                            # MODIFIÉ
	match pending_action:
		"quit":
			get_tree().quit()
		"delete_monster":
			GeneralData.player["team"][pending_index] = ""
			update_slots()
		"delete_object":
			GeneralData.player["inventory"][pending_index] = {"name": "", "scene": "", "current": 0}
			update_slots()
	pending_action = ""
	pending_index = -1
	confirmation_dialog.visible = false

func _on_no_pressed():                             # MODIFIÉ
	pending_action = ""
	pending_index = -1
	confirmation_dialog.visible = false

func update_slots():                                # MODIFIÉ
	var inventory = GeneralData.player["inventory"]
	for i in range(min(inventory.size(), slots.size())):
		slots[i].update(inventory[i], i)
		if not slots[i].delete_requested.is_connected(_on_object_delete_requested):
			slots[i].delete_requested.connect(_on_object_delete_requested)
	var team = GeneralData.player["team"]
	for i in range(min(team.size(), monster_slots.size())):
		monster_slots[i].update_monster(team[i], i)
		if not monster_slots[i].delete_requested.is_connected(_on_monster_delete_requested):
			monster_slots[i].delete_requested.connect(_on_monster_delete_requested)

func _process(_delta):
	if Input.is_action_just_pressed("menu"):
		if is_open: close()
		else: open()

func open():
	visible = true
	is_open = true
	var screen_size = get_viewport_rect().size
	var base_size = Vector2(1920, 1080)
	var ratio = min(screen_size.x / base_size.x, screen_size.y / base_size.y)
	$NinePatchRect.scale = Vector2(ratio, ratio)
	$NinePatchRect.global_position = (screen_size - Vector2(500, 500) * ratio) / 2

func close():
	visible = false
	is_open = false
