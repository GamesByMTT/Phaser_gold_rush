import Phaser from "phaser";
import { Globals } from "./Globals";
import { gameConfig } from "./appconfig";
import { UiContainer } from "./UiContainer";
import SoundManager from "./SoundManager";
import InfoScene from "./infoPopup";

export class UiPopups extends Phaser.GameObjects.Container {
    SoundManager: SoundManager;
    UiContainer: UiContainer
    menuBtn!: InteractiveBtn;
    settingBtn!: InteractiveBtn;
    rulesBtn!: InteractiveBtn;
    infoBtn!: InteractiveBtn;
    exitBtn!: InteractiveBtn
    yesBtn!: InteractiveBtn;
    noBtn!: InteractiveBtn
    isOpen: boolean = false;
    settingClose!: InteractiveBtn;
    soundEnabled: boolean = true; // Track sound state
    musicEnabled: boolean = true; // Track sound state

    constructor(scene: Phaser.Scene, uiContainer: UiContainer, soundManager: SoundManager) {
        super(scene);
        this.setPosition(0, 0);
        // this.ruleBtnInit();
        this.settingBtnInit();
        this.menuBtnInit();
        this.exitButton();
        this.infoBtnInit();
        this.UiContainer = uiContainer
        this.SoundManager = soundManager
        scene.add.existing(this);
    }

    menuBtnInit() {
        const menuBtnTextures = [
            this.scene.textures.get('MenuBtn'),
            this.scene.textures.get('MenuBtnH')
        ];
        this.menuBtn = new InteractiveBtn(this.scene, menuBtnTextures, () => {
            this.buttonMusic("buttonpressed")
            this.openPopUp();
        }, 0, true);
        this.menuBtn.setPosition( gameConfig.scale.width / 1.05, gameConfig.scale.height / 1.11 );
        this.add(this.menuBtn);
    }
    exitButton(){
        const exitButtonSprites = [
            this.scene.textures.get('exitButton'),
            this.scene.textures.get('exitButton')
        ];
        this.exitBtn = new InteractiveBtn(this.scene, exitButtonSprites, ()=>{
                this.buttonMusic("buttonpressed")
                this.openLogoutPopup();
        }, 0, true, );
        this.exitBtn.setPosition(gameConfig.scale.width / 1.22 , gameConfig.scale.height / 6.5);
        this.exitBtn.setScale(1.2)
        this.add(this.exitBtn)
    }
    
    settingBtnInit() {
        const settingBtnSprites = [
            this.scene.textures.get('settingBtn'),
            this.scene.textures.get('settingBtnH')
        ];
        this.settingBtn = new InteractiveBtn(this.scene, settingBtnSprites, () => {
            this.buttonMusic("buttonpressed")
            // setting Button
            this.openSettingPopup();
        }, 1, false); // Adjusted the position index
        this.settingBtn.setPosition(gameConfig.scale.width - this.settingBtn.width * 2, gameConfig.scale.height/2);
        this.settingBtn.setScale(0.9)
        this.add(this.settingBtn);
    }

    infoBtnInit() {
        const infoBtnSprites = [
            this.scene.textures.get('infoBtn'),
            this.scene.textures.get('infoBtnH'),
        ];
        this.infoBtn = new InteractiveBtn(this.scene, infoBtnSprites, () => {
            // info button 
            this.buttonMusic("buttonpressed")
            this.openPage();
        }, 2, false); // Adjusted the position index
        this.infoBtn.setPosition(gameConfig.scale.width/ 2 - this.infoBtn.width * 5, this.infoBtn.height * 0.7).setScale(0.8);
        this.add(this.infoBtn);
    }

    openPopUp() {
        // Toggle the isOpen boolean
        this.isOpen = !this.isOpen;
        this.menuBtn.setInteractive(false);
        if (this.isOpen) {
            this.tweenToPosition(this.settingBtn, 1);
            this.tweenToPosition(this.infoBtn, 2);
        } else {
            this.tweenBack(this.settingBtn);
            this.tweenBack(this.infoBtn);
        }
    }

    tweenToPosition(button: InteractiveBtn, index: number) {
        const targetY =  this.menuBtn.y - (index * (this.menuBtn.height))
       // Calculate the x position with spacing
       button.setPosition(this.menuBtn.x, this.menuBtn.y)
        button.setVisible(true);
        this.scene.tweens.add({
            targets: button,
            y: targetY,
            duration: 300,
            ease: 'Elastic',
            easeParams: [1, 0.9],
            onComplete: () => {
                button.setInteractive(true);
                this.menuBtn.setInteractive(true);
            }
        });
    }
    tweenBack(button: InteractiveBtn) {
        button.setInteractive(false);
        this.scene.tweens.add({
            targets: button,
            y: button,
            duration: 100,
            ease: 'Elastic',
            easeParams: [1, 0.9],
            onComplete: () => {
                button.setVisible(false);
                this.menuBtn.setInteractive(true);
            }
        });
    }

    openPage() {
        Globals.SceneHandler?.addScene("InfoScene", InfoScene, true)
    }
   
    /**
     * 
     */
    openSettingPopup() {
        const inputOverlay = this.scene.add.rectangle(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height, 0x000000, 0.8)
            .setOrigin(0, 0)
            .setDepth(16)
            .setInteractive();
    
        inputOverlay.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            pointer.event.stopPropagation();
        });
    
        const numSteps = 10; // 10 steps for 0.0 to 1.0
        let soundOn = this.SoundManager.getMasterVolume() > 0;
        let musicOn = this.SoundManager.getSoundVolume("backgroundMusic") > 0;
    
        const infopopupContainer = this.scene.add.container(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2
        ).setDepth(17); // Set depth higher than inputOverlay

         // Create scrollbar container
        const popupBg = this.scene.add.image(0, 0, 'settingHeading').setDepth(13);
        const soundsImage = this.scene.add.text(-170, -120, "SOUNDS", {color:"#db5b01", fontSize: "50px", fontFamily: 'RobotoSlab', align:"center"}).setDepth(10).setScale(0.7);
        const musicImage = this.scene.add.text(-170, 80, "MUSIC", {color:"#db5b01", fontSize: "50px", fontFamily: 'RobotoSlab', align:"center"}).setDepth(10).setScale(0.7);
        const SountoggleBg = this.scene.add.image(150, -100, "SoundToggleBg").setScale(0.7)
        const musicToggleBg = this.scene.add.image(150, 100, "SoundToggleBg").setScale(0.7)

        const soundToggleButton = this.scene.add.image(150, -100, soundOn ? 'toggleOn' : 'toggleOff')
            .setInteractive()
            .setOrigin(0.5)
            .setScale(0.7);
        const musicToggleButton = this.scene.add.image(150, 100, musicOn ? 'toggleOn' : 'toggleOff')
            .setInteractive()
            .setOrigin(0.5)
            .setScale(0.7);

        soundToggleButton.on('pointerdown', () => {
            soundOn = !soundOn;
            this.adjustSoundVolume(soundOn ? 1 : 0); // Assuming 1 is full volume
            soundToggleButton.setTexture(soundOn ? 'toggleOn' : 'toggleOff');
        });

        musicToggleButton.on('pointerdown', () => {
            musicOn = !musicOn;
            this.adjustMusicVolume(musicOn ? 1 : 0); // Assuming 1 is full volume
            musicToggleButton.setTexture(musicOn ? 'toggleOn' : 'toggleOff');
        });

        const exitButtonSprites = [
            this.scene.textures.get('exitButton'),
            this.scene.textures.get('exitButton')
        ];
        
        this.settingClose = new InteractiveBtn(this.scene, exitButtonSprites, () => {
            infopopupContainer.destroy();
            inputOverlay.destroy();
            inputOverlay.destroy();
            this.buttonMusic("buttonpressed");
        }, 0, true);
        
        this.settingClose.setPosition(280, -235).setScale(0.8);
    
        popupBg.setOrigin(0.5);
        popupBg.setScale(0.9);
        popupBg.setAlpha(1);
        
        infopopupContainer.add([popupBg, this.settingClose, SountoggleBg, soundsImage, musicToggleBg, musicImage, soundToggleButton, musicToggleButton,]);
    }

   // Function to adjust sound volume
    adjustSoundVolume(level: number) {
        console.log("level check sound", level);
        this.SoundManager.setMasterVolume(level);
    }

    // Function to adjust music volume
    adjustMusicVolume(level: number) {
        console.log("level check music", level);
        this.SoundManager.setVolume("backgroundMusic", level);
    }
    
    buttonMusic(key: string){
        this.SoundManager.playSound(key)
    }

    /**
     * @method openLogoutPopup
     * @description creating an container for exitPopup 
     */
    openLogoutPopup() {
        // Create a semi-transparent background for the popup
        const blurGraphic = this.scene.add.graphics().setDepth(1); // Set depth lower than popup elements
        blurGraphic.fillStyle(0x000000, 0.7); // Black with 50% opacity
        blurGraphic.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height); // Cover entire screen
        
        this.UiContainer.onSpin(true);
        // Create a container for the popup
        const popupContainer = this.scene.add.container(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2
        ).setDepth(1); // Set depth higher than blurGraphic
    
        // Popup background image
        const popupBg = this.scene.add.image(0, 0, 'messagePopup').setDepth(10);
        popupBg.setOrigin(0.5);
        popupBg.setDisplaySize(900, 671); // Set the size for your popup background
        popupBg.setAlpha(1); // Set background transparency
        this.exitBtn.disableInteractive();

        const quitHeading = this.scene.add.text(-130, -150, "QUIT GAME", {color:"#db5b01", fontSize: "50px", fontFamily: 'RobotoSlab', align:"center" })
        // Add text to the popup
        const popupText = this.scene.add.text(-200, -50, "DO YOU REALLY WANT \n TO QUIT?", {color:"#935a49", fontSize: "40px", fontFamily: 'RobotoSlab', align:"center" });
        
        // Yes and No buttons
        const logoutButtonSprite = [
            this.scene.textures.get("yesButton"),
            this.scene.textures.get("yesButtonHover")
        ];
        this.yesBtn = new InteractiveBtn(this.scene, logoutButtonSprite, () => {
            
            this.UiContainer.onSpin(false);
            popupContainer.destroy();
            blurGraphic.destroy(); // Destroy blurGraphic when popup is closed
            window.parent.postMessage("onExit", "*");   
            Globals.Socket?.socket.emit("EXIT", {});
        }, 0, true);
        const logoutNoButtonSprite = [
            this.scene.textures.get("noButton"),
            this.scene.textures.get("noButtonHover")
        ];
        this.noBtn = new InteractiveBtn(this.scene, logoutNoButtonSprite, () => {
            this.UiContainer.onSpin(false);
            this.exitBtn.setInteractive()
            popupContainer.destroy();
            blurGraphic.destroy(); // Destroy blurGraphic when popup is closed
        }, 0, true);
        // const yesText = this.scene.add.text(-130, 140, "YES", {color:"#000000", fontFamily:"RobotoSlab", fontSize:"30px"}).setOrigin(0.5)
        // const noText = this.scene.add.text(130, 140, "NO", {color:"#000000", fontFamily:"RobotoSlab", fontSize:"30px"}).setOrigin(0.5)
        this.yesBtn.setPosition(-130, 150).setScale(0.8, 0.8);
        this.noBtn.setPosition(130, 150).setScale(0.8, 0.8);
       
        // Add all elements to popupContainer
        popupContainer.add([popupBg, popupText, quitHeading, this.yesBtn, this.noBtn]);
        // Add popupContainer to the scene
        this.scene.add.existing(popupContainer);       
    }
    
    buttonInteraction(press: boolean){
        if(press){
            this.menuBtn.disableInteractive();
            this.settingBtn.disableInteractive()
            this.rulesBtn.disableInteractive();
            this.menuBtn.disableInteractive();
        }
    }
}

class InteractiveBtn extends Phaser.GameObjects.Sprite {
    moveToPosition: number = -1;
    defaultTexture!: Phaser.Textures.Texture;
    hoverTexture!: Phaser.Textures.Texture

    constructor(scene: Phaser.Scene, textures: Phaser.Textures.Texture[], callback: () => void, endPos: number, visible: boolean) {
        super(scene, 0, 0, textures[0].key); // Use texture key
        this.defaultTexture = textures[0];
        this.hoverTexture = textures[1];        
        this.setOrigin(0.5);
        this.setInteractive();
        this.setVisible(visible);
        this.moveToPosition = endPos;
        this.on('pointerdown', () => {
            this.setTexture(this.hoverTexture.key)
            // this.setFrame(1);
            callback();
        });
        this.on('pointerup', () => {
            this.setTexture(this.defaultTexture.key)
            // this.setFrame(0);
        });
        this.on('pointerout', () => {
            this.setTexture(this.defaultTexture.key)
            // this.setFrame(0);
        });
        // Set up animations if necessary
        this.anims.create({
            key: 'hover',
            frames: this.anims.generateFrameNumbers(textures[1].key),
            frameRate: 10,
            repeat: -1
        });
    }
}