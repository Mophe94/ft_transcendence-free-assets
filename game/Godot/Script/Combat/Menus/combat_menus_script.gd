extends Panel

var battle_result: Dictionary = {
	"win": preload("res://Scene/Combat/CombatResult/win.tscn"),
	"lose": preload("res://Scene/Combat/CombatResult/lose.tscn")
}

var SPEED_TEXT = GeneralData.SPEED_TEXT

@onready var playerAsset = GeneralData.player_charactere_scene
@onready var inventory = GeneralData.player["inventory"]
@onready var skill = GeneralData.player["currentMonster"]["skill"]

@onready var button = [$Button, $Button2, $Button3, $Button4]
@onready var back_button = $Button5

signal action_play
signal action_combat
signal change_monster
signal enemy_change_monster
signal stop_timer
signal run_timer

##############################################################
func _lose():
	await text_show("YOU LOSE.")
	var lose_scene = battle_result["lose"].instantiate()
	get_tree().current_scene.add_child(lose_scene)
	stop_timer.emit()
	Received.action_finished.emit()
	
func _win():
	await text_show("YOU WIN !")
	var victory_scene = battle_result["win"].instantiate()
	get_tree().current_scene.add_child(victory_scene)
	stop_timer.emit()
	Received.action_finished.emit()

func _change_monster():
	await text_show(GeneralData.text)
	$Text.text = ""
	set_menus_select_monster()
	run_timer.emit()
	Received.action_finished.emit()

func _enemy_change_monster():
	hide_selection()
	await text_show(GeneralData.text)
	$Text.text = ""
	run_timer.emit()
	Received.action_finished.emit()

func _new_current_monster():
	await text_show(GeneralData.text)
	$Text.text = ""
	emit_signal("change_monster")
		
func _new_enemy_monster():
	await text_show(GeneralData.text)
	$Text.text = ""
	emit_signal("enemy_change_monster")

func waiting_player(send_func: Callable):
	action_play.emit()
	hide_selection()
	lock_button()
	send_func.call()
	await text_show("Waiting action enemy.")

func _received_action():
	emit_signal("action_combat")
	await text_show(GeneralData.text)
	$Text.text = ""
	Received.action_finished.emit()
	
func _new_turn():
	await text_show(GeneralData.text)
	$Text.text = ""
	run_timer.emit()
	_back()
##############################################################

func text_show(new_text):
	$Text.show()
	$Text.visible_characters = 0
	$Text.text = new_text
	for i in range($Text.text.length() + 1):
		$Text.visible_characters = i
		await get_tree().create_timer(SPEED_TEXT).timeout
	await get_tree().create_timer(0.5).timeout

func lock_button():
	for i in range(4):
		button[i].disabled = true
	back_button.disabled = true

func unlock_button():
	for i in range(4):
		button[i].disabled = false
	back_button.disabled = false
	
func hide_selection():
	for i in range(button.size()):
		button[i].hide()
		back_button.hide()
	
	
func set_menus_back():
	unlock_button()
	hide_selection()
	button[0].show()
	button[0].text = "SKILL"
	button[0].action = "skill"
	button[1].show()
	button[1].text = "ITEMS"
	button[1].action = "items"
	button[2].show()
	button[2].text = "CHANGE"
	button[2].action = "change"
	button[3].show()
	button[3].text = "PASS"
	button[3].action = "pass"

func set_menus_choice_pass(object):
	unlock_button()
	hide_selection()
	if object == "no":
		_back()
	elif object == "yes":
		var send_func = func():
			Send.send_message(Send.SEND_TAB[Send.SEND_NAME.PASS])
		waiting_player(send_func)

func set_menus_pass():
	unlock_button()
	hide_selection()
	text_show("Are you sure you want pass ?")
	button[2].show()
	button[2].text = "YES"
	button[2].action = "choice_pass"
	button[2].object = "yes"
	button[3].show()
	button[3].text = "NO"
	button[3].action = "choice_pass"
	button[3].object = "no"
	back_button.show()

func set_monster_choice(object):
	hide_selection()
	var send_func = func():
		Send.send_message(Send.SEND_TAB[Send.SEND_NAME.CHANGE_CURRENT_MONSTER], object)
	waiting_player(send_func)
	
func set_menus_select_monster():
	unlock_button()
	hide_selection()
	for i in range(3):
		if GeneralData.player["battle_team"][i]["name"] != "":
			button[i].show()
			if GeneralData.player["battle_team"][i]["life"]["current"] == 0:
				button[i].text = GeneralData.player["battle_team"][i]["name"] + " : dead"
				button[i].disabled = true
			else:
				button[i].text = GeneralData.player["battle_team"][i]["name"] + " : " + str(GeneralData.player["battle_team"][i]["life"]["current"]) + "/" + str(GeneralData.player["battle_team"][i]["life"]["max"])
				button[i].action = "monster"
				button[i].object = GeneralData.player["battle_team"][i]["slot"]
	if GeneralData.player["currentMonster"]["name"] != "":
		back_button.show()

func set_menus_change():
	unlock_button()
	hide_selection()
	await text_show("Which monster you want to switch to ?")
	var current_button = 2
	for i in range(3):
		if i == int(GeneralData.player["currentMonster"]["slot"]):
			continue
		if GeneralData.player["battle_team"][i]["name"] != "":
			button[current_button].show()
			if GeneralData.player["battle_team"][i]["life"]["current"] == 0:
				button[current_button].text = GeneralData.player["battle_team"][i]["name"] + " : dead"
				button[current_button].disabled = true
			else:
				button[current_button].text = GeneralData.player["battle_team"][i]["name"] + " : " + str(GeneralData.player["battle_team"][i]["life"]["current"]) + "/" + str(GeneralData.player["battle_team"][i]["life"]["max"])
				button[current_button].action = "monster"
				button[current_button].object = GeneralData.player["battle_team"][i]["slot"]
			current_button +=1
	back_button.show()
	
func set_menus_use(object):
	hide_selection()
	var send_func = func():
		Send.send_message(Send.SEND_TAB[Send.SEND_NAME.USE_ITEM_COMBAT], object)
	waiting_player(send_func)

func set_menus_items():
	unlock_button()
	hide_selection()
	var j = 0
	for i in range(4):
		if inventory[i]["name"] != "" and inventory[i]["scene"] == "combat" and inventory[i]["current"] > 0:
			button[j].show()
			button[j].text = inventory[i]["name"] + " x " + str(inventory[i]["current"])
			button[j].action = "use"
			button[j].object = inventory[i]["name"]
			j += 1
		else:
			button[i].object = ""
	back_button.show()

func set_menus_attack(object):
	hide_selection()
	var send_func = func():
		Send.send_message(Send.SEND_TAB[Send.SEND_NAME.TRY_ATTACK], object)
	waiting_player(send_func)
	
func set_menus_skill():
	unlock_button()
	hide_selection()
	for i in range(4):
		if skill[i]["name"] != "":
			button[i].show()
			if skill[i]["current"] == 0:
				button[i].disabled = true
			button[i].text = skill[i]["name"] + " " + str(skill[i]["current"]) + "/" + str(skill[i]["max"])
			button[i].action = "attack"
			button[i].object = skill[i]["name"]
		else:
			button[i].object = ""
	back_button.show()

func _monster_choice(object):
	set_monster_choice(object)
	await get_tree().create_timer(1.0).timeout

func _select_monster():
	set_menus_select_monster()
	await get_tree().create_timer(1.0).timeout

func _change():
	set_menus_change()
	await get_tree().create_timer(1.0).timeout

func _action():
	set_menus_back()
	await get_tree().create_timer(1.0).timeout
	
func _skill():
	set_menus_skill()
	await get_tree().create_timer(1.0).timeout

func _attack(object):
	set_menus_attack(object)
	await get_tree().create_timer(1.0).timeout

func _pass():
	set_menus_pass()
	await get_tree().create_timer(1.0).timeout
	
func _choice_pass(object):
	set_menus_choice_pass(object)
	await get_tree().create_timer(1.0).timeout

func _use(object):
	set_menus_use(object)
	await get_tree().create_timer(5.0).timeout

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
		"monster":
			_monster_choice(object)
		"change":
			_change()
		"choice_pass":
			_choice_pass(object)
		"items":
			_items()
		"back":
			_back()
		"use":
			_use(object)
		"pass":
			_pass()
		"skill":
			_skill()
		"attack":
			_attack(object)
		"select_monster":
			_select_monster()
		

func _ready() -> void:
	Received.new_current_monster.connect(_new_current_monster)
	Received.new_enemy_monster.connect(_new_enemy_monster)
	Received.action.connect(_received_action)
	Received.change_monster.connect(_change_monster)
	Received.enemy_change_monster.connect(_enemy_change_monster)
	Received.new_turn.connect(_new_turn)
	Received.win.connect(_win)
	Received.lose.connect(_lose)
	set_menus_select_monster()
	for i in range(button.size()):
		button[i].action_pressed.connect(_on_button_action)
	back_button.action_pressed.connect(_on_button_action)
