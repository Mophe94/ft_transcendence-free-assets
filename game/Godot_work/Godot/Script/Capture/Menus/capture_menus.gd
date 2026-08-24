extends Panel

@onready var playerAsset = GeneralData.player["asset"]
@onready var inventory = GeneralData.player["inventory"]

@onready var button = [$Button, $Button2, $Button3, $Button4]
@onready var back_button = $Button5

var SPEED_TEXT = GeneralData.SPEED_TEXT
var AWAIT_TEXT = GeneralData.WAIT_TEXT

var stop_event = false

signal try_catch
signal catch_fail
signal catch_ok
signal monster_flee

#############################
func transi_close():
	var transi_scene = GeneralData.transi.instantiate()
	add_child(transi_scene)
	await transi_scene.get_node("CanvasLayer/ColorRect").close()

func _stop_event():
	stop_event = true

func _result_catch():
	var send_func = func():
		Send.send_message(Send.SEND_TAB[Send.SEND_NAME.TRY_CATCH])
	var success = await GeneralProcess.wait_signal_return(send_func, Received.catch_result)

	if success >= 0:
		return success
	elif stop_event == false:
		await transi_close()
		get_tree().change_scene_to_packed(GeneralData.wait)

func _result_item(object):
	var send_func = func():
		Send.send_message(Send.SEND_TAB[Send.SEND_NAME.USE_ITEM], object)
	var success = await GeneralProcess.wait_signal_return(send_func, Received.catch_result)

	if success >= 0:
		return success
	elif stop_event == false:
		await transi_close()
		get_tree().change_scene_to_packed(GeneralData.wait)
#############################

func text_show(new_text):
	$Text.show()
	$Text.visible_characters = 0
	$Text.text = new_text
	for i in range($Text.text.length() + 1):
		$Text.visible_characters = i
		await get_tree().create_timer(SPEED_TEXT).timeout
	await get_tree().create_timer(AWAIT_TEXT).timeout

func hide_button():
	for i in range(button.size()):
		button[i].hide()
		back_button.hide()

func set_menus_action():
	$Text.text = ""
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
	hide_button()
	if object == "yes":
		await text_show("You are fleeing")
		var tween = create_tween()
		tween.tween_property(self, "modulate:a", 0.0, 1.0)
		await tween.finished
		if stop_event == false:
			await transi_close()
			get_tree().change_scene_to_file(GeneralData.map[GeneralData.current_map])
	else:
		_back()
	
func set_menus_flee():
	hide_button()
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
	hide_button()
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
	await text_show("Your team is already full!")
	back_button.show()
	
func set_menus_catch(object):
	hide_button()
	if object == "yes":
		emit_signal("try_catch")
		await text_show("You try to catch " + GeneralData.monster_encounter)
		var success = await _result_catch()
		
		# Fonction work
		if success >= 0:
			# Catch success
			if success == 0:
				emit_signal("catch_ok")
				await text_show("You success to capture " + GeneralData.monster_encounter + "!")
				if stop_event == false:
					await transi_close()
					get_tree().change_scene_to_file(GeneralData.map[GeneralData.current_map])
			# Cacth fail
			elif success == 1:
				emit_signal("catch_fail")
				await text_show("You failed to capture " + GeneralData.monster_encounter)
				_back()
			# Catch fail + monster flee
			else:
				await text_show("You failed to capture " + GeneralData.monster_encounter)
				emit_signal("monster_flee")
				await text_show(GeneralData.monster_encounter + " fled")
				if stop_event == false:
					await transi_close()
					get_tree().change_scene_to_file(GeneralData.map[GeneralData.current_map])
				
		elif stop_event == false:
			await transi_close()
			get_tree().change_scene_to_packed(GeneralData.wait)
	else:
		_back()

func set_menus_use(object):
	hide_button()
	await text_show("You use " + object)
	var team = GeneralData.player["team"]
	for i in range(team.size()):
		if team[i] == "":
			await text_show("Your team is already full!")
			emit_signal("try_catch")
			var success = await _result_item(object)
				
			if success >= 0:
				emit_signal("catch_ok")
				await text_show("The capture of " + GeneralData.monster_encounter + " was successful!")
				if stop_event == false:
					await transi_close()
					get_tree().change_scene_to_file(GeneralData.map[GeneralData.current_map])
					return
			else:
				emit_signal("catch_fail")
				await text_show("You failed to capture " + GeneralData.monster_encounter)
				_back()
				return
	await text_show("Your team is already full!")
	back_button.show()

func set_menus_items():
	hide_button()
	var j = 0
	for i in range(4):
		if inventory[i]["name"] != "" && inventory[i]["scene"] == "map" && inventory[i]["current"] != 0:
			button[j].show()
			button[j].text = inventory[i]["name"] + " x " + str(inventory[i]["current"])
			button[j].action = "use"
			button[j].object = inventory[i]["name"]
			j += 1
		else:
			button[i].object = ""
	back_button.show()

func _action():
	$Text.text = ""
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
	$Text.text = ""
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
	get_parent().get_node("Timer").stop_event.connect(_stop_event)
	set_menus_action()
	for i in range(button.size()):
		button[i].action_pressed.connect(_on_button_action)
	back_button.action_pressed.connect(_on_button_action)
