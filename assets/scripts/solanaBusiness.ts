import { _decorator, Component, find, Label, Node, Script } from 'cc';
import * as solanaWeb3 from '@solana/web3.js';
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
  @property(Node)
  chestNode: Node = null;
  private wallet: any;
  private lamports_per_sol: any = solanaWeb3.LAMPORTS_PER_SOL;
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
    this.chestNode = find('Select/Chest');
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

  sendMoney() {
    //Token người nhận
    const receiverAddress = "E1mZjPCHRJKed34mFVj7JBvo5sDDaN5mv8GK5qdYK5QR";
    const quantity = 0.02;
    if (quantity != null) {
      (async () => {
        try {
          await this.signInTransactionAndSendMoney(receiverAddress, quantity);
          this.chestNode.emit('open-chest');
        } catch (e) {
          console.warn("Failed", e);
          this.chestNode.emit('close-chest');
        }
      })
    } else {
      alert("Canceled operation !");
      this.chestNode.emit('close-chest');
    }
  }

  private signInTransactionAndSendMoney(destPubkeyStr:string, quantity: number) {
    (async () => {
      const network = "https://api.devnet.solana.com";
      const connection = new solanaWeb3.Connection(network);
      const transaction = new solanaWeb3.Transaction();

      try {
        const lamports = quantity * this.lamports_per_sol;

        console.log("starting sendMoney");
        const destPubkey = new solanaWeb3.PublicKey(destPubkeyStr);
        const walletAccountInfo = await connection.getAccountInfo(
          this.wallet.publicKey
        );
        console.log("wallet data size", walletAccountInfo?.data.length);

        const receiverAccountInfo = await connection.getAccountInfo(
          destPubkey
        );
        console.log("receiver data size", receiverAccountInfo?.data.length);

        const instruction = solanaWeb3.SystemProgram.transfer({
          fromPubkey: this.wallet.publicKey,
          toPubkey: destPubkey,
          lamports,
        });
        let trans = await setWalletTransaction(instruction, connection);

        let signature = await signAndSendTransaction(
          this.wallet,
          trans,
          connection
        );

      } catch (e) {
        console.warn("Failed", e);
      }

    })();

    async (instruction: any, connection: any) => {
      const transaction = new solanaWeb3.Transaction();
      transaction.add(instruction);
      transaction.feePayer = this.wallet.publicKey;
      let hash = await connection.getRecentBlockhash();
      console.log("blockhash", hash);
      transaction.recentBlockhash = hash.blockhash;
      return transaction;
    }

    async function signAndSendTransaction(wallet: any, transaction: any, connection: any) {
      // Sign transaction, broadcast, and confirm
      const { signature } = await window.solana.signAndSendTransaction(
        transaction
      );
      await connection.confirmTransaction(signature);
      return signature;
    }
  }
}

declare global {
  interface Window {
    solana: any;
  }
}


