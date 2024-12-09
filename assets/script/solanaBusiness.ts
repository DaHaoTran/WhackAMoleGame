import { _decorator, Component, find, Label, Node, Script } from 'cc';
//import {  } from '../../node_modules/@solana/web3.js';
const { ccclass, property } = _decorator;

@ccclass('solanaBusiness')
export class solanaBusiness extends Component {
  @property(Node)
  connectWalletNode: Node;
  @property(Node)
  accountLabel: Node;
  private wallet: any;
  //private lamports_per_sol: any = solanaWeb3.LAMPORTS_PER_SOL;

  protected start(): void {
    this.connectWalletNode = find('Menu/connectWalletButton');
    this.accountLabel = find('Menu/accountLabel');
  }

  async onLoad() {
      await this.loadSolanaWeb3Script();
  }

  // Ensure the script is loaded before using it
  private loadSolanaWeb3Script() {
      return new Promise<void>(async (resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/@solana/web3.js@v1.33.0/lib/index.iife.js";
          script.type = "text/javascript";
          script.async = true;
          script.onload = () => {
              console.log("Solana Web3.js loaded successfully.");
              resolve();
          };
          script.onerror = (error) => {
              console.error("Failed to load Solana Web3.js:", error);
              reject(error);
          };
          document.head.appendChild(script);
      });
  }

  connectWallet() {
    (async () => {
      try {
        this.wallet = await window.solana.connect();
      } catch (err) {
        console.log(err);
      }
    })();
    window.solana.on(
      "connect",
      () => (
        this.connectWalletNode.active = false,
        this.accountLabel.getComponent(Label).string = "Hi, " + this.wallet.publicKey.toString()
      )
    );
  }
}

declare global {
  interface Window {
    solana: any;
  }
}


