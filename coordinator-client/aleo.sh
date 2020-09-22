#####
PRIVATE_KEY="0xef497e3f423fce52beb5da8c1e6904872ccbb40b8b3590932096e84260c08fa6"
ADDRESS="0xd0FaDc3C5899c28c581c0e06819f4113cb08b0e4"
CHUNKS=10
#####

yarn initialize --seed-file "./seed" --auth-type "aleo" --participant-id $ADDRESS --aleo-private-key $PRIVATE_KEY --count $CHUNKS

#yarn contribute --seed-file "./seed" --auth-type "aleo" --participant-id $ADDRESS --aleo-private-key $PRIVATE_KEY
