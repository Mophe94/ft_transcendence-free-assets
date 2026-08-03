extends Node

enum SEND_NAME {
	REQUEST_ITEM,
	ADD_ITEM,
	NEW_ENCOUNTER,
	TRY_CATCH,
	DELETE_MONSTER,
	DELETE_ITEM,
	USE_ITEM,
	TEAM_CHOICE,
	CHANGE_CURRENT_MONSTER,
	TRY_ATTACK,
	PASS
}

const SEND_TAB = {
	SEND_NAME.REQUEST_ITEM: "request_item",
	SEND_NAME.ADD_ITEM: "add_item",
	SEND_NAME.NEW_ENCOUNTER: "new_encounter",
	SEND_NAME.TRY_CATCH: "try_catch",
	SEND_NAME.DELETE_MONSTER: "delete_monster",
	SEND_NAME.DELETE_ITEM: "delete_item",
	SEND_NAME.USE_ITEM: "use_item",
	SEND_NAME.TEAM_CHOICE: "team_choice",
	SEND_NAME.CHANGE_CURRENT_MONSTER: "change_current_monster",
	SEND_NAME.TRY_ATTACK: "try_attack",
	SEND_NAME.PASS: "pass"
}

func send_message(event, value = null):
	#PROTO MESSAGE
	var packet = {
		"event": "game",
		"data": {}
	}
	print(event)
	match event:
		"request_item":
			_item_request(packet)
		"add_item":
			_add_item(packet)
		"new_encounter":
			_new_encounter(packet)
		"try_catch":
			_try_catch(packet)
		"delete_monster":
			_delete_monster(packet, value)
		"delete_item":
			_delete_item(packet, value)
		"use_item":
			_use_item(packet, value)
		"team_choice":
			_team_choice(packet)
		"change_current_monster":
			print("coucoucocuocu")
			_change_current_monster(packet, value)
		"try_attack":
			_try_attack(packet, value)
		"use_item_combat":
			_use_item_combat(packet, value)
		"pass":
			_pass(packet)
	if Network.wsSate != WebSocketPeer.STATE_CLOSED:
		print("-------- MSG SEND --------  :\n", JSON.stringify(packet))
		Network.ws.send_text(JSON.stringify(packet))
	else:
		print("-------- WEBSOCKET CLOSE--------  :\n", JSON.stringify(packet))


func _pass(packet):
	packet["data"] = {
		"state": "pass"
	}


func _use_item_combat(packet, item):
	packet["data"] = {
		"state": "use_item_combat",
		"item": item
	}


func _try_attack(packet, skill):
	packet["data"] = {
		"state" = "attack",
		"skill" = skill
	}


func _change_current_monster(packet, slot):
	packet["data"] = {
		"state": "change_current_monster",
		"slot": slot
	}


func _team_choice(packet):
	var tab = ["", "", ""]
	for i in range(GeneralData.player["battle_team"].size()):
		tab[i] = GeneralData.player["battle_team"][i]["name"]
	packet["data"] = {
		"state": "team_choice",
		"battle_team": tab
	}

func _use_item(packet, item):
	packet["data"] = {
		"state": "use_item",
		"item": item
	}


func _delete_item(packet, item):
	packet["data"] = {
		"state" = "delete_item",
		"item" = item
	}


func _delete_monster(packet, monster):
	packet["data"] = {
		"state" = "delete_monster",
		"monster" = monster
	}


func _try_catch(packet):
	packet["data"] = {
		"state": "try_catch"
	}


func _item_request(packet):
	packet["data"] = {
		"state": "item_request" 
	}


func _add_item(packet):
	packet["data"] = {
		"state": "add_item"
	}


func _new_encounter(packet):
	packet["data"] = {
		"state": "new_encounter",
		"tile": GeneralData.tile
	}
