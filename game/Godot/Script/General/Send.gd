extends Node

func send_mesage(event, value = null):
	#PROTO MESSAGE
	var packet = {
		"event": "game",
		"data": {}
	}
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
			_team_choice(packet, value)
		"change_current_monster":
			_change_current_monster(packet, value)
		"try_attack":
			_try_attack(packet, value)
	Network.ws.send_text(JSON.stringify(packet))


func _try_attack(packet, slot):
	packet["data"] = {
		"state" = "attack",
		"slot" = slot
	}


func _change_current_monster(packet, slot):
	packet["data"] = {
		"state": "change_current_monster",
		"slot": slot
	}


func _team_choice(packet, team):
	packet["data"] = {
		"battle_team": team
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
