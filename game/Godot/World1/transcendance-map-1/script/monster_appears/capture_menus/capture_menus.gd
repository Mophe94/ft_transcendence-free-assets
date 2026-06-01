extends Panel

signal try_catch
signal monster_back

@onready var playerAsset = GeneralData.hero_database[GeneralData.player["asset"]]
@onready var inventory = GeneralData.player["inventory"]

@onready var button = [$GridContainer/Slot1/button, $GridContainer/Slot2/button, $GridContainer/Slot3/button, $GridContainer/Slot4/button]
@onready var back_button = $Slot5/Button

var SPEED_TEXT = GeneralData.SPEED_TEXT

func transi_close():
	var transi_scene = GeneralData.transi.instantiate()
	add_child(transi_scene)
	await transi_scene.get_node("CanvasLayer/ColorRect").close()
	transi_scene.queue_free()

func text_show(new_text):
	$Text.show()
	$Text.visible_characters = 0
	$Text.text = new_text
	for i in range($Text.text.length() + 1):
		$Text.visible_characters = i
		await get_tree().create_timer(SPEED_TEXT).timeout

func hide_button(str):
	for i in range(4):
		button[i].hide()
	if str == "all":
		back_button.hide()

func set_menus_action():
	button[0].text = "CAPTURE"
	button[0].action = "capture"
	button[1].text = "ITEMS"
	button[1].action = "items"
	button[2].text = "FLEE"
	button[2].action = "flee"
	button[3].hide()
	back_button.hide()
	
func set_menus_back():
	back_button.hide()
	$Banner/CenterContainer/Action.text = "ACTION"
	button[0].show()
	button[0].text = "CAPTURE"
	button[0].action = "capture"
	button[1].show()
	button[1].text = "ITEMS"
	button[1].action = "items"
	button[2].show()
	button[2].text = "FLEE"
	button[2].action = "flee"
	button[3].hide()

func set_menus_flee_choice(object):
	hide_button("all")
	if object == "yes":
		await text_show("you flee")
		var tween = create_tween()
		tween.set_trans(Tween.TRANS_SINE)
		tween.set_ease(Tween.EASE_OUT)
		tween.tween_property(self, "modulate:a", 0.0, 1.0)
		await tween.finished
		hide()
		await transi_close()
		get_tree().change_scene_to_file("res://scene/team_setup/team_setup.tscn")
	else:
		set_menus_back()
	back_button.show()
	
func set_menus_flee():
	hide_button("all")
	await text_show("Are you sure you want to run away ?")
	button[2].text = "YES"
	button[2].action = "flee choice"
	button[2].object = "yes"
	button[2].show()
	button[3].text = "NO"
	button[3].action = "flee choice"
	button[3].object = "no"
	button[3].show()
	back_button.show()
	
	
func set_menus_capture():
	$Banner/CenterContainer/Action.text = "CAPTURE"
	hide_button("all")
	if GeneralData.player["team"].has(""):
		await text_show("Do you want to try to catch " + GeneralData.monster_encounter)
		button[2].text = "YES"
		button[2].action = "catch"
		button[2].object = "yes"
		button[2].show()
		button[3].text = "NO"
		button[3].action = "catch"
		button[3].object = "no"
		button[3].show()
		back_button.show()
	else:
		await text_show("Your team is already full !")
		back_button.show()
	
func set_menus_catch(object):
	if object == "yes":
		hide_button("all")
		emit_signal("try_catch")
	else:
		set_menus_back()
	
func set_menus_catch_result(object):
	hide_button("all")
	if object == "yes":
		for i in range(6):
			if GeneralData.player["team"][i] == "":
				GeneralData.player["team"][i] = GeneralData.monster_encounter
				break
		set_menus_back()
		emit_signal("monster_back")
	else:
		set_menus_back()
		emit_signal("monster_back")
	
func set_menus_use(object):
	hide_button("all")
	await text_show("You use " + object)
	for i in range(4):
		if inventory[i]["name"] == object:
			inventory[i]["current"] -= 1
			if inventory[i]["current"] == 0:
				inventory[i]["name"] = ""
	back_button.show()

func set_menus_items():
	$Banner/CenterContainer/Action.text = "ITEMS"
	for i in range(4):
		button[i].hide()
		if inventory[i]["name"] != "":
			button[i].show()
			button[i].text = inventory[i]["name"] + " x " + str(inventory[i]["current"])
			button[i].action = "use"
			button[i].object = inventory[i]["name"]
		else:
			button[i].object = ""
	back_button.show()

func _action():
	set_menus_action()
	await get_tree().create_timer(1.0).timeout

func _flee_choice(object):
	set_menus_flee_choice(object)
	await get_tree().create_timer(1.0).timeout

func _flee():
	$Banner/CenterContainer/Action.text = "FLEE"
	set_menus_flee()
	await get_tree().create_timer(1.0).timeout
	
func _capture():
	set_menus_capture()
	await get_tree().create_timer(1.0).timeout

func _catch(object):
	set_menus_catch(object)
	await get_tree().create_timer(1.0).timeout

func _catch_result(object):
	set_menus_catch_result(object)
	await get_tree().create_timer(1.0).timeout

func _use(object):
	set_menus_use(object)
	await get_tree().create_timer(1.0).timeout

func _items():
	set_menus_items()
	await get_tree().create_timer(1.0).timeout
	
func _back():
	set_menus_back()
	await get_tree().create_timer(1.0).timeout

func _on_button_action(action, object):
	$Text.text = ""
	$Text.hide()
	match action:
		"flee":
			_flee()
		"capture":
			_capture()
		"catch":
			_catch(object)
		"catch_result":
			_catch_result(object)
		"items":
			_items()
		"back":
			_back()
		"use":
			_use(object)
		"flee choice":
			_flee_choice(object)

func _ready() -> void:
	set_menus_action()
	var player_scene = playerAsset.instantiate()
	$GridContainer/Player.add_child(player_scene)
	for i in range(button.size()):
		button[i].action_pressed.connect(_on_button_action)
	back_button.action_pressed.connect(_on_button_action)
	


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(_delta: float) -> void:
	pass
