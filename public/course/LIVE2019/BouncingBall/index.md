# Graphics and Motion

An object that moves on the physics engine can be created by just describing one line.

`Circle(500, 100)`

There are two things that must be written at the minimum.
- shape
- x and y coordinates.

The first and second arguments are automatically read as x and y coordinates.
If you want to set more options, you can add them after the coordinates.

Option example

|Option|Function|Description example|
|:--:|:--:|:--:|
|width / height|Specify the width and height of the object|`width = 100`|
|isStatic|Lock object to specified coordinates|`isStatic = true`|
|Restitution|coefficient of restitution|`restitution = 1.5`|
|fillStyle|Object color specification|`fillStyle = "green"`|
|clicked|Specify the function to be run when the object is clicked|`clicked = [Function name]`|
	

