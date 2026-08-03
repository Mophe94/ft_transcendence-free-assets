extends GPUParticles2D
 
func _ready() -> void:
	_update_emission_area()
	get_viewport().size_changed.connect(_update_emission_area)
 
func _update_emission_area() -> void:
	var viewport_size: Vector2 = get_viewport().get_visible_rect().size
 
	# Positionne le node au centre de la moitie superieure de l'ecran
	position = Vector2(viewport_size.x / 3.0, viewport_size.y * 0.25)
 
	# La zone d'emission couvre toute la largeur, sur la moitie superieure (donc demi-hauteur)
	var mat := process_material as ParticleProcessMaterial
	if mat:
		mat.emission_shape = ParticleProcessMaterial.EMISSION_SHAPE_BOX
		mat.emission_box_extents = Vector3(viewport_size.x / 2.0, viewport_size.y / 4.0, 0.0)
