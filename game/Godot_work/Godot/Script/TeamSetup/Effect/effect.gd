extends Control

@onready var gpu_particles = $Comete
@onready var cpu_particles = $Star

func _ready() -> void:
	if OS.has_feature("web"):
		gpu_particles.trail_enabled = false
	resized.connect(_update_particles)
	_update_particles()

func _update_particles() -> void:
	var viewport_size = size
	gpu_particles.position = viewport_size / 2
	cpu_particles.position = viewport_size / 2
	cpu_particles.emission_rect_extents = viewport_size / 2
	if gpu_particles.process_material is ParticleProcessMaterial:
		var mat = gpu_particles.process_material as ParticleProcessMaterial
		if mat.emission_shape == 3:
			var shape_scale = mat.emission_shape_scale
			var scale_x = shape_scale.x if shape_scale.x != 0 else 1.0
			var scale_y = shape_scale.y if shape_scale.y != 0 else 1.0
			mat.emission_box_extents = Vector3(
				(viewport_size.x / 2) / scale_x,
				(viewport_size.y / 2) / scale_y,
				0
			)
