extends Node2D
class_name MashBar

signal completed
signal failed

@export var min_presses: int = 5
@export var max_presses: int = 15
@export var time_limit: float = 3.0
@export var decay_per_second: float = 15.0
@export var action_name: String = "action"

@onready var progress_bar: TextureProgressBar = $ProgressBar

var press_value: float = 0.0
var time_left: float = 0.0
var active: bool = false

func _ready() -> void:
	visible = false
	set_process(false)

func start() -> void:
	var target_presses := randi_range(min_presses, max_presses)
	press_value = 100.0 / float(target_presses)
	progress_bar.value = 0
	time_left = time_limit
	active = true
	visible = true
	modulate = Color.WHITE
	set_process(true)

func _process(delta: float) -> void:
	if not active:
		return
	time_left -= delta
	if Input.is_action_just_pressed("action"):
		progress_bar.value += press_value
	else:
		progress_bar.value -= decay_per_second * delta
	progress_bar.value = clamp(progress_bar.value, 0, 100)
	if progress_bar.value >= 100:
		_on_success()
	elif time_left <= 0:
		_on_fail()

func _on_success() -> void:
	active = false
	set_process(false)
	_play_success_feedback()

func _play_success_feedback() -> void:
	var tween = create_tween()
	tween.tween_property(self, "modulate", Color(0.3, 1.0, 0.3), 0.15)
	tween.tween_interval(0.3)
	tween.tween_callback(func():
		visible = false
		progress_bar.value = 0
		modulate = Color.WHITE
		completed.emit()
	)

func _on_fail() -> void:
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
		progress_bar.value = 0
		modulate = Color.WHITE
		failed.emit()
	)
	
func force_fail() -> void:
	if active:
		_on_fail()
