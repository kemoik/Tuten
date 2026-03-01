# 🌊 Tuten — Docker Deployment Guide
### Local Docker → Cloud Server, Step by Step

---

## 📁 Project Structure

```
tuten-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx          ← React entry point
│   └── App.jsx           ← Your full Tuten website
├── Dockerfile            ← Multi-stage build (Node → Nginx)
├── docker-compose.yml    ← Easy local orchestration
├── nginx.conf            ← Production Nginx config
├── .dockerignore         ← Keeps image lean
├── .gitignore
├── index.html            ← Vite HTML template
├── vite.config.js        ← Vite config
└── package.json          ← Dependencies
```

---

## PHASE 1 — Local Setup (Your Computer)

### Step 1 — Install Prerequisites

**Install Node.js (v20+)**
```bash
# macOS (using Homebrew)
brew install node

# Windows — download installer from:
https://nodejs.org/en/download

# Ubuntu/Linux
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Install Docker Desktop**
```
https://www.docker.com/products/docker-desktop/
```
> After installing, open Docker Desktop and make sure it's running (whale icon in taskbar).

---

### Step 2 — Set Up the Project

Download all the project files from Claude and place them in a folder.  
Your folder should look exactly like the structure above.

Then open a terminal and navigate into it:
```bash
cd tuten-app
```

---

### Step 3 — Test Locally Without Docker First (optional but recommended)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser at **http://localhost:3000** — you should see your Tuten website live!

Press `Ctrl + C` to stop it when done.

---

### Step 4 — Build the Docker Image

```bash
# Build the image (this will take 1–2 minutes the first time)
docker build -t tuten-app .
```

You should see output like:
```
[+] Building 45.2s
 => [builder 1/5] FROM node:20-alpine
 => [builder 4/5] RUN npm install
 => [builder 5/5] RUN npm run build
 => [production 3/3] COPY --from=builder /app/dist ...
 => naming to docker.io/library/tuten-app
```

---

### Step 5 — Run the Container Locally

**Option A — Simple run:**
```bash
docker run -d \
  --name tuten-website \
  -p 80:80 \
  tuten-app
```

**Option B — Using Docker Compose (recommended):**
```bash
docker-compose up -d
```

The `-d` flag runs it in the background (detached mode).

---

### Step 6 — View Your Live Website

Open your browser and go to:
```
http://localhost
```
or
```
http://localhost:8080
```

🎉 Your Tuten website is now running in Docker!

---

### Useful Docker Commands

```bash
# Check running containers
docker ps

# View logs
docker logs tuten-website

# Stop the container
docker-compose down

# Stop and remove everything
docker-compose down --rmi all

# Rebuild after making code changes
docker-compose up -d --build

# Open a shell inside the container (for debugging)
docker exec -it tuten-website sh
```

---

## PHASE 2 — Deploy to a Cloud Server

### Step 7 — Choose a Cloud Provider

**Recommended options (all support Docker):**

| Provider | Best For | Starting Price |
|---|---|---|
| **DigitalOcean** | Simplest setup, great docs | $6/month |
| **Hetzner Cloud** | Cheapest, fast EU/US servers | ~$4/month |
| **AWS EC2** | Most powerful, more complex | ~$8/month |
| **Google Cloud Run** | Auto-scaling, pay per request | ~$0-5/month |
| **Render.com** | Easiest, deploy from GitHub | Free tier |

> **Recommendation for beginners: DigitalOcean Droplet or Render.com**

---

### Step 8A — Deploy to DigitalOcean (Recommended)

**8A.1 — Create a Droplet**
1. Sign up at https://digitalocean.com
2. Click **Create → Droplets**
3. Choose:
   - Image: **Ubuntu 24.04 LTS**
   - Size: **Basic / Regular — $6/month** (1 vCPU, 1GB RAM — plenty for this app)
   - Datacenter: Choose closest to Kenya (Amsterdam or Singapore)
   - Authentication: **SSH Key** (or Password if you're new)
4. Click **Create Droplet**
5. Note your server's **IP address** (e.g. `165.22.45.12`)

---

**8A.2 — SSH Into Your Server**
```bash
# Replace with your actual IP
ssh root@165.22.45.12
```

---

**8A.3 — Install Docker on the Server**
```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Verify both installed
docker --version
docker compose version
```

---

**8A.4 — Upload Your Project to the Server**

**Option A — Using Git (recommended):**
```bash
# On your LOCAL machine first — push to GitHub
git init
git add .
git commit -m "Initial Tuten website"
git remote add origin https://github.com/YOUR_USERNAME/tuten-app.git
git push -u origin main

# Then on your SERVER:
git clone https://github.com/YOUR_USERNAME/tuten-app.git
cd tuten-app
```

**Option B — Using SCP (direct file copy):**
```bash
# Run this on your LOCAL machine
scp -r ./tuten-app root@165.22.45.12:/root/
```

---

**8A.5 — Build and Run on the Server**
```bash
# On the server, inside the project folder
cd tuten-app
docker compose up -d --build
```

---

**8A.6 — Open Port 80 in Firewall**
```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw enable
```

---

**8A.7 — Test It!**
Open your browser and visit:
```
http://165.22.45.12
```
Your Tuten website is now live on the internet! 🌍

---

### Step 9 — Connect a Custom Domain (Optional but Professional)

**9.1 — Buy a domain** from Namecheap, GoDaddy, or Google Domains  
(e.g. `tuten.co.ke` or `shoptutenke.com`)

**9.2 — Point the domain to your server:**
- In your domain registrar's DNS settings, add an **A Record**:
  ```
  Type:  A
  Name:  @
  Value: 165.22.45.12   ← your server IP
  TTL:   3600
  ```
- Also add:
  ```
  Type:  A
  Name:  www
  Value: 165.22.45.12
  ```

**9.3 — Add SSL/HTTPS (Free with Let's Encrypt):**
```bash
# On your server
apt install certbot -y

# Get free SSL certificate (replace with your domain)
certbot --nginx -d tuten.co.ke -d www.tuten.co.ke

# Auto-renew SSL (runs every 12 hours)
crontab -e
# Add this line:
0 12 * * * certbot renew --quiet
```

Your site will now be accessible at:
```
https://tuten.co.ke  ✅ Secure!
```

---

### Step 8B — Deploy to Render.com (Easiest Alternative)

If you want zero server management:

1. Push your code to GitHub (see Step 8A.4 Option A)
2. Go to https://render.com and sign up
3. Click **New → Web Service**
4. Connect your GitHub repo
5. Settings:
   - **Environment:** Docker
   - **Branch:** main
   - **Dockerfile Path:** ./Dockerfile
6. Click **Create Web Service**
7. Wait ~3 minutes — Render gives you a free URL like `tuten-app.onrender.com`

---

## PHASE 3 — Keeping It Running & Updated

### Make Code Changes and Redeploy

Every time you update your website code:

**If using a server (DigitalOcean):**
```bash
# On your local machine — push changes
git add .
git commit -m "Updated product list"
git push origin main

# SSH into server and pull + rebuild
ssh root@YOUR_IP
cd tuten-app
git pull
docker compose up -d --build
```

**If using Render.com:**
- Just `git push` — Render auto-deploys! ✨

---

### Monitor Your Container

```bash
# Check status
docker ps

# Live logs
docker logs -f tuten-website

# Resource usage (CPU, memory)
docker stats tuten-website

# Restart if something goes wrong
docker compose restart
```

---

## 🔑 Summary Cheatsheet

| Goal | Command |
|---|---|
| Build image | `docker build -t tuten-app .` |
| Start locally | `docker-compose up -d` |
| Stop locally | `docker-compose down` |
| Rebuild after changes | `docker-compose up -d --build` |
| View logs | `docker logs tuten-website` |
| SSH to server | `ssh root@YOUR_IP` |
| Pull & redeploy on server | `git pull && docker compose up -d --build` |

---

*Built with ☀️ for Tuten | Effortless Style — Mombasa, Kenya*
