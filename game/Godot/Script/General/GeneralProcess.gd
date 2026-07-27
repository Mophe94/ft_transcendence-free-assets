extends Node

var TIMEOUT = 10
var TIMEVAL = 1

func wait_signal(send_func: Callable, signal_to_wait: Signal) -> bool:
	var time = 0
	var received = [false]

	var wait_task = func():
		await signal_to_wait
		received = [true]
	wait_task.call()

	send_func.call()
	while time < TIMEOUT and not received[0]:
		await get_tree().create_timer(TIMEVAL).timeout
		time += TIMEVAL
		if not received[0] and time % 4 == 0:
			print("TIME WAITING FOR RECEIVED : ", str(time), "/", str(TIMEOUT))
			send_func.call()
	if not received[0]:
		Network.connection = false
		print("SIGNAL NEVER RECEIVED")
	return received[0]

func wait_signal_return(send_func: Callable, signal_to_wait: Signal) -> int:
	var time = 0
	var received = -1

	var wait_task = func():
		received = await signal_to_wait
	wait_task.call()

	send_func.call()
	while time < TIMEOUT and received == -1:
		await get_tree().create_timer(TIMEVAL).timeout
		time += TIMEVAL
		if received == -1 and time % 4 == 0:
			print("TIME WAITING FOR RECEIVED : ", str(time), "/", str(TIMEOUT))
			send_func.call()
	if received == -1:
		Network.connection = false
		print("SIGNAL NEVER RECEIVED")
	return received
