extends NinePatchRect
var dragging = false
var drag_offset = Vector2.ZERO

func _unhandled_input(event):
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		if not event.pressed:
			dragging = false

func _process(_delta):
	if dragging:
		var new_pos = get_global_mouse_position() - drag_offset
		
		var screen_size = get_viewport_rect().size
		var panel_size = Vector2(500, 600)
		
		new_pos.x = clamp(new_pos.x, 0, screen_size.x - panel_size.x)
		new_pos.y = clamp(new_pos.y, 0, screen_size.y - panel_size.y)
		
		global_position = new_pos
