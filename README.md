# Babylon Test Project
=======================

## Project Overview
---------------

This is a Babylon Staking Demo, designed primarily for learning purposes. Please note that many features are still in development and will be continuously improved as the project evolves.
![img.png](img.png)
## Getting Started
---------------

### Prerequisites

* Node.js version 14.15.0

### Installation

1. Clone the repository: `git clone https://github.com/kkkk666/babylon_test.git`
2. Install dependencies: `npm install`
3. Start the development server: `npm run serve`
4. Open your browser and navigate to `http://localhost:8080`

### Build and Deployment

1. Build the project: `npm run build`
2. Deploy the project to your preferred platform

## Project Structure
-----------------

* `src`: Source code for the project
* `public`: Public assets for the project

## Features
--------

### **Project Features**

1. **Theme Switching (Light & Dark Modes)**
    - Users can toggle between light and dark themes. Currently, the dark theme is still under development.

2. **Wallet Connection (In Progress)**
    - A feature for connecting cryptocurrency wallets is under development, allowing users to securely interact with the platform.

3. **Staking Metrics Display**
    - Displays detailed staking information, including:
        - **Total TVL** (Total Value Locked) for staking.
        - **Confirmed TVL** (total value that has been confirmed).
        - **Pending BTC** (amount of Bitcoin currently pending).
        - **Total Delegation Transactions** (the number of delegation transactions).
        - **Number of Staking Addresses** (how many unique addresses have participated in staking).

4. **Finality Providers Information Display**
    - Displays comprehensive information about Finality Providers (FPs), including:
        - **Certified Providers** (marked with a check mark to indicate Babylon certification).
        - **Delegations** (shows the number of delegation transactions for each FP).
        - **Stake** (total amount of BTC staked with a particular FP).

5. **Stake Input & Preview (In Progress)**
    - After connecting a wallet and selecting an FP, users can:
        - Enter the amount of BTC to be staked.
        - Preview a detailed breakdown of the staking information, such as:
            - **Amount of BTC staked**.
            - **Staking duration**.
            - **Staking transaction fees**, and other related details.

6. **Staking History List (In Progress)**
    - Displays a list of all historical staking transactions, along with their respective details and statuses. For each transaction:
        - **Transaction Hash**: Clicking the hash will redirect the user to Mempool for a detailed view of the transaction.
        - **Status**: Displays the current state of the transaction, including:
            - Active, Unbonding Requested, Unbonding, Unbonded, Withdrawn, Pending, Overflow, Expired, Requesting Unbonding, Withdrawal Submitted.
        - **Action**: Displays the relevant actions based on the current status:
            - **Unbond** (available when the status is Active).
            - **Withdraw** (available when the status is Unbonded).
