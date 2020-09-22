#####
URL="http://167.71.156.62:8080"
CONTRIBUTOR_PRIVATE_KEY="0xef497e3f423fce52beb5da8c1e6904872ccbb40b8b3590932096e84260c08fa6"
CONTRIBUTOR_ADDRESS="0xd0FaDc3C5899c28c581c0e06819f4113cb08b0e4"
#VERIFIER_PRIVATE_KEY="0x70c1675327a74378f4893e6bf2aae9298250c59ae0e49d4ff066e40eb0e3c828"
#VERIFIER_ADDRESS="0xd0FaDc3C5899c28c581c0e06819f4113cb08b0e4"
CHUNKS=10
#####

yarn initialize --seed-file "./seed" --auth-type "aleo" --participant-id $CONTRIBUTOR_ADDRESS --aleo-private-key $CONTRIBUTOR_PRIVATE_KEY --count $CHUNKS --api-url $URL

#yarn contribute --seed-file "./seed" --auth-type "aleo" --participant-id $CONTRIBUTOR_ADDRESS --aleo-private-key $CONTRIBUTOR_PRIVATE_KEY --api-url $URL

#yarn verifier --seed-file "./seed" --auth-type "aleo" --participant-id $VERIFIER_ADDRESS --aleo-private-key $VERIFIER_PRIVATE_KEY --api-url $URL
