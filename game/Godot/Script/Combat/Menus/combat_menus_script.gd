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

signal change_current_monster
signal change_enemy_monster

func text_show(new_text):
	$Text.show()
	$Text.visible_characters = 0
	$Text.text = new_text
	for i in range($Text.text.length() + 1):
		$Text.visible_characters = i
		await get_tree().create_timer(SPEED_TEXT).timeout

func lock_button():
	for i in range(4):
		button[i].disabled = true
	back_button.disabled = true

func unlock_button():
	for i in range(4):
		button[i].disabled = false
	back_button.disabled = false
	
func hide_selection(my_str):
	for i in range(button.size()):
		button[i].hide()
	if my_str == "all":
		back_button.hide()
	
	
func set_menus_back():
	unlock_button()
	hide_selection("all")
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
	for i in range(GeneralData.player["currentMonster"]["skill"].size()):
		if GeneralData.player["currentMonster"]["skill"][i]["current"] > 0:
			break
			
	button[3].text = "PASS"
	button[3].action = "pass"
	
func set_menus_pass():
	unlock_button()
	hide_selection("all")
	$Text.show()
	$Text.visible_characters = 0
	$Text.text = "Are you sure you want pass ?"
	for i in range($Text.text.length() + 1):
		$Text.visible_characters = i
		await get_tree().create_timer(SPEED_TEXT).timeout
	button[2].show()
	button[2].text = "YES"
	button[2].action = "choice"
	button[2].object = "yes"
	button[3].show()
	button[3].text = "NO"
	button[3].action = "choice"
	button[3].object = "no"
	back_button.show()
	
func set_menus_monster(object):
	hide_selection("all")
	var index = int(object)
	var name_stock =  GeneralData.player["currentMonster"]["name"]
	if name_stock == "":
		GeneralData.player["currentMonster"]["name"] = GeneralData.player["battle_team"][index]["name"]
		GeneralData.player["currentMonster"]["life"] = GeneralData.player["battle_team"][index]["life"]
		GeneralData.player["currentMonster"]["index"] = object
		await text_show(GeneralData.player["currentMonster"]["name"] + " appeared")
	else:
		var temp = GeneralData.player["currentMonster"].duplicate(true)
		GeneralData.player["currentMonster"]["name"] = GeneralData.player["battle_team"][index]["name"]
		GeneralData.player["currentMonster"]["life"] = GeneralData.player["battle_team"][index]["life"].duplicate(true)
		GeneralData.player["currentMonster"]["index"] = object
		GeneralData.player["battle_team"][index]["name"] = temp["name"]
		GeneralData.player["battle_team"][index]["life"] = temp["life"].duplicate(true)
		await text_show( GeneralData.player["battle_team"][index]["name"] + " has been replaced by " + GeneralData.player["currentMonster"]["name"])
	back_button.show()
	emit_signal("change_current_monster")
	
func set_menus_select_monster():
	unlock_button()
	hide_selection("all")
	for i in range(3):
		if GeneralData.player["battle_team"][i]["name"] != "":
			button[i].show()
			if GeneralData.player["battle_team"][i]["life"]["current"] == 0:
				button[i].text = GeneralData.player["battle_team"][i]["name"] + " : dead"
				button[i].disabled = true
			else:
				button[i].text = GeneralData.player["battle_team"][i]["name"] + " : " + str(GeneralData.player["battle_team"][i]["life"]["current"]) + "/" + str(GeneralData.player["battle_team"][i]["life"]["max"])
				button[i].action = "monster"
				button[i].object = str(i)
	if GeneralData.player["currentMonster"]["name"] != "":
		back_button.show()

func set_menus_change():
	unlock_button()
	hide_selection("all")
	await text_show("Which monster you want to switch to ?")
	var current_button = 2
	for i in range(3):
		if i == int(GeneralData.player["currentMonster"]["index"]):
			continue
		if GeneralData.player["battle_team"][i]["name"] != "":
			button[current_button].show()
			if GeneralData.player["battle_team"][i]["life"]["current"] == 0:
				button[current_button].text = GeneralData.player["battle_team"][i]["name"] + " : dead"
				button[current_button].disabled = true
			else:
				button[current_button].text = GeneralData.player["battle_team"][i]["name"] + " : " + str(GeneralData.player["battle_team"][i]["life"]["current"]) + "/" + str(GeneralData.player["battle_team"][i]["life"]["max"])
				button[current_button].action = "monster"
				button[current_button].object = str(i)
			current_button +=1
	back_button.show()
	
func set_menus_choice(object):
	unlock_button()
	if object == "no":
		hide_selection("all")
		await text_show("You win")
		var victory_scene = battle_result["win"].instantiate()
		get_tree().current_scene.add_child(victory_scene)
	elif object == "yes":
		hide_selection("all")
		await text_show("You lose the fight")
		var lose_scene = battle_result["lose"].instantiate()
		get_tree().current_scene.add_child(lose_scene)
	
func set_menus_use(object):
	unlock_button()
	hide_selection("all")
	await text_show("You use " + object)
	for i in range(4):
		if inventory[i]["name"] == object:
			inventory[i]["current"] -= 1
			if inventory[i]["current"] == 0:
				inventory[i]["name"] = ""
	back_button.show()
	
func set_menus_attack(object):
	unlock_button()
	hide_selection("all")
	await text_show("You try to use " + object)
	for i in range(4):
		if skill[i]["name"] == object:
			skill[i]["current"] -= 1
	back_button.show()

func set_menus_items():
	unlock_button()
	hide_selection("all")
	var j = 0
	for i in range(4):
		if inventory[i]["name"] != "" and inventory[i]["scene"] == "combat":
			button[j].show()
			button[j].text = inventory[i]["name"] + " x " + str(inventory[i]["current"])
			button[j].action = "use"
			button[j].object = inventory[i]["name"]
			j += 1
		else:
			button[i].object = ""
	back_button.show()
	
func set_menus_skill():
	unlock_button()
	hide_selection("all")
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

func _monster(object):
	set_menus_monster(object)
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
	
func _choice(object):
	set_menus_choice(object)
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
			_monster(object)
		"change":
			_change()
		"choice_pass":
			_choice(object)
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
	set_menus_select_monster()
	for i in range(button.size()):
		button[i].action_pressed.connect(_on_button_action)
	back_button.action_pressed.connect(_on_button_action)
	


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(_delta: float) -> void:
	pass
