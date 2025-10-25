import { expect } from "chai";
import { ethers } from "hardhat";
import { VTS } from "../typechain-types";

describe("VTS Token", function () {
  let vts: VTS;
  let owner: any;
  let addr1: any;
  let addr2: any;
  
  const TOTAL_SUPPLY = ethers.parseEther("1000000"); // 1,000,000 VTS
  
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const VTS = await ethers.getContractFactory("VTS");
    vts = await VTS.deploy();
  });
  
  describe("Déploiement", function () {
    it("Devrait avoir le bon nom", async function () {
      expect(await vts.name()).to.equal("Veritas Token");
    });
    
    it("Devrait avoir le bon symbole", async function () {
      expect(await vts.symbol()).to.equal("VTS");
    });
    
    it("Devrait avoir 18 décimales", async function () {
      expect(await vts.decimals()).to.equal(18);
    });
    
    it("Devrait avoir le bon supply total", async function () {
      expect(await vts.totalSupply()).to.equal(TOTAL_SUPPLY);
    });
    
    it("Devrait donner tout le supply au déployeur", async function () {
      expect(await vts.balanceOf(owner.address)).to.equal(TOTAL_SUPPLY);
    });
  });
  
  describe("Transferts", function () {
    const transferAmount = ethers.parseEther("1000"); // 1,000 VTS
    
    it("Devrait permettre les transferts", async function () {
      await vts.transfer(addr1.address, transferAmount);
      expect(await vts.balanceOf(addr1.address)).to.equal(transferAmount);
    });
    
    it("Devrait mettre à jour les balances après transfert", async function () {
      const initialBalance = await vts.balanceOf(owner.address);
      
      await vts.transfer(addr1.address, transferAmount);
      
      expect(await vts.balanceOf(owner.address)).to.equal(initialBalance - transferAmount);
      expect(await vts.balanceOf(addr1.address)).to.equal(transferAmount);
    });
    
    it("Devrait émettre l'événement Transfer", async function () {
      await expect(vts.transfer(addr1.address, transferAmount))
        .to.emit(vts, "Transfer")
        .withArgs(owner.address, addr1.address, transferAmount);
    });
    
    it("Devrait échouer si le solde est insuffisant", async function () {
      const insufficientAmount = TOTAL_SUPPLY + ethers.parseEther("1");
      
      await expect(vts.transfer(addr1.address, insufficientAmount))
        .to.be.revertedWithCustomError(vts, "ERC20InsufficientBalance")
        .withArgs(owner.address, TOTAL_SUPPLY, insufficientAmount);
    });
  });
  
  describe("Approbations", function () {
    const approveAmount = ethers.parseEther("500"); // 500 VTS
    
    it("Devrait permettre l'approbation", async function () {
      await vts.approve(addr1.address, approveAmount);
      expect(await vts.allowance(owner.address, addr1.address)).to.equal(approveAmount);
    });
    
    it("Devrait émettre l'événement Approval", async function () {
      await expect(vts.approve(addr1.address, approveAmount))
        .to.emit(vts, "Approval")
        .withArgs(owner.address, addr1.address, approveAmount);
    });
    
    it("Devrait permettre transferFrom après approbation", async function () {
      await vts.approve(addr1.address, approveAmount);
      
      await vts.connect(addr1).transferFrom(owner.address, addr2.address, approveAmount);
      
      expect(await vts.balanceOf(addr2.address)).to.equal(approveAmount);
      expect(await vts.allowance(owner.address, addr1.address)).to.equal(0);
    });
  });
  
  describe("Fonctions ERC-20", function () {
    it("Devrait retourner le bon supply total", async function () {
      expect(await vts.totalSupply()).to.equal(TOTAL_SUPPLY);
    });
    
    it("Devrait maintenir le supply total constant", async function () {
      const initialSupply = await vts.totalSupply();
      
      // Effectuer quelques transferts
      await vts.transfer(addr1.address, ethers.parseEther("1000"));
      await vts.transfer(addr2.address, ethers.parseEther("2000"));
      
      expect(await vts.totalSupply()).to.equal(initialSupply);
    });
  });
  
  describe("Edge Cases", function () {
    it("Devrait gérer les transferts de 0", async function () {
      await expect(vts.transfer(addr1.address, 0))
        .to.emit(vts, "Transfer")
        .withArgs(owner.address, addr1.address, 0);
    });
    
    it("Devrait gérer les approbations de 0", async function () {
      await expect(vts.approve(addr1.address, 0))
        .to.emit(vts, "Approval")
        .withArgs(owner.address, addr1.address, 0);
    });
    
    it("Devrait gérer les transferts vers l'adresse zéro", async function () {
      await expect(vts.transfer(ethers.ZeroAddress, ethers.parseEther("1")))
        .to.be.revertedWithCustomError(vts, "ERC20InvalidReceiver")
        .withArgs(ethers.ZeroAddress);
    });
  });
});
