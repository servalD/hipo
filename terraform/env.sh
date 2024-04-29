# Retrive the token in the API section of your Digital Ocean profil. Remove it before commit to prevent leekage. (git hook will remind you)
export TF_VAR_DIGITALOCEAN_TOKEN=
# true: Digital Ocean droplet; false: local Multipass VM
export TF_VAR_CLOUD=false
