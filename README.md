
# TradeTix - backend

💰Why let your tickets go to waste? Sell it on TradeTix!

"TradeTix is a user-friendly web app where you can sell ticketsyou’re unable to utilize. Easily find a new home for your tickets or grab last-minute deals from other users."

## Build and Run

clone the project and run the mongodb in container

```bash
  cd tradetix-backend/k8s
  docker-compose up -d
```

run the app
```bash
    cd ..
    npm run dev
```


# 🎟️ Trade-Tix - Ticket Resale Platform 🎟️

Welcome to **Trade-Tix**, a secure, full-stack platform that allows users to buy and sell tickets seamlessly! Whether you're looking to purchase tickets for a concert, event, or show, **Trade-Tix** provides both **crypto** and **Razorpay** payment options, ensuring flexibility and security for every transaction. 🌐💳

---

## 🚀 Features

- **Ticket Buying & Selling** 🎫
  - Buy and sell tickets for various events.
  - Secure transactions using **crypto** and **Razorpay** payment gateway. 💰

- **Blockchain Integration** ⛓️
  - **Ethereum (Ganache)** powered private blockchain network with **smart contracts** for transparent ticket transactions. 🔐
  - Interact with the blockchain through **MetaMask** for a decentralized experience. 🌍

- **Scalable & Reliable** ⚙️
  - Deployed on **Kubernetes** for high availability and horizontal scaling. 📈
  - Managed using **BTP Kyma** and **ISTIO Ingress** for seamless service communication. 🌐

- **Platform Fee** 💸
  - 18% fee on **crypto** transactions for platform maintenance.

---

## 📦 Installation

To run this project locally, follow the steps below:

### 1. Clone the repository

```bash
git clone https://github.com/your-username/trade-tix.git
cd trade-tix
