#Working with Protobuf


##Getting started
Get Protobufjs, Google's Protobuf for js seems to have little to no documentation

		$> npm install protobufjs [--save --save-prefix=~]

		var protobuf = require("protobufjs");

##Instructions for parsing

### General
1. Use proto3 syntax only
2. Optional/Repeated keywords are to be used for every member
3. Required keyword is literally hitler. Stay away.
4. Check for state's update index to verify if states aren't getting dropped

### State Message
Consists of actor properties and corresponding LOS for player 1 and player 2

1. Get access to State, Actor and LOS data type
 
		 var StateMessage = root.lookup("IPC.State");
		 var ActorMessage = root.lookup("IPC.State.Actor");
		 var LOSMessage = root.lookup("IPC.State.LOS");
2. Decode incoming state message

		var StateDecoded = StateMessage.decode(buffer);
3. StateDecoded contains the state comprising of repeated IPC::Actor and IPC::LOS
4. Resolved enum scope: IPC::State::Actor::*Required enum value* and IPC::State::LOS::*Required enum value*

### Terrain Message
Consists of terrain types, position and size

Similar to State but lookout for the following

1. Redundant enum value: IPC::Terrain::TerrainElement::UNDEFINED would not correspond to any terrain unit when loading from file.
2. Loadind the terrain: Load up the terrain into files since the actual terrain corresponding to the level would be huge. Then on loading a particular level, Decode the filestream corresponding to the level's terrain.

### Interrupts Message
Consists of interrupts like renderer status and level number

Not exactly similar to State but you can load up the types in the same manner. Lookout for the following

1. Setting a field: At most one field can be set at the same time. Setting any member of the oneof automatically clears all the other members
2. Interrupting the Simulator: Pass only one of the values to the simulator in one update
