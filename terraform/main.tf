terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
    multipass = {
      source  = "larstobi/multipass"
      version = "1.4.2"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "4.0.5"
    }
  }
}

# Setup ssh key pair
provider "tls" {}

resource "tls_private_key" "ssh" {
  algorithm = "RSA"
  rsa_bits  = "4096"
}

# Generate private key file
resource "local_file" "private_key" {
  content         = tls_private_key.ssh.private_key_pem
  filename        = "id_rsa"
  file_permission = "0600"
}

# Template cloud-ini with public key
resource "local_file" "cloud-init" {
  content = templatefile(
    "cloud-init.yaml.tftpl",
    {
      pub_key = tls_private_key.ssh.public_key_openssh
    }
  )
  filename = "cloud-init.yaml"
}

variable "CLOUD" {
  description = "Use digital ocean if true, otherwise, multipass"
  type = bool
  default = false
}

## Cloud setup ##

# Fix it in env.sh
variable "DIGITALOCEAN_TOKEN" {
  type = string
  default = ""
}

# Configure the DigitalOcean Provider
provider "digitalocean" {
  token = var.DIGITALOCEAN_TOKEN
}

resource "digitalocean_droplet" "ubuntu-droplet" {
  # Specifies the name of the droplet
  name   = "frontend"
  # Specifies the size of the VM
  size   = "s-2vcpu-4gb"
  # Specifies the image to use for the VM (Ubuntu here)
  image  = "ubuntu-23-10-x64"
  # Specifies the region where the droplet will be created
  region = "nyc3"
  # Specifies the droplet setup for ssh, users and group
  user_data = local_file.cloud-init.content
  # Enable or disable resource
  count = var.CLOUD ? 1 : 0
}

# Aquire droplet info data
data "digitalocean_droplet" "frontend_info" {
  depends_on = [
    digitalocean_droplet.ubuntu-droplet
  ]

  name = "frontend"
  # Enable or disable resource data
  count = var.CLOUD ? 1 : 0
}

## Local setup ##

provider "multipass" {}

resource "multipass_instance" "frontend" {
  depends_on = [ local_file.cloud-init ]
  name           = "frontend"
  image          = ""
  cpus           = 3
  memory         = "2GiB"
  disk           = "20GiB"
  cloudinit_file = local_file.cloud-init.filename
  # Enable or disable resource
  count = var.CLOUD ? 0 : 1
}

data "multipass_instance" "frontend_info" {
  depends_on = [
    multipass_instance.frontend
  ]
  name = "frontend"
  # Enable or disable resource data
  count = var.CLOUD ? 0 : 1
}

## Provider agnostic
# Print droplet or vm ip on the terminal
output "frontend_ip" {
  value = "${var.CLOUD ? data.digitalocean_droplet.frontend_info[0].ipv4_address : data.multipass_instance.frontend_info[0].ipv4}"
}

# Ansible hosts templating
resource "local_file" "ansible_hosts" {
  content = templatefile(
    "hosts.tftpl",
    {
      frontend_ip = "${var.CLOUD ? data.digitalocean_droplet.frontend_info[0].ipv4_address : data.multipass_instance.frontend_info[0].ipv4}"
    }
  )
  filename = "../inventory/hosts"
}


# Ansible vars templating
resource "local_file" "ansible-var" {
  content = templatefile(
    "frontend.yml.tftpl",
    {
      VM_IP = "${var.CLOUD ? data.digitalocean_droplet.frontend_info[0].ipv4_address : data.multipass_instance.frontend_info[0].ipv4}"
    }
  )
  filename = "inventory/group_vars.frontend.yml"
}
