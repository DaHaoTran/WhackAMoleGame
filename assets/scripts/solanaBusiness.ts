import { _decorator, Component, find, Label, Node, Script } from 'cc';
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
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
  private isSending: boolean = false;
  private wallet: any;
  private solanaWeb3: any;
  private accountData: any;
  private lamports_per_sol: any;

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
      await this.loadScript();
      this.lamports_per_sol = solanaWeb3.LAMPORTS_PER_SOL;
  }

  // Ensure the script is loaded before using it
  private loadScript() {
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

  async sendMoney() {
    if(this.isSending == false) {
      this.isSending = true;
      //Token người nhận
      const receiverAddress = "E1mZjPCHRJKed34mFVj7JBvo5sDDaN5mv8GK5qdYK5QR";
      const quantity = 0.02;
      if (quantity != null) {
        // Gọi hàm sendMoney để thực hiện giao dịch 
        await this.signInTransactionAndSendMoney(receiverAddress, quantity);
      } else {
        alert("Canceled operation !");
        this.chestNode.emit('close-chest');
      }
    }
  }

  signInTransactionAndSendMoney(destPubkeyStr, quantity) {
    (async () => {
      const network = "https://api.devnet.solana.com";
      const connection = new solanaWeb3.Connection(network);
      const transaction = new solanaWeb3.Transaction();

      try {
        const lamports = quantity * this.lamports_per_sol;

        const destPubkey = new solanaWeb3.PublicKey(destPubkeyStr);
        const walletAccountInfo = await connection.getAccountInfo(
          this.wallet.publicKey
        );

        const receiverAccountInfo = await connection.getAccountInfo(
          destPubkey
        );

        const instruction = solanaWeb3.SystemProgram.transfer({
          fromPubkey: this.wallet.publicKey,
          toPubkey: destPubkey,
          lamports,
        });
        let trans = await setWalletTransaction(this.wallet.publicKey, instruction, connection);

        let signature = await signAndSendTransaction(
          trans,
          connection
        );
        this.chestNode.emit('open-chest');
        this.isSending = false;
      } catch (e) {
        console.warn("Failed", e);
      }

    })();

    async function setWalletTransaction(publickey, instruction, connection) {
      const transaction = new solanaWeb3.Transaction();
      transaction.add(instruction);
      transaction.feePayer = publickey;
      let hash = await connection.getLatestBlockhash();
      console.log("blockhash", hash);
      transaction.recentBlockhash = hash.blockhash;
      return transaction;
    }
  
    async function signAndSendTransaction(transaction, connection) {
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


