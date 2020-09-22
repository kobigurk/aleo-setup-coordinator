#####
URL="http://167.71.156.62:8080"
#CONTRIBUTOR_PRIVATE_KEY="0xef497e3f423fce52beb5da8c1e6904872ccbb40b8b3590932096e84260c08fa6"
#CONTRIBUTOR_ADDRESS="0xd0FaDc3C5899c28c581c0e06819f4113cb08b0e4"
VERIFIER_PRIVATE_KEY="0xa9cf8102c152fa21ac170c6688b6f3df59ad05fb80d8035c4ed8cbc2617886e7"
VERIFIER_ADDRESS="0xEC60b9a43529c12CA83Af466D8A6F8444392D47C"
CHUNKS=10
#####

#yarn initialize --seed-file "./seed" --auth-type "aleo" --participant-id $CONTRIBUTOR_ADDRESS --aleo-private-key $CONTRIBUTOR_PRIVATE_KEY --count $CHUNKS --api-url $URL

#yarn contribute --seed-file "./seed" --auth-type "aleo" --participant-id $CONTRIBUTOR_ADDRESS --aleo-private-key $CONTRIBUTOR_PRIVATE_KEY --api-url $URL

yarn verify --seed-file "./seed" --auth-type "aleo" --participant-id $VERIFIER_ADDRESS --aleo-private-key $VERIFIER_PRIVATE_KEY --api-url $URL
