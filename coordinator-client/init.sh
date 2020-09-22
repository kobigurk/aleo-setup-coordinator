sudo apt-get update
sudo apt-get install -y build-essential libssl-dev jq npm

curl https://raw.githubusercontent.com/creationix/nvm/v0.35.3/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
nvm install 12.0.0

sudo npm install yarn -g

#####

yarn install

echo -n "$(tr -dc 'A-F0-9' < /dev/urandom | head -c32)" > seed
echo "COORDINATOR_SEED_FILE=seed" > .env


######
#
#yarn initialize
#
######
#
#yarn contribute:dave
