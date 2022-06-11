/*Player*/
const SongLine = document.querySelectorAll(".Song_setting_range");
const SongPlay = document.querySelectorAll(".Song_Play");
const SVGplay = document.querySelectorAll(".Play");
const SVGpause = document.querySelectorAll(".Pause");
const Musics = document.querySelector(".AudioMus")
const TimeSongCurrent = document.querySelectorAll(".Time_Song_Current")
const TimeSong = document.querySelectorAll(".Time_Song")
const TrackListItem = document.querySelectorAll(".Tracks_about_list>li")
const TrackListItemActive = document.querySelectorAll(".Tracks_about_list>li>p")
const TrackList = document.querySelectorAll(".Track_List")
let MoveSong = false;
let MusicPlay = false;
let ColorRange = "#7A66CC"
let CurrentValue = 0;
let CurrentTrack = TrackList[0];
let TimerFrameTrack;
let PlayerfistPlay = false;
let PlayerSecondPlay = false;
Musics.volume=0.2;
for (let i = 0; i < TrackList.length; i++) {
    TrackList[i].volume=0.2
    
}
function SetTime(ClassTime, TimeValue) {
    let min = Math.floor(TimeValue / 60);
    let sec = Math.trunc(TimeValue - min * 60)
    min < 10 ?
        ClassTime.innerHTML = `0${min}:` :
        ClassTime.innerHTML = `${min}:`

    sec < 10 ?
        ClassTime.innerHTML = ClassTime.innerHTML + `0${sec}` :
        ClassTime.innerHTML = ClassTime.innerHTML + `${sec}`
}
Musics.addEventListener('loadedmetadata', () => {
    SongLine[0].max = Math.floor(Musics.duration);
    SetTime(TimeSong[0], Musics.duration);
})
TrackList[0].addEventListener('loadedmetadata', () => {
    SongLine[1].max = Math.floor(TrackList[0].duration);
    SetTime(TimeSong[1], TrackList[0].duration);
})
function CurrentTimeLine(value, max, index, CurrentMusic) {
    let Current = (value * 100) / max;
    if (Current < 0.5) return 0;
    if (Math.trunc(CurrentMusic.duration) === Math.trunc(CurrentMusic.currentTime)) {
        index === 0 ? PlayerfistPlay = false : PlayerSecondPlay = false;
        MusicPlay = false;
        SVGplay[index].style.display = "block";
        SVGpause[index].style.display = "none";
        Current = 100;
        return Current;
    }
    return Current;
}

SongLine.forEach((e, index) => {
    e.addEventListener("input", () => {
        CurrentValue = CurrentTimeLine(e.value, e.max, index, index === 0 ? Musics : CurrentTrack);
        SetTime(TimeSongCurrent[index], e.value);
        e.style.background = `linear-gradient(to right ,${ColorRange} 0%,${ColorRange} ${CurrentValue}%, white ${CurrentValue}%, white 100%)`
        MoveSong = true
    })
})
SongLine.forEach((e, index) => {
    e.addEventListener("click", () => {

        index === 0 ? Musics.currentTime = e.value : CurrentTrack.currentTime = e.value
        CurrentValue = CurrentTimeLine(e.value, e.max, index, index === 0 ? Musics : CurrentTrack);
        SetTime(TimeSongCurrent[index], e.value);
        e.style.background = `linear-gradient(to right ,${ColorRange} 0%,${ColorRange} ${CurrentValue}%, white ${CurrentValue}%, white 100%)`
        MoveSong = false;

    })
})
SongPlay.forEach((e, index) => {
    e.addEventListener("click", function MusicStart () {
        if (!MusicPlay) {
            if (CurrentValue === 100) {
                SongLine[index].value = 0;
                CurrentValue = CurrentTimeLine(SongLine[index].value, SongLine[index].max, index, index === 0 ? Musics : CurrentTrack);
                SetTime(TimeSongCurrent[index], SongLine[index].value);
                SongLine[index].style.background = `linear-gradient(to right ,${ColorRange} 0%,${ColorRange} ${CurrentValue}%, white ${CurrentValue}%, white 100%)`;
            }
            if(index === 0)
            {
                Musics.play();
                PlayerfistPlay = true

            } else
            { CurrentTrack.play();
                PlayerSecondPlay=true;
            }
            MusicPlay = true;
            SVGplay[index].style.display = "none";
            SVGpause[index].style.display = "block";
            _MusicPlay(SongLine[index], TimeSongCurrent[index], index, index === 0 ? Musics : CurrentTrack)

        } else {
            clearTimeout(TimerFrameTrack);
            MusicPlay = false;
            if (index === 0) {
                if (PlayerSecondPlay) {
                    PlayerSecondPlay = false;
                    SVGplay[1].style.display = "block";
                    SVGpause[1].style.display = "none";
                    CurrentTrack.pause();
                    MusicStart();
                }
                else
                {
                    PlayerfistPlay = false
                    Musics.pause();
                    SVGplay[index].style.display = "block";
                    SVGpause[index].style.display = "none";
                }

            } else {
                if (PlayerfistPlay) {
                    PlayerfistPlay = false;
                    SVGplay[0].style.display = "block";
                    SVGpause[0].style.display = "none";
                    Musics.pause();
                    MusicStart();
                }
                else
                {
                    PlayerSecondPlay = false
                    CurrentTrack.pause();
                    SVGplay[index].style.display = "block";
                    SVGpause[index].style.display = "none";
                }
            }

        }

    })
})
TrackListItem.forEach((e, index) => {
    e.addEventListener("click", () => {
        _ClearTrack();
        for (let i = 0; i < TrackListItemActive.length; i++) {
            if (index === i) TrackListItemActive[i].classList.add("Active");
            else TrackListItemActive[i].classList.remove("Active");
        }
        _StartTrack(index);
    })
})
function _MusicPlay(_SongLine, _TimeSongCurrent, index, _Music) {

    if (MusicPlay) {
        TimerFrameTrack = setTimeout(() => {
            if (!MoveSong && CurrentValue < 100) {
                _SongLine.value = _Music.currentTime;
                CurrentValue = CurrentTimeLine(_SongLine.value, _SongLine.max, index, _Music);
                SetTime(_TimeSongCurrent, _SongLine.value);
                _SongLine.style.background = `linear-gradient(to right ,${ColorRange} 0%,${ColorRange} ${CurrentValue}%, white ${CurrentValue}%, white 100%)`;
            }
            _MusicPlay(_SongLine, _TimeSongCurrent, index, _Music);
        }, 1000);
    }
}
function _ClearTrack() {
    if (MusicPlay) clearTimeout(TimerFrameTrack);
    if (PlayerfistPlay) {
        PlayerfistPlay = false;
        SVGplay[0].style.display = "block";
        SVGpause[0].style.display = "none";
        Musics.pause();
    }
    CurrentValue = 0;
    MusicPlay = false;
    CurrentTrack.pause();
    CurrentTrack.currentTime = 0;
    TimeSongCurrent[1].innerHTML = "00:00";
    SongLine[1].style.background = ""
    SongLine[1].value = 0;
}
function _StartTrack(IndexTrack) {
    SongLine[1].max = Math.floor(TrackList[IndexTrack].duration);
    SetTime(TimeSong[1], TrackList[IndexTrack].duration);
    CurrentTrack = TrackList[IndexTrack];
    CurrentTrack.play();
    MusicPlay = true;
    PlayerSecondPlay=true;
    SVGplay[1].style.display = "none";
    SVGpause[1].style.display = "block";
    _MusicPlay(SongLine[1], TimeSongCurrent[1], 1, CurrentTrack)

}
/*Heder move*/
const HederTop=document.querySelector(".Header_sub_top");
window.addEventListener("scroll",()=>
{
 
        if(window.pageYOffset>0)HederTop.classList.add("Active");
        else HederTop.classList.remove("Active")
   
})
/*Heder Burger*/
const BurgerNavItem=document.querySelectorAll(".Header_Navigation_mob>ul>li");
const BurgerMenu=document.querySelector(".Header_Navigation_Burger");
const BurgerNavMenu=document.querySelector(".Header_Navigation_mob");
BurgerMenu.addEventListener("click",()=>
{
    BurgerNavMenu.classList.toggle("Active")
})
BurgerNavItem.forEach(e=>
    {
        e.addEventListener("click",(event)=>
        {
            event.stopPropagation();
            BurgerNavMenu.classList.remove("Active")
        })
    })
/*Image_swap*/
const AuthorImgItem = document.querySelectorAll(".Author_About_img_item");
const AuthorImg = document.querySelectorAll(".Author_About_img_item>img");
function SwapFist()
{
    AuthorImgItem[0].className = "Author_About_img_item fist";
    AuthorImgItem[1].className = "Author_About_img_item second";
    AuthorImg[0].className = "second";
    AuthorImg[1].className = "fist";
}
function SwapSecond()
{
    AuthorImgItem[0].className = "Author_About_img_item second";
    AuthorImgItem[1].className = "Author_About_img_item fist";
    AuthorImg[0].className = "fist";
    AuthorImg[1].className = "second";
}

/*popup Image*/
const ImgGallery=document.querySelectorAll(".grid_item");
const ImgGalleryPopup=document.querySelectorAll(".Gallery_PopUp");
const ImgPopup=document.querySelectorAll(".Gallery_PopUp_img>img");
const ClosePopup=document.querySelectorAll(".PopUp_close");
ClosePopup.forEach((e,index)=>
{
    e.addEventListener("click",(event)=>
    {
        event.stopPropagation();
        ImgGalleryPopup[index].classList.add("close")
        document.body.removeAttribute("style");
        setTimeout(()=>
        {
            ImgGalleryPopup[index].classList.remove("close")
            ImgGalleryPopup[index].classList.remove("Active")
        },500)
        
    })
})
ImgGalleryPopup.forEach((e)=>
{
    e.addEventListener("click",(event)=>
    {
        event.stopPropagation();
        e.classList.add("close")
        document.body.removeAttribute("style");
        setTimeout(()=>
        {
            e.classList.remove("close")
            e.classList.remove("Active")
        },500)
        
    })
})
ImgPopup.forEach((e)=>
{
    e.addEventListener("click",(event)=>
    {
        event.stopPropagation();
})})
ImgGallery.forEach((e,index)=>
    {
        e.addEventListener("click",(event)=>{
            event.stopPropagation();
            ImgGalleryPopup[index].classList.add("Active")
            document.body.style.overflow="hidden";
        })
    });
/*Slide*/
const LeftButton=document.querySelector(".Tickets_button.left")
const RightButton=document.querySelector(".Tickets_button.right")
const SlideTrain=document.querySelector(".Tickets_slide_train")
const Slideitem=document.querySelector(".Tickets_slide_item")
let SizeMove=parseInt(getComputedStyle(Slideitem).minWidth)+parseInt(getComputedStyle(Slideitem).marginRight);
let CanIswap=true;
let CountSlideVivew=3;
LeftButton.addEventListener("click",()=>{  
    if(CanIswap)
    {
        if (parseInt(getComputedStyle(SlideTrain).left)<0)
       { SlideTrain.style.left = `${parseInt(getComputedStyle(SlideTrain).left)+SizeMove}px`;
    CanIswap=false
    setTimeout(()=>{
        CanIswap=true
    },800)}
}
})
RightButton.addEventListener("click",()=>{
    if(CanIswap)
    {
        if((parseInt(getComputedStyle(SlideTrain).left)*-1)+CountSlideVivew*SizeMove<parseInt(getComputedStyle(SlideTrain).width))
       { SlideTrain.style.left = `${parseInt(getComputedStyle(SlideTrain).left)-SizeMove}px`;
        CanIswap=false
        setTimeout(()=>{
            CanIswap=true
        },800)
    }
    }
  
})
/*WidthScreen*/
function SetSizeSpace()
{
    if (window.screen.width<=1280 && window.screen.width>912)
    {CountSlideVivew=2;
    SizeMove=parseInt(getComputedStyle(Slideitem).minWidth)+parseInt(getComputedStyle(Slideitem).marginRight);
    }
    if (window.screen.width<=979)
    {
        AuthorImgItem[1].removeAttribute("style");
        AuthorImgItem[0].removeEventListener("click", SwapFist);
        AuthorImgItem[1].removeEventListener("click", SwapSecond);
    }
    else  if (window.screen.width>979)
    {
        AuthorImgItem[0].addEventListener("click", SwapFist)
        AuthorImgItem[1].addEventListener("click", SwapSecond)
        AuthorImgItem[1].style.cssText="top:66px;left:95px;z-index:-2;background-color: rgba(0,0,0,0.7);"
    }

    if (window.screen.width<=912 && window.screen.width>532)
    {CountSlideVivew=1;
    SizeMove=parseInt(getComputedStyle(Slideitem).minWidth)+parseInt(getComputedStyle(Slideitem).marginRight);
    }
}
SetSizeSpace()
window.addEventListener("resize",()=>
{ 
    SetSizeSpace()
})