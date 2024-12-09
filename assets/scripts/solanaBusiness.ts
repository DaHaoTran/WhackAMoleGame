import { _decorator, Component, find, Label, Node, Script } from 'cc';
//import {  } from '../../node_modules/@solana/web3.js';
const { ccclass, property } = _decorator;

@ccclass('solanaBusiness')
export class solanaBusiness extends Component {
  @property(Node)
  connectWalletNode: Node = null;
  @property(Node)
  accountLabel: Node = null;
  @property(Node)
  subMenuLabel: Node = null;
  @property(Node)
  subMenuNode: Node = null;
  @property(Node)
  menuNode: Node = null;
  private wallet: any;
  private connection: Connection;
  private publicKey: PublicKey;
  private accountInfo: Connection;
  private accountData: any;
  //private lamports_per_sol: any = solanaWeb3.LAMPORTS_PER_SOL;

  protected start(): void {
    //Lấy các node
    this.connectWalletNode = find('Menu/connectWalletButton');
    this.accountLabel = find('Menu/accountLabel');
    this.subMenuLabel = find('Menu/SubMenu/Label');
    this.subMenuNode = find('Menu/SubMenu');
    this.menuNode = find('Menu');
  }

  async onLoad() {
      //Khai báo với Solana Web3.js
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
      //Kiểm tra ví hợp lệ
      if (!window.solana || !window.solana.isPhantom) {
        if(this.subMenuLabel) {this.subMenuLabel.getComponent(Label).string = 'Wallet must be phatom, please installed phantom wallet and try again !';}
        if(this.subMenuNode) {this.subMenuNode.active = true;}
        setTimeout(() => {
          this.subMenuLabel.getComponent(Label).string = '';
          this.subMenuNode.active = false; 
        }, 1500);
        return;
      }
      //Kết nối ví
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
        this.menuNode.emit('connected-wallet')
      )
    );
  }
}

declare global {
  interface Window {
    solana: any;
  }
}


