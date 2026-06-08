extends Panel

@onready var item_visual: Sprite2D = $CenterContainer/Panel/item_display
@onready var item_count: Label = $CenterContainer/Panel/item_count

func update(item: Dictionary):
	if item["name"] == "" or item["current"] == 0:
		item_visual.visible = false
	else:
		item_visual.visible = true
		item_visual.texture = GeneralData.object_database[item["name"]]
		item_count.visible = true
		item_count.text = str(item["current"])

func update_monster(monster_name: String):
	if monster_name == "":
		item_visual.visible = false
	else:
		item_visual.visible = true
		item_visual.texture = GeneralData.monster_icon_database[monster_name]
