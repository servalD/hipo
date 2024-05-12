# Web site deployment project (Advanced LINUX)

Use terraform to initialize a server, then deploy a web app with its database and API using ansible tool.
This server is supposed to be secure (proper user permissions and fw deployed) and monitored by prometheus.

1. ### Setup venv for ansible
   ```shell
   ./bin/setup.sh
   source .venv/bin/activate
   ```
2. ### Initialize a server using terraform

   Choice between Digital Ocean droplet and local Multipass VM (default) by changing the `TF_VAR_CLOUD` boolean in `./terraform/env.sh`

   ```shell
   # Loads `TF_VAR_CLOUD` and `TF_VAR_DIGITALOCEAN_TOKEN` (get it from your digitalocean profile)
   source ./terraform/env.sh
   # Install dependencies
   terraform -chdir=./terraform init
   # Deploy the vm/droplet and generate the "hosts" ansible file
   terraform -chdir=./terraform apply -auto-approve
   # Teardown
   terraform -chdir=terraform destroy -auto-approve
   ```

   #### SSH connection

   ```shell
   ssh ubuntu@$(terraform -chdir=./terraform output -raw frontend_ip) -i ./terraform/id_rsa
   ```

3. ### Run Ansible playbook to deploy the web app, api and install requirements
   ```shell
   ansible-playbook -i inventory playbook.yml
   ```

## Creating a new password for root user

```shell
mkpasswd --method=SHA-512 --rounds=4096
```
