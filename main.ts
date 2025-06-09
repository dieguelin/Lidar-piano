import { playnote, delay, PianoNotes } from './piano';

async function playSequence() {

    console.log('Starting piano sequence...');
    
    // Play A4
    playnote(PianoNotes.A4);
    
    // Wait 2 seconds
    await delay(200);
    
    // Play E4
    playnote(PianoNotes.E4);
    
    // Wait 1.5 seconds
    await delay(800);
    
    // Play Middle C
    playnote(PianoNotes.C4);
    
    console.log('Sequence complete!');
}

playSequence();