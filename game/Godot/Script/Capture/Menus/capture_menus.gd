extends Panel

@onready var playerAsset = GeneralData.player["asset"]
@onready var inventory = GeneralData.player["inventory"]

@onready var button = [$Button, $Button2, $Button3, $Button4]
@onready var back_button = $Button5

var SPEED_TEXT = GeneralData.SPEED_TEXT
var AWAIT_TEXT = GeneralData.WAIT_TEXT

signal try_catch
signal catch_fail
signal catch_ok

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
	await get_tree().create_timer(AWAIT_TEXT).timeout

func hide_button(my_str):
	for i in range(button.size()):
		button[i].hide()
	if my_str == "all":
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
#		tween.set_trans(Tween.TRANS_SINE)
#		tween.set_ease(Tween.EASE_OUT)
		tween.tween_property(self, "modulate:a", 0.0, 1.0)
		await tween.finished
		hide()
		await transi_close()
		get_tree().change_scene_to_packed(GeneralData.map[GeneralData.current_map])
	else:
		_back()
	
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
	hide_button("all")
	var team = GeneralData.player["team"]
	for i in range(team.size()):
		if team[i] == "":
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
			return
	await text_show("Your team is already full !")
	back_button.show()
	
func set_menus_catch(object):
	if object == "yes":
		hide_button("all")
		Send.send_mesage(Send.SEND_TAB[Send.SEND_NAME.TRY_CATCH])
		emit_signal("try_catch")
		await text_show("You try to catch " + GeneralData.monster_encounter)
		var success = await Received.catch_result
		if success:
			emit_signal("catch_ok")
			await text_show("You success to capture " + GeneralData.monster_encounter + " !")
			await transi_close()
			get_tree().change_scene_to_packed(GeneralData.map[GeneralData.current_map])
		else:
			emit_signal("catch_fail")
			await text_show("You fail to capture " + GeneralData.monster_encounter)
			_back()
	else:
		_back()

func set_menus_use(object):
	hide_button("all")
	await text_show("You use " + object)
	Send.send_mesage(Send.SEND_TAB[Send.SEND_NAME.USE_ITEM], object)
	emit_signal("try_catch")
	await Received.catch_result
	emit_signal("catch_ok")
	await text_show("You success to capture " + GeneralData.monster_encounter + " !")
	await transi_close()
	get_tree().change_scene_to_packed(GeneralData.map[GeneralData.current_map])

func set_menus_items():
	hide_button("all")
	var j = 0
	for i in range(4):
		if inventory[i]["name"] != "" && inventory[i]["scene"] == "map":
			button[j].show()
			button[j].text = inventory[i]["name"] + " x " + str(inventory[i]["current"])
			button[j].action = "use"
			button[j].object = inventory[i]["name"]
			j += 1
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
	set_menus_flee()
	await get_tree().create_timer(1.0).timeout
	
func _capture():
	set_menus_capture()
	await get_tree().create_timer(1.0).timeout

func _catch(object):
	set_menus_catch(object)
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
	for i in range(button.size()):
		button[i].action_pressed.connect(_on_button_action)
	back_button.action_pressed.connect(_on_button_action)
	


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(_delta: float) -> void:
	pass
