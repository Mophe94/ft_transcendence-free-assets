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

signal stop_inventory
signal run_inventory


#############################
func transi_close():
	var transi_scene = GeneralData.transi.instantiate()
	add_child(transi_scene)
	await transi_scene.get_node("CanvasLayer/ColorRect").close()
	transi_scene.queue_free()

func _delete_monster(monster):
	var send_func = func():
		Send.send_mesage(Send.SEND_TAB[Send.SEND_NAME.DELETE_MONSTER], monster)
	var success = await GeneralProcess.wait_signal(send_func, Received.update_team)

	if ! success:
		await transi_close()
		get_tree().change_scene_to_packed(GeneralData.wait)
		
func _delete_item(object):
	var send_func = func():
		Send.send_mesage(Send.SEND_TAB[Send.SEND_NAME.DELETE_ITEM], object)
	var success = await GeneralProcess.wait_signal(send_func, Received.update_inventory)

	if ! success:
		await transi_close()
		get_tree().change_scene_to_packed(GeneralData.wait)
#############################


func _ready():
	for node in get_tree().get_nodes_in_group("trigger_zone"):
		if node.has_signal("update_slots"):
			node.update_slots.connect(update_slots)
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

func _on_yes_pressed():   
	confirmation_dialog.visible = false                         # MODIFIÉ
	match pending_action:
		"quit":
			get_tree().quit()
		"delete_monster":
			emit_signal("stop_inventory")
			await _delete_monster(GeneralData.player["team"][pending_index])
			emit_signal("run_inventory")
		"delete_object":
			emit_signal("stop_inventory")
			await _delete_item(GeneralData.player["inventory"][pending_index]["name"])
			emit_signal("run_inventory")
	update_slots()
	pending_action = ""
	pending_index = -1

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
