# Cross-Chain Actions with Across on Scroll

## Overview
This project demonstrates how to utilize Across for seamless cross-chain actions on the Scroll network. Users can input an amount of USDC from any source chain and bridge it directly into Aave, showcasing the potential of cross-chain finance.

While this example is straightforward, the underlying code can be extended to facilitate more complex contract interactions, effectively abstracting away the complexity of cross-chain UX.

## Technologies Used
- [Across](https://across.to) for briding user funds and executing onchain transactions.
- [Scroll](https://scroll.io/) extends Ethereum’s capabilities through zero knowledge tech and EVM compatibility.
- [Privy](https://www.privy.io/) for secure wallet connections.
- [Wagmi](https://wagmi.sh/) for React hooks to interact with Ethereum.

## Environment Variables
To run this project, you need to set up the following environment variable:

- `NEXT_PUBLIC_PRIVY_APP_ID`: Your Privy application ID. This is required for wallet connection functionality.

### Setting Up Environment Variables
1. Create a `.env` file in the root of your project.
2. Add the following line to the file:

   ```plaintext
   NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
   ```

3. Replace `your_privy_app_id_here` with your actual Privy application ID.

## Documentation
For more information on Across, please refer to the official documentation [here](https://docs.across.to/).

## Contact
Feel free to reach out to me on [Twitter](https://x.com/againes_) for any questions or feedback.