extends Node2D
class_name FishingBar

signal completed
signal failed

@export var cursor_speed: float = 2.0
@export var zone_min_width: float = 0.12
@export var zone_max_width: float = 0.25
@export var time_limit: float = 6.0
@export var action_name: String = "action"
@export var zone_color: Color = Color(0, 0, 0, 0.45)
@export var cursor_color: Color = Color(1, 1, 1, 0.9)
@export var cursor_width: float = 4.0

@onready var bar: Control = $Targer_Bar

var shadow_zone: ColorRect
var cursor: ColorRect

var cursor_pos: float = 0.0
var direction: int = 1

var zone_start: float = 0.0
var zone_end: float = 0.0

var time_left: float = 0.0
var active: bool = false
var can_validate: bool = false


func _ready() -> void:
	visible = false
	set_process(false)
	_create_generated_visuals()


func _create_generated_visuals() -> void:
	shadow_zone = ColorRect.new()
	shadow_zone.color = zone_color
	shadow_zone.size.y = bar.size.y
	shadow_zone.mouse_filter = Control.MOUSE_FILTER_IGNORE
	bar.add_child(shadow_zone)

	cursor = ColorRect.new()
	cursor.color = cursor_color
	cursor.size = Vector2(cursor_width, bar.size.y)
	cursor.mouse_filter = Control.MOUSE_FILTER_IGNORE
	bar.add_child(cursor)


func start() -> void:
	var zone_width = randf_range(zone_min_width, zone_max_width)

	zone_start = randf_range(0.0, 1.0 - zone_width)
	zone_end = zone_start + zone_width

	cursor_pos = 0.0
	direction = 1
	time_left = time_limit

	active = true
	can_validate = false

	visible = true
	modulate = Color.WHITE

	_update_zone_visual()
	_update_cursor_visual()

	set_process(true)

	# évite de détecter le même appui qui lance la pêche
	await get_tree().create_timer(0.2).timeout

	if active:
		can_validate = true


func _process(delta: float) -> void:
	if not active:
		return

	time_left -= delta

	cursor_pos += direction * cursor_speed * delta

	if cursor_pos >= 1.0:
		cursor_pos = 1.0
		direction = -1

	elif cursor_pos <= 0.0:
		cursor_pos = 0.0
		direction = 1

	_update_cursor_visual()


	if can_validate and Input.is_action_just_pressed(action_name):

		if cursor_pos >= zone_start and cursor_pos <= zone_end:
			_on_success()
		else:
			_on_fail()

		return


	if time_left <= 0:
		_on_fail()


func _update_zone_visual() -> void:
	var w = bar.size.x

	shadow_zone.position.x = zone_start * w
	shadow_zone.size.x = (zone_end - zone_start) * w


func _update_cursor_visual() -> void:
	var w = bar.size.x

	cursor.position.x = cursor_pos * w - cursor_width / 2.0


func _on_success() -> void:
	if not active:
		return

	active = false
	set_process(false)

	_play_success_feedback()


func _play_success_feedback() -> void:
	var tween = create_tween()

	tween.tween_property(self, "modulate", Color(0.3, 1.0, 0.3), 0.15)
	tween.tween_interval(0.3)

	tween.tween_callback(func():
		visible = false
		modulate = Color.WHITE
		completed.emit()
	)


func _on_fail() -> void:
	if not active:
		return

	active = false
	set_process(false)

	_play_break_feedback()


func _play_break_feedback() -> void:
	var tween = create_tween()

	modulate = Color(1, 0.3, 0.3)

	var original_pos = position

	tween.tween_property(self, "position", original_pos + Vector2(4, 0), 0.05)
	tween.tween_property(self, "position", original_pos - Vector2(4, 0), 0.05)
	tween.tween_property(self, "position", original_pos + Vector2(4, 0), 0.05)
	tween.tween_property(self, "position", original_pos, 0.05)

	tween.tween_callback(func():
		visible = false
		modulate = Color.WHITE
		failed.emit()
	)


func force_fail() -> void:
	if active:
		_on_fail()
