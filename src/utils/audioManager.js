import { Audio } from 'expo-av';

class AudioManager {
  constructor() {
    this.sounds = {};
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

// Load sound files
      await this.loadSound('move', require('../assets/sounds/move.wav'));
      await this.loadSound('win', require('../assets/sounds/win.wav'));
      await this.loadSound('lose', require('../assets/sounds/lose.wav'));
      await this.loadSound('powerup', require('../assets/sounds/powerup.wav'));
      await this.loadSound('key', require('../assets/sounds/key.wav'));

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }

  async loadSound(name, source) {
    try {
      const { sound } = await Audio.Sound.createAsync(source, {
        shouldPlay: false,
        isLooping: false,
      });
      this.sounds[name] = sound;
    } catch (error) {
      console.error(`Error loading sound ${name}:`, error);
    }
  }

  async playSound(name, volume = 1.0) {
    if (!this.isInitialized || !this.sounds[name]) return;

    try {
      await this.sounds[name].setVolumeAsync(volume);
      await this.sounds[name].replayAsync();
    } catch (error) {
      console.error(`Error playing sound ${name}:`, error);
    }
  }

  async cleanup() {
    Object.values(this.sounds).forEach(async (sound) => {
      try {
        await sound.unloadAsync();
      } catch (error) {
        console.error('Error unloading sound:', error);
      }
    });
    this.sounds = {};
    this.isInitialized = false;
  }
}

export default new AudioManager();
