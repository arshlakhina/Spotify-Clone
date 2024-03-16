let currentSong=new Audio();

function secondsToMinutesSeconds(seconds) {
    // if (isNaN(seconds) || !isFinite(seconds)) {
    //     return "Invalid input"; // Return a message indicating invalid input
    // }

    // const format = val => `0${Math.floor(val)}`.slice(-2)
    // const hours = seconds / 3600
    // const minutes = (seconds % 3600) / 60
  
    // return [minutes, seconds % 60].map(format).join(':')

    if (isNaN(seconds) || seconds<0){
        return "00:00"; //Return '00:00' if the input is not valid}
    }
        const mins = Math.floor(seconds / 60); //CALCULATE MINUTES
        const secs = Math.round(seconds % 60); //Calculate remaining seconds and round it ,calculates the remaining seconds after extracting the minutes and rounds it using Math.round
        const formattedMins = String(mins).padStart(2, "0"); // Format minutes to have leading zeros if needed
        const formattedSecs = String(secs).padStart(2, "0"); //Format seconds to have leading zeros if needed,converts the minutes to a string and ensures it always has at least two characters by adding leading zeros using padStart if needed
        return `${formattedMins}:${formattedSecs}`;
    }


async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}

const playMusic=(track,pause=false)=>{
    currentSong.id = "currentSong";
    currentSong.src="/songs/"+track;
    if(!pause){
        currentSong.play();
        play.src="pause.svg";
    }

    document.querySelector(".song-name").innerHTML=decodeURI(track);
    document.querySelector(".song-time").innerHTML= "00:00 / 00:00";
}

async function main() {

    //get the list of all songs
    let songs = await getSongs();
    // console.log(songs); 

    // playMusic(songs[0],true);

    //show all the songs in the library section
    let songul = document.querySelector(".song-list").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
                          <i class="fa-solid fa-music song-img" style="color: #ffffff;"></i>
                           <div class="song-info">
                                <div class="song-name">${song.replaceAll("%20", " ")}</div>
                                <div>Arsh</div>
                           </div> 
                           <div class="song-play">
                               <i class="fa-regular fa-circle-play" style="color: #ffffff;"></i>
                           </div>
                        </li>`
    }

    //attach an event listener to each song
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",element=>{
            playMusic(e.querySelector(".song-info").firstElementChild.innerHTML.trim());
        })
    })

    //attach an event listener to previous, play and next
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src="pause.svg"
        }
        else
        {
            currentSong.pause();
            play.src="play.svg"
        }
    })

    //listen for timeupdate event
    currentSong.addEventListener("timeupdate",()=>{
        // console.log(currentSong.currentTime,currentSong.duration);
        console.log(document.querySelector(".song-time").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`)
    })

    // console.log(document.getElementsByClassName(".song-name").innerHTML)

    // var audio = new Audio(songs[0]);
    // audio.play();

    //     audio.addEventListener("loadeddata", () => {
    //         let duration = audio.duration;
    //         console.log(duration);
    //     });
}

main();