#####
URL="http://64.227.92.100:8000/api/coordinator"
CONTRIBUTOR_PRIVATE_KEY="APrivateKey1yfMNCSbTWDkPrMuAiaDntvBa4abc8HW8EKcJEkc8yi9yAwf"
CONTRIBUTOR_ADDRESS="aleo1esmsw3k9crrs3r8k06l7wgmytanjj35tr47aprv7mq5l96yctqfqc930nx"
#CONTRIBUTOR_PRIVATE_KEY="0xa9cf8102c152fa21ac170c6688b6f3df59ad05fb80d8035c4ed8cbc2617886e7"
#CONTRIBUTOR_ADDRESS="0xEC60b9a43529c12CA83Af466D8A6F8444392D47C"
VERIFIER_PRIVATE_KEY="APrivateKey1uBK2GoFHPrtPX4D9McZ2a8uTjgTc6yJdhsrkfq4Rr2q1BDz"
VERIFIER_ADDRESS="aleo1htnk0gkucn3uccura0dc78m5r6nz865lz7a4y43w3rnu70dkkgrq6af7hc"
CHUNKS=10
#####

#yarn initialize --seed-file "./seed" --auth-type "aleo" --participant-id $CONTRIBUTOR_ADDRESS --aleo-private-key $CONTRIBUTOR_PRIVATE_KEY --count $CHUNKS --api-url $URL

yarn contribute --seed-file "./seed" --auth-type "aleo" --participant-id $CONTRIBUTOR_ADDRESS --aleo-private-key $CONTRIBUTOR_PRIVATE_KEY --api-url $URL

#yarn verify --seed-file "./seed" --auth-type "aleo" --participant-id $VERIFIER_ADDRESS --aleo-private-key $VERIFIER_PRIVATE_KEY --api-url $URL
